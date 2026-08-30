'use client'

/**
 * The real pipeline, with real timings.
 *
 * The API used to return a pre-written steps array — "Extracting & Cleaning"
 * was marked completed before anything ran, and every stage flipped to
 * completed unconditionally. Now each entry is recorded around the actual
 * call, so a skipped URL fetch or a failed stage shows up as what it was.
 */

interface Step {
  name: string
  status: 'completed' | 'failed' | 'skipped'
  result: string
  durationMs: number
  timestamp: string
}

const STATUS_STYLES: Record<Step['status'], { dot: string; label: string; text: string }> = {
  completed: { dot: 'bg-emerald-400', label: 'done', text: 'text-emerald-300' },
  failed: { dot: 'bg-red-400', label: 'failed', text: 'text-red-300' },
  skipped: { dot: 'bg-amber-400', label: 'skipped', text: 'text-amber-300' },
}

function formatMs(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '—'
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

export default function PipelineTimeline({
  steps,
  totalMs,
  model,
  fetchedFrom,
}: {
  steps?: Step[]
  totalMs?: number
  model?: string
  fetchedFrom?: string | null
}) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Pipeline</h3>
        <p className="text-xs text-gray-500">
          {formatMs(totalMs ?? 0)} total{model ? ` · ${model}` : ''}
        </p>
      </div>

      <ol className="space-y-2">
        {steps.map((step, index) => {
          const style = STATUS_STYLES[step.status] ?? STATUS_STYLES.completed
          return (
            <li key={`${step.name}-${index}`} className="flex items-start gap-3 text-sm">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${style.dot}`} aria-hidden="true" />
              <span className="flex-1 min-w-0">
                <span className="text-gray-200">{step.name}</span>
                <span className={`ml-2 text-xs ${style.text}`}>{style.label}</span>
                {step.status !== 'completed' && step.result && (
                  <span className="block text-xs text-gray-500 mt-0.5">{step.result}</span>
                )}
              </span>
              <span className="text-xs text-gray-500 tabular-nums shrink-0">{formatMs(step.durationMs)}</span>
            </li>
          )
        })}
      </ol>

      {fetchedFrom && (
        <p className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500 break-all">
          Fetched from{' '}
          <a
            href={fetchedFrom}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            {fetchedFrom}
          </a>
        </p>
      )}
    </div>
  )
}
