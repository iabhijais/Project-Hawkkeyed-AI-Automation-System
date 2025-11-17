import { NextRequest, NextResponse } from 'next/server'
import { runOpusWorkflow } from '@/lib/opusClient'
import { extractStructuredData } from '@/lib/geminiClient'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const workflow = formData.get('workflow') as string
    const input = formData.get('input') as string
    const file = formData.get('file') as File | null

    if (!workflow || !input) {
      return NextResponse.json(
        { error: 'Missing workflow or input' },
        { status: 400 }
      )
    }

    let processedInput = input

    if (file) {
      const text = await file.text()
      processedInput = `${input}\n\nFile content:\n${text}`
    }

    const steps = []

    // Step 1: Extract & Clean
    steps.push({
      name: 'Extracting & Cleaning',
      status: 'completed',
      result: 'Input processed successfully',
      timestamp: new Date().toISOString(),
    })

    // Step 2: Gemini Intelligence (HawkVision)
    steps.push({
      name: 'HawkVision (Gemini Intelligence)',
      status: 'running',
      result: 'Analyzing with deep intelligence...',
      timestamp: new Date().toISOString(),
    })

    const geminiData = await extractStructuredData(processedInput, workflow)

    steps[steps.length - 1].status = 'completed'
    steps[steps.length - 1].result = JSON.stringify(geminiData).substring(0, 200) + '...'

    // Step 3: Opus Workflow Processing
    steps.push({
      name: 'Opus Workflow Processing',
      status: 'running',
      result: 'Running AI workflow...',
      timestamp: new Date().toISOString(),
    })

    const opusResult = await runOpusWorkflow(workflow, processedInput, geminiData)

    steps[steps.length - 1].status = 'completed'
    steps[steps.length - 1].result = opusResult.substring(0, 200) + '...'

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
      input: processedInput.substring(0, 200),
      steps,
      geminiData,
      opusOutput: opusResult,
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
