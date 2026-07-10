import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import Navigation, { Footer } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Clean | Premium Cleaning Solutions',
  description: 'Premium e-commerce platform for cleaning products, hygiene solutions and equipment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}