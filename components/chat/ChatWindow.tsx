'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import Avatar from '@/components/user/Avatar'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatTime, formatDateTime } from '@/lib/utils'
import { useSocket } from '@/lib/socket'
import { Socket } from 'socket.io-client'
import { toast } from 'sonner'

interface Message {
  id: number
  senderId: number
  receiverId: number
  content: string
  timestamp: Date | string
  isRead: boolean
  isEdited: boolean
  editedAt: Date | string | null
  sender: {
    id: number
    username: string
    avatar: string | null
  }
}

interface ChatWindowProps {
  userId: number
  currentUserId: number
  initialMessages?: Message[]
  otherUser?: {
    id: number
    username: string
    avatar: string | null
    isOnline: boolean
    lastSeen: Date | string
  }
}

export default function ChatWindow({
  userId,
  currentUserId,
  initialMessages = [],
  otherUser,
}: ChatWindowProps) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { socket, isConnected } = useSocket()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Логирование состояния подключения
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:56',message:'Socket connection state',data:{hasSocket:!!socket,isConnected,socketId:socket?.id,userId,currentUserId},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }, [socket, isConnected, userId, currentUserId])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/messages/chat/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Load messages error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:73',message:'userId changed - reloading messages',data:{userId,currentUserId,previousUserId:initialMessages[0]?.receiverId || initialMessages[0]?.senderId},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    loadMessages()
  }, [userId])

  // Настройка Socket.IO событий
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:78',message:'Setting up Socket.IO events',data:{hasSocket:!!socket,isConnected,socketId:socket?.id,userId},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (!socket || !userId) {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:81',message:'Skipping Socket.IO setup - missing socket or userId',data:{hasSocket:!!socket,hasUserId:!!userId},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return
    }
    
    // Если соединение еще не установлено, ждем его установки
    if (!isConnected) {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:90',message:'Socket not connected yet, waiting for connection',data:{socketId:socket.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Подписываемся на событие подключения, чтобы установить события когда соединение будет готово
      const handleConnect = () => {
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:96',message:'Socket connected, will set up events in next render',data:{socketId:socket.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
      }
      
      socket.on('connect', handleConnect)
      
      return () => {
        socket.off('connect', handleConnect)
      }
    }

    // Получение нового сообщения
    const handleReceiveMessage = (data: {
      id: number
      sender_id: number
      sender_name: string
      receiver_id: number
      content: string
      timestamp: Date | string
      is_read: boolean
    }) => {
      // Добавляем сообщение только если оно для текущего чата
      if (
        (data.sender_id === userId && data.receiver_id === currentUserId) ||
        (data.sender_id === currentUserId && data.receiver_id === userId)
      ) {
        const newMessage: Message = {
          id: data.id,
          senderId: data.sender_id,
          receiverId: data.receiver_id,
          content: data.content,
          timestamp: data.timestamp,
          isRead: data.is_read,
          isEdited: false,
          editedAt: null,
          sender: {
            id: data.sender_id,
            username: data.sender_name,
            avatar: null,
          },
        }

        setMessages((prev) => [...prev, newMessage])
      }
    }

    // Редактирование сообщения
    const handleMessageEdited = (data: {
      message_id: number
      content: string
      edited_at: Date | string
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.message_id
            ? {
                ...msg,
                content: data.content,
                isEdited: true,
                editedAt: data.edited_at,
              }
            : msg
        )
      )
    }

    // Удаление сообщения
    const handleMessageDeleted = (data: { message_id: number }) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.message_id))
    }

    // Индикатор печати
    const handleUserTyping = (data: {
      user_id: number
      username: string
      is_typing: boolean
    }) => {
      if (data.user_id === userId) {
        setIsOtherTyping(data.is_typing)

        if (data.is_typing) {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsOtherTyping(false)
          }, 3000)
        }
      }
    }

    // Обновление статуса онлайн
    const handleUserOnline = (data: { user_id: number; username: string }) => {
      if (data.user_id === userId && otherUser) {
        // Обновляем статус через обновление страницы или состояние
        router.refresh()
      }
    }

    const handleUserOffline = (data: { user_id: number }) => {
      if (data.user_id === userId && otherUser) {
        router.refresh()
      }
    }

    // Ошибки
    const handleError = (data: { message: string }) => {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:176',message:'Socket.IO error received',data:{error:data.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      toast.error(data.message || 'Произошла ошибка')
    }

    // Подтверждение отправки сообщения
    const handleMessageSent = (data: { id: number; timestamp: Date | string }) => {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:203',message:'Message sent confirmation received',data:{messageId:data.id,userId,currentUserId},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      // Обновляем временное сообщение с реальным ID
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === currentUserId && msg.id > 1000000000000 // Временный ID
            ? { ...msg, id: data.id, timestamp: data.timestamp }
            : msg
        )
      )
    }

    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:210',message:'Subscribing to Socket.IO events',data:{userId,currentUserId,socketId:socket.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:225',message:'Subscribing to Socket.IO events',data:{userId,currentUserId,socketId:socket.id,isConnected},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    socket.on('receive_message', handleReceiveMessage)
    socket.on('message_edited', handleMessageEdited)
    socket.on('message_deleted', handleMessageDeleted)
    socket.on('user_typing', handleUserTyping)
    socket.on('user_online', handleUserOnline)
    socket.on('user_offline', handleUserOffline)
    socket.on('error', handleError)
    socket.on('message_sent', handleMessageSent)

    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:242',message:'Cleaning up Socket.IO event listeners',data:{userId,currentUserId,socketId:socket.id,reason:'useEffect cleanup or userId changed'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      socket.off('receive_message', handleReceiveMessage)
      socket.off('message_edited', handleMessageEdited)
      socket.off('message_deleted', handleMessageDeleted)
      socket.off('user_typing', handleUserTyping)
      socket.off('user_online', handleUserOnline)
      socket.off('user_offline', handleUserOffline)
      socket.off('error', handleError)
      socket.off('message_sent', handleMessageSent)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [socket, isConnected, userId, currentUserId])

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Отправка сообщения через Socket.IO
  const handleSendMessage = useCallback(
    (content: string) => {
      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:209',message:'handleSendMessage called',data:{hasSocket:!!socket,isConnected,userId,currentUserId,messageLength:content.length,messagePreview:content.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      if (!socket || !isConnected) {
        // #region agent log
        fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:212',message:'Socket not connected - cannot send',data:{hasSocket:!!socket,isConnected},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        toast.error('Соединение не установлено')
        return
      }

      // #region agent log
      fetch('http://127.0.0.1:7249/ingest/d72aa6b5-55e4-4b56-8b58-ea2f6c45c2a4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ChatWindow.tsx:218',message:'Emitting send_message event',data:{receiver_id:userId,messageLength:content.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      socket.emit('send_message', {
        receiver_id: userId,
        message: content,
      })

      // Оптимистичное обновление UI
      const tempMessage: Message = {
        id: Date.now(), // Временный ID
        senderId: currentUserId,
        receiverId: userId,
        content,
        timestamp: new Date(),
        isRead: false,
        isEdited: false,
        editedAt: null,
        sender: {
          id: currentUserId,
          username: '', // Будет обновлено с сервера
          avatar: null,
        },
      }

      setMessages((prev) => [...prev, tempMessage])
    },
    [socket, isConnected, userId, currentUserId]
  )

  // Редактирование сообщения через Socket.IO
  const handleEditMessage = useCallback(
    (messageId: number, content: string) => {
      if (!socket || !isConnected) {
        toast.error('Соединение не установлено')
        return
      }

      socket.emit('edit_message', {
        message_id: messageId,
        content,
      })
    },
    [socket, isConnected]
  )

  // Удаление сообщения через Socket.IO
  const handleDeleteMessage = useCallback(
    (messageId: number) => {
      if (!socket || !isConnected) {
        toast.error('Соединение не установлено')
        return
      }

      socket.emit('delete_message', {
        message_id: messageId,
      })
    },
    [socket, isConnected]
  )

  // Индикатор печати
  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !isConnected) return

      socket.emit('typing', {
        receiver_id: userId,
        is_typing: isTyping,
      })
    },
    [socket, isConnected, userId]
  )

  const getLastSeenText = (lastSeen: Date | string, isOnline: boolean) => {
    if (isOnline) return 'В сети'

    const lastSeenDate = new Date(lastSeen)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / 60000)

    if (diffMinutes < 1) return 'Только что'
    if (diffMinutes < 60) return `Был(а) в сети ${diffMinutes} мин. назад`
    if (diffMinutes < 1440) return `Был(а) в сети ${Math.floor(diffMinutes / 60)} ч. назад`
    if (diffMinutes < 10080)
      return `Был(а) в сети ${Math.floor(diffMinutes / 1440)} дн. назад`

    return `Был(а) в сети ${formatDateTime(lastSeen)}`
  }

  if (!otherUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-primary-gray-text font-onyx-regular">
          Пользователь не найден
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-primary-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b-2 border-primary-gray-medium bg-primary-white">
        <button
          onClick={() => router.push('/chats')}
          className="lg:hidden p-2 hover:bg-primary-gray-light rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar username={otherUser.username} avatar={otherUser.avatar} size="md" />
        <div className="flex-1 min-w-0">
          <h2 className="font-onyx-black text-lg truncate">{otherUser.username}</h2>
          <p
            className={`text-sm font-onyx-regular truncate ${
              otherUser.isOnline
                ? 'text-primary-green-light'
                : 'text-primary-gray-text'
            }`}
          >
            {getLastSeenText(otherUser.lastSeen, otherUser.isOnline)}
          </p>
        </div>
        <button
          onClick={() => router.push(`/match/${userId}`)}
          className="p-2 hover:bg-primary-gray-light rounded-lg transition-colors"
          title="Просмотреть профиль"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-primary-gray-text font-onyx-regular">Загрузка сообщений...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-primary-gray-text font-onyx-regular">
              Начните общение, отправив первое сообщение
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentUserId={currentUserId}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Индикатор печати */}
        {isOtherTyping && (
          <div className="flex items-center gap-2 text-primary-gray-text text-sm font-onyx-regular">
            <Avatar username={otherUser.username} avatar={otherUser.avatar} size="sm" />
            <span>{otherUser.username} печатает...</span>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected}
        receiverId={userId}
        onTyping={handleTyping}
      />
    </div>
  )
}
