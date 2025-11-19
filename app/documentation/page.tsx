'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function DocumentationPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Quick Start</h1>
                    <p className="text-gray-600 dark:text-gray-400">Learn how to use Project HawkkEyed's AI automation workflows.</p>
                </div>

                {/* Quick Start Section */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-xl mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span>🚀</span> Quick Start Guide
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Select a Workflow</h3>
                            <p className="text-gray-600 dark:text-gray-400">Choose from one of our four intelligent modules based on your needs.</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Input Your Data</h3>
                            <p className="text-gray-600 dark:text-gray-400">Provide your text, URL, file, or data. You can also try our demo scenarios.</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Get Results</h3>
                            <p className="text-gray-600 dark:text-gray-400">Receive AI-powered insights, summaries, or content instantly. Download as PDF or view in your browser.</p>
                        </div>
                    </div>
                </section>

                {/* Workflows Overview */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-xl mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span>📚</span> Workflow Modules
                    </h2>

                    <div className="space-y-6">
                        <WorkflowDoc
                            icon="📄"
                            title="Document Intelligence"
                            description="Upload PDFs, Word docs, or other documents to receive executive summaries, key insights, and actionable recommendations."
                        />

                        <WorkflowDoc
                            icon="🔗"
                            title="Web Extraction"
                            description="Paste any URL to automatically extract structured data, main content, and metadata from web pages."
                        />

                        <WorkflowDoc
                            icon="📊"
                            title="Data Insights"
                            description="Input raw CSV or JSON data to generate visualizations, trend analysis, and strategic recommendations."
                        />

                        <WorkflowDoc
                            icon="💬"
                            title="Smart Assistant"
                            description="Draft professional emails, messages, or content with perfect tone and context using AI assistance."
                        />
                    </div>
                </section>

                {/* Features */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-xl mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span>✨</span> Key Features
                    </h2>

                    <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-3">
                            <span className="text-cyan-500 mt-1">✓</span>
                            <span><strong className="text-gray-900 dark:text-white">Powered by Google Gemini 1.5 Pro:</strong> State-of-the-art AI model for maximum accuracy</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-cyan-500 mt-1">✓</span>
                            <span><strong className="text-gray-900 dark:text-white">PDF Export:</strong> Download professional reports for all workflows</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-cyan-500 mt-1">✓</span>
                            <span><strong className="text-gray-900 dark:text-white">Workflow History:</strong> Access and restore previous runs anytime</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-cyan-500 mt-1">✓</span>
                            <span><strong className="text-gray-900 dark:text-white">Analytics Dashboard:</strong> Track usage patterns and insights</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-cyan-500 mt-1">✓</span>
                            <span><strong className="text-gray-900 dark:text-white">Dark/Light Mode:</strong> Comfortable viewing experience any time of day</span>
                        </li>
                    </ul>
                </section>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-200 transform hover:scale-105"
                    >
                        <span>Get Started</span>
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </main>
    )
}

function WorkflowDoc({ icon, title, description }: { icon: string, title: string, description: string }) {
    return (
        <div className="flex gap-4 pb-6 border-b border-gray-200 dark:border-white/5 last:border-0 last:pb-0">
            <div className="text-3xl">{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </div>
    )
}
