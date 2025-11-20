'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const menuItems = [
        { href: '/', label: 'Workflows', icon: '⚡', description: 'AI Automation' },
        { href: '/history', label: 'History', icon: '🕰️', description: 'Past Tasks' },
        { href: '/analytics', label: 'Analytics', icon: '📊', description: 'Insights' },
        { href: '/settings', label: 'Settings', icon: '⚙️', description: 'Preferences' },
        { href: '/documentation', label: 'Quick Start', icon: '📚', description: 'Documentation' },
    ]

    return (
        <>
            {/* Hamburger Button - Premium Design */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 transition-all shadow-lg shadow-cyan-500/10"
                aria-label="Toggle menu"
            >
                <div className="w-5 h-4 flex flex-col justify-between">
                    <span
                        className={`w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''
                            }`}
                    />
                    <span
                        className={`w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''
                            }`}
                    />
                    <span
                        className={`w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''
                            }`}
                    />
                </div>
            </button>

            {/* Backdrop - Premium Blur */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-in Menu - Ultra Premium */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] border-l border-cyan-500/30 shadow-2xl z-50 transform transition-all duration-500 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_50%)]" />

                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

                {/* Content Container */}
                <div className="relative h-full flex flex-col">
                    {/* Header - Premium */}
                    <div className="p-6 border-b border-white/10 backdrop-blur-xl bg-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                                    Navigation
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Project HawkkEyed</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                            >
                                <span className="text-gray-400 group-hover:text-white text-2xl transition-colors">×</span>
                            </button>
                        </div>
                    </div>

                    {/* Menu Items - Ultra Premium */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${isActive
                                            ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/20'
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Hover Glow Effect */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    )}

                                    {/* Icon Container */}
                                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 shadow-lg shadow-cyan-500/20'
                                            : 'bg-white/5 group-hover:bg-white/10 group-hover:scale-110'
                                        }`}>
                                        <span className="text-2xl">{item.icon}</span>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <span className={`font-semibold transition-colors ${isActive ? 'text-cyan-300' : 'text-white group-hover:text-cyan-300'
                                                }`}>
                                                {item.label}
                                            </span>
                                            {isActive && (
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse animation-delay-150" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                                    </div>

                                    {/* Arrow Indicator */}
                                    <div className={`transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                                        }`}>
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer - Premium */}
                    <div className="p-6 border-t border-white/10 backdrop-blur-xl bg-gradient-to-br from-black/40 to-black/20">
                        <div className="text-center space-y-3">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <span className="text-lg">🤖</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500">Powered by</p>
                                    <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                        Google Gemini AI
                                    </p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/5">
                                <p className="text-xs text-gray-600">Version 1.0.0 • Production</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
