'use client'

import { useState } from 'react'

interface InputSectionProps {
  onRun: (input: string, file?: File) => void
  isRunning: boolean
  disabled: boolean
}

export default function InputSection({ onRun, isRunning, disabled }: InputSectionProps) {
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = () => {
    if (!input.trim() && !file) return
    onRun(input, file || undefined)
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Input</h2>
      
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your instruction, URL, or text..."
        className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4 resize-none focus:outline-none focus:border-amber-500"
        disabled={disabled || isRunning}
      />

      <div className="flex items-center gap-4">
        <label className="flex-1">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            disabled={disabled || isRunning}
          />
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-600 text-sm">
            {file ? file.name : '📎 Upload file (optional)'}
          </div>
        </label>

        <button
          onClick={handleSubmit}
          disabled={disabled || isRunning || (!input.trim() && !file)}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          {isRunning ? 'Running...' : 'Run Workflow'}
        </button>
      </div>
    </div>
  )
}
