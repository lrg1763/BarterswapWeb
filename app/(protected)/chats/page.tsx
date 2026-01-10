import ChatContainer from '@/components/chat/ChatContainer'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

async function getChats(userId: number) {
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

  return chats
}

export default async function ChatsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = parseInt(session.user.id)
  const chats = await getChats(userId)

  return (
    <ChatContainer
      initialChats={chats}
      currentUserId={userId}
    />
  )
}

export const metadata = {
  title: 'Чаты - SkillSwap',
  description: 'Ваши сообщения',
}
