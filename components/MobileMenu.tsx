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
        { href: '/', label: 'Workflows', icon: '⚡' },
        { href: '/history', label: 'History', icon: '🕰️' },
        { href: '/analytics', label: 'Analytics', icon: '📊' },
        { href: '/settings', label: 'Settings', icon: '⚙️' },
        { href: '/documentation', label: 'Quick Start', icon: '📚' },
    ]

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                aria-label="Toggle menu"
            >
                <div className="w-5 h-4 flex flex-col justify-between">
                    <span
                        className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''
                            }`}
                    />
                    <span
                        className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''
                            }`}
                    />
                    <span
                        className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''
                            }`}
                    />
                </div>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-in Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-[#0B0F19]/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-2xl shadow-black/50 z-50 transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                {/* Menu Header */}
                <div className="relative p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Menu
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <span className="text-gray-400 text-2xl">×</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Navigation</p>
                </div>

                {/* Menu Items */}
                <nav className="relative p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-black/30 backdrop-blur-xl">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">Powered by</p>
                        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Google Gemini AI
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
