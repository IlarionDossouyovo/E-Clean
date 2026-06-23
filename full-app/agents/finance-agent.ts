import prisma from '@/lib/prisma'

interface FraudScore {
  score: number // 0-100
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  flags: string[]
}

interface MarginReport {
  productId: string
  cost: number
  price: number
  margin: number
  marginPercent: number
}

interface TaxReport {
  subtotal: number
  taxAmount: number
  taxRate: number
  total: number
}

export class FinanceAgent {
  async invoiceGeneration(orderId: string): Promise<any> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    })
    
    if (!order) return null
    
    return {
      orderNumber: order.orderNumber,
      customer: order.user?.email,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.taxAmount,
      shipping: order.shippingCost,
      total: order.total,
      date: order.createdAt,
    }
  }
  
  async autoReconciliation(payments: any[]): Promise<any> {
    // Auto-match payments with orders
    const reconciled = []
    
    for (const payment of payments) {
      if (payment.status === 'PAID') {
        reconciled.push({
          paymentId: payment.id,
          orderId: payment.orderId,
          status: 'matched',
        })
      }
    }
    
    return { reconciled, unmatched: [] }
  }
  
  async fraudDetection(transaction: any): Promise<FraudScore> {
    let score = 0
    const flags: string[] = []
    
    // Check for suspicious patterns
    if (transaction.amount > 1000) {
      score += 30
      flags.push('High amount transaction')
    }
    
    if (transaction.amount > 500 && transaction.velocity === 'high') {
      score += 40
      flags.push('High velocity + high amount')
    }
    
    // IP reputation check would go here
    // Device fingerprinting would go here
    
    let risk: FraudScore['risk'] = 'LOW'
    if (score >= 60) risk = 'HIGH'
    else if (score >= 30) risk = 'MEDIUM'
    
    return { score, risk, flags }
  }
  
  async cashflowForecast(days: number): Promise<any> {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
    })
    
    const revenue = orders.reduce((sum, o) => sum + o.total, 0)
    const avgDaily = revenue / days
    
    return {
      periodDays: days,
      totalRevenue: revenue,
      avgDaily,
      forecast30: avgDaily * 30,
      forecast60: avgDaily * 60,
      forecast90: avgDaily * 90,
    }
  }
  
  async expenseCategorization(expenses: any[]): Promise<any> {
    // Auto-categorize expenses
    const categorized = expenses.map(e => ({
      ...e,
      category: 'OPERATIONAL', // Default
    }))
    
    return categorized
  }
  
  async marginAnalysis(productId: string): Promise<MarginReport | null> {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    
    if (!product || !product.cost) return null
    
    const margin = product.price - product.cost
    const marginPercent = (margin / product.price) * 100
    
    return {
      productId,
      cost: product.cost,
      price: product.price,
      margin,
      marginPercent,
    }
  }
  
  async taxCalculation(orderId: string): Promise<TaxReport | null> {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    
    if (!order) return null
    
    return {
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      taxRate: order.taxAmount / order.subtotal * 100,
      total: order.total,
    }
  }
  
  async refundApproval(refundId: string): Promise<any> {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { payment: true },
    })
    
    if (!refund) return { approved: false, reason: 'Refund not found' }
    
    // Auto-approve for small refunds
    if (refund.amount < 50) {
      return { approved: true, reason: 'Auto-approved under threshold' }
    }
    
    // Would integrate with fraud detection
    return { approved: false, reason: 'Requires manual review' }
  }
}

export default new FinanceAgent()