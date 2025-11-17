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
  const [warning, setWarning] = useState('')

  const handleSubmit = () => {
    setWarning('')
    
    if (!input.trim() && !file) return

    // Check if input is just a short question
    if (input.trim().length < 30 && input.trim().endsWith('?')) {
      setWarning('💡 Tip: For summaries, paste document text or upload a file. For Q&A, use the Chat workflow.')
      return
    }

    onRun(input, file || undefined)
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Input</h2>
      
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setWarning('')
        }}
        placeholder="Paste document text, URL content, or data to analyze..."
        className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4 resize-none focus:outline-none focus:border-amber-500"
        disabled={disabled || isRunning}
      />

      {warning && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
          {warning}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="flex-1">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            disabled={disabled || isRunning}
            accept=".txt,.pdf,.doc,.docx"
          />
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-600 text-sm">
            {file ? `📄 ${file.name}` : '📎 Upload file (optional)'}
          </div>
        </label>

        <button
          onClick={handleSubmit}
          disabled={disabled || isRunning || (!input.trim() && !file)}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          {isRunning ? '⏳ Processing...' : '▶ Run Workflow'}
        </button>
      </div>
    </div>
  )
}
