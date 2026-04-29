// 🤖 E-CLEAN AI ORCHESTRATOR
// Central Brain that manages all AI Agents

import { SalesAgent } from './agents/sales-agent'
import { SupportAgent } from './agents/support-agent'
import { FinanceAgent } from './agents/finance-agent'
import { OperationsAgent } from './agents/operations-agent'
import { MarketingAgent } from './agents/marketing-agent'

export interface ConversationContext {
  userId?: string
  sessionId: string
  channel: 'web' | 'whatsapp' | 'sms' | 'email'
  language: 'fr' | 'en' | 'es' | 'pt'
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  agent?: string
}

/**
 * E-Clean AI Orchestrator
 * Central brain that routes requests to the appropriate AI agent
 */
export class EcleanAI {
  private sales: SalesAgent
  private support: SupportAgent
  private finance: FinanceAgent
  private operations: OperationsAgent
  private marketing: MarketingAgent
  
  private memory: Map<string, AIMessage[]> = new Map()
  private context: Map<string, ConversationContext> = new Map()

  constructor() {
    // Initialize all agents
    this.sales = new SalesAgent()
    this.support = new SupportAgent()
    this.finance = new FinanceAgent()
    this.operations = new OperationsAgent()
    this.marketing = new MarketingAgent()
    
    console.log('[EcleanAI] 🤖 All 5 agents initialized')
  }

  /**
   * Main entry point for all AI requests
   */
  async process(input: string, ctx: ConversationContext): Promise<{
    response: string
    agent: string
    action?: string
  }> {
    // Store context
    this.context.set(ctx.sessionId, ctx)
    
    // Get conversation history
    const history = this.memory.get(ctx.sessionId) || []
    history.push({ role: 'user', content: input, timestamp: new Date() })
    
    // Route to appropriate agent
    const intent = await this.classifyIntent(input, history)
    
    let response: string
    let agent: string
    
    switch (intent) {
      case 'purchase':
      case 'product_info':
      case 'pricing':
      case 'recommendation':
        agent = 'sales'
        response = await this.sales.process(input, ctx, history)
        break
        
      case 'support':
      case 'refund':
      case 'complaint':
      case 'order_issue':
        agent = 'support'
        response = await this.support.process(input, ctx, history)
        break
        
      case 'invoice':
      case 'payment':
      case 'refund_request':
        agent = 'finance'
        response = await this.finance.process(input, ctx, history)
        break
        
      case 'shipping':
      case 'tracking':
      case 'stock':
        agent = 'operations'
        response = await this.operations.process(input, ctx, history)
        break
        
      case 'marketing':
      case 'promotion':
      case 'newsletter':
      case 'loyalty':
        agent = 'marketing'
        response = await this.marketing.process(input, ctx, history)
        break
        
      case 'general':
      default:
        agent = 'assistant'
        response = await this.generalAssistant(input, ctx, history)
    }
    
    // Store response
    history.push({ role: 'assistant', content: response, timestamp: new Date(), agent })
    this.memory.set(ctx.sessionId, history.slice(-20)) // Keep last 20 messages
    
    return { response, agent, action: intent }
  }

  /**
   * Classify user intent using AI
   */
  private async classifyIntent(input: string, history: AIMessage[]): Promise<string> {
    const lower = input.toLowerCase()
    
    // Quick keyword matching
    if (lower.match(/achet|commande|produit|prix|recommande|catalogue|panier/i)) return 'purchase'
    if (lower.match(/support|aide|problème|retour|rembours|commande|suivi/i)) return 'support'
    if (lower.match(/facture|paiement|refund|rembours|virment|i(/i)) return 'finance'
    if (lower.match(/livraison|stock|expédition|suivi| Tracking/i)) return 'shipping'
    if (lower.match(/promo|newsletter|offre|programme|fidél/i)) return 'marketing'
    if (lower.match(/qui|que|qu'est|cb|fournisseur|e-clean|contact/i)) return 'general'
    
    // Use last message context if unclear
    if (history.length > 0) {
      const lastAgent = history[history.length - 1].agent
      if (lastAgent) return lastAgent
    }
    
    return 'general'
  }

  /**
   * General purpose assistant
   */
  private async generalAssistant(input: string, ctx: ConversationContext, history: AIMessage[]): Promise<string> {
    const lower = input.toLowerCase()
    
    // Company info
    if (lower.match(/qui|entreprise|e-clean/i)) {
      return `E-Clean est une plateforme e-commerce professionnelle spécialisée dans les produits de nettoyage et d'hygiène pour particuliers et entreprises. Fondée parELECTRON Group, nous offrent des produits质量和des services exceptionnels..Comment puis-je vous aider?`
    }
    
    // Help
    if (lower.match(/aide|help|menu/i)) {
      return `Je peux vous aider pour:\n🏠 Nos produits etcatalogue\n🛒 Passer unecommande\n💳 Questions depaiement\n📦 Suivre unecommande\n📞 Contacter le support\n💬 Questions générales\n\nQue recherchez-vous?`
    }
    
    // Default smart response
    return `Je suis là pour vous aider! Vous pouvez me demander des informations sur nos produits, passer une commande, suivre une livraison, oucontacter le support.N'hésitez pas à meposer votre question!`
  }

  /**
   * Process webhook events from external systems
   */
  async handleWebhook(event: {
    type: string
    data: Record<string, any>
  }): Promise<void> {
    switch (event.type) {
      case 'order.created':
        await this.operations.triggerOrderFlow(event.data)
        break
        
      case 'order.delivered':
        await this.marketing.triggerReviewRequest(event.data)
        break
        
      case 'cart.abandoned':
        await this.marketing.triggerCartRecovery(event.data)
        break
        
      case 'user.registered':
        await this.marketing.triggerWelcome(event.data)
        break
        
      case 'refund.requested':
        await this.finance.processRefund(event.data)
        break
        
      case 'stock.low':
        await this.operations.alertLowStock(event.data)
        break
        
      case 'payment.failed':
        await this.support.notifyPaymentFailed(event.data)
        break
    }
  }

  /**
   * Get analytics from all agents
   */
  async getAnalytics(): Promise<{
    sales: any
    support: any
    operations: any
    marketing: any
  }> {
    return {
      sales: await this.sales.getStats(),
      support: await this.support.getStats(),
      operations: await this.operations.getStats(),
      marketing: await this.marketing.getStats()
    }
  }

  /**
   * Clear session memory
   */
  clearSession(sessionId: string): void {
    this.memory.delete(sessionId)
    this.context.delete(sessionId)
  }

  /**
   * Get session history
   */
  getHistory(sessionId: string): AIMessage[] {
    return this.memory.get(sessionId) || []
  }
}

// Singleton instance
export const ecleanAI = new EcleanAI()

export default EcleanAI