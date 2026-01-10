import Avatar from './Avatar'
import { Star, MapPin, Calendar, Award } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface UserProfileProps {
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
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  const rating = typeof user.rating === 'string' ? parseFloat(user.rating) : user.rating
  const skillsOffered = user.skillsOffered
    ? user.skillsOffered.split(',').map((s) => s.trim()).filter(Boolean)
    : []
  const skillsNeeded = user.skillsNeeded
    ? user.skillsNeeded.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-6">
        <Avatar username={user.username} avatar={user.avatar} size="xl" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-onyx-black">{user.username}</h1>
            {user.isPremium && (
              <span className="px-3 py-1 bg-primary-green-light text-primary-white text-xs font-onyx-black rounded-full">
                Premium
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-primary-green-light text-primary-green-light" />
              <span className="font-onyx-black text-lg">
                {rating > 0 ? rating.toFixed(1) : 'Нет рейтинга'}
              </span>
            </div>
            {user.stats && (
              <span className="text-primary-gray-text font-onyx-regular text-sm">
                ({user.stats.reviewsCount} {user.stats.reviewsCount === 1 ? 'отзыв' : 'отзывов'})
              </span>
            )}
          </div>

          {/* Location */}
          {user.location && (
            <div className="flex items-center gap-2 text-primary-gray-text mb-2">
              <MapPin className="h-4 w-4" />
              <span className="font-onyx-regular">{user.location}</span>
            </div>
          )}

          {/* Created at */}
          <div className="flex items-center gap-2 text-primary-gray-text">
            <Calendar className="h-4 w-4" />
            <span className="font-onyx-regular text-sm">
              На платформе с {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <h2 className="text-xl font-onyx-black mb-3">О себе</h2>
          <p className="text-primary-gray-text font-onyx-regular whitespace-pre-wrap">
            {user.bio}
          </p>
        </div>
      )}

      {/* Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <h2 className="text-xl font-onyx-black mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Предлагаю
          </h2>
          {skillsOffered.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-green-lighter text-primary-black rounded-full text-sm font-onyx-regular border border-primary-green-light"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-primary-gray-text font-onyx-regular text-sm">
              Навыки не указаны
            </p>
          )}
        </div>

        {/* Skills Needed */}
        <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <h2 className="text-xl font-onyx-black mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Нужно
          </h2>
          {skillsNeeded.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillsNeeded.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-gray-light text-primary-black rounded-full text-sm font-onyx-regular border border-primary-gray-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-primary-gray-text font-onyx-regular text-sm">
              Навыки не указаны
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      {user.stats && (
        <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <h2 className="text-xl font-onyx-black mb-4">Статистика</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-onyx-black mb-1">
                {user.stats.reviewsCount}
              </div>
              <div className="text-sm text-primary-gray-text font-onyx-regular">
                {user.stats.reviewsCount === 1 ? 'Отзыв' : 'Отзывов'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-onyx-black mb-1">
                {user.stats.messagesCount}
              </div>
              <div className="text-sm text-primary-gray-text font-onyx-regular">
                {user.stats.messagesCount === 1 ? 'Сообщение' : 'Сообщений'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-onyx-black mb-1">
                {user.stats.exchangesCount}
              </div>
              <div className="text-sm text-primary-gray-text font-onyx-regular">
                {user.stats.exchangesCount === 1 ? 'Обмен' : 'Обменов'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
