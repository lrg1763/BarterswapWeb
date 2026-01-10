'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

interface ProtectedLayoutClientProps {
  children: React.ReactNode
}

export default function ProtectedLayoutClient({
  children,
}: ProtectedLayoutClientProps) {
  const pathname = usePathname()
  const isChatPage = pathname?.startsWith('/chats') || false

  return (
    <div className="flex h-screen bg-primary-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden lg:ml-0">
        {/* Для страниц чатов убираем padding, чтобы ChatContainer занимал весь экран */}
        {isChatPage ? (
          children
        ) : (
          <div className="container mx-auto px-4 py-6 lg:px-8 h-full overflow-y-auto">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}
