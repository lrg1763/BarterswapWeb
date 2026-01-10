'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validations'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function ChangePasswordForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await fetch('/api/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.details) {
          result.details.forEach((err: any) => {
            if (err.path) {
              setFieldError(err.path[0] as keyof ChangePasswordInput, {
                message: err.message,
              })
            }
          })
        } else {
          setError(result.error || 'Ошибка при смене пароля')
        }
        setIsLoading(false)
        return
      }

      toast.success('Пароль успешно изменен')
      router.push('/profile')
      router.refresh()
    } catch (err) {
      console.error('Change password error:', err)
      setError('Произошла ошибка при смене пароля')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Текущий пароль
        </label>
        <div className="relative">
          <input
            {...register('currentPassword')}
            type={showCurrentPassword ? 'text' : 'password'}
            id="currentPassword"
            className="w-full px-4 py-3 pr-12 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
            placeholder="Введите текущий пароль"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-gray-text hover:text-primary-black transition-colors"
          >
            {showCurrentPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Новый пароль
        </label>
        <div className="relative">
          <input
            {...register('newPassword')}
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            className="w-full px-4 py-3 pr-12 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
            placeholder="Введите новый пароль (минимум 6 символов)"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-gray-text hover:text-primary-black transition-colors"
          >
            {showNewPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Подтвердите новый пароль
        </label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            className="w-full px-4 py-3 pr-12 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
            placeholder="Повторите новый пароль"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-gray-text hover:text-primary-black transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
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
            Изменение...
          </>
        ) : (
          'Изменить пароль'
        )}
      </button>
    </form>
  )
}
