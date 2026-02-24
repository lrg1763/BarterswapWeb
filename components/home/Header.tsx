'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS, AUTH_LINKS } from '@/lib/site-config'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary-white border-b-2 border-primary-gray-medium">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - слева */}
          <Link
            href="/"
            className="font-logo text-xl md:text-2xl lg:text-3xl font-bold text-primary-black hover:opacity-80 transition-opacity"
          >
            Barterswap
          </Link>

            {/* Navigation - по центру (скрыто на мобильных) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm xl:text-base font-onyx-regular text-primary-black hover:opacity-70 transition-opacity whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Кнопки Регистрация / Войти - справа (скрыто на мобильных) */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href={AUTH_LINKS.register}
                className="px-4 py-2 rounded text-sm font-onyx-black bg-primary-black text-primary-white hover:opacity-90 transition-opacity border-2 border-primary-black whitespace-nowrap"
              >
                Регистрация
              </Link>
              <Link
                href={AUTH_LINKS.login}
                className="px-4 py-2 rounded text-sm font-onyx-black bg-primary-white text-primary-black border-2 border-primary-black hover:bg-primary-gray-light transition-colors whitespace-nowrap"
              >
                Войти
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-primary-black hover:opacity-70 transition-opacity"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-primary-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu */}
          <nav className="fixed inset-0 bg-primary-white z-50 lg:hidden flex flex-col">
            <div className="container mx-auto px-4 pt-6 pb-8 flex flex-col h-full">
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-primary-black hover:opacity-70 transition-opacity"
                  aria-label="Закрыть меню"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-2xl font-onyx-black text-primary-black hover:opacity-70 transition-opacity text-left py-4 border-b-2 border-primary-gray-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {/* Кнопки в мобильном меню */}
              <div className="flex flex-col gap-4 pt-4 border-t-2 border-primary-gray-medium">
                <Link
                  href={AUTH_LINKS.register}
                  className="block w-full text-center py-4 rounded text-lg font-onyx-black bg-primary-black text-primary-white hover:opacity-90 transition-opacity border-2 border-primary-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Регистрация
                </Link>
                <Link
                  href={AUTH_LINKS.login}
                  className="block w-full text-center py-4 rounded text-lg font-onyx-black bg-primary-white text-primary-black border-2 border-primary-black hover:bg-primary-gray-light transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Войти
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
