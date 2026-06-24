'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CreditCard, Plus, Trash2, Check } from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank'
  last4?: string
  expiry?: string
  isDefault: boolean
}

export default function PaymentSettingsPage() {
  const [methods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', last4: '4242', expiry: '12/26', isDefault: true },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case 'card': return '💳'
      case 'paypal': return '🅿️'
      case 'bank': return '🏦'
      default: return '💳'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white py-4 px-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Link href="/account" className="text-xl font-bold">E-Clean</Link>
          <Link href="/account" className="text-blue-200 hover:text-white">← Retour</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Moyens de paiement</h1>

        {/* Liste des moyens de paiement */}
        <div className="space-y-4 mb-6">
          {methods.map(method => (
            <div key={method.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{getIcon(method.type)}</span>
                <div>
                  <p className="font-medium text-gray-900">
                    {method.type === 'card' && `•••• •••• •••• ${method.last4}`}
                    {method.type === 'paypal' && 'PayPal'}
                    {method.type === 'bank' && 'Virement bancaire'}
                  </p>
                  {method.expiry && (
                    <p className="text-sm text-gray-500">Expire {method.expiry}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Par défaut
                  </span>
                )}
                <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ajouter un moyen de paiement */}
        <button className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50">
          <Plus className="w-5 h-5" />
          Ajouter un moyen de paiement
        </button>
      </main>
    </div>
  )
}