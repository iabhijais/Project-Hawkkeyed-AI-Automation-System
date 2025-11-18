'use client'

import { useState } from 'react'
import Loader from './Loader'

interface OutputSectionProps {
  output: any
  isRunning: boolean
}

export default function OutputSection({ output, isRunning }: OutputSectionProps) {
  const [showRawData, setShowRawData] = useState(false)

  if (isRunning) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700 rounded-xl p-8 shadow-xl">
        <Loader />
      </div>
    )
  }

  if (!output) return null

  return (
    <div className="space-y-6">
      {/* Detailed Analysis - Main Card */}
      {output.detailedAnalysis && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
            <span>📊</span>
            <span>Detailed Analysis</span>
          </h3>
          <div className="bg-gray-900/50 rounded-xl p-5 max-h-96 overflow-y-auto">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
              {output.detailedAnalysis}
            </div>
          </div>
        </div>
      )}

      {/* Structured Data - Compact Cards */}
      {output.geminiData && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
            <span>🦅</span>
            <span>Key Insights</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            
            {output.geminiData.summary && (
              <div className="bg-gray-900/50 rounded-xl p-4 md:col-span-2">
                <h4 className="font-semibold text-sm mb-2 text-gray-400 uppercase tracking-wide">Summary</h4>
                <p className="text-gray-300 leading-relaxed text-sm">{output.geminiData.summary}</p>
              </div>
            )}

            {output.geminiData.insights && output.geminiData.insights.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-3 text-gray-400 uppercase tracking-wide">Insights</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {output.geminiData.insights.slice(0, 5).map((insight: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {output.geminiData.recommendations && output.geminiData.recommendations.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-3 text-gray-400 uppercase tracking-wide">Recommendations</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {output.geminiData.recommendations.slice(0, 5).map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-1">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

            {output.geminiData.tasks && output.geminiData.tasks.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-200">Action Items</h4>
                <div className="space-y-2">
                  {output.geminiData.tasks.map((task: any, i: number) => (
                    <div key={i} className="bg-gray-900/50 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="font-medium text-gray-200">{task.title}</span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-400">{task.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {output.geminiData.keyFacts && output.geminiData.keyFacts.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-200">Key Facts</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {output.geminiData.keyFacts.map((fact: string, i: number) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}

            {output.geminiData.keyPoints && output.geminiData.keyPoints.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-200">Key Points</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {output.geminiData.keyPoints.map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      {/* Processing Steps - Collapsible */}
      <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <summary className="cursor-pointer p-4 font-medium text-gray-300 hover:text-white flex items-center gap-2">
          <span>📊</span>
          <span>View Processing Steps</span>
        </summary>
          <div className="p-4 pt-0 space-y-2">
            {output.steps?.map((step: any, i: number) => (
              <div key={i} className="bg-gray-800 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={step.status === 'completed' ? 'text-green-400' : 'text-gray-400'}>
                    {step.status === 'completed' ? '✓' : '○'}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
                <p className="text-xs text-gray-400 ml-6">{step.result}</p>
              </div>
            ))}
          </div>
        </details>

      {/* Raw Data - Collapsible */}
      <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <summary className="cursor-pointer p-4 font-medium text-gray-300 hover:text-white flex items-center gap-2">
          <span>🔧</span>
          <span>View Raw Data (Debug)</span>
        </summary>
          <div className="p-4 pt-0">
            <pre className="text-xs text-gray-400 overflow-auto max-h-64 bg-black/50 p-3 rounded">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        </details>

      {/* Action Buttons */}
      {output.ok && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const text = `HAWKKEYED AI ANALYSIS REPORT\n\n${output.detailedAnalysis || ''}\n\nGenerated: ${new Date().toLocaleString()}`
              const blob = new Blob([text], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `hawkkeyed-report-${Date.now()}.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/50"
          >
            <span>📥</span>
            <span>Download Report</span>
          </button>
          
          <button
            onClick={() => {
              const subject = 'Hawkkeyed AI Analysis Report'
              const body = encodeURIComponent(`${output.detailedAnalysis || 'Analysis completed'}\n\nGenerated by Hawkkeyed AI Automation System`)
              window.open(`mailto:?subject=${subject}&body=${body}`)
            }}
            className="flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all"
          >
            <span>📧</span>
            <span>Email Report</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(output.detailedAnalysis || JSON.stringify(output, null, 2))
              alert('✓ Copied to clipboard!')
            }}
            className="flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all"
          >
            <span>📋</span>
            <span>Copy</span>
          </button>
        </div>
      )}

      {output.error && (
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 text-red-400">
          <strong>⚠️ Error:</strong> {output.error}
        </div>
      )}
    </div>
  )
}
