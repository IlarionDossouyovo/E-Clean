import prisma from '@/lib/prisma'

interface TicketCategory {
  type: 'ORDER' | 'PRODUCT' | 'PAYMENT' | 'SHIPPING' | 'REFUND' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

interface SentimentScore {
  score: number // -1 to 1
  label: 'positive' | 'neutral' | 'negative'
}

export class SupportAgent {
  async classifyTicket(message: string): Promise<TicketCategory> {
    const lower = message.toLowerCase()
    
    let type: TicketCategory['type'] = 'OTHER'
    let priority: TicketCategory['priority'] = 'MEDIUM'
    
    if (lower.includes('order') || lower.includes('commande')) {
      type = 'ORDER'
    } else if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('livraison')) {
      type = 'SHIPPING'
    } else if (lower.includes('refund') || lower.includes('remboursement')) {
      type = 'REFUND'
      priority = 'HIGH'
    } else if (lower.includes('payment') || lower.includes('paiement') || lower.includes('card')) {
      type = 'PAYMENT'
      priority = 'HIGH'
    } else if (lower.includes('product') || lower.includes('produit') || lower.includes('quality')) {
      type = 'PRODUCT'
    }
    
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('immediately')) {
      priority = 'URGENT'
    }
    
    return { type, priority }
  }
  
  async analyzeSentiment(message: string): Promise<SentimentScore> {
    const positiveWords = ['thank', 'great', 'excellent', 'love', 'perfect', 'amazing', 'merci', 'super']
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'angry', 'frustrated', 'horrible']
    
    const words = message.toLowerCase().split(/\W+/)
    
    let score = 0
    for (const word of words) {
      if (positiveWords.includes(word)) score += 0.2
      if (negativeWords.includes(word)) score -= 0.2
    }
    
    score = Math.max(-1, Math.min(1, score))
    
    let label: SentimentScore['label'] = 'neutral'
    if (score > 0.2) label = 'positive'
    if (score < -0.2) label = 'negative'
    
    return { score, label }
  }
  
  async findKnowledgeBase(query: string): Promise<any[]> {
    // Simple search in FAQ/knowledge base
    // In production, this would use vector search
    const articles = [
      { id: '1', title: 'How to track my order?', content: 'You can track your order using...' },
      { id: '2', title: 'Return policy', content: 'We offer 30-day returns...' },
      { id: '3', title: 'Payment methods', content: 'We accept Visa, PayPal...' },
    ]
    
    const queryLower = query.toLowerCase()
    return articles.filter(a => 
      a.title.toLowerCase().includes(queryLower) ||
      a.content.toLowerCase().includes(queryLower)
    )
  }
  
  async generateSolution(ticketId: string): Promise<string> {
    const solution = "Based on your inquiry, here's what we recommend..."
    return solution
  }
  
  async escalateToHuman(ticketId: string, reason: string): Promise<void> {
    console.log(`Escalating ticket ${ticketId} to human agent. Reason: ${reason}`)
    // Would integrate with ticketing system
  }
  
  async scheduleCallback(ticketId: string, preferredTime: Date): Promise<void> {
    console.log(`Scheduling callback for ticket ${ticketId} at ${preferredTime}`)
  }
  
  async detectFrustration(userId: string): Promise<boolean> {
    // Check for patterns indicating frustration
    const recentTickets = await prisma.productReview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    
    return recentTickets.length >= 3
  }
}

export default new SupportAgent()