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

const EMPTY: Stat[] = [
  { label: 'Workflows', value: '4', hint: 'Document, web, data and chat pipelines' },
  { label: 'Runs here', value: '—', hint: 'Run a workflow to populate this' },
  { label: 'Avg. response', value: '—', hint: 'Measured on this device' },
  { label: 'Last run', value: '—', hint: 'Nothing yet' },
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
      { label: 'Workflows', value: '4', hint: 'Document, web, data and chat pipelines' },
      { label: 'Runs here', value: String(history.length), hint: 'Stored in this browser' },
      {
        label: 'Avg. response',
        value: avgMs ? (avgMs >= 1000 ? `${(avgMs / 1000).toFixed(1)}s` : `${avgMs}ms`) : '—',
        hint: durations.length ? `Measured across ${durations.length} runs` : 'Not measured yet',
      },
      {
        label: history.length && withOutcome.length ? 'Success rate' : 'Last run',
        value: withOutcome.length ? successRate : relativeTime(history[0].timestamp),
        hint: withOutcome.length ? `Across ${withOutcome.length} runs on this device` : 'On this device',
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
          <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{stat.value}</div>
          <div className="text-[10px] md:text-xs text-cyan-200/70 uppercase tracking-widest font-bold mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
