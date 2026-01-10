'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning'
  onClose: () => void
  duration?: number
}

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Даем время на анимацию исчезновения
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor =
    type === 'success'
      ? 'bg-green-50 border-green-500'
      : type === 'error'
      ? 'bg-red-50 border-red-500'
      : 'bg-yellow-50 border-yellow-500'

  const textColor =
    type === 'success'
      ? 'text-green-800'
      : type === 'error'
      ? 'text-red-800'
      : 'text-yellow-800'

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 ${bgColor} border-l-4 rounded shadow-lg transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className={`text-sm font-onyx-regular ${textColor}`}>{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className={`${textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
