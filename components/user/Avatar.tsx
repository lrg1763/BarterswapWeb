import Image from 'next/image'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  username: string
  avatar?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-2xl',
}

export default function Avatar({
  username,
  avatar,
  size = 'md',
  className,
}: AvatarProps) {
  const sizeClass = sizeClasses[size]

  if (avatar) {
    // Убеждаемся, что путь начинается с /uploads/avatars/ или является абсолютным URL
    // Если avatar - это просто имя файла (например "1-1768066769830.webp"), добавляем префикс
    let imageSrc: string
    if (avatar.startsWith('/uploads/avatars/')) {
      // Уже правильный путь
      imageSrc = avatar
    } else if (avatar.startsWith('/')) {
      // Путь начинается с /, но не содержит /uploads/avatars/
      imageSrc = `/uploads/avatars${avatar}`
    } else if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
      // Абсолютный URL или data URL
      imageSrc = avatar
    } else {
      // Относительный путь (имя файла) - добавляем префикс
      imageSrc = `/uploads/avatars/${avatar}`
    }
    
    return (
      <div className={cn('relative rounded-full overflow-hidden', sizeClass, className)}>
        <Image
          src={imageSrc}
          alt={username}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  // Fallback на инициалы
  const initials = getInitials(username)

  return (
    <div
      className={cn(
        'rounded-full bg-primary-gray-light flex items-center justify-center font-onyx-black text-primary-black border-2 border-primary-gray-medium',
        sizeClass,
        className
      )}
    >
      {initials}
    </div>
  )
}
