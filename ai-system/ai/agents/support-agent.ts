// 🤖 E-CLEAN SUPPORT AGENT
// AI-Powered Customer Support with Ticket Management

import { OpenAI } from 'openai'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ============== TYPES ==============

export enum TicketCategory {
  ORDER = 'order_issue'
  PRODUCT = 'product_question'
  PAYMENT = 'payment_issue'
  RETURN = 'return_request'
  TECHNICAL = 'technical_support'
  BILLING = 'billing'
  OTHER = 'other'
}

export enum TicketStatus {
  OPEN = 'open'
  PENDING = 'pending'
  IN_PROGRESS = 'in_progress'
  RESOLVED = 'resolved'
  CLOSED = 'closed'
}

export enum Priority {
  LOW = 'low'
  MEDIUM = 'medium'
  HIGH = 'high'
  URGENT = 'urgent'
}

export interface SentimentScore {
  score: number // -1 to 1
  label: 'negative' | 'neutral' | 'positive'
  emotions: string[]
}

export interface TicketClassification {
  category: TicketCategory
  subcategory: string
  priority: Priority
  entities: Record<string, string>
  suggestedActions: string[]
}

// ============== SUPPORT AGENT CLASS ==============

export class SupportAgent {
  private model = 'gpt-4-turbo'

  // Classify incoming ticket
  async classifyTicket(message: string, context?: Record<string, any>): Promise<TicketClassification> {
    const response = await openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: 'Tu classes les tickets support. Catégories: order_issue, product_question, payment_issue, return_request, technical_support, billing, other. Priorités: low, medium, high, urgent.' },
        { role: 'user', content: `Analyse ce message: "${message}". Contexte: ${JSON.stringify(context || {})}` }
      ],
      functions: [{
        name: 'classifyTicket',
        parameters: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: Object.values(TicketCategory) },
            subcategory: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
            entities: { type: 'object' },
            suggestedActions: { type: 'array', items: { type: 'string' } }
          }
        }
      }],
      function_call: { name: 'classifyTicket' }
    })

    const result = JSON.parse(response.choices[0].message.function_call?.arguments || '{}')

    // Auto-detect urgency patterns
    if (message.toLowerCase().includes('urgent') || 
        message.toLowerCase().includes('immediate') ||
        message.toLowerCase().includes('asap')) {
      result.priority = Priority.URGENT
    }

    return result
  }

  // Sentiment Analysis
  async analyzeSentiment(message: string): Promise<SentimentScore> {
    const response = await openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: 'Analyse le sentiment de ce message. Retourne un score de -1 (très négatif) à 1 (très positif).' },
        { role: 'user', content: message }
      ],
      functions: [{
        name: 'analyzeSentiment',
        parameters: {
          type: 'object',
          properties: {
            score: { type: 'number', minimum: -1, maximum: 1 },
            label: { type: 'string', enum: ['negative', 'neutral', 'positive'] },
            emotions: { type: 'array', items: { type: 'string' } }
          }
        }
      }],
      function_call: { name: 'analyzeSentiment' }
    })

    const result = JSON.parse(response.choices[0].message.function_call?.arguments || '{"score":0,"label":"neutral"}')
    return result
  }

  // Auto-generate response to ticket
  async autoRespond(ticketId: string): Promise<{ response: string; shouldAutoSend: boolean }> {
    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } })
    if (!ticket) throw new Error('Ticket not found')

    // Search knowledge base
    const articles = await this.findKnowledgeBase(ticket.subject)
    const sentiment = await this.analyzeSentiment(ticket.message)

    // Determine if AI can handle
    let shouldAutoSend = false
    let response = ''

    if (articles.length > 0) {
      response = `Bonjour${ticket.firstName ? ' ' + ticket.firstName : ''},\n\n`
      response += `Merci de nous avoir contactés. J'ai trouvé des informations qui pourraient vous aider:\n\n`
      response += articles.slice(0, 3).map(a => `- ${a.title}: ${a.summary}`).join('\n')
      response += '\n\nCes informations résolvent-elles votre problème?'

      if (sentiment.score > -0.5) shouldAutoSend = true
    } else {
      // Escalate to human with summary
      await this.escalateToHuman(ticketId, 'no_knowledge_base_match')
      return { response: 'Ticket escaladé vers un agent humain', shouldAutoSend: false }
    }

    // Auto-escalate if highly negative sentiment
    if (sentiment.score < -0.7) {
      await this.escalateToHuman(ticketId, 'highly_dissatisfied_customer')
    }

    return { response, shouldAutoSend }
  }

  // Knowledge Base Search
  async findKnowledgeBase(query: string): Promise<{ id: string; title: string; summary: string }[]> {
    // Use semantic search with embeddings (simplified)
    const articles = await prisma.knowledgeBaseArticle.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } }
        ],
        isPublished: true
      },
      take: 5
    })

    return articles.map(a => ({
      id: a.id,
      title: a.title,
      summary: a.content.substring(0, 150) + '...'
    }))
  }

  // Generate solution using knowledge base
  async generateSolution(ticketId: string): Promise<string> {
    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } })
    if (!ticket) return ''

    const articles = await this.findKnowledgeBase(ticket.subject)
    const customerHistory = await prisma.order.findMany({
      where: { userId: ticket.userId },
      take: 5
    })

    // Build context for AI
    const context = {
      issue: ticket.message,
      relatedArticles: articles,
      orderHistory: customerHistory
    }

    const solution = await openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: 'Génère une solution détaillée basée sur la base de connaissance et l\'historique du client.' },
        { role: 'user', content: JSON.stringify(context) }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    return solution.choices[0].message.content || ''
  }

  // Escalate to human agent
  async escalateToHuman(ticketId: string, reason: string): Promise<void> {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatus.OPEN,
        assignedTo: 'HUMAN_AGENT',
        internalNote: `Escaladé: ${reason}`
      }
    })

    // Notify admin channel
    if (process.env.SLACK_WEBHOOK_URL) {
      // Send to Slack
    }
  }

  // Summarize conversation
  async summarizeConversation(ticketId: string): Promise<string> {
    const messages = await prisma.supportMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' }
    })

    const summary = await openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: 'Résume cette conversation en 2-3 phrases.' },
        { role: 'user', content: messages.map(m => `${m.sender}: ${m.content}`).join('\n') }
      ],
      max_tokens: 200
    })

    return summary.choices[0].message.content || ''
  }

  // Detect customer frustration
  async detectFrustration(userId: string): Promise<boolean> {
    const recentTickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    let frustrationCount = 0
    for (const ticket of recentTickets) {
      const sentiment = await this.analyzeSentiment(ticket.message)
      if (sentiment.score < -0.3) frustrationCount++
    }

    return frustrationCount >= 3
  }

  // Schedule callback
  async scheduleCallback(ticketId: string, preferredTime: Date): Promise<boolean> {
    await prisma.supportCallback.create({
      data: {
        ticketId,
        scheduledAt: preferredTime,
        status: 'scheduled'
      }
    })

    return true
  }
}

// ============== KNOWLEDGE BASE ==============

export async function seedKnowledgeBase() {
  const articles = [
    {
      title: 'Comment retourner un produit',
      content: 'Pour retourner un produit: 1. Allez dans Mes Commandes 2. Sélectionnez la commande 3. Cliquez sur Retourner 4. Imprimez l\'étiquette 5. Emballez le produit',
      keywords: ['retour', 'remboursement', 'échange', 'retourner']
    },
    {
      title: 'Suivre ma commande',
      content: 'Pour suivre votre commande: 1. Connectez-vous à votre compte 2. Allez dans Mes Commandes 3. Cliquez sur Suivre 4.Utilisez le numéro de suivi',
      keywords: ['suivre', 'livraison', 'suivi', 'tracking']
    },
    {
      title: 'Méthodes de paiement',
      content: 'Nous acceptons: Visa, Mastercard, PayPal, Virement bancaire, Crypto (USDT)',
      keywords: ['paiement', 'carte', 'virement', 'paypal']
    },
    {
      title: 'Garantie produits',
      content: 'Tous nos produits ont une garantie de 2 ans. La garantie couvre les défauts de fabrication.',
      keywords: ['garantie', 'défaut', 'réparation', 'échange']
    }
  ]

  // Seed knowledge base
  for (const article of articles) {
    await prisma.knowledgeBaseArticle.upsert({
      where: { title: article.title },
      create: { ...article, isPublished: true },
      update: article
    })
  }
}

export default SupportAgent