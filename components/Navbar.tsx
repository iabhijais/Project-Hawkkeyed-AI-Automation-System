'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <Image
                                src="/logo.jpg"
                                alt="Hawkkeyed Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-base sm:text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 dark:from-white dark:via-cyan-200 dark:to-cyan-500">
                            PROJECT HAWKKEYED
                        </span>
                    </Link>

                    {/* Desktop Navigation - Shifted Left */}
                    <div className="hidden md:flex items-center gap-6 ml-auto mr-4">
                        <div className="flex items-baseline space-x-6">
                            <NavLink href="/" active={pathname === '/'}>Workflows</NavLink>
                            <NavLink href="/history" active={pathname === '/history'}>History</NavLink>
                            <NavLink href="/analytics" active={pathname === '/analytics'}>Analytics</NavLink>
                            <NavLink href="/settings" active={pathname === '/settings'}>Settings</NavLink>
                        </div>

                        {/* Quick Start Button */}
                        <Link
                            href="/documentation"
                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-200 transform hover:scale-105"
                        >
                            Quick Start
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <Link
                            href="/documentation"
                            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-200"
                        >
                            Quick Start
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${active
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
        >
            {children}
        </Link>
    )
}
