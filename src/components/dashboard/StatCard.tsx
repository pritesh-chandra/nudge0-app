'use client'

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1.5 text-sm text-ink-soft">{hint}</p>}
    </div>
  )
}
