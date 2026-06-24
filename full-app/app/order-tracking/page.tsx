'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Package, MapPin, RotateCcw, ChevronRight, Search } from 'lucide-react'

interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'refunded'
  total: number
  items: number
  tracking?: string
}

export default function OrderTrackingPage() {
  const searchParams = useSearchParams()
  const view = searchParams.get('status') || searchParams.get('shipments') || searchParams.get('refunds') || 'all'
  
  const [orders] = useState<Order[]>([
    { id: 'ORD-2024-001', date: '2024-01-15', status: 'shipped', total: 89.99, items: 3, tracking: 'TRK123456' },
    { id: 'ORD-2024-002', date: '2024-01-10', status: 'delivered', total: 145.50, items: 5 },
    { id: 'ORD-2024-003', date: '2024-01-05', status: 'pending', total: 32.00, items: 1 },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'refunded': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'processing': return 'En traitement'
      case 'shipped': return 'Expédié'
      case 'delivered': return 'Livré'
      case 'refunded': return 'Remboursé'
      default: return status
    }
  }

  const filteredOrders = orders.filter(o => {
    if (view === 'pending') return o.status === 'pending'
    if (view === 'shipments') return o.status === 'shipped'
    if (view === 'refunds') return o.status === 'refunded'
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">E-Clean</Link>
          <Link href="/account" className="text-blue-200 hover:text-white">Mon compte</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Suivi des commandes</h1>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Link href="/order-tracking" className={`px-4 py-2 rounded-full ${view === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
            Toutes
          </Link>
          <Link href="/order-tracking?status=pending" className={`px-4 py-2 rounded-full ${view === 'pending' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
            En attente
          </Link>
          <Link href="/order-tracking?shipments=true" className={`px-4 py-2 rounded-full ${view === 'shipments' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
            <Package className="w-4 h-4 inline mr-1" /> Expéditions
          </Link>
          <Link href="/order-tracking?refunds=true" className={`px-4 py-2 rounded-full ${view === 'refunds' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
            <RotateCcw className="w-4 h-4 inline mr-1" /> Retours
          </Link>
        </div>

        {/* Liste des commandes */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {order.items} produit(s) • <span className="font-semibold">{order.total.toFixed(2)} €</span>
                  </div>
                  {order.tracking && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Suivre
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}