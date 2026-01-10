'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { messageSchema } from '@/lib/validations'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  receiverId: number
  onTyping?: (isTyping: boolean) => void
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  receiverId,
  onTyping,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || disabled) {
      return
    }

    // Валидация через Zod
    try {
      messageSchema.parse({ content: message.trim() })
      onSendMessage(message.trim())
      setMessage('')
      setIsTyping(false)
      if (onTyping) {
        onTyping(false)
      }

      // Сброс высоты textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Message validation error:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter отправляет сообщение, Shift+Enter - новая строка
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    // Ограничение на 2000 символов
    if (value.length <= 2000) {
      setMessage(value)

      // Автоматическое изменение высоты textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }

      // Индикатор печати
      if (!isTyping && value.trim().length > 0) {
        setIsTyping(true)
        if (onTyping) {
          onTyping(true)
        }
      }

      // Сброс таймера печати
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        if (onTyping) {
          onTyping(false)
        }
      }, 3000) // 3 секунды без ввода = остановка печати
    }
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t-2 border-primary-gray-medium bg-primary-white"
    >
      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          disabled={disabled}
          rows={1}
          maxLength={2000}
          className="flex-1 px-4 py-3 border-2 border-primary-black rounded-lg bg-primary-white text-primary-black font-onyx-regular focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px] max-h-[150px]"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="p-3 bg-primary-green-light text-primary-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          title="Отправить сообщение"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-2 text-xs text-primary-gray-text font-onyx-regular">
        {message.length} / 2000 символов
      </p>
    </form>
  )
}
