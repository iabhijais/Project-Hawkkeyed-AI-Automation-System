'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Header from '@/components/Header'
import WorkflowCard from '@/components/WorkflowCard'
import InputSection from '@/components/InputSection'
import OutputSection from '@/components/OutputSection'

const workflows = [
  {
    id: 'doc-summary',
    title: 'Document Intelligence',
    description: 'Upload complex PDFs or docs. Get executive summaries, key insights, and action items instantly.',
    icon: '📄',
    color: 'cyan'
  },
  {
    id: 'url-extract',
    title: 'Web Extraction',
    description: 'Paste any URL. Extract structured data, main content, and metadata automatically.',
    icon: '🔗',
    color: 'purple'
  },
  {
    id: 'data-insights',
    title: 'Data Insights',
    description: 'Input raw data (CSV/JSON). Generate visualizations, trend analysis, and strategic recommendations.',
    icon: '📊',
    color: 'amber'
  },
  {
    id: 'chat-draft',
    title: 'Smart Assistant',
    description: 'Draft emails, messages, or content with perfect tone and context. Your AI writing partner.',
    icon: '💬',
    color: 'emerald'
  }
]

export default function Home() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<any>(null)

  // Auto-scroll to output section when running or when output is ready
  useEffect(() => {
    if (isRunning || output) {
      setTimeout(() => {
        const element = document.getElementById('output-section')
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 140
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
    }
  }, [isRunning, output])

  // Restore from History
  useEffect(() => {
    const restoreTask = localStorage.getItem('restoreTask')
    if (restoreTask) {
      try {
        const task = JSON.parse(restoreTask)
        setSelectedWorkflow(task.workflow)
        setOutput(task.result)
        // Dispatch event to update InputSection
        setTimeout(() => {
          const event = new CustomEvent('demoSelected', { detail: task.input })
          window.dispatchEvent(event)
        }, 500)
        localStorage.removeItem('restoreTask')
      } catch (e) {
        console.error('Failed to restore task', e)
      }
    }
  }, [])

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

      // Save to History
      if (result.ok) {
        const historyItem = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          workflow: selectedWorkflow,
          input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
          result: result
        }
        const history = JSON.parse(localStorage.getItem('workflowHistory') || '[]')
        history.unshift(historyItem)
        localStorage.setItem('workflowHistory', JSON.stringify(history))
      }
    } catch (error) {
      setOutput({ error: 'Workflow failed' })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden selection:bg-cyan-500/30">
      <Navbar />

      {/* Subtle background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_50%)]"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-30"></div>
      </div>

      <Header />

      <div className="max-w-6xl mx-auto px-4 relative z-10 pb-20">

        {/* Glass container for workflows */}
        <div id="workflows" className="backdrop-blur-3xl bg-white dark:bg-white/5 rounded-[2rem] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-2xl mb-8 scroll-mt-32 relative overflow-hidden">
          {/* Section Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm border border-cyan-200 dark:border-cyan-500/30">1</span>
              Select Intelligence Module
            </h2>
            {!selectedWorkflow && <span className="text-xs text-gray-500 uppercase tracking-wider font-medium animate-pulse">Select a module to begin</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                isSelected={selectedWorkflow === workflow.id}
                onSelect={() => {
                  setSelectedWorkflow(workflow.id)
                  // Smooth scroll to the input section
                  setTimeout(() => {
                    const element = document.getElementById('input-section')
                    if (element) {
                      const y = element.getBoundingClientRect().top + window.scrollY - 140
                      window.scrollTo({ top: y, behavior: 'smooth' })
                    }
                  }, 100)
                }}
              />
            ))}
          </div>
        </div>

        {selectedWorkflow && (
          <div id="input-section" className="backdrop-blur-3xl bg-white dark:bg-white/5 rounded-[2rem] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-2xl mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm border border-cyan-200 dark:border-cyan-500/30">2</span>
                Input Data Source
              </h2>

              {/* Demo Presets */}
              <select
                onChange={(e) => {
                  const demo = e.target.value
                  if (demo) {
                    // Trigger input change in InputSection
                    const event = new CustomEvent('demoSelected', { detail: demo })
                    window.dispatchEvent(event)
                  }
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-600 dark:text-gray-400 text-sm focus:outline-none focus:border-cyan-500/50 focus:text-gray-900 dark:focus:text-white transition-colors cursor-pointer hover:bg-gray-200 dark:hover:bg-black/60"
              >
                <option value="">💡 Select a Demo Scenario</option>
                <option value="AI Market Landscape 2025 Sample Report

Artificial Intelligence (AI) adoption has accelerated globally across healthcare, finance, education, and enterprise automation.
The AI market is projected to reach $407 billion by 2027, driven by generative AI, automation agents, and real-time decision systems.
Major challenges include data privacy, model accuracy, hallucinations, and rising compute costs.
Industry leaders like Google, OpenAI, Anthropic, and Meta continue pushing boundaries with multimodal models, enterprise tools, and ecosystem expansions.">📄 AI Market Report 2025</option>
                <option value="https://www.talkesport.com/news/why-jonathan-is-best-player-india/">🔗 Esports Article Analysis – Jonathan</option>
                <option value="Month,Active Users
Jan,1200
Feb,1450
Mar,1600
Apr,2100
May,2600
Jun,3100
Jul,3400
Aug,4200
Sep,4800
Oct,5400
Nov,6000
Dec,6800">📊 Monthly User Growth Data</option>
                <option value="Client Follow-up Email

Draft a follow-up email for a client who attended an AI demo session last week.
Thank them for joining, share the report link, summarize key features shown,
and offer a free 15-minute onboarding call next week.">💬 Client Follow-up Email</option>
              </select>
            </div>

            <InputSection
              onRun={handleRun}
              isRunning={isRunning}
              disabled={!selectedWorkflow}
            />
          </div>
        )}

        {(isRunning || output) && (
          <div id="output-section" className="backdrop-blur-3xl bg-white dark:bg-white/5 rounded-[2rem] p-8 md:p-10 border border-gray-200 dark:border-white/5 shadow-2xl mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm border border-cyan-200 dark:border-cyan-500/30">3</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Intelligent Output
              </h2>
            </div>
            <OutputSection output={output} isRunning={isRunning} />
          </div>
        )}

        {/* Professional Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-200 dark:border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Branding & Credits */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Made with <span className="text-red-500 animate-pulse">❤️</span> by <a href="https://iabhijais.vercel.app/" target="_blank" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors font-bold">iabhijais</a>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-1 uppercase tracking-wider">
                Powered by Google Gemini • Built for AI Genesis
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://iabhijais.vercel.app/"
                target="_blank"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gray-400 dark:border-gray-600 group-hover:border-cyan-500 dark:group-hover:border-cyan-400 transition-colors">
                  <Image
                    src="/iabhijais.ico"
                    alt="Portfolio"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="group-hover:underline decoration-cyan-500/50 underline-offset-4">Portfolio</span>
              </a>
              <a
                href="https://www.linkedin.com/in/iabhijais/"
                target="_blank"
                className="text-gray-500 dark:text-gray-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors text-sm font-medium flex items-center gap-2 group"
              >
                <div className="relative w-5 h-5">
                  <Image
                    src="/linkedin-icon.png"
                    alt="LinkedIn"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="group-hover:underline decoration-[#0A66C2]/50 underline-offset-4">LinkedIn</span>
              </a>
              <a
                href="https://lablab.ai/u/@iabhijais"
                target="_blank"
                className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium flex items-center gap-2 group"
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src="/lablab.png"
                    alt="LabLab.ai"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="group-hover:underline decoration-purple-500/50 underline-offset-4">LabLab.ai</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
