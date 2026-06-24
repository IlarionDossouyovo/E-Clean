'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Types pour les agents IA
interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'idle' | 'error'
  lastRun?: string
  description: string
}

// Statistiques simulées
interface Stats {
  totalSales: number
  totalOrders: number
  totalUsers: number
  revenue: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Sales Agent', role: 'sales', status: 'idle', description: 'Gère les ventes et les conversions' },
    { id: '2', name: 'Finance Agent', role: 'finance', status: 'idle', description: 'Gestion financière et comptabilité' },
    { id: '3', name: 'Marketing Agent', role: 'marketing', status: 'idle', description: 'Campagnes marketing et SEO' },
    { id: '4', name: 'Support Agent', role: 'support', status: 'idle', description: 'Support client 24/7' },
    { id: '5', name: 'Operations Agent', role: 'operations', status: 'idle', description: 'Logistique et inventaire' },
  ])

  useEffect(() => {
    // Simuler le chargement des statistiques
    setTimeout(() => {
      setStats({
        totalSales: 12450,
        totalOrders: 342,
        totalUsers: 1250,
        revenue: 45680
      })
      setLoading(false)
    }, 1000)
  }, [])

  const runAgent = (agentId: string) => {
    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: 'active' as const } : a
    ))
    
    // Simuler l'exécution de l'agent
    setTimeout(() => {
      setAgents(prev => prev.map(a => 
        a.id === agentId ? { ...a, status: 'idle' as const, lastRun: new Date().toISOString() } : a
      ))
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Admin */}
      <header className="bg-blue-900 text-white py-4 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-blue-200 hover:text-white">←</button>
            <Link href="/" className="text-xl font-bold hover:text-blue-200">E-Clean Admin</Link>
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-blue-200">Accueil</Link>
            <Link href="/admin/dashboard" className="text-blue-200">Dashboard</Link>
            <Link href="/catalog" className="hover:text-blue-200">Catalogue</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Administrateur</h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Ventes Totales</p>
            <p className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.totalSales.toLocaleString()} €</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Commandes</p>
            <p className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Utilisateurs</p>
            <p className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Revenus</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '...' : stats.revenue.toLocaleString()} €</p>
          </div>
        </div>

        {/* Section Agents IA */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">🤖 Agents IA</h2>
            <span className="text-sm text-gray-500">5 agents disponibles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    agent.status === 'active' ? 'bg-green-100 text-green-800' :
                    agent.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status === 'active' ? 'En cours' : 'Inactif'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
                <button 
                  onClick={() => runAgent(agent.id)}
                  disabled={agent.status === 'active'}
                  className={`w-full py-2 rounded ${
                    agent.status === 'active' 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {agent.status === 'active' ? 'En cours...' : 'Lancer l\'agent'}
                </button>
                {agent.lastRun && (
                  <p className="text-xs text-gray-400 mt-2">
                    Dernier lancement: {new Date(agent.lastRun).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Gestion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion du Catalogue</h2>
            <div className="space-y-3">
              <Link href="/catalog" className="block py-2 px-4 bg-gray-50 rounded hover:bg-gray-100">
                Voir les produits
              </Link>
              <button className="block w-full text-left py-2 px-4 bg-gray-50 rounded hover:bg-gray-100">
                Ajouter un produit
              </button>
              <button className="block w-full text-left py-2 px-4 bg-gray-50 rounded hover:bg-gray-100">
                Gérer les catégories
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion des Commandes</h2>
            <div className="space-y-3">
              <button className="block w-full text-left py-2 px-4 bg-gray-50 rounded hover:bg-gray-100">
                Commandes en attente
              </button>
              <button className="block w-full text-left py-2 px-4 bg-gray-50 rounded hover:bg-gray-100">
                Suivi des expéditions
              </button>
              <button className="block w-full text-left py-2 px-4 bg-gray-50 rounded hover:bg-gray-100">
                Retours et remboursements
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}