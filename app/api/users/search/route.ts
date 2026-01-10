import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const searchParams = request.nextUrl.searchParams

    const query = searchParams.get('query') || ''
    const minRating = parseFloat(searchParams.get('min_rating') || '0')
    const location = searchParams.get('location') || ''
    const sortBy = searchParams.get('sort_by') || 'created_at' // rating, created_at, username
    const sortOrder = searchParams.get('sort_order') || 'desc' // asc, desc
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 20
    const skip = (page - 1) * pageSize

    // Получаем список заблокированных пользователей (которые заблокировали текущего или кого заблокировал текущий)
    const blocks = await prisma.block.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }],
      },
      select: {
        blockerId: true,
        blockedId: true,
      },
    })

    const blockedUserIds = new Set<number>()
    blocks.forEach((block) => {
      if (block.blockerId !== userId) blockedUserIds.add(block.blockerId)
      if (block.blockedId !== userId) blockedUserIds.add(block.blockedId)
    })

    // Построение запроса поиска
    const where: any = {
      id: {
        not: userId, // Исключаем текущего пользователя
        notIn: Array.from(blockedUserIds), // Исключаем заблокированных
      },
    }

    // Фильтр по минимальному рейтингу
    if (minRating > 0) {
      where.rating = {
        gte: minRating,
      }
    }

    // Фильтр по местоположению
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      }
    }

    // Поисковый запрос
    if (query) {
      where.OR = [
        { username: { contains: query, mode: 'insensitive' } },
        { skillsOffered: { contains: query, mode: 'insensitive' } },
        { skillsNeeded: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Определяем сортировку
    let orderBy: any = {}
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: sortOrder }
        break
      case 'username':
        orderBy = { username: sortOrder }
        break
      case 'created_at':
      default:
        orderBy = { createdAt: sortOrder }
        break
    }

    // Получаем пользователей
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        orderBy,
        take: pageSize,
        skip,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Search users error:', error)
    return NextResponse.json(
      { error: 'Ошибка при поиске пользователей' },
      { status: 500 }
    )
  }
}
