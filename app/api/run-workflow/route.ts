import { NextRequest, NextResponse } from 'next/server'
import { runOpusWorkflow } from '@/lib/opusClient'
import { extractStructuredData } from '@/lib/geminiClient'
import { getAdminDB } from '@/lib/firebase'
import admin from 'firebase-admin'

export async function POST(request: NextRequest) {
  const db = getAdminDB()
  let runRef: FirebaseFirestore.DocumentReference | null = null

  try {
    const formData = await request.formData()
    const workflow = formData.get('workflow') as string
    const input = formData.get('input') as string
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') || 'anonymous'

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

    // Create workflow run document
    runRef = await db.collection('workflowRuns').add({
      workflow,
      input: processedInput.substring(0, 500),
      status: 'starting',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userId,
    })

    const steps = []

    // Step 1: Extract & Clean
    steps.push({
      name: 'Extracting & Cleaning',
      status: 'completed',
      result: 'Input processed successfully',
      timestamp: new Date().toISOString(),
    })

    await db.collection('workflowRuns').doc(runRef.id).update({
      status: 'processing',
      steps,
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

    await db.collection('workflowRuns').doc(runRef.id).update({ steps })

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

    await db.collection('workflowRuns').doc(runRef.id).update({ steps })

    // Step 4: Building Output
    steps.push({
      name: 'Building Output',
      status: 'completed',
      result: 'Workflow completed successfully',
      timestamp: new Date().toISOString(),
    })

    const finalResult = {
      workflow,
      input: processedInput.substring(0, 200),
      steps,
      geminiData,
      opusOutput: opusResult,
      timestamp: new Date().toISOString(),
    }

    // Update final status
    await db.collection('workflowRuns').doc(runRef.id).update({
      status: 'completed',
      steps,
      result: finalResult,
      finishedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      ok: true,
      id: runRef.id,
      ...finalResult,
    })
  } catch (error: any) {
    console.error('Workflow error:', error)

    if (runRef) {
      await db.collection('workflowRuns').doc(runRef.id).update({
        status: 'error',
        error: error.message || String(error),
        finishedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    }

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
