import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const onyxSemiMonoRegular = localFont({
  src: '../public/fonts/OnyxSemiMono-Regular.otf',
  variable: '--font-onyx-regular',
  weight: '400',
  display: 'swap',
})

const onyxSemiMonoBlack = localFont({
  src: '../public/fonts/OnyxSemiMono-Black.otf',
  variable: '--font-onyx-black',
  weight: '900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SkillSwap - Обмен навыками',
  description: 'Платформа для peer-to-peer обмена навыками и услугами',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body
        className={`${onyxSemiMonoRegular.variable} ${onyxSemiMonoBlack.variable} font-onyx-regular antialiased`}
      >
        <ErrorBoundary>
          <SessionProvider>
            {children}
            <Toaster position="top-right" />
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
