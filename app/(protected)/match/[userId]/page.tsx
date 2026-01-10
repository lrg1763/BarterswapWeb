import MatchPageClient from './MatchPageClient'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

async function getUserData(userId: number, currentUserId: number) {
  // Проверка блокировки
  const isBlocked = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: currentUserId, blockedId: userId },
        { blockerId: userId, blockedId: currentUserId },
      ],
    },
  })

  if (isBlocked) {
    return null
  }

  // Получаем пользователя
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
    return null
  }

  // Получаем текущего пользователя для сравнения навыков
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      skillsOffered: true,
      skillsNeeded: true,
    },
  })

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

  // Находим совпадения навыков
  const skillsMatches: string[] = []
  if (currentUser) {
    const currentNeeded = currentUser.skillsNeeded
      ? currentUser.skillsNeeded.split(',').map((s) => s.trim().toLowerCase())
      : []
    const targetOffered = user.skillsOffered
      ? user.skillsOffered.split(',').map((s) => s.trim().toLowerCase())
      : []

    // Находим навыки, которые нужны текущему и предлагает целевой
    currentNeeded.forEach((skill) => {
      if (targetOffered.includes(skill)) {
        // Находим оригинальное написание
        const original = user.skillsOffered
          ?.split(',')
          .map((s) => s.trim())
          .find((s) => s.toLowerCase() === skill)
        if (original) skillsMatches.push(original)
      }
    })
  }

  // Проверяем, добавлен ли в избранное
  const isFavorite = await prisma.favorite.findUnique({
    where: {
      userId_favoriteId: {
        userId: currentUserId,
        favoriteId: userId,
      },
    },
  })

  // Проверяем, заблокирован ли текущим пользователем
  const isBlockedByCurrent = await prisma.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    },
  })

  // Получаем существующий отзыв текущего пользователя (если есть)
  const existingReview = await prisma.review.findUnique({
    where: {
      reviewerId_reviewedId: {
        reviewerId: currentUserId,
        reviewedId: userId,
      },
    },
  })

  // Получаем первые 10 отзывов
  const reviews = await prisma.review.findMany({
    where: { reviewedId: userId },
    include: {
      reviewer: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const totalReviews = await prisma.review.count({
    where: { reviewedId: userId },
  })

  return {
    ...user,
    stats: {
      reviewsCount,
      messagesCount,
      exchangesCount,
    },
    skillsMatches,
    isFavorite: !!isFavorite,
    isBlocked: !!isBlockedByCurrent,
    existingReview: existingReview
      ? {
          id: existingReview.id,
          rating: parseFloat(existingReview.rating.toString()),
          comment: existingReview.comment,
        }
      : null,
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      reviewer: r.reviewer,
    })),
    reviewsPagination: {
      page: 1,
      totalPages: Math.ceil(totalReviews / 10),
      total: totalReviews,
    },
  }
}

export default async function MatchPage({
  params,
}: {
  params: { userId: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const currentUserId = parseInt(session.user.id)
  const userId = parseInt(params.userId)

  if (isNaN(userId)) {
    redirect('/search')
  }

  const user = await getUserData(userId, currentUserId)

  if (!user) {
    redirect('/search')
  }

  return <MatchPageClient user={user} currentUserId={currentUserId} />
}

export const metadata = {
  title: 'Профиль пользователя - SkillSwap',
  description: 'Просмотр профиля пользователя',
}
