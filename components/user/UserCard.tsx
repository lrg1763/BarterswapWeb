import Link from 'next/link'
import Avatar from './Avatar'
import { Star, MapPin } from 'lucide-react'

interface UserCardProps {
  user: {
    id: number
    username: string
    avatar?: string | null
    rating: number | string
    location?: string | null
    skillsOffered?: string | null
    skillsNeeded?: string | null
    isOnline?: boolean
  }
}

export default function UserCard({ user }: UserCardProps) {
  const rating = typeof user.rating === 'string' ? parseFloat(user.rating) : user.rating
  const skillsOffered = user.skillsOffered
    ? user.skillsOffered.split(',').slice(0, 3).map((s) => s.trim()).filter(Boolean)
    : []
  const skillsNeeded = user.skillsNeeded
    ? user.skillsNeeded.split(',').slice(0, 3).map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <Link href={`/match/${user.id}`}>
      <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white hover:border-primary-green-light transition-colors cursor-pointer">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar username={user.username} avatar={user.avatar} size="lg" />
            {user.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary-green-light border-2 border-primary-white rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-onyx-black mb-1 truncate">{user.username}</h3>
            <div className="flex items-center gap-2 mb-2">
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary-green-light text-primary-green-light" />
                  <span className="text-sm font-onyx-black">{rating.toFixed(1)}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-1 text-primary-gray-text">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs font-onyx-regular truncate">{user.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Offered */}
        {skillsOffered.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-primary-gray-text font-onyx-regular mb-1">Предлагает:</p>
            <div className="flex flex-wrap gap-1">
              {skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-green-lighter text-primary-black rounded text-xs font-onyx-regular border border-primary-green-light"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills Needed */}
        {skillsNeeded.length > 0 && (
          <div>
            <p className="text-xs text-primary-gray-text font-onyx-regular mb-1">Нужно:</p>
            <div className="flex flex-wrap gap-1">
              {skillsNeeded.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-gray-light text-primary-black rounded text-xs font-onyx-regular border border-primary-gray-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-primary-gray-medium">
          <span className="text-sm text-primary-black font-onyx-black hover:underline">
            Просмотреть профиль →
          </span>
        </div>
      </div>
    </Link>
  )
}
