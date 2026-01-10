import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-onyx-black mb-6">
              SkillSwap
            </h1>
            <p className="text-xl md:text-2xl text-primary-gray-text mb-8 max-w-2xl mx-auto">
              Платформа для peer-to-peer обмена навыками и услугами без использования денег
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary-black text-primary-white font-onyx-black rounded-lg hover:opacity-90 transition-opacity text-lg"
              >
                Начать обмен
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-primary-black text-primary-black font-onyx-black rounded-lg hover:bg-primary-gray-light transition-colors text-lg"
              >
                Войти
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
              <h3 className="text-xl font-onyx-black mb-3">Найдите партнера</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Найдите пользователей с навыками, которые вам нужны, и предложите свои в обмен
              </p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
              <h3 className="text-xl font-onyx-black mb-3">Обменивайтесь навыками</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Взаимное обучение без денег - только бартерный обмен услугами
              </p>
            </div>
            <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
              <h3 className="text-xl font-onyx-black mb-3">Развивайтесь вместе</h3>
              <p className="text-primary-gray-text font-onyx-regular">
                Получайте новые знания и делитесь своим опытом с другими
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="border-t-2 border-primary-gray-medium pt-16">
            <h2 className="text-3xl md:text-4xl font-onyx-black mb-8 text-center">
              Как это работает
            </h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-green-light rounded-full flex items-center justify-center font-onyx-black text-primary-black">
                  1
                </div>
                <div>
                  <h3 className="font-onyx-black mb-2">Зарегистрируйтесь</h3>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Создайте профиль и укажите навыки, которые вы предлагаете и которые вам нужны
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-green-light rounded-full flex items-center justify-center font-onyx-black text-primary-black">
                  2
                </div>
                <div>
                  <h3 className="font-onyx-black mb-2">Найдите партнера</h3>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Используйте поиск, чтобы найти пользователей с подходящими навыками
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-green-light rounded-full flex items-center justify-center font-onyx-black text-primary-black">
                  3
                </div>
                <div>
                  <h3 className="font-onyx-black mb-2">Начните обмен</h3>
                  <p className="text-primary-gray-text font-onyx-regular">
                    Свяжитесь с партнером через чат и договоритесь об обмене навыками
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export const metadata = {
  title: 'SkillSwap - Обмен навыками и услугами',
  description: 'Платформа для peer-to-peer обмена навыками и услугами без использования денег',
}
