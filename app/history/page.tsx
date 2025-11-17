'use client'

import Link from 'next/link'

export default function HistoryPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Workflow History</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            ← Back
          </Link>
        </div>

        <div className="text-center py-12 text-gray-400">
          <p className="mb-4">History feature coming soon!</p>
          <p className="text-sm">Enable Firebase to save and view workflow history</p>
        </div>
      </div>
    </main>
  )
}
