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
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Output</h2>
        <Loader />
      </div>
    )
  }

  if (!output) return null

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Output</h2>
      
      <div className="space-y-6">
        {/* Final Report - Main Focus */}
        {output.geminiData && (
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-amber-400">🦅 Analysis Report</h3>
            
            {output.geminiData.summary && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-200">Summary</h4>
                <p className="text-gray-300 leading-relaxed">{output.geminiData.summary}</p>
              </div>
            )}

            {output.geminiData.insights && output.geminiData.insights.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-200">Key Insights</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {output.geminiData.insights.map((insight: string, i: number) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {output.geminiData.recommendations && output.geminiData.recommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-200">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {output.geminiData.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

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
        <details className="bg-gray-900 rounded-lg">
          <summary className="cursor-pointer p-4 font-medium text-gray-300 hover:text-white">
            📊 View Processing Steps
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
        <details className="bg-gray-900 rounded-lg">
          <summary className="cursor-pointer p-4 font-medium text-gray-300 hover:text-white">
            🔧 View Raw Data (Debug)
          </summary>
          <div className="p-4 pt-0">
            <pre className="text-xs text-gray-400 overflow-auto max-h-64 bg-black/50 p-3 rounded">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        </details>

        {output.error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
            <strong>⚠️ Error:</strong> {output.error}
          </div>
        )}
      </div>
    </div>
  )
}
