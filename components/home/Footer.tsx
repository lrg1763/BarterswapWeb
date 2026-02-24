'use client'

// YouTube Icon Component
const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

// Telegram Icon Component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

export default function Footer() {
  const navItems = [
    { id: 'features', label: 'Инструкция' },
    { id: 'advantages', label: 'Преимущества' },
    { id: 'examples', label: 'Примеры' },
    { id: 'technologies', label: 'Технологии' },
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <footer className="text-primary-white" style={{ backgroundColor: '#111111' }}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Navigation Links - Vertical */}
        <div className="mb-12 md:mb-14">
          <nav className="flex flex-col items-center gap-4 md:gap-6">
            {navItems.map((item) => (
              <span
                key={item.id}
                className="text-2xl md:text-3xl lg:text-4xl font-onyx-black text-primary-white cursor-default"
              >
                {item.label}
              </span>
            ))}
          </nav>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          {/* Сотрудничество */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <p className="text-lg font-onyx-regular text-white">
              Сотрудничество:{' '}
              <span className="text-white font-onyx-regular cursor-default">
                info@barterswap.com
              </span>
            </p>
          </div>

          {/* Поддержка */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <p className="text-lg font-onyx-regular text-white">
              Поддержка:{' '}
              <span className="text-white font-onyx-regular cursor-default">
                support@barterswap.com
              </span>
            </p>
          </div>

          {/* VK */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <span className="text-lg font-onyx-regular text-white cursor-default">
              VK
            </span>
          </div>

          {/* YouTube */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <span className="flex items-center gap-2 text-lg font-onyx-regular text-white cursor-default">
              <YouTubeIcon className="w-6 h-6 flex-shrink-0" />
              <span>YouTube</span>
            </span>
          </div>

          {/* Telegram */}
          <div className="px-6 py-3 rounded" style={{ backgroundColor: 'rgb(41, 41, 41)' }}>
            <span className="flex items-center gap-2 text-lg font-onyx-regular text-white cursor-default">
              <TelegramIcon className="w-6 h-6 flex-shrink-0" />
              <span>Telegram</span>
            </span>
          </div>
        </div>

        {/* Bottom: Legal Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 pt-6">
          <span className="text-sm font-onyx-regular text-primary-gray-medium">
            © 2026 Barterswap
          </span>
          <span className="text-sm font-onyx-regular text-primary-gray-medium cursor-default">
            Документация и информация о стоимости ПО
          </span>
          <span className="text-sm font-onyx-regular text-primary-gray-medium cursor-default">
            Правила использования сервиса
          </span>
          <span className="text-sm font-onyx-regular text-primary-gray-medium cursor-default">
            Политика конфиденциальности
          </span>
          <span className="text-sm font-onyx-regular text-primary-gray-medium cursor-default">
            О компании
          </span>
        </div>
      </div>
    </footer>
  )
}
