import { useMemo } from 'react'

export type LocalCurrency = { currency: string; locale: string }

// USD per unit -> local currency conversion snapshot.
// Placeholder rates: swap for a live FX feed or fixed regional price lists before charging.
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 87,
  JPY: 155,
  CAD: 1.37,
  AUD: 1.52,
  BRL: 5.4,
  SGD: 1.34,
  AED: 3.67,
  CHF: 0.88,
}

const EURO_COUNTRIES = new Set([
  'AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR',
  'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK',
])

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  IN: 'INR',
  JP: 'JPY',
  CA: 'CAD',
  AU: 'AUD',
  BR: 'BRL',
  SG: 'SGD',
  AE: 'AED',
  CH: 'CHF',
}

// Timezone is the closest permissionless proxy for where the user physically is.
const COUNTRY_BY_TIMEZONE: Record<string, string> = {
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Tokyo': 'JP',
  'Asia/Singapore': 'SG',
  'Asia/Dubai': 'AE',
  'Europe/London': 'GB',
  'Europe/Dublin': 'IE',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Vienna': 'AT',
  'Europe/Lisbon': 'PT',
  'Europe/Zurich': 'CH',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Phoenix': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Sao_Paulo': 'BR',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU',
}

function countryToCurrency(country: string | undefined): string | undefined {
  if (!country) return undefined
  if (EURO_COUNTRIES.has(country)) return 'EUR'
  return CURRENCY_BY_COUNTRY[country]
}

export function detectLocalCurrency(): LocalCurrency {
  const locale = navigator.language || 'en-US'

  // 1. Timezone (physical location proxy)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  let currency = countryToCurrency(COUNTRY_BY_TIMEZONE[timeZone])

  // 2. Locale region fallback (e.g. en-IN -> IN)
  if (!currency) {
    for (const tag of navigator.languages ?? [locale]) {
      try {
        const region = new Intl.Locale(tag).region
        currency = countryToCurrency(region ?? undefined)
        if (currency) break
      } catch {
        // ignore malformed language tags
      }
    }
  }

  return { currency: currency ?? 'USD', locale }
}

export function formatUsd(usd: number, { currency, locale }: LocalCurrency): string {
  const amount = Math.round(usd * (RATES[currency] ?? 1))
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function useLocalCurrency(): LocalCurrency {
  return useMemo(() => detectLocalCurrency(), [])
}
