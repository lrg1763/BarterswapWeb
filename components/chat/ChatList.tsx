'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Avatar from '@/components/user/Avatar'
import { formatTime, formatDateTime, truncate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useSocket } from '@/lib/socket'

interface Chat {
  userId: number
  username: string
  avatar: string | null
  isOnline: boolean
  lastSeen: Date | string
  lastMessage: string
  lastMessageTime: Date | string
  unreadCount: number
}

interface ChatListProps {
  initialChats?: Chat[]
}

export default function ChatList({ initialChats = [] }: ChatListProps) {
  const pathname = usePathname()
  const { socket, isConnected } = useSocket()
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [isLoading, setIsLoading] = useState(false)

  const loadChats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/chats')
      if (response.ok) {
        const data = await response.json()
        setChats(data.chats || [])
      }
    } catch (error) {
      console.error('Load chats error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadChats()

    // Обновляем список чатов каждые 5 секунд или при фокусе окна
    const interval = setInterval(() => {
      loadChats()
    }, 5000)

    const handleFocus = () => {
      loadChats()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Обновление списка чатов при получении новых сообщений через Socket.IO
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleReceiveMessage = () => {
      // Обновляем список чатов при получении нового сообщения
      loadChats()
    }

    const handleNewMessageNotification = () => {
      // Обновляем список чатов при уведомлении о новом сообщении
      loadChats()
    }

    const handleUserOnline = () => {
      // Обновляем статус онлайн в списке чатов
      loadChats()
    }

    const handleUserOffline = () => {
      // Обновляем статус офлайн в списке чатов
      loadChats()
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('new_message_notification', handleNewMessageNotification)
    socket.on('user_online', handleUserOnline)
    socket.on('user_offline', handleUserOffline)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('new_message_notification', handleNewMessageNotification)
      socket.off('user_online', handleUserOnline)
      socket.off('user_offline', handleUserOffline)
    }
  }, [socket, isConnected])

  const getLastSeenText = (lastSeen: Date | string, isOnline: boolean) => {
    if (isOnline) return 'В сети'

    const lastSeenDate = new Date(lastSeen)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / 60000)

    if (diffMinutes < 1) return 'Только что'
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ч. назад`
    if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)} дн. назад`

    return formatDateTime(lastSeen)
  }

  if (chats.length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-primary-gray-text font-onyx-regular text-lg">
            У вас пока нет чатов
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-primary-gray-medium">
        <h2 className="text-2xl font-onyx-black">Чаты</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && chats.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-primary-gray-text font-onyx-regular">Загрузка...</p>
          </div>
        ) : (
          <div className="divide-y divide-primary-gray-medium">
            {chats.map((chat) => {
              const isActive = pathname === `/chats/${chat.userId}` || pathname?.includes(`/chats/${chat.userId}`)
              const chatUrl = `/chats/${chat.userId}`

              return (
                <Link
                  key={chat.userId}
                  href={chatUrl}
                  className={cn(
                    'flex items-center gap-3 p-4 hover:bg-primary-gray-light transition-colors',
                    isActive && 'bg-primary-green-lighter border-l-4 border-primary-green-light'
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar username={chat.username} avatar={chat.avatar} size="md" />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-green-light border-2 border-primary-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-onyx-black text-base truncate">{chat.username}</h3>
                      <span className="text-xs text-primary-gray-text font-onyx-regular ml-2 flex-shrink-0">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-primary-gray-text font-onyx-regular truncate">
                        {truncate(chat.lastMessage, 40)}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="flex-shrink-0 bg-primary-green-light text-primary-white text-xs font-onyx-black rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-primary-gray-text font-onyx-regular mt-1">
                      {getLastSeenText(chat.lastSeen, chat.isOnline)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
