import 'dotenv/config'
import { betterAuth } from 'better-auth'
import { emailOTP } from 'better-auth/plugins'
import { pool } from './pool'
import { sendMail } from './mailer'

export const auth = betterAuth({
  // Supabase Postgres, via the shared connection pool
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:8080',
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // No sign-in until the signup OTP has been confirmed
    requireEmailVerification: true,
  },
  plugins: [
    emailOTP({
      // Fires automatically after sign-up (and on resend)
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 60 * 10,
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === 'email-verification'
            ? `${otp} is your nudgeo verification code`
            : `${otp} is your nudgeo code`
        await sendMail({
          to: email,
          subject,
          text: `Hey,\n\nYour nudgeo verification code is ${otp}. It expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.\n\nnudgeo`,
        })
      },
    }),
  ],
  session: {
    // Refresh-token equivalent: DB-backed session token, 30-day life,
    // silently renewed (sliding window) once per day of activity.
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    // Access-token equivalent: short-lived signed cookie so most requests
    // skip the DB; re-validated against the session token every 5 minutes.
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: ['http://localhost:8080'],
})

export type Session = typeof auth.$Infer.Session
