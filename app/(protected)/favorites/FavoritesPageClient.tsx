'use client'

import { useState } from 'react'
import UserCard from '@/components/user/UserCard'
import { Heart, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: number
  username: string
  avatar?: string | null
  rating: number | string
  location?: string | null
  skillsOffered?: string | null
  skillsNeeded?: string | null
  isOnline?: boolean
}

interface FavoritesPageClientProps {
  initialUsers: User[]
}

export default function FavoritesPageClient({
  initialUsers,
}: FavoritesPageClientProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({})

  const handleRemove = async (userId: number) => {
    if (
      !confirm('Вы уверены, что хотите удалить этого пользователя из избранного?')
    ) {
      return
    }

    setIsLoading((prev) => ({ ...prev, [userId]: true }))

    try {
      const response = await fetch(`/api/favorites/${userId}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Ошибка при удалении из избранного')
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId))
      toast.success('Пользователь удален из избранного')
    } catch (error: any) {
      console.error('Remove favorite error:', error)
      toast.error(error.message || 'Произошла ошибка')
    } finally {
      setIsLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-onyx-black mb-2 flex items-center gap-3">
        <Heart className="h-8 w-8 fill-primary-green-light text-primary-green-light" />
        Избранное
      </h1>
      <p className="text-primary-gray-text font-onyx-regular mb-8">
        Пользователи, которых вы добавили в избранное
      </p>

      {users.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-primary-gray-medium mb-4" />
          <p className="text-primary-gray-text font-onyx-regular text-lg mb-4">
            У вас пока нет избранных пользователей
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Найти пользователей
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="relative">
              <UserCard user={user} />
              <button
                onClick={() => handleRemove(user.id)}
                disabled={isLoading[user.id]}
                className="absolute top-4 right-4 p-2 bg-primary-white border-2 border-primary-gray-medium rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Удалить из избранного"
              >
                <Trash2 className="h-4 w-4 text-primary-black hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
