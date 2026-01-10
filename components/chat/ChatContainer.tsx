'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import { cn } from '@/lib/utils'

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

interface ChatContainerProps {
  initialChats?: Chat[]
  currentUserId: number
  initialChatUserId?: number
  initialMessages?: any[]
  initialOtherUser?: any
}

export default function ChatContainer({
  initialChats = [],
  currentUserId,
  initialChatUserId,
  initialMessages,
  initialOtherUser,
}: ChatContainerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    initialChatUserId || null
  )
  const [isMobile, setIsMobile] = useState(false)

  // Определяем, является ли текущий путь страницей конкретного чата
  const chatUserId = pathname.startsWith('/chats/')
    ? parseInt(pathname.split('/')[2])
    : null

  useEffect(() => {
    setSelectedUserId(chatUserId || null)

    // Определяем мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [chatUserId])

  const handleChatSelect = (userId: number) => {
    setSelectedUserId(userId)
    router.push(`/chats/${userId}`)
  }

  // Десктоп версия: показываем split-view
  if (!isMobile) {
    return (
      <div className="h-screen flex overflow-hidden bg-primary-white">
        {/* Left Panel - Chat List */}
        <div className="w-[350px] border-r-2 border-primary-gray-medium flex-shrink-0 overflow-hidden">
          <ChatList initialChats={initialChats} />
        </div>

        {/* Right Panel - Chat Window */}
        <div className="flex-1 overflow-hidden">
          {selectedUserId ? (
            <ChatWindow
              userId={selectedUserId}
              currentUserId={currentUserId}
              initialMessages={initialMessages}
              otherUser={initialOtherUser}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-primary-white">
              <div className="text-center">
                <p className="text-primary-gray-text font-onyx-regular text-lg">
                  Выберите чат для начала общения
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Мобильная версия: полноэкранный список или чат
  return (
    <div className="h-screen overflow-hidden bg-primary-white">
      {selectedUserId ? (
        // Показываем чат
        <div className="h-full">
          <ChatWindow
            userId={selectedUserId}
            currentUserId={currentUserId}
            initialMessages={initialMessages}
            otherUser={initialOtherUser}
          />
        </div>
      ) : (
        // Показываем список чатов
        <div className="h-full">
          <ChatList initialChats={initialChats} />
        </div>
      )}
    </div>
  )
}
