'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface HistoryItem {
  id: string
  timestamp: string
  workflow: string
  input: string
  result: any
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('workflowHistory')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your history?')) {
      localStorage.removeItem('workflowHistory')
      setHistory([])
    }
  }

  const restoreTask = (item: HistoryItem) => {
    localStorage.setItem('restoreTask', JSON.stringify(item))
    router.push('/')
  }

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case 'doc-summary': return '📄'
      case 'url-extract': return '🔗'
      case 'data-insights': return '📊'
      case 'chat-draft': return '💬'
      default: return '⚡'
    }
  }

  const getWorkflowName = (type: string) => {
    switch (type) {
      case 'doc-summary': return 'Document Intelligence'
      case 'url-extract': return 'Web Extraction'
      case 'data-insights': return 'Data Analytics'
      case 'chat-draft': return 'Smart Assistant'
      default: return 'Workflow'
    }
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[#0B0F19] selection:bg-cyan-500/30">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_50%)]"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-24 sm:pt-32 pb-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Workflow History</h1>
            <p className="text-gray-400 text-sm sm:text-base">Track your recent AI automation tasks</p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🕰️</div>
            <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
            <p className="text-gray-400 mb-6">Run a workflow to see it appear here.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-all"
            >
              Start a Workflow
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => restoreTask(item)}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-500/30 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {getWorkflowIcon(item.workflow)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{getWorkflowName(item.workflow)}</h3>
                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3 mb-4 border border-white/5 group-hover:border-white/10 transition-colors">
                      <p className="text-sm text-gray-400 font-mono line-clamp-2">
                        {item.input}
                      </p>
                    </div>

                    {/* Result Summary */}
                    <div className="flex items-center gap-4 text-sm">
                      {item.result.geminiData?.summary && (
                        <span className="text-cyan-400 flex items-center gap-1">
                          <span>✓</span> Summary Generated
                        </span>
                      )}
                      {item.result.geminiData?.emailDraft && (
                        <span className="text-purple-400 flex items-center gap-1">
                          <span>✉️</span> Email Drafted
                        </span>
                      )}
                      {item.result.geminiData?.insights && (
                        <span className="text-amber-400 flex items-center gap-1">
                          <span>📊</span> Insights Extracted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow Hint */}
                  <div className="hidden md:flex items-center justify-center text-gray-600 group-hover:text-cyan-400 transition-colors">
                    <span className="text-2xl">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
