import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Gem, Check, Star } from 'lucide-react'
import Link from 'next/link'

async function getUserSubscription(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  })
  return user?.isPremium || false
}

export default async function SubscriptionPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = parseInt(session.user.id)
  const isPremium = await getUserSubscription(userId)

  const benefits = [
    'Приоритетная поддержка 24/7',
    'Расширенные возможности поиска',
    'Неограниченное количество избранных',
    'Приоритетное отображение в поиске',
    'Эксклюзивные функции и возможности',
    'Расширенная статистика профиля',
    'Приоритет в рекомендациях',
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gem className="h-10 w-10 text-primary-green-light" />
          <h1 className="text-4xl md:text-5xl font-onyx-black">Премиум подписка</h1>
        </div>
        <p className="text-primary-gray-text font-onyx-regular text-lg">
          Откройте все возможности платформы
        </p>
      </div>

      {isPremium && (
        <div className="p-6 bg-primary-green-lighter border-2 border-primary-green-light rounded-lg mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Check className="h-6 w-6 text-primary-green-light" />
            <h2 className="text-2xl font-onyx-black">У вас активна премиум подписка</h2>
          </div>
          <p className="text-primary-gray-text font-onyx-regular">
            Вы пользуетесь всеми преимуществами премиум статуса
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Free Plan */}
        <div className="p-8 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
          <h3 className="text-2xl font-onyx-black mb-4">Бесплатный</h3>
          <div className="mb-6">
            <span className="text-4xl font-onyx-black">0₽</span>
            <span className="text-primary-gray-text font-onyx-regular ml-2">
              / месяц
            </span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary-green-light flex-shrink-0 mt-0.5" />
              <span className="font-onyx-regular">Базовый поиск пользователей</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary-green-light flex-shrink-0 mt-0.5" />
              <span className="font-onyx-regular">Обмен сообщениями</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary-green-light flex-shrink-0 mt-0.5" />
              <span className="font-onyx-regular">До 10 избранных</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary-green-light flex-shrink-0 mt-0.5" />
              <span className="font-onyx-regular">Система отзывов</span>
            </li>
          </ul>
          <button
            disabled
            className="w-full px-6 py-3 border-2 border-primary-gray-medium text-primary-gray-text font-onyx-black rounded-lg cursor-not-allowed"
          >
            Текущий план
          </button>
        </div>

        {/* Premium Plan */}
        <div className="p-8 border-2 border-primary-green-light rounded-lg bg-primary-green-lighter relative">
          {isPremium && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-primary-green-light text-primary-white text-xs font-onyx-black rounded-full">
              Активна
            </div>
          )}
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 text-primary-green-light fill-primary-green-light" />
            <h3 className="text-2xl font-onyx-black">Премиум</h3>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-onyx-black">990₽</span>
            <span className="text-primary-gray-text font-onyx-regular ml-2">
              / месяц
            </span>
          </div>
          <ul className="space-y-3 mb-8">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary-green-light flex-shrink-0 mt-0.5" />
                <span className="font-onyx-regular">{benefit}</span>
              </li>
            ))}
          </ul>
          <button
            disabled={isPremium}
            className={`w-full px-6 py-3 ${
              isPremium
                ? 'border-2 border-primary-gray-medium text-primary-gray-text cursor-not-allowed'
                : 'bg-primary-black text-primary-white hover:opacity-90'
            } font-onyx-black rounded-lg transition-opacity`}
          >
            {isPremium ? 'Активна' : 'Оформить подписку'}
          </button>
        </div>
      </div>

      <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
        <h3 className="text-xl font-onyx-black mb-4">Часто задаваемые вопросы</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-onyx-black mb-2">Как отменить подписку?</h4>
            <p className="text-primary-gray-text font-onyx-regular text-sm">
              Подписку можно отменить в любое время в настройках профиля. Доступ к
              премиум функциям сохранится до окончания оплаченного периода.
            </p>
          </div>
          <div>
            <h4 className="font-onyx-black mb-2">Какие способы оплаты доступны?</h4>
            <p className="text-primary-gray-text font-onyx-regular text-sm">
              В настоящее время интеграция платежной системы находится в разработке.
              Скоро появятся различные способы оплаты.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Подписка - Barterswap',
  description: 'Премиум подписка Barterswap',
}
