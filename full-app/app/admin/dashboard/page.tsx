'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Bot, DollarSign, ShoppingCart, Users, Package, 
  TrendingUp, Activity, Zap, Clock, CheckCircle,
  AlertTriangle, ArrowRight, BarChart3, Settings
} from 'lucide-react'

// Types pour les agents IA
interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'idle' | 'error'
  lastRun?: string
  description: string
  tasks: number
  success: number
  icon: string
}

// Workflow automatisé
interface Workflow {
  id: string
  name: string
  trigger: string
  status: 'active' | 'paused'
  lastRun?: string
  runs: number
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
    { id: '1', name: 'Sales Agent', role: 'sales', status: 'idle', description: 'Ventes, recommandations, négociation de prix, upselling', tasks: 1247, success: 94.5, icon: '💰' },
    { id: '2', name: 'Finance Agent', role: 'finance', status: 'idle', description: 'Facturation, détection fraude, cashflow', tasks: 856, success: 98.2, icon: '💵' },
    { id: '3', name: 'Marketing Agent', role: 'marketing', status: 'idle', description: 'Campagnes, SEO, contenu, A/B testing', tasks: 523, success: 91.3, icon: '📢' },
    { id: '4', name: 'Support Agent', role: 'support', status: 'idle', description: 'Ticketing, KB, escalade humaine', tasks: 2341, success: 89.7, icon: '🎧' },
    { id: '5', name: 'Operations Agent', role: 'operations', status: 'idle', description: 'Logistique, stocks, réapprovisionnement', tasks: 678, success: 96.1, icon: '📦' },
  ])

  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: 'w1', name: 'Order → Fulfillment', trigger: 'order.created', status: 'active', runs: 342 },
    { id: 'w2', name: 'Cart Recovery', trigger: 'cart.abandoned', status: 'active', runs: 89 },
    { id: 'w3', name: 'Welcome Journey', trigger: 'user.registered', status: 'active', runs: 156 },
    { id: 'w4', name: 'Inventory Check', trigger: 'schedule (6h)', status: 'active', runs: 30 },
    { id: 'w5', name: 'Refund Processing', trigger: 'refund.requested', status: 'active', runs: 45 },
    { id: 'w6', name: 'Review Request', trigger: 'order.delivered', status: 'active', runs: 278 },
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
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-6 h-6" /> Agents IA
            </h2>
            <span className="text-sm text-gray-500">5 agents actifs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{agent.icon}</span>
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    agent.status === 'active' ? 'bg-green-100 text-green-800' :
                    agent.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {agent.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                
                <div className="flex gap-4 text-xs text-gray-500 mb-4">
                  <span>Tâches: <strong className="text-gray-900">{agent.tasks}</strong></span>
                  <span>Succès: <strong className="text-green-600">{agent.success}%</strong></span>
                </div>
                
                <button 
                  onClick={() => runAgent(agent.id)}
                  disabled={agent.status === 'active'}
                  className={`w-full py-2 rounded flex items-center justify-center gap-2 ${
                    agent.status === 'active' 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  {agent.status === 'active' ? 'En cours...' : 'Lancer'}
                </button>
                {agent.lastRun && (
                  <p className="text-xs text-gray-400 mt-2">
                    Dernier: {new Date(agent.lastRun).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Workflows Automatisés */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6" /> Workflows Automatisés
            </h2>
            <span className="text-sm text-gray-500">{workflows.length} workflows actifs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Workflow</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Déclencheur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Exécutions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((workflow) => (
                  <tr key={workflow.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{workflow.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{workflow.trigger}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        workflow.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workflow.status === 'active' ? 'Actif' : 'En pause'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{workflow.runs}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Voir détails →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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