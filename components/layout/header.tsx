'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { useTheme } from 'next-themes'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Moon01Icon,
  Sun01Icon,
  WaveIcon,
  Menu01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { useEffect, useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="bg-primary/10 p-1.5 rounded-xl group-hover:bg-primary/20 transition-colors">
              <HugeiconsIcon
                icon={WaveIcon}
                className="size-7 text-primary"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-lg leading-none tracking-tight group-hover:text-primary transition-colors">
                AI Lake Guardian
              </h1>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Udaipur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-muted/50">
            <NavLink href="/" current={pathname === '/'}>
              Dashboard
            </NavLink>
            <NavLink href="/reports" current={pathname === '/reports'}>
              Citizen Reports
            </NavLink>
            <NavLink href="/methodology" current={pathname === '/methodology'}>
              Methodology
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 bg-emerald-500/5 text-emerald-500 rounded-full border border-emerald-500/10 mr-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE SYSTEM
            </div>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
                className="rounded-xl hover:bg-primary/5"
              >
                {theme === 'dark' ? (
                  <HugeiconsIcon icon={Sun01Icon} className="h-5 w-5" />
                ) : (
                  <HugeiconsIcon icon={Moon01Icon} className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <HugeiconsIcon
                icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon}
                className="size-6"
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-md animate-in fade-in duration-200">
          <nav className="container mx-auto px-4 py-8 flex flex-col gap-4">
            <MobileNavLink
              href="/"
              current={pathname === '/'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              href="/reports"
              current={pathname === '/reports'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Citizen Reports
            </MobileNavLink>
            <MobileNavLink
              href="/methodology"
              current={pathname === '/methodology'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Methodology
            </MobileNavLink>
          </nav>
        </div>
      )}
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
        'text-xs font-bold transition-all px-4 py-2 rounded-full uppercase tracking-widest',
        current
          ? 'bg-background text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  current,
  onClick,
  children,
}: NavLinkProps & { onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'text-2xl font-black transition-all py-4 border-b border-muted/20 uppercase tracking-tighter flex items-center justify-between group',
        current ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </Link>
  )
}
