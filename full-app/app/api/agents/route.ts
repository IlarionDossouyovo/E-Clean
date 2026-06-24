import { NextRequest, NextResponse } from 'next/server'

// Liste des agents disponibles
const agents = [
  { id: 'sales', name: 'Sales Agent', description: 'Gère les ventes et les conversions' },
  { id: 'finance', name: 'Finance Agent', description: 'Gestion financière et comptabilité' },
  { id: 'marketing', name: 'Marketing Agent', description: 'Campagnes marketing et SEO' },
  { id: 'support', name: 'Support Agent', description: 'Support client 24/7' },
  { id: 'operations', name: 'Operations Agent', description: 'Logistique et inventaire' },
]

// GET /api/agents - Liste des agents
export async function GET() {
  return NextResponse.json({
    success: true,
    agents: agents.map(a => ({
      ...a,
      status: 'idle',
      lastRun: null
    }))
  })
}

// POST /api/agents - Exécuter un agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, action } = body

    if (!agentId) {
      return NextResponse.json({ error: 'agentId requis' }, { status: 400 })
    }

    const agent = agents.find(a => a.id === agentId)
    if (!agent) {
      return NextResponse.json({ error: 'Agent non trouvé' }, { status: 404 })
    }

    // Simuler l'exécution de l'agent
    // Dans un vrai système, cela déclencherait l'agent IA
    return NextResponse.json({
      success: true,
      message: `Agent ${agent.name} exécuté avec succès`,
      result: {
        agentId,
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('API agents error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}