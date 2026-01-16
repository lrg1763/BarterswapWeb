'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { Loader2 } from 'lucide-react'

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.details) {
          // Ошибки валидации Zod
          result.details.forEach((err: any) => {
            if (err.path) {
              setFieldError(err.path[0] as keyof RegisterInput, {
                message: err.message,
              })
            }
          })
        } else {
          setError(result.error || 'Произошла ошибка при регистрации')
        }
        setIsLoading(false)
        return
      }

      // Успешная регистрация - редирект на страницу входа
      router.push('/login?registered=true')
    } catch (err) {
      console.error('Register error:', err)
      setError('Произошла ошибка при регистрации')
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
          placeholder="Введите пароль (минимум 6 символов)"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Подтвердите пароль
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
          placeholder="Повторите пароль"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
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
            Регистрация...
          </>
        ) : (
          'Зарегистрироваться'
        )}
      </button>

      <p className="text-center text-sm text-primary-gray-text font-onyx-regular">
        Уже есть аккаунт?{' '}
        <a
          href="/login"
          className="text-primary-black font-onyx-black hover:underline"
        >
          Войти
        </a>
      </p>
    </form>
  )
}
