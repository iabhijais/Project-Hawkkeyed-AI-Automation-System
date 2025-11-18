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
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
        <header className="mb-8 md:mb-10 text-center">
          <div className="inline-block mb-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl px-8 py-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C10.9 2 10 2.9 10 4C10 4.7 10.4 5.4 11 5.7V7C11 7 9.5 7.5 8.5 9C7.5 10.5 7 13 7 13H5C4.4 13 4 13.4 4 14C4 14.6 4.4 15 5 15H7C7 15 7.5 17.5 8.5 19C9.5 20.5 11 21 11 21V22.3C10.4 22.6 10 23.3 10 24H14C14 23.3 13.6 22.6 13 22.3V21C13 21 14.5 20.5 15.5 19C16.5 17.5 17 15 17 15H19C19.6 15 20 14.6 20 14C20 13.4 19.6 13 19 13H17C17 13 16.5 10.5 15.5 9C14.5 7.5 13 7 13 7V5.7C13.6 5.4 14 4.7 14 4C14 2.9 13.1 2 12 2M12 4.5C12.3 4.5 12.5 4.7 12.5 5C12.5 5.3 12.3 5.5 12 5.5C11.7 5.5 11.5 5.3 11.5 5C11.5 4.7 11.7 4.5 12 4.5Z"/>
                </svg>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-cyan-400">
                  HAWKKEYED
                </h1>
              </div>
              <p className="text-xs font-mono text-cyan-400/70 tracking-wider">AI AUTOMATION SYSTEM</p>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm md:text-base mb-1">
            Workflow Intelligence System
          </p>
          <p className="text-gray-500 text-xs">
            Sharp Vision • Precise Execution • Automated Intelligence
          </p>
        </header>

        {/* Glass container for workflows */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl mb-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-200 mb-6 flex items-center flex-wrap">
            <span className="flex items-center gap-1">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm font-bold shadow-lg">1</span>
              <span className="text-gray-400">.</span>
            </span>
            <span className="ml-2">Select Workflow</span>
            {!selectedWorkflow && <span className="text-xs text-gray-500">(Choose one to continue)</span>}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                isSelected={selectedWorkflow === workflow.id}
                onSelect={() => setSelectedWorkflow(workflow.id)}
              />
            ))}
          </div>
        </div>

        {selectedWorkflow && (
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-200 mb-6 flex items-center">
              <span className="flex items-center gap-1">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm font-bold shadow-lg">2</span>
                <span className="text-gray-400">.</span>
              </span>
              <span className="ml-2">Provide Input</span>
            </h2>
            <InputSection
              onRun={handleRun}
              isRunning={isRunning}
              disabled={!selectedWorkflow}
            />
          </div>
        )}

        {(isRunning || output) && (
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-200 mb-6 flex items-center">
              <span className="flex items-center gap-1">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm font-bold shadow-lg">3</span>
                <span className="text-gray-400">.</span>
              </span>
              <span className="ml-2">Results</span>
            </h2>
            <OutputSection output={output} isRunning={isRunning} />
          </div>
        )}
      </div>
    </main>
  )
}
