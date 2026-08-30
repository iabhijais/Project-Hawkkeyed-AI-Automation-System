'use client'

import { useEffect, useState } from 'react'

/**
 * Stats computed from what this browser has actually run.
 *
 * These replace four hardcoded numbers (99.9% accuracy, <50ms latency, 100%
 * uptime) that were never measured. A real small number is worth more than a
 * fabricated big one — anyone who opens the file can check these.
 */

interface Stat {
  label: string
  value: string
  hint: string
}

// Before anything has been run, show facts that are true on a first visit
// rather than a row of placeholder dashes, which reads as broken.
const EMPTY: Stat[] = [
  { label: 'Workflows', value: '4', hint: 'Document, web, data and chat pipelines' },
  { label: 'Model', value: '2.5 Flash', hint: 'Google Gemini 2.5 Flash' },
  { label: 'Stages / run', value: '2', hint: 'Structured extraction, then report generation' },
  { label: 'Runs here', value: 'None yet', hint: 'Your runs are counted on this device only' },
]

function relativeTime(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stat[]>(EMPTY)

  useEffect(() => {
    let history: any[] = []
    try {
      history = JSON.parse(localStorage.getItem('workflowHistory') || '[]')
    } catch {
      history = []
    }

    if (!Array.isArray(history) || history.length === 0) return

    const durations = history
      .map((item) => Number(item?.durationMs))
      .filter((value) => Number.isFinite(value) && value > 0)

    const avgMs = durations.length
      ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
      : null

    const withOutcome = history.filter((item) => typeof item?.ok === 'boolean')
    const successRate = withOutcome.length
      ? `${Math.round((withOutcome.filter((item) => item.ok).length / withOutcome.length) * 100)}%`
      : '—'

    setStats([
      { label: 'Runs here', value: String(history.length), hint: 'Stored in this browser only' },
      {
        label: 'Avg. response',
        value: avgMs ? (avgMs >= 1000 ? `${(avgMs / 1000).toFixed(1)}s` : `${avgMs}ms`) : '—',
        hint: durations.length ? `Measured across ${durations.length} runs` : 'Not measured yet',
      },
      {
        label: 'Success rate',
        value: successRate,
        hint: withOutcome.length
          ? `${withOutcome.filter((item: any) => item.ok).length} of ${withOutcome.length} runs succeeded`
          : 'No runs with a recorded outcome yet',
      },
      {
        label: 'Last run',
        value: relativeTime(history[0].timestamp),
        hint: new Date(history[0].timestamp).toLocaleString(),
      },
    ])
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {stats.map((stat) => (
        <div
          key={stat.label}
          title={stat.hint}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_20px_#00f2ff14] hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
        >
          <div
            className={`font-bold text-white tracking-tight ${
              stat.value.length > 6 ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'
            }`}
          >
            {stat.value}
          </div>
          <div className="text-[10px] md:text-xs text-cyan-200/70 uppercase tracking-widest font-bold mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
