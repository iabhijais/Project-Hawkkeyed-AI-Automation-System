'use client'

import { useState } from 'react'
import WorkflowCard from '@/components/WorkflowCard'
import InputSection from '@/components/InputSection'
import OutputSection from '@/components/OutputSection'

const workflows = [
  { id: 'doc-summary', name: 'Document → Summary → PDF', icon: '📄' },
  { id: 'url-extract', name: 'URL → Key Facts → Email', icon: '🔗' },
  { id: 'data-insights', name: 'Data → Insights → Chart', icon: '📊' },
  { id: 'chat-draft', name: 'Chat → Draft Email → Store', icon: '💬' },
]

export default function Home() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<any>(null)

  const handleRun = async (input: string, file?: File) => {
    if (!selectedWorkflow) return
    
    setIsRunning(true)
    setOutput(null)

    try {
      const formData = new FormData()
      formData.append('workflow', selectedWorkflow)
      formData.append('input', input)
      if (file) formData.append('file', file)

      const response = await fetch('/api/run-workflow', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setOutput(result)
    } catch (error) {
      setOutput({ error: 'Workflow failed' })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
            🦅 Project Hawkkeyed
          </h1>
          <p className="text-gray-400 text-lg">
            AI Automation & Workflow Intelligence System
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              isSelected={selectedWorkflow === workflow.id}
              onSelect={() => setSelectedWorkflow(workflow.id)}
            />
          ))}
        </div>

        <InputSection
          onRun={handleRun}
          isRunning={isRunning}
          disabled={!selectedWorkflow}
        />

        {(isRunning || output) && (
          <OutputSection output={output} isRunning={isRunning} />
        )}
      </div>
    </main>
  )
}
