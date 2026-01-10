'use client'

import { useState, useEffect } from 'react'
import Avatar from '@/components/user/Avatar'
import { Star, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Review {
  id: number
  rating: number | string
  comment?: string | null
  createdAt: Date | string
  reviewer: {
    id: number
    username: string
    avatar?: string | null
  }
}

interface ReviewListProps {
  userId: number
  currentUserId: number
  initialReviews?: Review[]
  initialPage?: number
  initialTotalPages?: number
}

export default function ReviewList({
  userId,
  currentUserId,
  initialReviews = [],
  initialPage = 1,
  initialTotalPages = 1,
}: ReviewListProps) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [isLoading, setIsLoading] = useState(false)

  const loadReviews = async (pageNum: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/reviews/user/${userId}?page=${pageNum}&pageSize=10`
      )
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
        setPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Load reviews error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return
    }

    try {
      const response = await fetch(`/api/reviews?id=${reviewId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Ошибка при удалении отзыва')
      }

      toast.success('Отзыв удален')
      router.refresh()
      loadReviews(page)
    } catch (error: any) {
      console.error('Delete review error:', error)
      toast.error(error.message || 'Произошла ошибка при удалении отзыва')
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-primary-gray-text font-onyx-regular text-lg">
          Пока нет отзывов
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const rating = typeof review.rating === 'string' 
          ? parseFloat(review.rating) 
          : review.rating

        return (
          <div
            key={review.id}
            className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white"
          >
            <div className="flex items-start gap-4 mb-3">
              <Avatar
                username={review.reviewer.username}
                avatar={review.reviewer.avatar}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-onyx-black text-lg">{review.reviewer.username}</h4>
                  {review.reviewer.id === currentUserId && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Удалить отзыв"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`h-4 w-4 ${
                          value <= rating
                            ? 'fill-primary-green-light text-primary-green-light'
                            : 'text-primary-gray-medium'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-primary-gray-text font-onyx-regular">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            {review.comment && (
              <p className="text-primary-gray-text font-onyx-regular whitespace-pre-wrap">
                {review.comment}
              </p>
            )}
          </div>
        )
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => loadReviews(page - 1)}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 border-2 border-primary-black rounded-lg font-onyx-regular hover:bg-primary-gray-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>
          <span className="px-4 py-2 text-primary-gray-text font-onyx-regular">
            Страница {page} из {totalPages}
          </span>
          <button
            onClick={() => loadReviews(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="px-4 py-2 border-2 border-primary-black rounded-lg font-onyx-regular hover:bg-primary-gray-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  )
}
