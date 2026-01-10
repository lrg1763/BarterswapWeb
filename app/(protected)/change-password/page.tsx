import ChangePasswordForm from '@/components/forms/ChangePasswordForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Lock } from 'lucide-react'

export default async function ChangePasswordPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-8 w-8 text-primary-black" />
          <h1 className="text-4xl font-onyx-black">Смена пароля</h1>
        </div>
        <p className="text-primary-gray-text font-onyx-regular">
          Введите текущий пароль и выберите новый пароль для вашего аккаунта
        </p>
      </div>

      <div className="p-6 border-2 border-primary-gray-medium rounded-lg bg-primary-white">
        <ChangePasswordForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Смена пароля - SkillSwap',
  description: 'Измените пароль вашего аккаунта',
}
