import Loader from './Loader'

interface OutputSectionProps {
  output: any
  isRunning: boolean
}

export default function OutputSection({ output, isRunning }: OutputSectionProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Output</h2>
      
      {isRunning ? (
        <Loader />
      ) : output ? (
        <div className="space-y-4">
          {output.steps?.map((step: any, i: number) => (
            <div key={i} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={step.status === 'completed' ? 'text-green-400' : step.status === 'running' ? 'text-yellow-400' : 'text-gray-400'}>
                  {step.status === 'completed' ? '✓' : step.status === 'running' ? '⟳' : '○'}
                </span>
                <span className="font-medium">{step.name}</span>
              </div>
              <p className="text-gray-400 text-sm">{step.result}</p>
            </div>
          ))}

          {output.geminiData && (
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-amber-400">🦅 HawkVision Analysis</h3>
              <pre className="text-xs text-gray-300 overflow-auto max-h-48">
                {JSON.stringify(output.geminiData, null, 2)}
              </pre>
            </div>
          )}

          {output.opusOutput && (
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-cyan-400">📋 Final Output</h3>
              <div className="text-sm text-gray-300 whitespace-pre-wrap">
                {output.opusOutput}
              </div>
            </div>
          )}
          
          {output.error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
              <strong>Error:</strong> {output.error}
            </div>
          )}

          {output.ok && output.id && (
            <div className="text-xs text-gray-500 text-center">
              Run ID: {output.id}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
