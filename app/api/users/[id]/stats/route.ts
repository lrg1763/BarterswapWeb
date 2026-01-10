import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    const userId = parseInt(params.id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Неверный ID пользователя' },
        { status: 400 }
      )
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

    return NextResponse.json({
      reviewsCount,
      messagesCount,
      exchangesCount,
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении статистики' },
      { status: 500 }
    )
  }
}
