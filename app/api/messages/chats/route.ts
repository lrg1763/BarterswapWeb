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

    // Получаем все сообщения текущего пользователя
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        isDeleted: false,
      },
      orderBy: { timestamp: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isOnline: true,
            lastSeen: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
    })

    // Группируем сообщения по собеседникам
    const chatMap = new Map<number, {
      userId: number
      username: string
      avatar: string | null
      isOnline: boolean
      lastSeen: Date
      lastMessage: string
      lastMessageTime: Date
      unreadCount: number
    }>()

    messages.forEach((message) => {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId
      const otherUser =
        message.senderId === userId ? message.receiver : message.sender

      if (!chatMap.has(otherUserId)) {
        // Проверяем, не заблокирован ли пользователь
        // Это будет проверено позже в отдельном запросе
        chatMap.set(otherUserId, {
          userId: otherUserId,
          username: otherUser.username,
          avatar: otherUser.avatar,
          isOnline: otherUser.isOnline,
          lastSeen: otherUser.lastSeen,
          lastMessage: message.content.substring(0, 50),
          lastMessageTime: message.timestamp,
          unreadCount: 0,
        })
      } else {
        const chat = chatMap.get(otherUserId)!
        // Обновляем, если это более новое сообщение
        if (message.timestamp > chat.lastMessageTime) {
          chat.lastMessage = message.content.substring(0, 50)
          chat.lastMessageTime = message.timestamp
          chat.isOnline = otherUser.isOnline
          chat.lastSeen = otherUser.lastSeen
        }
      }

      // Подсчитываем непрочитанные сообщения
      if (message.receiverId === userId && !message.isRead) {
        const chat = chatMap.get(otherUserId)!
        chat.unreadCount++
      }
    })

    // Получаем список заблокированных пользователей
    const blocks = await prisma.block.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }],
      },
    })

    const blockedUserIds = new Set<number>()
    blocks.forEach((block) => {
      if (block.blockerId !== userId) blockedUserIds.add(block.blockerId)
      if (block.blockedId !== userId) blockedUserIds.add(block.blockedId)
    })

    // Фильтруем заблокированных пользователей
    const chats = Array.from(chatMap.values())
      .filter((chat) => !blockedUserIds.has(chat.userId))
      .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())

    return NextResponse.json({ chats })
  } catch (error) {
    console.error('Get chats error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении списка чатов' },
      { status: 500 }
    )
  }
}
