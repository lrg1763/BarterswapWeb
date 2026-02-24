import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
})

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

const isGhPages = process.env.GITHUB_PAGES === '1'
const baseUrl = isGhPages ? 'https://lrg1763.github.io/BarterswapWeb' : undefined

export const metadata: Metadata = {
  metadataBase: baseUrl ? new URL(baseUrl) : undefined,
  title: 'Barterswap - Обмен навыками',
  description: 'Платформа для peer-to-peer обмена навыками и услугами',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Barterswap',
    statusBarStyle: 'default',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body
        className={`${manrope.variable} ${onyxSemiMonoRegular.variable} ${onyxSemiMonoBlack.variable} font-onyx-regular antialiased`}
      >
        <ErrorBoundary>
          {children}
          <Toaster position="top-right" />
        </ErrorBoundary>
      </body>
    </html>
  )
}
