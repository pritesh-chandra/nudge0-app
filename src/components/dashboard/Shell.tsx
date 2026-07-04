'use client'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarPlus,
  ChartLineUp,
  EnvelopeSimple,
  GearSix,
  House,
  List,
  Plus,
  SignOut,
  X,
} from '@phosphor-icons/react'
import { signOut } from '@/lib/auth-client'

const NAV = [
  { href: '/dashboard', label: 'Home', icon: House },
  { href: '/dashboard/events/new', label: 'Create event', icon: CalendarPlus },
  { href: '/dashboard/analytics', label: 'Analytics', icon: ChartLineUp },
  { href: '/dashboard/emails', label: 'Email templates', icon: EnvelopeSimple },
  { href: '/dashboard/settings', label: 'Settings', icon: GearSix },
]

function isActive(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
}

async function onSignOut() {
  await signOut()
  window.location.assign('/')
}

function SidebarContent({
  pathname,
  user,
  onNavigate,
}: {
  pathname: string
  user: { name: string; email: string }
  onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-ink text-cream">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-6 pb-6 pt-6"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-sun text-lg font-extrabold text-ink">
          n
        </span>
        <span className="text-xl font-bold tracking-tight">nudgeo</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors ${
                active ? 'bg-sun text-ink' : 'text-cream/70 hover:bg-white/5 hover:text-cream'
              }`}
            >
              <Icon size={20} weight={active ? 'fill' : 'regular'} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-cream/10 p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sun font-bold text-ink">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-cream/50">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="grid size-9 shrink-0 place-items-center rounded-full text-cream/60 transition-colors hover:bg-white/10 hover:text-cream"
          >
            <SignOut size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Shell({
  user,
  children,
}: {
  user: { name: string; email: string }
  children: ReactNode
}) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const title = NAV.find(({ href }) => isActive(pathname, href))?.label ?? 'Dashboard'

  return (
    <div className="min-h-[100dvh]">
      {/* Fixed sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent pathname={pathname} user={user} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">
            <SidebarContent pathname={pathname} user={user} onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-6 grid size-9 place-items-center rounded-full text-cream/70 hover:bg-white/10"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>
      )}

      {/* Fixed topbar */}
      <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-line bg-cream/85 backdrop-blur-md lg:left-64">
        <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="grid size-10 place-items-center rounded-xl text-ink hover:bg-cream-deep lg:hidden"
            >
              <List size={22} weight="bold" />
            </button>
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/events/new"
              className="flex items-center gap-1.5 rounded-full bg-sun px-4 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98] sm:px-5"
            >
              <Plus size={16} weight="bold" />
              <span className="hidden sm:inline">New event</span>
            </Link>
            <span className="grid size-9 place-items-center rounded-full bg-ink text-sm font-bold text-cream">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pb-16 pt-24 sm:px-6 lg:pl-[280px] lg:pr-8">{children}</main>
    </div>
  )
}
