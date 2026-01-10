'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, type ReviewInput } from '@/lib/validations'
import { Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReviewFormProps {
  reviewedId: number
  existingReview?: {
    id: number
    rating: number
    comment?: string | null
  } | null
  onSuccess?: () => void
}

export default function ReviewForm({
  reviewedId,
  existingReview,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter()
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
    },
  })

  const rating = watch('rating')

  const onSubmit = async (data: ReviewInput) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewed_id: reviewedId,
          rating: data.rating,
          comment: data.comment,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при сохранении отзыва')
      }

      toast.success(
        existingReview ? 'Отзыв обновлен' : 'Отзыв успешно добавлен'
      )
      router.refresh()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Review submit error:', error)
      toast.error(error.message || 'Произошла ошибка при сохранении отзыва')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-onyx-black mb-3 text-primary-black">
          Рейтинг <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('rating', value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  value <= (hoveredRating || rating)
                    ? 'fill-primary-green-light text-primary-green-light'
                    : 'text-primary-gray-medium'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-primary-gray-text font-onyx-regular">
              {rating} {rating === 1 ? 'звезда' : rating < 5 ? 'звезды' : 'звезд'}
            </span>
          )}
        </div>
        <input
          {...register('rating')}
          type="hidden"
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-onyx-black mb-2 text-primary-black"
        >
          Комментарий (опционально, максимум 500 символов)
        </label>
        <textarea
          {...register('comment')}
          id="comment"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent resize-none"
          placeholder="Оставьте комментарий о пользователе..."
        />
        <p className="mt-1 text-xs text-primary-gray-text font-onyx-regular">
          {watch('comment')?.length || 0} / 500 символов
        </p>
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || rating === 0}
        className="px-6 py-3 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          existingReview ? 'Обновить отзыв' : 'Оставить отзыв'
        )}
      </button>
    </form>
  )
}
