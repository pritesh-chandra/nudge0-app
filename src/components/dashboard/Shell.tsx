'use client'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarPlus,
  ChartLineUp,
  Crown,
  EnvelopeSimple,
  GearSix,
  House,
  List,
  Plus,
  SignOut,
  X,
} from '@phosphor-icons/react'
import { signOut } from '@/lib/auth-client'
import { UpgradeModal } from './UpgradeModal'

export type Quota = {
  planKey: 'free' | 'creator' | 'studio'
  planName: string
  eventsUsed: number
  eventsLimit: number | null
  emailsUsed: number
  emailsLimit: number
}

function Meter({ used, limit }: { used: number; limit: number | null }) {
  const unlimited = limit === null
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(limit, 1)) * 100))
  const nearLimit = !unlimited && pct >= 80
  return (
    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
      {!unlimited && (
        <div
          className={`h-full rounded-full ${nearLimit ? 'bg-[#E2725B]' : 'bg-sun'}`}
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      )}
    </div>
  )
}

function QuotaCard({ quota, onUpgrade }: { quota: Quota; onUpgrade: () => void }) {
  const eventsLeft =
    quota.eventsLimit === null ? '∞' : Math.max(0, quota.eventsLimit - quota.eventsUsed)
  const emailsLeft = Math.max(0, quota.emailsLimit - quota.emailsUsed)

  return (
    <div className="mx-3 mb-3 rounded-2xl bg-white/[0.06] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-cream/50">
          {quota.planName} plan
        </span>
        {quota.planKey !== 'free' && <Crown size={14} weight="fill" className="text-sun" />}
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-cream/80">Events</span>
            <span className="tabular-nums text-cream/50">
              {quota.eventsUsed}
              {quota.eventsLimit === null ? '' : ` / ${quota.eventsLimit}`}
            </span>
          </div>
          <Meter used={quota.eventsUsed} limit={quota.eventsLimit} />
          <p className="mt-1 text-[11px] text-cream/40">
            {eventsLeft === '∞' ? 'Unlimited events' : `${eventsLeft} left in your quota`}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-cream/80">Emails this month</span>
            <span className="tabular-nums text-cream/50">
              {quota.emailsUsed.toLocaleString()} / {quota.emailsLimit.toLocaleString()}
            </span>
          </div>
          <Meter used={quota.emailsUsed} limit={quota.emailsLimit} />
          <p className="mt-1 text-[11px] text-cream/40">
            {quota.emailsLimit === 0
              ? 'Pay-as-you-go on Free'
              : `${emailsLeft.toLocaleString()} sends left`}
          </p>
        </div>
      </div>

      {quota.planKey === 'free' && (
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-sun px-4 py-2 text-xs font-bold text-ink transition-transform hover:-translate-y-px active:scale-[0.98]"
        >
          <Crown size={13} weight="fill" />
          Upgrade now
        </button>
      )}
    </div>
  )
}

const NAV = [
  { href: '/dashboard', label: 'Home', icon: House, pro: false },
  { href: '/dashboard/events/new', label: 'Create event', icon: CalendarPlus, pro: false },
  { href: '/dashboard/analytics', label: 'Analytics', icon: ChartLineUp, pro: false },
  { href: '/dashboard/emails', label: 'Email templates', icon: EnvelopeSimple, pro: true },
  { href: '/dashboard/settings', label: 'Settings', icon: GearSix, pro: false },
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
  quota,
  onNavigate,
  onUpgrade,
}: {
  pathname: string
  user: { name: string; email: string }
  quota: Quota
  onNavigate?: () => void
  onUpgrade: () => void
}) {
  const isFree = quota.planKey === 'free'
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
        {NAV.map(({ href, label, icon: Icon, pro }) => {
          const active = isActive(pathname, href)
          const locked = pro && isFree
          if (locked) {
            return (
              <button
                key={href}
                type="button"
                onClick={onUpgrade}
                title="Upgrade to unlock"
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-cream/35 transition-colors hover:bg-white/5"
              >
                <Icon size={20} />
                <span className="flex-1 text-left">{label}</span>
                <Crown size={13} weight="fill" className="text-sun/70" />
              </button>
            )
          }
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

      <QuotaCard quota={quota} onUpgrade={onUpgrade} />

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
  quota,
  children,
}: {
  user: { name: string; email: string }
  quota: Quota
  children: ReactNode
}) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const title = NAV.find(({ href }) => isActive(pathname, href))?.label ?? 'Dashboard'

  function openUpgrade() {
    setDrawerOpen(false)
    setUpgradeOpen(true)
  }

  return (
    <div className="min-h-[100dvh]">
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      {/* Fixed sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent pathname={pathname} user={user} quota={quota} onUpgrade={openUpgrade} />
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
            <SidebarContent
              pathname={pathname}
              user={user}
              quota={quota}
              onNavigate={() => setDrawerOpen(false)}
              onUpgrade={openUpgrade}
            />
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
