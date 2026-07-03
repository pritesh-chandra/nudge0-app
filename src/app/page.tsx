import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { UseCaseMarquee } from '@/components/UseCaseMarquee'
import { HowItWorks } from '@/components/HowItWorks'
import { FeatureBento } from '@/components/FeatureBento'
import { HypeScore } from '@/components/HypeScore'
import { Pricing } from '@/components/Pricing'
import { Testimonials } from '@/components/Testimonials'
import { Faq } from '@/components/Faq'
import { FinalCta } from '@/components/FinalCta'
import { Footer } from '@/components/Footer'

export default async function LandingPage() {
  // Signed-in visitors go straight to their dashboard
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/dashboard')

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <UseCaseMarquee />
        <HowItWorks />
        <FeatureBento />
        <HypeScore />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
