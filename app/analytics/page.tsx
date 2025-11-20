'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

export default function AnalyticsPage() {
    const [history, setHistory] = useState<any[]>([])
    const [stats, setStats] = useState({
        totalRuns: 0,
        mostUsed: 'None',
        successRate: '100%'
    })
    const [chartData, setChartData] = useState<any>(null)

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('workflowHistory') || '[]')
        setHistory(storedHistory)

        // Calculate Stats
        const totalRuns = storedHistory.length
        const workflowCounts: Record<string, number> = {}

        storedHistory.forEach((item: any) => {
            workflowCounts[item.workflow] = (workflowCounts[item.workflow] || 0) + 1
        })

        const mostUsed = Object.entries(workflowCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

        setStats({
            totalRuns,
            mostUsed: formatWorkflowName(mostUsed),
            successRate: totalRuns > 0 ? '100%' : 'N/A' // Assuming all saved are successful for now
        })

        // Prepare Chart Data
        const labels = Object.keys(workflowCounts).map(formatWorkflowName)
        const data = Object.values(workflowCounts)

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Workflow Usage',
                    data: data,
                    backgroundColor: [
                        'rgba(6, 182, 212, 0.6)', // Cyan
                        'rgba(168, 85, 247, 0.6)', // Purple
                        'rgba(245, 158, 11, 0.6)', // Amber
                        'rgba(16, 185, 129, 0.6)', // Emerald
                    ],
                    borderColor: [
                        'rgba(6, 182, 212, 1)',
                        'rgba(168, 85, 247, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        })

    }, [])

    const formatWorkflowName = (id: string) => {
        const names: Record<string, string> = {
            'doc-summary': 'Document Intelligence',
            'url-extract': 'Web Extraction',
            'data-insights': 'Data Insights',
            'chat-draft': 'Smart Assistant'
        }
        return names[id] || id
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
            <Navbar />

            <div className="pt-24 sm:pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Analytics Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Insights into your automation usage and performance.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        title="Total Workflows Run"
                        value={stats.totalRuns.toString()}
                        icon="🚀"
                        color="cyan"
                    />
                    <StatCard
                        title="Most Used Module"
                        value={stats.mostUsed}
                        icon="🏆"
                        color="purple"
                    />
                    <StatCard
                        title="Success Rate"
                        value={stats.successRate}
                        icon="✅"
                        color="emerald"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Usage Distribution</h3>
                        {chartData ? (
                            <div className="h-64 flex items-center justify-center">
                                <Doughnut
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { color: 'gray' } // Should adapt to theme ideally
                                            }
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity Log</h3>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {history.length > 0 ? (
                                history.slice(0, 10).map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">
                                                {item.workflow === 'doc-summary' ? '📄' :
                                                    item.workflow === 'url-extract' ? '🔗' :
                                                        item.workflow === 'data-insights' ? '📊' : '💬'}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatWorkflowName(item.workflow)}</p>
                                                <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30 px-2 py-1 rounded">
                                            Completed
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-10">No activity yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) {
    const colorClasses = {
        cyan: 'from-cyan-500 to-blue-500',
        purple: 'from-purple-500 to-pink-500',
        emerald: 'from-emerald-500 to-teal-500',
        amber: 'from-amber-500 to-orange-500'
    }[color] || 'from-gray-500 to-gray-600'

    return (
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses} opacity-10 blur-2xl rounded-full -mr-10 -mt-10 transition-opacity group-hover:opacity-20`}></div>

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center text-2xl shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
