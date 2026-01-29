import { Code, Heart, Github, Mail } from 'lucide-react'
import Link from 'next/link'

export default function DevelopersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Code className="h-10 w-10 text-primary-black" />
          <h1 className="text-4xl md:text-5xl font-onyx-black">О разработчиках</h1>
        </div>
        <p className="text-primary-gray-text font-onyx-regular text-lg">
          Barterswap - платформа для обмена навыками и услугами
        </p>
      </div>

      <div className="space-y-8">
        {/* О проекте */}
        <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <h2 className="text-2xl font-onyx-black mb-4">О проекте</h2>
          <p className="text-primary-gray-text font-onyx-regular mb-4">
            Barterswap - это современная платформа, созданная для людей, которые хотят
            обмениваться знаниями и навыками без использования денег. Мы верим, что
            каждый человек может научить чему-то ценному и научиться чему-то новому.
          </p>
          <p className="text-primary-gray-text font-onyx-regular">
            Наша миссия - создать сообщество, где люди могут свободно обмениваться
            профессиональными навыками, находить партнеров для обучения и развиваться
            вместе.
          </p>
        </div>

        {/* Технологии */}
        <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <h2 className="text-2xl font-onyx-black mb-4">Технологии</h2>
          <p className="text-primary-gray-text font-onyx-regular mb-4">
            Проект построен с использованием современных технологий:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-onyx-black mb-2">Frontend</h3>
              <ul className="space-y-1 text-primary-gray-text font-onyx-regular text-sm">
                <li>• Next.js 14+ (App Router)</li>
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="font-onyx-black mb-2">Backend</h3>
              <ul className="space-y-1 text-primary-gray-text font-onyx-regular text-sm">
                <li>• PostgreSQL</li>
                <li>• Prisma ORM</li>
                <li>• NextAuth.js v5</li>
                <li>• Socket.IO</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Поддержка проекта */}
        <div className="p-6 border-2 border-primary-green-light rounded-lg bg-primary-green-lighter">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-6 w-6 text-primary-green-light fill-primary-green-light" />
            <h2 className="text-2xl font-onyx-black">Поддержать проект</h2>
          </div>
          <p className="text-primary-gray-text font-onyx-regular mb-6">
            Если вам нравится Barterswap и вы хотите поддержать развитие платформы,
            вы можете:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 text-primary-black" />
              <span className="font-onyx-regular">
                Поставить звезду на{' '}
                <Link
                  href="https://github.com"
                  className="text-primary-black font-onyx-black hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary-black" />
              <span className="font-onyx-regular">
                Написать отзыв или предложение на{' '}
                <a
                  href="mailto:support@barterswap.com"
                  className="text-primary-black font-onyx-black hover:underline"
                >
                  support@barterswap.com
                </a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-primary-green-light fill-primary-green-light" />
              <span className="font-onyx-regular">
                Рассказать друзьям о платформе
              </span>
            </div>
          </div>
        </div>

        {/* Версия */}
        <div className="text-center p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <p className="text-primary-gray-text font-onyx-regular">
            Barterswap v1.0.0
          </p>
          <p className="text-primary-gray-text font-onyx-regular text-sm mt-2">
            © 2024 Barterswap. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'О разработчиках - Barterswap',
  description: 'Информация о проекте Barterswap и разработчиках',
}
