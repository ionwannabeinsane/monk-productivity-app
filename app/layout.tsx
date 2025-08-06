import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './context/AuthContext'

export const metadata: Metadata = {
  title: 'Monk - Balance Your Productivity',
  description: 'Level up your monk through mindful productivity and balanced goal achievement',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}