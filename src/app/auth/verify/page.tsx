import { Suspense } from 'react'
import { VerifyForm } from '@/components/auth/VerifyForm'

export const metadata = { title: 'Verify your email · nudgeo' }

export default function VerifyPage() {
  // Suspense boundary required for useSearchParams during prerender
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
