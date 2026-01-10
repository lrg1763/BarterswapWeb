import ProfilePageClient from './ProfilePageClient'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Suspense } from 'react'
import { SkeletonProfile } from '@/components/ui/Skeleton'

async function getUserData() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = parseInt(session.user.id)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      skillsOffered: true,
      skillsNeeded: true,
      location: true,
      bio: true,
      avatar: true,
      rating: true,
      isPremium: true,
      createdAt: true,
      lastSeen: true,
      isOnline: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  // Получаем статистику
  const [reviewsCount, messagesCount, exchangesCount] = await Promise.all([
    prisma.review.count({
      where: { reviewedId: userId },
    }),
    prisma.message.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        isDeleted: false,
      },
    }),
    prisma.message
      .findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          isDeleted: false,
        },
        select: {
          senderId: true,
          receiverId: true,
        },
      })
      .then((messages) => {
        const uniqueIds = new Set<number>()
        messages.forEach((msg) => {
          if (msg.senderId !== userId) uniqueIds.add(msg.senderId)
          if (msg.receiverId !== userId) uniqueIds.add(msg.receiverId)
        })
        return uniqueIds.size
      }),
  ])

  return {
    ...user,
    stats: {
      reviewsCount,
      messagesCount,
      exchangesCount,
    },
  }
}

export default async function ProfilePage() {
  return (
    <Suspense fallback={<SkeletonProfile />}>
      <ProfilePageContent />
    </Suspense>
  )
}

async function ProfilePageContent() {
  const user = await getUserData()
  return <ProfilePageClient initialUser={user} />
}

export const metadata = {
  title: 'Профиль - SkillSwap',
  description: 'Ваш профиль на SkillSwap',
}
