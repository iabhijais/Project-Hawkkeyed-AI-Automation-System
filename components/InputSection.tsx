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
    <div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setWarning('')
        }}
        placeholder="Paste document text, URL content, or data to analyze..."
        className="w-full h-40 backdrop-blur-sm bg-white/5 border-2 border-white/10 rounded-xl p-4 mb-4 resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-gray-200 placeholder-gray-500"
        disabled={disabled || isRunning}
      />

      {warning && (
        <div className="mb-4 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-l-4 border-yellow-500 rounded-lg text-yellow-200 text-sm flex items-start gap-3">
          <span className="text-xl">💡</span>
          <span>{warning}</span>
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
          <div className={`backdrop-blur-sm bg-white/5 border-2 rounded-xl p-4 cursor-pointer transition-all text-sm ${
            file 
              ? 'border-cyan-500/50 bg-cyan-500/10' 
              : 'border-white/10 hover:border-white/20 hover:bg-white/10'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{file ? '📄' : '📎'}</span>
              <span className={file ? 'text-cyan-300' : 'text-gray-400'}>
                {file ? file.name : 'Upload file (optional)'}
              </span>
            </div>
          </div>
        </label>

        <button
          onClick={handleSubmit}
          disabled={disabled || isRunning || (!input.trim() && !file)}
          className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/50 disabled:shadow-none text-white"
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>▶</span> Run Workflow
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
