import FavoritesPageClient from './FavoritesPageClient'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

async function getFavorites() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = parseInt(session.user.id)

  // Получаем избранных пользователей
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      favorite: {
        select: {
          id: true,
          username: true,
          avatar: true,
          rating: true,
          location: true,
          skillsOffered: true,
          skillsNeeded: true,
          isOnline: true,
          lastSeen: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return favorites.map((fav) => fav.favorite)
}

export default async function FavoritesPage() {
  const users = await getFavorites()

  return <FavoritesPageClient initialUsers={users} />
}

export const metadata = {
  title: 'Избранное - SkillSwap',
  description: 'Ваши избранные пользователи',
}
