import { NextRequest, NextResponse } from 'next/server'
import { extractStructuredData, generateDetailedAnalysis } from '@/lib/geminiClient'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const workflow = formData.get('workflow') as string
    const input = formData.get('input') as string
    const file = formData.get('file') as File | null

    if (!workflow || (!input && !file)) {
      return NextResponse.json(
        { error: 'Missing workflow or input' },
        { status: 400 }
      )
    }

    let processedInput = input
    let fileData: { mimeType: string; data: string } | undefined

    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fileData = {
        mimeType: file.type,
        data: buffer.toString('base64')
      }
      processedInput = input ? `${input}\n\n[File attached: ${file.name}]` : `[File attached: ${file.name}]`
    }

    const steps = []

    // Step 1: Extract & Clean
    steps.push({
      name: 'Extracting & Cleaning',
      status: 'completed',
      result: 'Input processed successfully',
      timestamp: new Date().toISOString(),
    })

    // Step 2: Gemini Intelligence - Structured Extraction
    steps.push({
      name: 'HawkVision Analysis',
      status: 'running',
      result: 'Extracting structured data...',
      timestamp: new Date().toISOString(),
    })

    const geminiData = await extractStructuredData(processedInput, workflow, fileData)

    steps[steps.length - 1].status = 'completed'
    steps[steps.length - 1].result = 'Structured data extracted successfully'

    // Step 3: Gemini Intelligence - Detailed Analysis
    steps.push({
      name: 'Deep Intelligence Processing',
      status: 'running',
      result: 'Generating detailed analysis...',
      timestamp: new Date().toISOString(),
    })

    const detailedAnalysis = await generateDetailedAnalysis(processedInput, geminiData, workflow, fileData)

    steps[steps.length - 1].status = 'completed'
    steps[steps.length - 1].result = 'Analysis completed successfully'

    // Step 4: Building Output
    steps.push({
      name: 'Building Output',
      status: 'completed',
      result: 'Workflow completed successfully',
      timestamp: new Date().toISOString(),
    })

    const finalResult = {
      ok: true,
      workflow,
      input: processedInput,
      steps,
      geminiData,
      detailedAnalysis,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(finalResult)
  } catch (error: any) {
    console.error('Workflow error:', error)

    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Workflow failed',
        details: error.stack,
      },
      { status: 500 }
    )
  }
}
