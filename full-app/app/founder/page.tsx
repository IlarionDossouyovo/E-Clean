'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Bot, Activity, DollarSign, ShoppingCart, Package, 
  Users, TrendingUp, Settings, Play, Pause, 
  RefreshCw, AlertTriangle, CheckCircle, XCircle,
  ChevronRight, Cpu, Zap, BarChart3, MessageSquare
} from 'lucide-react'
import { 
  SALES_AGENT_CONFIG, SUPPORT_AGENT_CONFIG, FINANCE_AGENT_CONFIG,
  MARKETING_AGENT_CONFIG, OPERATIONS_AGENT_CONFIG, INVENTORY_AGENT_CONFIG,
  SHIPPING_AGENT_CONFIG, REFUND_AGENT_CONFIG, REVIEW_AGENT_CONFIG, 
  CHAT_AGENT_CONFIG, HELP_AGENT_CONFIG, MAINTENANCE_AGENT_CONFIG, COMPANY_SERVICES 
} from '@/agents/config'

// Types
interface Agent {
  id: string
  name: string
  role: string
  description: string
  color: string
  icon: string
  status: string
  capabilities: string[]
  metrics: {
    tasksCompleted: number
    successRate: number
    [key: string]: any
  }
  instructions: string
  kpis: {
    [key: string]: number
  }
}

const agentsData: Agent[] = [
  SALES_AGENT_CONFIG,
  SUPPORT_AGENT_CONFIG,
  FINANCE_AGENT_CONFIG,
  MARKETING_AGENT_CONFIG,
  OPERATIONS_AGENT_CONFIG,
  INVENTORY_AGENT_CONFIG,
  SHIPPING_AGENT_CONFIG,
  REFUND_AGENT_CONFIG,
  REVIEW_AGENT_CONFIG,
  CHAT_AGENT_CONFIG,
  HELP_AGENT_CONFIG,
  MAINTENANCE_AGENT_CONFIG,
]

const services = [
  { 
    id: 'ecommerce', 
    name: 'E-Commerce Platform', 
    icon: ShoppingCart, 
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    status: 'online',
    description: 'Plateforme de vente en ligne principale',
    endpoints: ['/api/products', '/api/categories', '/api/orders', '/api/cart']
  },
  { 
    id: 'payment', 
    name: 'Système de Paiement', 
    icon: DollarSign, 
    color: 'text-green-600',
    bg: 'bg-green-100',
    status: 'online',
    description: 'Stripe, PayPal, virement, crypto',
    providers: ['Stripe', 'PayPal', 'Bank Transfer', 'Crypto (USDT)', 'Mobile Money']
  },
  { 
    id: 'logistics', 
    name: 'Logistique', 
    icon: Package, 
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    status: 'online',
    description: 'Suivi, transporteurs, livraison',
    carriers: ['DHL', 'FedEx', 'UPS', 'Chronopost', 'Mondial Relay']
  },
  { 
    id: 'marketing', 
    name: 'Marketing', 
    icon: TrendingUp, 
    color: 'text-pink-600',
    bg: 'bg-pink-100',
    status: 'online',
    description: 'Email, SMS, CRM, affiliation',
    tools: ['SendGrid', 'Twilio', 'HubSpot', 'Affiliate Program']
  },
  { 
    id: 'ai', 
    name: 'Intelligence Artificielle', 
    icon: Bot, 
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    status: 'online',
    description: 'GPT-4, embeddings, vector DB',
    providers: ['OpenAI', 'Custom Models']
  },
  { 
    id: 'warehouse', 
    name: 'Entrepôt', 
    icon: Activity, 
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    status: 'online',
    description: 'Gestion des stocks et expéditions',
    location: 'France/EU'
  },
]

export default function FounderDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [activeTab, setActiveTab] = useState<'agents' | 'services' | 'overview'>('agents')
  const [agentStatuses, setAgentStatuses] = useState<Record<string, string>>({})
  const [stats, setStats] = useState({
    totalTasks: 0,
    successRate: 0,
    activeAgents: 0,
    servicesOnline: 0,
  })

  // Initialize agent statuses
  useEffect(() => {
    const statuses: Record<string, string> = {}
    agentsData.forEach(agent => {
      statuses[agent.id] = 'active'
    })
    setAgentStatuses(statuses)

    // Calculate stats
    const totalTasks = agentsData.reduce((sum, a) => sum + (a.metrics?.tasksCompleted || 0), 0)
    const avgSuccess = agentsData.reduce((sum, a) => sum + (a.metrics?.successRate || 0), 0) / agentsData.length
    setStats({
      totalTasks,
      successRate: avgSuccess,
      activeAgents: agentsData.filter(a => a.status === 'active').length,
      servicesOnline: services.length,
    })
  }, [])

  const toggleAgent = (agentId: string) => {
    setAgentStatuses(prev => ({
      ...prev,
      [agentId]: prev[agentId] === 'active' ? 'paused' : 'active'
    }))
  }

  const restartAgent = (agentId: string) => {
    // Simulate restart
    setAgentStatuses(prev => ({
      ...prev,
      [agentId]: 'restarting'
    }))
    setTimeout(() => {
      setAgentStatuses(prev => ({
        ...prev,
        [agentId]: 'active'
      }))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">E-Clean AI Command Center</h1>
                <p className="text-sm text-slate-400">Dashboard Fondateur - Contrôle Total</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Système Opérationnel
              </span>
              <Link href="/" className="text-slate-400 hover:text-white transition">
                ← Retour
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 py-2">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'agents', label: 'Agents IA', icon: Bot },
              { id: 'services', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Agents Actifs</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.activeAgents}/10</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Services en Ligne</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.servicesOnline}/6</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Taux de Réussite</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.successRate.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Tâches Totales</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalTasks.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Services Status */}
            <div className="bg-slate-800 rounded-xl border border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Services de l'Entreprise
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                  <div key={service.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${service.bg} rounded-lg flex items-center justify-center`}>
                        <service.icon className={`w-5 h-5 ${service.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{service.name}</h3>
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                            En ligne
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Actions Rapides</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('agents')}
                  className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-emerald-500 transition text-left"
                >
                  <Bot className="w-8 h-8 text-emerald-400 mb-2" />
                  <p className="font-medium text-white">Gérer Agents</p>
                  <p className="text-sm text-slate-400">Voir et configurer</p>
                </button>
                <button 
                  onClick={() => setActiveTab('services')}
                  className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition text-left"
                >
                  <Settings className="w-8 h-8 text-blue-400 mb-2" />
                  <p className="font-medium text-white">Services</p>
                  <p className="text-sm text-slate-400">Monitoring</p>
                </button>
                <button className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-purple-500 transition text-left">
                  <BarChart3 className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="font-medium text-white">Rapports</p>
                  <p className="text-sm text-slate-400">Analyses détaillées</p>
                </button>
                <button className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-orange-500 transition text-left">
                  <Users className="w-8 h-8 text-orange-400 mb-2" />
                  <p className="font-medium text-white">Équipe</p>
                  <p className="text-sm text-slate-400">Gérer les accès</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Agents IA d'E-Clean</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Activer Tout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {agentsData.map(agent => (
                <div 
                  key={agent.id}
                  className={`bg-slate-800 rounded-xl border-2 transition cursor-pointer hover:border-slate-600 ${
                    selectedAgent?.id === agent.id ? 'border-emerald-500' : 'border-slate-700'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${agent.color}20` }}
                        >
                          {agent.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                          <p className="text-sm text-slate-400 capitalize">{agent.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          agentStatuses[agent.id] === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : agentStatuses[agent.id] === 'restarting'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {agentStatuses[agent.id] === 'active' ? 'Actif' : 
                           agentStatuses[agent.id] === 'restarting' ? 'Redémarrage' : 'En pause'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mt-4">{agent.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {agent.capabilities.slice(0, 4).map((cap, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                          {cap}
                        </span>
                      ))}
                      {agent.capabilities.length > 4 && (
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">
                          +{agent.capabilities.length - 4} autres
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleAgent(agent.id) }}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                          agentStatuses[agent.id] === 'active'
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        }`}
                      >
                        {agentStatuses[agent.id] === 'active' ? (
                          <><Pause className="w-4 h-4" /> Pause</>
                        ) : (
                          <><Play className="w-4 h-4" /> Activer</>
                        )}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); restartAgent(agent.id) }}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedAgent?.id === agent.id && (
                    <div className="px-6 pb-6 border-t border-slate-700 pt-4">
                      <h4 className="font-semibold text-white mb-2">Instructions de l'Agent</h4>
                      <p className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg max-h-32 overflow-y-auto">
                        {agent.instructions}
                      </p>
                      
                      <h4 className="font-semibold text-white mt-4 mb-2">Capabilités Complètes</h4>
                      <ul className="space-y-1">
                        {agent.capabilities.map((cap, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <ChevronRight className="w-3 h-3 text-emerald-400" />
                            {cap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Services de l'Entreprise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map(service => (
                <div key={service.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 ${service.bg} rounded-xl flex items-center justify-center`}>
                        <service.icon className={`w-6 h-6 ${service.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                          <span className="text-sm text-emerald-400">En ligne</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-400">{service.description}</p>
                    
                    {'endpoints' in service && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-300 mb-2">Endpoints:</p>
                        <div className="flex flex-wrap gap-2">
                          {(service as any).endpoints?.map((ep: string) => (
                            <span key={ep} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-400 font-mono">
                              {ep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {'providers' in service && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-300 mb-2">Fournisseurs:</p>
                        <div className="flex flex-wrap gap-2">
                          {(service as any).providers?.map((p: string) => (
                            <span key={p} className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-400">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {'carriers' in service && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-300 mb-2">Transporteurs:</p>
                        <div className="flex flex-wrap gap-2">
                          {(service as any).carriers?.map((c: string) => (
                            <span key={c} className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-400">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {'tools' in service && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-300 mb-2">Outils:</p>
                        <div className="flex flex-wrap gap-2">
                          {(service as any).tools?.map((t: string) => (
                            <span key={t} className="px-2 py-1 bg-pink-500/20 rounded text-xs text-pink-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2026 E-Clean - ELECTRON Group | AI Command Center | Accès Réservé au Fondateur
          </p>
        </div>
      </footer>
    </div>
  )
}
