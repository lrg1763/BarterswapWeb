import LoginForm from '@/components/forms/LoginForm'
import LoginPageClient from './LoginPageClient'
import { Suspense } from 'react'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://barterswap.com'

export const metadata: Metadata = {
  title: 'Вход - Barterswap',
  description: 'Войдите в свой аккаунт Barterswap',
  openGraph: {
    title: 'Вход - Barterswap',
    description: 'Войдите в свой аккаунт Barterswap',
    url: `${baseUrl}/login`,
    siteName: 'Barterswap',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Вход - Barterswap',
    description: 'Войдите в свой аккаунт Barterswap',
  },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginPageClient />
    </Suspense>
  )
}
