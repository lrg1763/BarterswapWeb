import LoginForm from '@/components/forms/LoginForm'
import LoginPageClient from './LoginPageClient'
import { Suspense } from 'react'

export const metadata = {
  title: 'Вход - SkillSwap',
  description: 'Войдите в свой аккаунт SkillSwap',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginPageClient />
    </Suspense>
  )
}
