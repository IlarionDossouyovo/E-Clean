'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Package, Heart, CreditCard, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger les données utilisateur depuis localStorage
    const storedUser = localStorage.getItem('eclean_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const menuItems = [
    { icon: Package, label: 'Mes commandes', href: '/order-tracking', color: 'text-blue-600' },
    { icon: Heart, label: 'Ma wishlist', href: '/catalog?wishlist=true', color: 'text-red-500' },
    { icon: MapPin, label: 'Mes adresses', href: '/account#addresses', color: 'text-green-600' },
    { icon: CreditCard, label: 'Moyens de paiement', href: '/payment-settings', color: 'text-purple-600' },
    { icon: Settings, label: 'Paramètres du compte', href: '/account#settings', color: 'text-gray-600' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user ? `${user.firstName} ${user.lastName}` : 'Mon compte'}
              </h1>
              <p className="text-blue-200">{user?.email || 'guest@e-clean.com'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className={`${item.color}`}>
                <item.icon size={24} />
              </div>
              <span className="flex-1 font-medium text-gray-900">{item.label}</span>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Déconnexion */}
        <button
          onClick={() => {
            localStorage.removeItem('eclean_user')
            window.location.href = '/login'
          }}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100"
        >
          <LogOut size={20} />
          Déconnexion
        </button>

        {/* Infos supplémentaires */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>E-Clean v1.0.0 • © 2026 ELECTRON Group</p>
          <p className="mt-1">
            <Link href="/contact" className="hover:underline">Support</Link>
            {' • '}
            <Link href="/faq" className="hover:underline">FAQ</Link>
            {' • '}
            <Link href="/legal" className="hover:underline">Mentions légales</Link>
          </p>
        </div>
      </div>
    </div>
  )
}