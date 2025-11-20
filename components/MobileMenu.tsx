'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

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

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <>
            {/* Hamburger Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-[110]"
                aria-label="Toggle menu"
            >
                <div className="space-y-1.5">
                    <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
            </button>

            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[100] md:hidden bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                aria-hidden="true"
            />

            {/* Slide-in Menu Drawer */}
            <div
                ref={menuRef}
                className={`fixed top-0 right-0 h-[100dvh] w-72 bg-black border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col z-[101] md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black">
                    <div>
                        <h2 className="text-lg font-bold text-white">Menu</h2>
                        <p className="text-xs text-gray-500">Project HawkkEyed</p>
                    </div>

                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2 bg-black">
                    {[
                        { href: '/', label: 'Workflows', icon: '⚡' },
                        { href: '/history', label: 'History', icon: '🕰️' },
                        { href: '/analytics', label: 'Analytics', icon: '📊' },
                        { href: '/settings', label: 'Settings', icon: '⚙️' },
                        { href: '/documentation', label: 'Quick Start', icon: '📚' },
                    ].map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${isActive
                                    ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium text-base">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                            🤖
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Powered by</p>
                            <p className="text-sm font-bold text-white">Google Gemini AI</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
