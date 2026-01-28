'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl">🌊</span>
            <div>
              <h1 className="font-bold text-lg text-slate-100 group-hover:text-sky-400 transition-colors">
                AI Lake Guardian
              </h1>
              <p className="text-xs text-slate-400">Udaipur</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" current={pathname === '/'}>
              Dashboard
            </NavLink>
            <NavLink href="/reports" current={pathname === '/reports'}>
              Reports
            </NavLink>
          </nav>

          {/* Status indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="hidden sm:inline">Live</span>
            </div>

            {/* Last updated */}
            <div className="hidden sm:block text-xs text-slate-500">
              Updated{' '}
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

interface NavLinkProps {
  href: string
  current: boolean
  children: React.ReactNode
}

function NavLink({ href, current, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${
          current
            ? 'bg-sky-500/20 text-sky-400'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
        }
      `}
    >
      {children}
    </Link>
  )
}
