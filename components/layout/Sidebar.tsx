'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  User,
  Search,
  MessageCircle,
  Heart,
  Gem,
  Code,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  unreadCount?: number
}

export default function Sidebar({ unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    { href: '/profile', label: 'Профиль', icon: User },
    { href: '/search', label: 'Поиск', icon: Search },
    {
      href: '/chats',
      label: 'Чаты',
      icon: MessageCircle,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { href: '/favorites', label: 'Избранное', icon: Heart },
    { href: '/subscription', label: 'Подписка', icon: Gem },
    { href: '/developers', label: 'Разработчики', icon: Code },
  ]

  const isActive = (href: string) => {
    if (href === '/profile') {
      return pathname === '/profile'
    }
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-white border-2 border-primary-black rounded-lg"
        aria-label="Открыть меню"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-primary-white border-r-2 border-primary-gray-medium z-50 transition-transform duration-300',
          'lg:translate-x-0 lg:static lg:z-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full w-[280px] lg:w-[300px]">
          {/* Logo */}
          <div className="p-6 border-b-2 border-primary-gray-medium">
            <h1 className="text-2xl font-onyx-black text-primary-black">
              SkillSwap
            </h1>
          </div>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2"
            aria-label="Закрыть меню"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Menu items */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-onyx-regular',
                        active
                          ? 'bg-primary-green-lighter text-primary-black font-onyx-black'
                          : 'text-primary-black hover:bg-primary-gray-light'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto bg-primary-green-light text-primary-white text-xs font-onyx-black rounded-full w-6 h-6 flex items-center justify-center">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Divider */}
          <div className="border-t-2 border-primary-gray-medium" />

          {/* Logout */}
          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-gray-text hover:bg-primary-gray-light transition-colors font-onyx-regular"
            >
              <LogOut className="h-5 w-5" />
              <span>Выход</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
