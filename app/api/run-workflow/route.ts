import { NextRequest, NextResponse } from 'next/server'
import { extractStructuredData, generateDetailedAnalysis, isGeminiConfigured } from '@/lib/geminiClient'
import { fetchPageText, looksLikeUrl, UrlFetchError } from '@/lib/fetchUrl'

const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'text/markdown',
  'image/png',
  'image/jpeg',
  'image/webp',
]

// A small in-memory bucket. This runs on a public demo behind a personal API
// key, so unbounded traffic is a real cost, not a hypothetical one.
const RATE_LIMIT = { windowMs: 60_000, max: 10 }
const hits = new Map<string, number[]>()

function rateLimited(request: NextRequest): boolean {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // crude cap so the map cannot grow forever
  return recent.length > RATE_LIMIT.max
}

interface Step {
  name: string
  status: 'completed' | 'failed' | 'skipped'
  result: string
  durationMs: number
  timestamp: string
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Wait a minute and try again.' },
      { status: 429 }
    )
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 503 }
    )
  }

  const steps: Step[] = []
  const track = async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
    const startedAt = Date.now()
    try {
      const value = await fn()
      steps.push({
        name,
        status: 'completed',
        result: 'ok',
        durationMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      })
      return value
    } catch (error: any) {
      steps.push({
        name,
        status: 'failed',
        result: error?.message || 'failed',
        durationMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  try {
    const formData = await request.formData()
    const workflow = formData.get('workflow') as string
    const input = (formData.get('input') as string) || ''
    const file = formData.get('file') as File | null

    if (!workflow || (!input.trim() && !file)) {
      return NextResponse.json({ ok: false, error: 'Missing workflow or input' }, { status: 400 })
    }

    let processedInput = input
    let fileData: { mimeType: string; data: string } | undefined
    let fetchedFrom: string | null = null
    let inputMode: 'text' | 'url' | 'file' = file ? 'file' : 'text'

    if (file) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { ok: false, error: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 10 MB.` },
          { status: 413 }
        )
      }
      if (file.type && !ALLOWED_MIME.includes(file.type)) {
        return NextResponse.json(
          { ok: false, error: `Files of type ${file.type} are not supported.` },
          { status: 415 }
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      fileData = { mimeType: file.type || 'application/octet-stream', data: buffer.toString('base64') }
      processedInput = input ? `${input}\n\n[File attached: ${file.name}]` : `[File attached: ${file.name}]`
      steps.push({
        name: 'Reading file',
        status: 'completed',
        result: `${file.name} · ${(file.size / 1024).toFixed(0)} KB`,
        durationMs: 0,
        timestamp: new Date().toISOString(),
      })
    } else if (workflow === 'url-extract' && looksLikeUrl(input)) {
      // Actually fetch the page rather than expecting pasted text.
      try {
        const page = await track('Fetching page', () => fetchPageText(input))
        processedInput = page.title ? `${page.title}\n\n${page.text}` : page.text
        fetchedFrom = page.url
        inputMode = 'url'
      } catch (error: any) {
        if (!(error instanceof UrlFetchError)) throw error
        // Fall back to treating the input as text, and say so in the response.
        steps[steps.length - 1].status = 'skipped'
        steps[steps.length - 1].result = `${error.message} Treating the input as text instead.`
        processedInput = input
      }
    }

    const geminiData = await track('Structured extraction', () =>
      extractStructuredData(processedInput, workflow, fileData)
    )

    const detailedAnalysis = await track('Report generation', () =>
      generateDetailedAnalysis(processedInput, geminiData, workflow, fileData)
    )

    return NextResponse.json({
      ok: true,
      workflow,
      inputMode,
      fetchedFrom,
      input: processedInput.slice(0, 2000),
      steps,
      totalMs: steps.reduce((sum, step) => sum + step.durationMs, 0),
      geminiData,
      detailedAnalysis,
      model: 'gemini-2.5-flash',
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    // Log the stack server-side; never return it to the client.
    console.error('Workflow error:', error)

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || 'Workflow failed',
        steps,
      },
      { status: 500 }
    )
  }
}
