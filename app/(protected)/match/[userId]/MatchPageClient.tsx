'use client'

import { useState } from 'react'
import Link from 'next/link'
import UserProfile from '@/components/user/UserProfile'
import ReviewForm from '@/components/reviews/ReviewForm'
import ReviewList from '@/components/reviews/ReviewList'
import { MessageCircle, Heart, Ban, ArrowLeft, Award, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface MatchPageClientProps {
  user: {
    id: number
    username: string
    avatar?: string | null
    rating: number | string
    location?: string | null
    skillsOffered?: string | null
    skillsNeeded?: string | null
    bio?: string | null
    createdAt: Date | string
    isPremium?: boolean
    stats?: {
      reviewsCount: number
      messagesCount: number
      exchangesCount: number
    }
    skillsMatches: string[]
    isFavorite: boolean
    isBlocked: boolean
    existingReview?: {
      id: number
      rating: number
      comment?: string | null
    } | null
    reviews?: Array<{
      id: number
      rating: number | string
      comment?: string | null
      createdAt: Date | string
      reviewer: {
        id: number
        username: string
        avatar?: string | null
      }
    }>
    reviewsPagination?: {
      page: number
      totalPages: number
      total: number
    }
  }
  currentUserId: number
}

export default function MatchPageClient({
  user,
  currentUserId,
}: MatchPageClientProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(user.isFavorite)
  const [isBlocked, setIsBlocked] = useState(user.isBlocked)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFavorite = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/favorites/${user.id}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Ошибка при изменении избранного')
      }

      const result = await response.json()
      setIsFavorite(result.isFavorite)
      toast.success(
        result.isFavorite
          ? 'Пользователь добавлен в избранное'
          : 'Пользователь удален из избранного'
      )
    } catch (error) {
      console.error('Toggle favorite error:', error)
      toast.error('Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleBlock = async () => {
    if (
      !confirm(
        `Вы уверены, что хотите ${
          isBlocked ? 'разблокировать' : 'заблокировать'
        } этого пользователя?`
      )
    ) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/blocks/${user.id}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Ошибка при блокировке/разблокировке')
      }

      const result = await response.json()
      setIsBlocked(result.isBlocked)

      if (result.isBlocked) {
        toast.success('Пользователь заблокирован')
        router.push('/search')
      } else {
        toast.success('Пользователь разблокирован')
        router.refresh()
      }
    } catch (error) {
      console.error('Toggle block error:', error)
      toast.error('Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-primary-gray-text hover:text-primary-black transition-colors mb-6 font-onyx-regular"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к поиску
      </Link>

      {/* Skills Matches */}
      {user.skillsMatches.length > 0 && (
        <div className="p-6 border-2 border-primary-green-light rounded-lg bg-primary-green-lighter mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-primary-green-light" />
            <h2 className="text-xl font-onyx-black">Совпадения навыков</h2>
          </div>
          <p className="text-primary-gray-text font-onyx-regular mb-3">
            Этот пользователь предлагает навыки, которые вам нужны:
          </p>
          <div className="flex flex-wrap gap-2">
            {user.skillsMatches.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-green-light text-primary-white rounded-full text-sm font-onyx-black border-2 border-primary-green-light"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* User Profile */}
      <UserProfile user={user} />

      {/* Review Form */}
      {!user.isBlocked && user.id !== currentUserId && (
        <div className="mt-8 p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <h2 className="text-xl font-onyx-black mb-4 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {user.existingReview ? 'Редактировать отзыв' : 'Оставить отзыв'}
          </h2>
          <ReviewForm
            reviewedId={user.id}
            existingReview={user.existingReview || null}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="mt-8">
        <h2 className="text-2xl font-onyx-black mb-6">
          Отзывы ({user.stats?.reviewsCount || 0})
        </h2>
        <ReviewList
          userId={user.id}
          currentUserId={currentUserId}
          initialReviews={user.reviews || []}
          initialPage={user.reviewsPagination?.page || 1}
          initialTotalPages={user.reviewsPagination?.totalPages || 1}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
        <h2 className="text-xl font-onyx-black mb-4">Действия</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/chats/${user.id}`}
            className="flex items-center gap-2 px-6 py-3 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" />
            Написать сообщение
          </Link>

          <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-3 border-2 rounded-lg font-onyx-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isFavorite
                ? 'bg-primary-green-lighter border-primary-green-light text-primary-black'
                : 'border-primary-black text-primary-black hover:bg-primary-gray-light'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          </button>

          <button
            onClick={handleToggleBlock}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-3 border-2 rounded-lg font-onyx-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isBlocked
                ? 'bg-red-50 border-red-500 text-red-800'
                : 'border-primary-black text-primary-black hover:bg-red-50 hover:border-red-500'
            }`}
          >
            <Ban className="h-5 w-5" />
            {isBlocked ? 'Разблокировать' : 'Заблокировать'}
          </button>
        </div>
      </div>
    </div>
  )
}
