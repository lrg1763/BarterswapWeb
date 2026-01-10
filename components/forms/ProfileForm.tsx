'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations'
import { Loader2, Upload, X } from 'lucide-react'
import Avatar from '@/components/user/Avatar'
import Image from 'next/image'

interface ProfileFormProps {
  initialData: {
    username: string
    skillsOffered?: string | null
    skillsNeeded?: string | null
    location?: string | null
    bio?: string | null
    avatar?: string | null
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatar || null
  )
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
    watch,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: initialData.username,
      skillsOffered: initialData.skillsOffered || '',
      skillsNeeded: initialData.skillsNeeded || '',
      location: initialData.location || '',
      bio: initialData.bio || '',
    },
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Валидация типа файла
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Недопустимый тип файла. Используйте PNG, JPG, JPEG, GIF или WEBP')
      return
    }

    // Валидация размера (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('Файл слишком большой. Максимальный размер: 5MB')
      return
    }

    setError(null)
    setAvatarFile(file)

    // Превью изображения
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      setError(null)
      setSuccess(null)
      setIsLoading(true)

      // Сначала обновляем аватар, если он был изменен
      let avatarUrl = initialData.avatar

      if (avatarFile) {
        const formData = new FormData()
        formData.append('avatar', avatarFile)

        const avatarResponse = await fetch('/api/users/me/avatar', {
          method: 'POST',
          body: formData,
        })

        if (!avatarResponse.ok) {
          const result = await avatarResponse.json()
          setError(result.error || 'Ошибка при загрузке аватара')
          setIsLoading(false)
          return
        }

        const avatarResult = await avatarResponse.json()
        avatarUrl = avatarResult.avatar
      } else if (avatarPreview === null && initialData.avatar) {
        // Удаление аватара
        const formData = new FormData()
        formData.append('avatar', '')

        await fetch('/api/users/me/avatar', {
          method: 'POST',
          body: formData,
        })
        avatarUrl = null
      }

      // Обновляем профиль
      const response = await fetch('/api/users/me', {
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
              setFieldError(err.path[0] as keyof UpdateProfileInput, {
                message: err.message,
              })
            }
          })
        } else {
          setError(result.error || 'Ошибка при обновлении профиля')
        }
        setIsLoading(false)
        return
      }

      setSuccess('Профиль успешно обновлен')
      router.refresh()

      // Сбрасываем форму через 2 секунды
      setTimeout(() => {
        setSuccess(null)
      }, 2000)
    } catch (err) {
      console.error('Profile update error:', err)
      setError('Произошла ошибка при обновлении профиля')
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
        <h2 className="text-2xl font-onyx-black mb-6">Редактировать профиль</h2>

        {/* Avatar upload */}
        <div className="mb-6">
          <label className="block text-sm font-onyx-black mb-3 text-primary-black">
            Аватар
          </label>
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <div className="relative">
                <Image
                  src={avatarPreview.startsWith('data:') || avatarPreview.startsWith('http://') || avatarPreview.startsWith('https://') || avatarPreview.startsWith('/') 
                    ? avatarPreview 
                    : `/uploads/avatars/${avatarPreview}`}
                  alt="Avatar preview"
                  width={100}
                  height={100}
                  className="rounded-full object-cover border-2 border-primary-black"
                />
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-2 -right-2 p-1 bg-primary-black text-primary-white rounded-full hover:opacity-80 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Avatar username={watch('username') || initialData.username} size="lg" />
            )}
            <div>
              <label
                htmlFor="avatar"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-primary-black rounded-lg hover:bg-primary-gray-light transition-colors font-onyx-regular"
              >
                <Upload className="h-4 w-4" />
                {avatarPreview ? 'Изменить аватар' : 'Загрузить аватар'}
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="mt-2 text-xs text-primary-gray-text font-onyx-regular">
                PNG, JPG, GIF, WEBP. Максимум 5MB. Автоматическое сжатие до 500x500px
              </p>
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="mb-6">
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
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-6">
          <label
            htmlFor="location"
            className="block text-sm font-onyx-black mb-2 text-primary-black"
          >
            Местоположение
          </label>
          <input
            {...register('location')}
            type="text"
            id="location"
            className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent"
            placeholder="Например: Москва, Россия"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Skills Offered */}
        <div className="mb-6">
          <label
            htmlFor="skillsOffered"
            className="block text-sm font-onyx-black mb-2 text-primary-black"
          >
            Навыки, которые предлагаю (через запятую)
          </label>
          <textarea
            {...register('skillsOffered')}
            id="skillsOffered"
            rows={3}
            className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent resize-none"
            placeholder="Например: Программирование на Python, Веб-дизайн, Английский язык"
          />
          {errors.skillsOffered && (
            <p className="mt-1 text-sm text-red-600">{errors.skillsOffered.message}</p>
          )}
        </div>

        {/* Skills Needed */}
        <div className="mb-6">
          <label
            htmlFor="skillsNeeded"
            className="block text-sm font-onyx-black mb-2 text-primary-black"
          >
            Навыки, которые нужны (через запятую)
          </label>
          <textarea
            {...register('skillsNeeded')}
            id="skillsNeeded"
            rows={3}
            className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent resize-none"
            placeholder="Например: Фотография, Маркетинг, Французский язык"
          />
          {errors.skillsNeeded && (
            <p className="mt-1 text-sm text-red-600">{errors.skillsNeeded.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label
            htmlFor="bio"
            className="block text-sm font-onyx-black mb-2 text-primary-black"
          >
            Биография (максимум 1000 символов)
          </label>
          <textarea
            {...register('bio')}
            id="bio"
            rows={6}
            maxLength={1000}
            className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent resize-none"
            placeholder="Расскажите о себе..."
          />
          <p className="mt-1 text-xs text-primary-gray-text font-onyx-regular">
            {watch('bio')?.length || 0} / 1000 символов
          </p>
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-sm text-red-800 font-onyx-regular">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm text-green-800 font-onyx-regular">{success}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            'Сохранить изменения'
          )}
        </button>
      </div>
    </form>
  )
}
