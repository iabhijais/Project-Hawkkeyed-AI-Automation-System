'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function SettingsPage() {
    const [showConfirm, setShowConfirm] = useState(false)

    const handleClearHistory = () => {
        localStorage.removeItem('workflowHistory')
        // Dispatch event to update other components if needed, or just reload
        window.location.reload()
    }

    const handleExportData = () => {
        const history = localStorage.getItem('workflowHistory') || '[]'
        const blob = new Blob([history], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `hawkkeyed-history-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your preferences and data.</p>
                </div>

                <div className="space-y-6">
                    {/* Data Management Section */}
                    <section className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-xl">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span>💾</span> Data Management
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/5">
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Export History</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Download your workflow history as a JSON file.</p>
                                </div>
                                <button
                                    onClick={handleExportData}
                                    className="px-4 py-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-500/20 transition-colors font-medium text-sm"
                                >
                                    Export Data
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-medium text-red-600 dark:text-red-400">Clear All History</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Permanently remove all saved workflow runs from this browser.</p>
                                </div>
                                {!showConfirm ? (
                                    <button
                                        onClick={() => setShowConfirm(true)}
                                        className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors font-medium text-sm"
                                    >
                                        Clear History
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowConfirm(false)}
                                            className="px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleClearHistory}
                                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm shadow-lg shadow-red-500/20"
                                        >
                                            Confirm Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-xl">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span>ℹ️</span> About
                        </h2>

                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                                <span>Version</span>
                                <span className="font-mono text-gray-900 dark:text-white">1.0.0 (Hackathon Edition)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Build</span>
                                <span className="font-mono text-gray-900 dark:text-white">Production</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Powered By</span>
                                <span className="font-medium text-cyan-600 dark:text-cyan-400">Google Gemini 1.5 Pro</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
