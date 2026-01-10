'use client'

import { useState } from 'react'
import Avatar from '@/components/user/Avatar'
import { formatTime, formatDateTime } from '@/lib/utils'
import { Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: {
    id: number
    senderId: number
    content: string
    timestamp: Date | string
    isEdited: boolean
    editedAt: Date | string | null
    sender: {
      id: number
      username: string
      avatar: string | null
    }
  }
  currentUserId: number
  onEdit?: (messageId: number, content: string) => void
  onDelete?: (messageId: number) => void
}

export default function MessageBubble({
  message,
  currentUserId,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const isOwn = message.senderId === currentUserId
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const handleEdit = () => {
    if (onEdit && editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent)
    }
    setIsEditing(false)
    setShowMenu(false)
  }

  const handleDelete = () => {
    if (onDelete && confirm('Вы уверены, что хотите удалить это сообщение?')) {
      onDelete(message.id)
    }
    setShowMenu(false)
  }

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 group',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
      onMouseEnter={() => isOwn && setShowMenu(true)}
      onMouseLeave={() => !isEditing && setShowMenu(false)}
    >
      {/* Avatar - только для сообщений собеседника */}
      {!isOwn && (
        <div className="flex-shrink-0">
          <Avatar username={message.sender.username} avatar={message.sender.avatar} size="sm" />
        </div>
      )}

      <div className={cn('flex flex-col max-w-[70%]', isOwn ? 'items-end' : 'items-start')}>
        {/* Username - только для сообщений собеседника */}
        {!isOwn && (
          <span className="text-xs text-primary-gray-text font-onyx-regular mb-1 px-1">
            {message.sender.username}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            'px-4 py-2 rounded-lg relative',
            isOwn
              ? 'bg-primary-green-light text-primary-black'
              : 'bg-primary-white text-primary-black border-2 border-primary-gray-medium shadow-sm'
          )}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleEdit()
                  }
                  if (e.key === 'Escape') {
                    setIsEditing(false)
                    setEditContent(message.content)
                  }
                }}
                className="w-full px-2 py-1 border-2 border-primary-black rounded bg-primary-white text-primary-black font-onyx-regular resize-none focus:outline-none focus:ring-2 focus:ring-primary-green-light"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(message.content)
                  }}
                  className="text-xs text-primary-gray-text font-onyx-regular hover:text-primary-black"
                >
                  Отмена
                </button>
                <button
                  onClick={handleEdit}
                  className="text-xs text-primary-black font-onyx-black hover:underline"
                >
                  Сохранить
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Menu buttons - только для своих сообщений */}
              {isOwn && showMenu && (
                <div className="absolute -top-8 right-0 flex gap-1 bg-primary-white border-2 border-primary-gray-medium rounded-lg p-1 shadow-lg">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-primary-gray-light rounded transition-colors"
                    title="Редактировать"
                  >
                    <Edit2 className="h-3 w-3 text-primary-black" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              )}

              <p className="font-onyx-regular whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </>
          )}
        </div>

        {/* Timestamp and edited indicator */}
        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-xs text-primary-gray-text font-onyx-regular">
            {formatTime(message.timestamp)}
          </span>
          {message.isEdited && message.editedAt && (
            <>
              <span className="text-xs text-primary-gray-text font-onyx-regular">
                (отредактировано)
              </span>
              <span className="text-xs text-primary-gray-text font-onyx-regular">
                {formatTime(message.editedAt)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
