import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'Series List',
  description: 'Manage your series lists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
