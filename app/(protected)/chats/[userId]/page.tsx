import ChatContainer from '@/components/chat/ChatContainer'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

async function getChatData(userId: number, currentUserId: number) {
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

  // Получаем сообщения между двумя пользователями
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
      isDeleted: false,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: { timestamp: 'asc' },
  })

  // Помечаем все сообщения как прочитанные
  await prisma.message.updateMany({
    where: {
      senderId: userId,
      receiverId: currentUserId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  })

  // Получаем информацию о собеседнике
  const otherUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      avatar: true,
      isOnline: true,
      lastSeen: true,
    },
  })

  if (!otherUser) {
    return null
  }

  return {
    messages: messages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      timestamp: msg.timestamp,
      isRead: msg.isRead,
      isEdited: msg.isEdited,
      editedAt: msg.editedAt,
      sender: msg.sender,
    })),
    otherUser,
  }
}

export default async function ChatPage({
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
    redirect('/chats')
  }

  const chatData = await getChatData(userId, currentUserId)

  if (!chatData) {
    redirect('/chats')
  }

  // Получаем список чатов для ChatContainer
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
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
      message.senderId === currentUserId ? message.receiverId : message.senderId
    const otherUser =
      message.senderId === currentUserId ? message.receiver : message.sender

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

    if (message.receiverId === currentUserId && !message.isRead) {
      const chat = chatMap.get(otherUserId)!
      chat.unreadCount++
    }
  })

  const blocks = await prisma.block.findMany({
    where: {
      OR: [{ blockerId: currentUserId }, { blockedId: currentUserId }],
    },
  })

  const blockedUserIds = new Set<number>()
  blocks.forEach((block) => {
    if (block.blockerId !== currentUserId) blockedUserIds.add(block.blockerId)
    if (block.blockedId !== currentUserId) blockedUserIds.add(block.blockedId)
  })

  const chats = Array.from(chatMap.values())
    .filter((chat) => !blockedUserIds.has(chat.userId))
    .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())

  return (
    <ChatContainer
      initialChats={chats}
      currentUserId={currentUserId}
      initialChatUserId={userId}
      initialMessages={chatData.messages}
      initialOtherUser={chatData.otherUser}
    />
  )
}

export const metadata = {
  title: 'Чат - Barterswap',
  description: 'Общение с пользователем',
}
