'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import Link from 'next/link'

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const q = query(
          collection(db, 'workflows'),
          orderBy('timestamp', 'desc'),
          limit(20)
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setHistory(data)
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

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

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No history yet</div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{item.workflow}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{item.input}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
