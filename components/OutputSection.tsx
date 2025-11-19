'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Loader from './Loader'
import DataChart from './DataChart'
import jsPDF from 'jspdf'

interface OutputSectionProps {
  output: any
  isRunning: boolean
}

export default function OutputSection({ output, isRunning }: OutputSectionProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (output && output.ok) {
      setShowSuccessModal(true)
    }
  }, [output])

  const generatePDF = () => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = 20

    // Helper for Footer
    const addFooter = () => {
      const pageCount = pdf.getNumberOfPages()
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`Project Hawkkeyed • AI Automation System • Page ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    // Helper for Header
    const addHeader = () => {
      pdf.setFontSize(20)
      pdf.setTextColor(6, 182, 212) // Cyan
      pdf.text('Project HawkkEyed', margin, 20)

      let workflowLabel = 'Document Analysis'
      if (output.workflow === 'url-extract') workflowLabel = 'Web Extraction'
      if (output.workflow === 'data-insights') workflowLabel = 'Data Insights'
      if (output.workflow === 'chat-draft') workflowLabel = 'Smart Assistant'

      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Workflow: ${workflowLabel}`, pageWidth - margin, 20, { align: 'right' })

      // Metadata Line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, 25, pageWidth - margin, 25)

      pdf.setFontSize(8)
      pdf.setTextColor(120, 120, 120)
      const dateStr = new Date().toLocaleString()

      // Robust sanitization: Ensure string, remove ALL newline types, trim
      let sourceText = output.input || ''
      if (typeof sourceText !== 'string') sourceText = String(sourceText)
      const cleanInput = sourceText.replace(/[\r\n]+/g, ' ').trim()

      // Strict truncation to prevent wrapping
      const maxLength = 75
      const sourceStr = cleanInput.length > maxLength ? cleanInput.substring(0, maxLength) + '...' : (cleanInput || 'N/A')

      pdf.text(`Generated for: Abhishek Jaisal | Date: ${dateStr} | Model: Gemini 2.0 Flash`, margin, 30)
      pdf.text(`Source: ${sourceStr}`, margin, 34)

      yPosition = 55 // Increased spacing to ensure no overlap
    }

    // Helper for page breaks
    const checkPageBreak = (heightNeeded: number) => {
      if (yPosition + heightNeeded > pageHeight - 20) {
        addFooter()
        pdf.addPage()
        yPosition = 20
        addHeader()
      }
    }

    // Initial Setup
    addHeader()

    // --- CONTENT GENERATION ---

    // 1. Executive Summary (if available) or Intro
    if (output.geminiData?.summary || output.detailedAnalysis) {
      checkPageBreak(40)
      pdf.setFontSize(14)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Executive Summary', margin, yPosition)
      yPosition += 8

      pdf.setFontSize(10)
      pdf.setTextColor(60, 60, 60)
      const summaryText = output.geminiData?.summary || output.detailedAnalysis || ''
      const lines = pdf.splitTextToSize(summaryText, maxWidth)
      lines.forEach((line: string) => {
        checkPageBreak(6)
        pdf.text(line, margin, yPosition)
        yPosition += 6
      })
      yPosition += 10
    }

    // 2. Web Extraction Specifics
    if (output.workflow === 'url-extract' && output.geminiData) {

      // Key Facts
      if (output.geminiData.keyFacts && output.geminiData.keyFacts.length > 0) {
        checkPageBreak(40)
        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Key Facts', margin, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setTextColor(60, 60, 60)
        output.geminiData.keyFacts.forEach((fact: string) => {
          checkPageBreak(10)
          const lines = pdf.splitTextToSize(`• ${fact}`, maxWidth)
          lines.forEach((line: string) => {
            pdf.text(line, margin, yPosition)
            yPosition += 6
          })
        })
        yPosition += 10
      }

      // Structured Insights
      if (output.geminiData.insights) {
        Object.entries(output.geminiData.insights).forEach(([key, values]: [string, any]) => {
          if (values && values.length > 0) {
            checkPageBreak(40)
            pdf.setFontSize(12)
            pdf.setTextColor(0, 0, 0) // Black for subheaders
            pdf.text(key.charAt(0).toUpperCase() + key.slice(1), margin, yPosition)
            yPosition += 6

            pdf.setFontSize(10)
            pdf.setTextColor(60, 60, 60)
            values.forEach((val: string) => {
              checkPageBreak(10)
              const lines = pdf.splitTextToSize(`- ${val}`, maxWidth)
              lines.forEach((line: string) => {
                pdf.text(line, margin, yPosition)
                yPosition += 6
              })
            })
            yPosition += 8
          }
        })
        yPosition += 5
      }

      // Email Draft
      if (output.geminiData.emailDraft) {
        checkPageBreak(60)
        // Draw a box for the email
        const boxTop = yPosition

        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Generated Email Draft', margin, yPosition)
        yPosition += 10

        pdf.setFontSize(10)
        pdf.setTextColor(40, 40, 40)

        // Subject
        pdf.setFont('Helvetica', 'bold')
        pdf.text(`Subject: ${output.geminiData.emailDraft.subject || 'No Subject'}`, margin + 5, yPosition)
        pdf.setFont('Helvetica', 'normal')
        yPosition += 8

        // Body
        const bodyText = output.geminiData.emailDraft.body || 'No content available.'
        const bodyLines = pdf.splitTextToSize(bodyText, maxWidth - 10)
        bodyLines.forEach((line: string) => {
          checkPageBreak(6)
          pdf.text(line, margin + 5, yPosition)
          yPosition += 6
        })

        // Box border
        pdf.setDrawColor(220, 220, 220)
        pdf.rect(margin, boxTop + 2, maxWidth, yPosition - boxTop + 2)
        yPosition += 15
      }
    } else {
      // Standard Insights (Array based) for other workflows
      if (output.geminiData?.insights && Array.isArray(output.geminiData.insights)) {
        checkPageBreak(40)
        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Key Insights', margin, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setTextColor(60, 60, 60)
        output.geminiData.insights.forEach((insight: string, i: number) => {
          checkPageBreak(10)
          const lines = pdf.splitTextToSize(`${i + 1}. ${insight}`, maxWidth)
          lines.forEach((line: string) => {
            pdf.text(line, margin, yPosition)
            yPosition += 6
          })
        })
        yPosition += 10
      }
    }

    // Methodology / Footer Note
    checkPageBreak(20)
    yPosition += 5
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text('Methodology: This report was generated using Google Gemini 2.0 Flash, utilizing advanced semantic extraction to identify key entities, risks, and opportunities from the source content.', margin, yPosition, { maxWidth: maxWidth })

    // Add footer to the last page
    addFooter()

    // Save
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    pdf.save(`hawkkeyed-${output.workflow}-${timestamp}.pdf`)
  }

  const getModalContent = () => {
    if (output.workflow === 'chat-draft') {
      return {
        title: 'Draft Ready!',
        message: 'Your email draft has been generated. You can send it now or preview it.',
        icon: '✉️',
        primaryAction: {
          label: 'Compose Email',
          icon: '📤',
          onClick: () => {
            const subject = output.geminiData?.subject || 'Draft'
            const body = encodeURIComponent(output.geminiData?.body || '')
            window.open(`mailto:?subject=${subject}&body=${body}`)
          }
        },
        secondaryAction: {
          label: 'Preview Draft',
          icon: '👁️',
          onClick: () => {
            setShowSuccessModal(false)
            setShowPreview(true)
          }
        }
      }
    }

    return {
      title: 'Analysis Complete!',
      message: 'Your data has been successfully processed. Choose an action below.',
      icon: output.workflow === 'data-insights' ? '📊' : (output.workflow === 'url-extract' ? '🔗' : '📄'),
      primaryAction: {
        label: 'Preview Report',
        icon: '👁️',
        onClick: () => {
          setShowSuccessModal(false)
          setShowPreview(true)
        }
      },
      secondaryAction: {
        label: 'Download PDF',
        icon: '📥',
        onClick: generatePDF
      }
    }
  }

  if (isRunning) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700 rounded-xl p-8 shadow-xl">
        <Loader />
      </div>
    )
  }

  if (output?.error) {
    return (
      <div id="output-section" className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center text-red-200 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-2">Workflow Failed</h3>
        <p>{output.error}</p>
        <p className="text-sm mt-2 opacity-75">Please try again. This might be due to a temporary server timeout.</p>
      </div>
    )
  }

  if (!output) return null

  const modalContent = getModalContent()

  return (
    <div className="space-y-6 relative">
      {/* Success Modal - Portaled to body */}
      {mounted && showSuccessModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>

            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <span className="text-4xl animate-bounce">{modalContent.icon}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{modalContent.title}</h3>
            <p className="text-gray-400 mb-8">{modalContent.message}</p>

            <div className="space-y-4">
              <button
                onClick={modalContent.primaryAction.onClick}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span className="text-xl">{modalContent.primaryAction.icon}</span>
                {modalContent.primaryAction.label}
              </button>

              <button
                onClick={modalContent.secondaryAction.onClick}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span className="text-xl">{modalContent.secondaryAction.icon}</span>
                {modalContent.secondaryAction.label}
              </button>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 text-sm text-gray-500 hover:text-gray-300 underline decoration-gray-700 hover:decoration-gray-500 transition-all"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Detailed Analysis - Main Card */}
      {output.detailedAnalysis && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
            <span>📊</span>
            <span>Detailed Analysis</span>
          </h3>
          <div className="bg-gray-900/50 rounded-xl p-5 max-h-96 overflow-y-auto">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
              {output.detailedAnalysis}
            </div>
          </div>
        </div>
      )}

      {/* Data Visualization Chart - for data-insights workflow */}
      {output.workflow === 'data-insights' && output.input && (
        <DataChart data={output.input} />
      )}

      {/* Structured Data - Compact Cards */}
      {output.geminiData && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
            <span>🦅</span>
            <span>Key Insights</span>
          </h3>

          <div className="space-y-4">
            {/* URL Extract Specific Layout */}
            {output.workflow === 'url-extract' ? (
              <>
                {/* Key Facts */}
                {output.geminiData.keyFacts && (
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <h4 className="font-semibold text-sm mb-3 text-gray-400 uppercase tracking-wide">Key Facts</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      {output.geminiData.keyFacts.map((fact: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Structured Insights Grid */}
                {output.geminiData.insights && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(output.geminiData.insights).map(([key, values]: [string, any]) => (
                      values && values.length > 0 && (
                        <div key={key} className="bg-gray-900/50 rounded-xl p-4">
                          <h4 className="font-semibold text-sm mb-3 text-gray-400 uppercase tracking-wide capitalize">{key}</h4>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            {values.map((val: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className={`mt-1 ${key === 'risks' ? 'text-red-400' :
                                  key === 'opportunities' ? 'text-green-400' :
                                    'text-cyan-400'
                                  }`}>
                                  {key === 'risks' ? '⚠️' : key === 'opportunities' ? '🚀' : '•'}
                                </span>
                                <span>{val}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Email Draft Removed for Web Extraction */}
              </>
            ) : output.workflow === 'chat-draft' ? (
              /* Smart Assistant (Chat Draft) Specific Layout */
              <div className="space-y-6">
                {/* Email Draft Card */}
                {output.geminiData.emailDraft && (
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-white/5 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📧</span>
                        <h4 className="font-bold text-white">AI-Generated Email</h4>
                      </div>
                      <button
                        onClick={() => {
                          const text = `Subject: ${output.geminiData.emailDraft?.subject || ''}\n\n${output.geminiData.emailDraft?.body || ''}`
                          navigator.clipboard.writeText(text)
                        }}
                        className="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-cyan-400 transition-colors flex items-center gap-1"
                      >
                        <span>📋</span> Copy to Clipboard
                      </button>
                    </div>

                    <div className="space-y-4 text-sm text-gray-300 font-mono bg-black/40 p-5 rounded-xl border border-white/5">
                      <div className="flex gap-2">
                        <span className="text-gray-500 font-semibold select-none min-w-[60px]">Subject:</span>
                        <span className="text-white font-medium">{output.geminiData.emailDraft.subject}</span>
                      </div>
                      <div className="whitespace-pre-wrap border-t border-white/10 pt-4 mt-2 leading-relaxed text-gray-300">
                        {output.geminiData.emailDraft.body}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stored Successfully Notification */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl">
                    💾
                  </div>
                  <div>
                    <h4 className="text-green-400 font-bold text-sm">Stored Successfully</h4>
                    <p className="text-green-500/70 text-xs mt-0.5">
                      Draft saved to your workspace. You can access it anytime in History.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Standard Insights for other workflows
              output.geminiData.insights && Array.isArray(output.geminiData.insights) && (
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {output.geminiData.insights.map((insight: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">{i + 1}.</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Project HawkkEyed - Report Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto bg-white text-gray-800 font-serif">
              {/* Preview Content - Mimics PDF Layout */}
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h1 className="text-3xl font-bold text-cyan-600 mb-2">Project HawkkEyed</h1>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Generated for: Abhishek Jaisal</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {output.geminiData?.summary && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Executive Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{output.geminiData.summary}</p>
                  </section>
                )}

                {/* Email Draft Preview */}
                {output.geminiData?.emailDraft && (
                  <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Email Draft</h2>
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-2">
                        <span className="font-bold text-gray-700">Subject: </span>
                        <span className="text-gray-900">{output.geminiData.emailDraft.subject}</span>
                      </div>
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-serif">
                        {output.geminiData.emailDraft.body}
                      </div>
                    </div>
                  </section>
                )}

                {/* Data Visualization for Data Insights */}
                {output.workflow === 'data-insights' && output.input && (
                  <section className="my-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Data Visualization</h2>
                    <div className="bg-[#0f172a] rounded-xl p-2 border border-gray-700 shadow-lg">
                      <DataChart data={output.input} />
                    </div>
                  </section>
                )}

                {output.geminiData?.keyFacts && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Key Facts</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {output.geminiData.keyFacts.map((fact: string, i: number) => (
                        <li key={i}>{fact}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {output.geminiData?.insights && !Array.isArray(output.geminiData.insights) && (
                  <section className="grid grid-cols-2 gap-6">
                    {Object.entries(output.geminiData.insights).map(([key, values]: [string, any]) => (
                      values && values.length > 0 && (
                        <div key={key}>
                          <h3 className="text-lg font-bold text-gray-800 mb-2 capitalize">{key}</h3>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                            {values.map((val: string, i: number) => (
                              <li key={i}>{val}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
                  </section>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                <span>📥</span> Download PDF
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
