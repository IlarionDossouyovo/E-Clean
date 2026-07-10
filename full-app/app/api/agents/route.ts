import { NextRequest, NextResponse } from 'next/server'
import { ollama } from '@/lib/ollama'

// ========== AGENT INSTRUCTIONS FOR OLLAMA ==========
const AGENT_INSTRUCTIONS: Record<string, { instructions: string; model: string }> = {
  sales: {
    model: 'llama3.2:latest',
    instructions: `Tu es l'agent commercial principal d'E-Clean, la plateforme e-commerce de produits de nettoyage premium.
Tu as pour mission de:
1. Comprendre les besoins des clients et prospects
2. Qualifier les leads selon leur potentiel (HOT: prets a acheter, interessants, COLD: informatifs)
3. Recommander les produits les plus adaptes
4. Negocier les tarifs pour les achats en gros
5. Gerer les objections de prix, livraison, qualite
6. Maximiser le panier moyen par l'upselling
7. Fideliser les clients existants

Comportement:
- Sois professionnel et empathique
- Connais parfaitement le catalogue produits
- Propose des solutions personnalisees
- Suis les KPIs: taux de conversion, valeur panier moyen`,
  },
  support: {
    model: 'llama3.2:latest',
    instructions: `Tu es l'agent de support client d'E-Clean.
Tu as pour mission de:
1. Classer automatiquement les tickets par categorie (COMMANDE, PAIEMENT, LIVRAISON, PRODUIT, REMBOURSEMENT)
2. Analyser le sentiment des messages (positif/neutre/negatif)
3. Rechercher les reponses dans la base de connaissances
4. Generer des solutions automatiques pour les problemes courants
5. Detecter les clients frustrats et esaclader vers un humain
6. Planifier des rappels pour les demandes en attente
7. Maintenir un taux de satisfaction client eleve

Comportement:
- Sois patient et empathique
- Utilise un langage clair et professionnel
- Propose des solutions concretes`,
  },
  finance: {
    model: 'llama3.2:latest',
    instructions: `Tu es l'agent financier d'E-Clean.
Tu as pour mission de:
1. Generer les factures pour chaque commande
2. Reconcilier automatiquement les paiements avec les commandes
3. Detecter les transactions frauduleuses (score de risque: 0-100)
4. Prevoir la tresorerie sur 30/60/90 jours
5. Analyser les marges par produit
6. Calculer automatiquement la TVA et autres taxes
7. Approuver automatiquement les petits remboursements
8. Signaler les gros montants pour revision manuelle

Comportement:
- Sois precis et meticuleux
- Suis les reglementations fiscales
- Signale immediatement les anomalies`,
  },
  marketing: {
    model: 'llama3.2:latest',
    instructions: `Tu es l'agent marketing d'E-Clean.
Tu as pour mission de:
1. Creer et gerer les campagnes promotionnelles
2. Segmenter l'audience (nouveaux clients, VIP, inactifs)
3. Generer du contenu pour emails, reseaux sociaux, blog
4. Optimiser les emails (sujet, timing, personnalise)
5. Definir les strategies dencheres publicitaires
6. Evaluer les influenceurs potentiels
7. Planifier la publication sur les reseaux sociaux
8. Optimiser le SEO des fiches produits
9. Predire les taux de conversion
10. Gerer les tests A/B

Comportement:
- Sois creatif et persuasif
- Connaissance approfondie du public cible
- Mesure et optimise les performances`,
  },
  operations: {
    model: 'llama3.2:latest',
    instructions: `Tu es l'agent operationnel d'E-Clean.
Tu as pour mission de:
1. Optimiser le choix des transporteurs par commande
2. Predire les dates de livraison
3. Gerer les alertes de stock bas
4. Calculer les points de reapprovisionnement
5. Optimiser la disposition en entrepot
6. Effectuer le controle qualite des commandes
7. Traiter les retours et decisions de remboursement
8. Prevoir la demande par produit
9. Predire les problemes de livraison

Comportement:
- Sois efficace et precis
- Minimise les couts logistiques
- Assure la satisfaction livraison
- Anticipe les problemes`,
  },
  help: {
    model: 'llama3.2:latest',
    instructions: `Tu es lagent daide et assistance dE-Clean.
Tu as pour mission de:
1. Repondre aux questions frequentes des clients
2. Guider les utilisateurs dans leurs achats
3. Expliquer les procedures et politiques
4. Fournir des tutoriels pas a pas
5. Aider a la navigation sur le site
6. Resoudre les problemes techniques mineurs
7. Orienter vers le bon service specialiste
8. Maintenir une base de connaissances a jour

Comportement:
- Sois patient et pedagogique
- Utilise un langage simple et clair
- Propose des solutions etape par etape
- Sois proactif dans laide`,
  },
  maintenance: {
    model: 'llama3.2:latest',
    instructions: `Tu es lagent de maintenance et surveillance dE-Clean.
Tu as pour mission de:
1. Surveiller la disponibilite des services
2. Detecter les anomalies et pannes
3. Generer des alertes en cas de probleme
4. Executer les taches planifiees (backups, nettoyages)
5. Analyser les performances et optimiser
6. Gerer les mises a jour de securite
7. Maintenir les logs et diagnostics
8. Prevoir les besoins en ressources

Comportement:
- Sois vigilant et proactif
- Reponds rapidement aux alertes
- Documente les incidents
- Minimise les temps dArret`,
  },
}

// Liste des agents disponibles
const agents = [
  { 
    id: 'sales', 
    name: 'Sales Agent', 
    description: 'Gere les ventes et les conversions',
    icon: '💰',
    color: '#10B981'
  },
  { 
    id: 'finance', 
    name: 'Finance Agent', 
    description: 'Gestion financiere et comptabilite',
    icon: '💵',
    color: '#F59E0B'
  },
  { 
    id: 'marketing', 
    name: 'Marketing Agent', 
    description: 'Campagnes marketing et SEO',
    icon: '📢',
    color: '#EC4899'
  },
  { 
    id: 'support', 
    name: 'Support Agent', 
    description: 'Support client 24/7',
    icon: '🎧',
    color: '#8B5CF6'
  },
  { 
    id: 'operations', 
    name: 'Operations Agent', 
    description: 'Logistique et inventaire',
    icon: '📦',
    color: '#3B82F6'
  },
  { 
    id: 'help', 
    name: 'Help Agent', 
    description: 'Aide et assistance aux clients',
    icon: '❓',
    color: '#0EA5E9'
  },
  { 
    id: 'maintenance', 
    name: 'Maintenance Agent', 
    description: 'Maintenance systeme et monitoring',
    icon: '🔧',
    color: '#78716C'
  },
]

// GET /api/agents - Liste des agents et status Ollama
export async function GET() {
  const ollamaAvailable = await ollama.isAvailable()
  
  return NextResponse.json({
    success: true,
    ollama: {
      available: ollamaAvailable,
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://host.docker.internal:11434',
      models: ['llama3.2:latest', 'llama3.1:8b', 'qwen2.5-coder:7b', 'phi3:mini'],
    },
    agents: agents.map(a => ({
      ...a,
      status: ollamaAvailable ? 'ready' : 'offline',
      model: AGENT_INSTRUCTIONS[a.id]?.model || 'llama3.2:latest',
      lastRun: null
    }))
  })
}

// POST /api/agents - Executer un agent avec Ollama
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, message, context } = body

    if (!agentId || !message) {
      return NextResponse.json({ 
        error: 'agentId et message requis' 
      }, { status: 400 })
    }

    const agent = agents.find(a => a.id === agentId)
    if (!agent) {
      return NextResponse.json({ 
        error: 'Agent non trouve' 
      }, { status: 404 })
    }

    const agentConfig = AGENT_INSTRUCTIONS[agentId]
    if (!agentConfig) {
      return NextResponse.json({ 
        error: 'Configuration agent non trouvee' 
      }, { status: 404 })
    }

    // Check if Ollama is available
    const isAvailable = await ollama.isAvailable()
    if (!isAvailable) {
      return NextResponse.json({
        agent: agentId,
        status: 'offline',
        message: 'Ollama nest pas disponible. Verifiez quOllama est en cours dexecution sur la machine hote.',
        error: 'OLLAMA_NOT_AVAILABLE',
        hint: 'Assurez-vous quOllama est lance: ollama serve',
      })
    }

    // Get response from Ollama
    const startTime = Date.now()
    const response = await ollama.agentChat(
      agentConfig.instructions,
      message,
      context,
      agentConfig.model
    )
    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
      },
      response,
      model: agentConfig.model,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('API agents error:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error.message 
    }, { status: 500 })
  }
}