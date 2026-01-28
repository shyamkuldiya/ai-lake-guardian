'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🌊</span>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">
                AI Lake Guardian
              </h1>
              <span className="text-xs text-muted-foreground">Udaipur</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/" current={pathname === '/'}>
              Dashboard
            </NavLink>
            <NavLink href="/reports" current={pathname === '/reports'}>
              Reports
            </NavLink>
          </nav>

          {/* Status indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">Live System</span>
            </div>

            {/* Last updated */}
            <div className="hidden sm:block text-xs text-muted-foreground">
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
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        current ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  )
}
