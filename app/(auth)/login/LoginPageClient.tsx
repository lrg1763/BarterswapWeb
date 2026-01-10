'use client'

import LoginForm from '@/components/forms/LoginForm'
import Toast from '@/components/ui/Toast'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginPageClient() {
  const searchParams = useSearchParams()
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowToast(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-primary-white flex items-center justify-center px-4 py-12">
      {showToast && (
        <Toast
          message="Регистрация успешна! Теперь вы можете войти."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-onyx-black mb-2">SkillSwap</h1>
          <h2 className="text-2xl md:text-3xl font-onyx-black mb-4">Вход</h2>
          <p className="text-primary-gray-text font-onyx-regular">
            Войдите в свой аккаунт
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
