// 🤖 E-CLEAN SALES AGENT
// AI-Powered Sales Assistant with NLP and Decision Making

import { OpenAI } from 'openai'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ============== TYPES ==============

export interface SalesContext {
  userId?: string
  sessionId: string
  query: string
  previousMessages: AIConversation[]
  cart?: Cart
  viewedProducts: string[]
}

export interface LeadQualification {
  score: number // 0-100
  budget: 'low' | 'medium' | 'high' | 'enterprise'
  timeline: 'immediate' | 'short' | 'long' | 'none'
  authority: boolean
  need: 'critical' | 'moderate' | 'low'
}

export interface ProductRecommendation {
  product: Product
  score: number
  reasoning: string
}

export interface AIResponse {
  message: string
  actions?: AIAction[]
  products?: ProductRecommendation[]
  confidence: number
}

export interface AIAction {
  type: 'recommend_product' | 'offer_discount' | 'create_coupon' | 'escalate' | 'schedule_call'
  data: Record<string, any>
}

// ============== AI SALES AGENT CLASS ==============

export class SalesAgent {
  private model = 'gpt-4-turbo'
  private systemPrompt = `Tu es EVA, l'assistant commercial IA de E-Clean.
Tu aides les clients à trouver les produits de nettoyage parfaits.
Sois professionnelle, empathique et proactive.
Connaîs notre catalogue par cœur.
Cherche à comprendre les besoins réels.`

  // Analyze Customer Query with NLP
  async analyzeCustomer(query: string, userId?: string): Promise<{
    intent: string
    entities: Record<string, string>
    sentiment: number
    needs: string[]
  }> {
    const response = await openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Analyse cette requête client: "${query}"` }
      ],
      functions: [{
        name: 'analyzeQuery',
        parameters: {
          type: 'object',
          properties: {
            intent: { type: 'string', enum: ['browse', 'buy', 'price_inquiry', 'support', 'return', 'other'] },
            entities: { type: 'object', additionalProperties: { type: 'string' } },
            sentiment: { type: 'number', minimum: -1, maximum: 1 },
            needs: { type: 'array', items: { type: 'string' } }
          }
        }
      }],
      function_call: { name: 'analyzeQuery' }
    })

    return JSON.parse(response.choices[0].message.function_call?.arguments || '{}')
  }

  // Generate Personalized Response
  async generateResponse(context: SalesContext): Promise<AIResponse> {
    const { userId, query, cart, previousMessages } = context

    // Build conversation history
    const messages = [
      { role: 'system', content: this.systemPrompt }
    ]

    // Add recent conversation
    previousMessages.slice(-5).forEach(msg => {
      messages.push({ role: msg.role, content: msg.content })
    })

    messages.push({ role: 'user', content: query })

    const response = await openai.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.7,
      max_tokens: 500
    })

    const message = response.choices[0].message.content || ''

    // Determine confidence based on response length and structure
    const confidence = message.length > 100 ? 0.85 : 0.6

    // Generate product recommendations if relevant
    let products: ProductRecommendation[] = []
    if (message.toLowerCase().includes('recommande')) {
      products = await this.productRecommendation(
        userId ? { id: userId } : null,
        3
      )
    }

    return { message, products, confidence }
  }

  // Qualify Lead with BANT Framework
  async qualifyLead(leadData: {
    name: string
    email: string
    company?: string
    query: string
    source: string
  }): Promise<LeadQualification & { recommendation: string }> {
    const response = await openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: 'Tu qualify les leads BANT: Budget, Authority, Need, Timeline' },
        { role: 'user', content: `Analyse ce lead: ${JSON.stringify(leadData)}` }
      ],
      functions: [{
        name: 'qualifyLead',
        parameters: {
          type: 'object',
          properties: {
            score: { type: 'number', minimum: 0, maximum: 100 },
            budget: { type: 'string', enum: ['low', 'medium', 'high', 'enterprise'] },
            timeline: { type: 'string', enum: ['immediate', 'short', 'long', 'none'] },
            authority: { type: 'boolean' },
            need: { type: 'string', enum: ['critical', 'moderate', 'low'] },
            recommendation: { type: 'string' }
          }
        }
      }],
      function_call: { name: 'qualifyLead' }
    })

    return JSON.parse(response.choices[0].message.function_call?.arguments || '{"score":50}')
  }

  // AI Product Recommendations
  async productRecommendation(user: { id: string } | null, limit: number = 5): Promise<ProductRecommendation[]> {
    let products

    if (user) {
      // Personalized recommendations based on user history
      const userOrders = await prisma.order.findMany({
        where: { userId: user.id },
        take: 10,
        orderBy: { createdAt: 'desc' }
      })

      const purchasedCategories = [...new Set(
        await prisma.orderItem.findMany({
          where: { order: { userId: user.id } },
          include: { product: { include: { category: true } } }
        }).then(items => items.map(i => i.product.categoryId))
      )]

      products = await prisma.product.findMany({
        where: {
          categoryId: { in: purchasedCategories },
          isActive: true,
          stock: { gt: 0 }
        },
        take: limit,
        orderBy: { salesCount: 'desc' }
      })
    } else {
      // Popular products for new users
      products = await prisma.product.findMany({
        where: { isActive: true, stock: { gt: 0 }, isFeatured: true },
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    }

    return products.map(p => ({
      product: p,
      score: Math.random() * 0.3 + 0.7, // Simulated score
      reasoning: 'Basé sur les tendances actuelles'
    }))
  }

  // Pricing Negotiation AI
  async pricingNegotiation(productId: string, userId: string): Promise<{
    eligible: boolean
    discount: number
    minPrice: number
    reasoning: string
  }> {
    const [product, userOrders, user] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.order.findMany({ where: { userId }, take: 10 }),
      prisma.user.findUnique({ where: { id: userId } })
    ])

    if (!product || !user) return { eligible: false, discount: 0, minPrice: 0, reasoning: 'Utilisateur non trouvé' }

    const orderCount = userOrders.length
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0)

    // Calculate discount based on customer value
    let eligible = false
    let discount = 0

    if (orderCount >= 5) eligible = true
    else if (totalSpent > 500) eligible = true

    if (eligible) {
      // Tiered discount
      if (totalSpent > 5000) discount = 15
      else if (totalSpent > 2000) discount = 10
      else if (totalSpent > 500) discount = 5
    }

    const minPrice = product.price * (1 - discount / 100)

    return {
      eligible,
      discount,
      minPrice,
      reasoning: `Client fidèle: ${orderCount} commandes, ${totalSpent}€ total`
    }
  }

  // Upselling Analysis
  async upselling(cartItems: { productId: string }[], userId: string): Promise<ProductRecommendation[]> {
    const categoryIds = await prisma.product.findMany({
      where: { id: { in: cartItems.map(i => i.productId) } },
      select: { categoryId: true }
    }).then(p => p.map(p => p.categoryId))

    return this.productRecommendation({ id: userId }, 3)
  }

  // Objection Handling
  async handleObjection(objection: string, context: SalesContext): Promise<AIResponse> {
    const objections = await openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Un client dit: "${objection}". Comment répondre de façon professionnelle?` }
      ],
      temperature: 0.7,
      max_tokens: 300
    })

    return {
      message: objections.choices[0].message.content || '',
      confidence: 0.9
    }
  }
}

// ============== TRIGGER HANDLERS ==============

export function setupSalesTriggers(agent: SalesAgent) {
  // Trigger: Price Inquiry
  const priceInquiryHandler = async (data: { productId: string; userId: string }) => {
    const pricing = await agent.pricingNegotiation(data.productId, data.userId)
    
    if (pricing.eligible) {
      return {
        message: ` Bonne nouvelle! En tant que client fidèle, vous êtes éligible à une réduction de ${pricing.discount}%!`,
        discount: pricing.discount,
        action: 'create_coupon'
      }
    }
    return { message: 'Prix actuel: voir le catalogue', pricing }
  }

  // Trigger: Cart Abandonment
  const cartAbandonmentHandler = async (data: { userId: string }) => {
    const recommendations = await agent.productRecommendation({ id: data.userId }, 3)
    
    const messages = [
      { type: 'email', delay: 3600 }, // 1h - Reminder
      { type: 'sms', delay: 14400, condition: 'phone_verified' }, // 4h
      { type: 'email', delay: 86400, data: { discount: 10 } } // 24h - Discount
    ]

    return { messages, recommendations }
  }

  return {
    priceInquiryHandler,
    cartAbandonmentHandler
  }
}

// ============== API ENDPOINTS ==============

/*
POST /api/ai/sales/analyze
POST /api/ai/sales/respond  
POST /api/ai/sales/qualify
POST /api/ai/sales/recommend
POST /api/ai/sales/pricing
*/

export default SalesAgent