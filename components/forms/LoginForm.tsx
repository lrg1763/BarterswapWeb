'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/profile'
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null)
      setIsLoading(true)

      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Неверное имя пользователя или пароль')
        setIsLoading(false)
        return
      }

      // Успешный вход
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      console.error('Login error:', err)
      setError('Произошла ошибка при входе')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Имя пользователя
        </label>
        <input
          {...register('username')}
          type="text"
          id="username"
          className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
          placeholder="Введите имя пользователя"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Пароль
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
          placeholder="Введите пароль"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...register('rememberMe')}
          type="checkbox"
          id="rememberMe"
          className="w-4 h-4 border-2 border-primary-black rounded focus:ring-2 focus:ring-primary-green-light"
        />
        <label
          htmlFor="rememberMe"
          className="ml-2 text-sm font-onyx-regular text-primary-gray-text"
        >
          Запомнить меня
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-800 font-onyx-regular">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Вход...
          </>
        ) : (
          'Войти'
        )}
      </button>

      <p className="text-center text-sm text-primary-gray-text font-onyx-regular">
        Нет аккаунта?{' '}
        <a
          href="/register"
          className="text-primary-black font-onyx-black hover:underline"
        >
          Зарегистрироваться
        </a>
      </p>
    </form>
  )
}
