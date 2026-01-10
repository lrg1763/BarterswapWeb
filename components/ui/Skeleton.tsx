import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-primary-gray-light'
  
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      aria-hidden="true"
    />
  )
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  return <Skeleton variant="circular" className={sizeClasses[size]} />
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white', className)}>
      <div className="flex items-center gap-4 mb-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-5 w-1/3" />
          <Skeleton variant="text" className="h-4 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-6">
        <SkeletonAvatar size="xl" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="h-8 w-48" />
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-4 w-40" />
        </div>
      </div>

      {/* Bio */}
      <SkeletonCard>
        <Skeleton variant="text" className="h-6 w-24 mb-3" />
        <SkeletonText lines={3} />
      </SkeletonCard>

      {/* Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard>
          <Skeleton variant="text" className="h-6 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </SkeletonCard>
        <SkeletonCard>
          <Skeleton variant="text" className="h-6 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </SkeletonCard>
      </div>
    </div>
  )
}
