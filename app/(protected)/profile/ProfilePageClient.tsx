'use client'

import { useState } from 'react'
import Link from 'next/link'
import UserProfile from '@/components/user/UserProfile'
import ProfileForm from '@/components/forms/ProfileForm'
import { Edit2, User } from 'lucide-react'

interface ProfilePageClientProps {
  initialUser: {
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
  }
}

export default function ProfilePageClient({ initialUser }: ProfilePageClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(initialUser)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toggle buttons */}
      <div className="flex gap-4 mb-6 border-b-2 border-primary-gray-medium">
        <button
          onClick={() => setIsEditing(false)}
          className={`flex items-center gap-2 px-4 py-3 font-onyx-black transition-colors ${
            !isEditing
              ? 'text-primary-black border-b-2 border-primary-black'
              : 'text-primary-gray-text hover:text-primary-black'
          }`}
        >
          <User className="h-5 w-5" />
          Просмотр
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-3 font-onyx-black transition-colors ${
            isEditing
              ? 'text-primary-black border-b-2 border-primary-black'
              : 'text-primary-gray-text hover:text-primary-black'
          }`}
        >
          <Edit2 className="h-5 w-5" />
          Редактировать
        </button>
      </div>

      {/* Content */}
      {isEditing ? (
        <ProfileForm
          initialData={{
            username: user.username,
            skillsOffered: user.skillsOffered,
            skillsNeeded: user.skillsNeeded,
            location: user.location,
            bio: user.bio,
            avatar: user.avatar,
          }}
        />
      ) : (
        <>
          <UserProfile user={user} />
          {/* Action buttons */}
          <div className="mt-8 p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
            <h2 className="text-xl font-onyx-black mb-4">Действия</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/change-password"
                className="px-6 py-3 border-2 border-primary-black text-primary-black font-onyx-black rounded-lg hover:bg-primary-gray-light transition-colors"
              >
                Изменить пароль
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
