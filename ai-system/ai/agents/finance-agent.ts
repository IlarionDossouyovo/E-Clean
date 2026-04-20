// 💰 E-CLEAN FINANCE AGENT
// AI-Powered Financial Management

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ============== TYPES ==============

export interface Invoice {
  id: string
  orderId: string
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  subtotal: number
  tax: number
  total: number
  currency: string
}

export interface FraudScore {
  score: number // 0-100
  level: 'low' | 'medium' | 'high' | 'critical'
  factors: string[]
  recommendation: 'approve' | 'review' | 'reject'
}

export interface CashflowReport {
  date: Date
  inflows: number
  outflows: number
  net: number
  projection: number[]
}

export interface MarginReport {
  productId: string
  revenue: number
  cost: number
  margin: number
  marginPercent: number
}

// ============== FINANCE AGENT CLASS ==============

export class FinanceAgent {
  // Auto-generate invoice on order
  async generateInvoice(orderId: string): Promise<Invoice> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: { include: { product: true } }
      }
    })

    if (!order) throw new Error('Order not found')

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        userId: order.userId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'draft'
      }
    })

    return invoice as Invoice
  }

  // Auto-check and reconcile payments
  async reconcilePayment(paymentId: string): Promise<{ reconciled: boolean; match?: string }> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    })

    if (!payment) return { reconciled: false, match: 'Payment not found' }

    if (payment.amount === payment.order.total &&
        payment.status === 'PAID') {
      return { reconciled: true }
    }

    return { reconciled: false, match: 'Amount mismatch' }
  }

  // AI Fraud Detection
  async fraudDetection(transaction: {
    userId: string
    amount: number
    paymentMethod: string
    shippingAddress?: string
    ipAddress?: string
  }): Promise<FraudScore> {
    const factors: string[] = []
    let riskScore = 0

    // Check user order history
    const userOrders = await prisma.order.count({ where: { userId: transaction.userId } })
    if (userOrders === 0) {
      riskScore += 20
      factors.push('Premier ordre client')
    }

    // Check amount vs average
    const avgOrderValue = await prisma.order.aggregate({
      where: { userId: transaction.userId },
      _avg: { total: true }
    })

    if (transaction.amount > (avgOrderValue._avg.total || 0) * 3) {
      riskScore += 25
      factors.push('Montant inhabituel (3x平均)')
    }

    // Check payment anomaly
    if (transaction.paymentMethod === 'card') {
      riskScore += 10
      factors.push('Paiement par carte')
    }

    // IP check (simplified)
    if (transaction.ipAddress?.startsWith('199.')) {
      riskScore += 15
      factors.push('IP suspecte')
    }

    // Determine level and recommendation
    let level: 'low' | 'medium' | 'high' | 'critical'
    let recommendation: 'approve' | 'review' | 'reject'

    if (riskScore >= 70) {
      level = 'critical'
      recommendation = 'reject'
    } else if (riskScore >= 40) {
      level = 'high'
      recommendation = 'review'
    } else if (riskScore >= 20) {
      level = 'medium'
      recommendation = 'review'
    } else {
      level = 'low'
      recommendation = 'approve'
    }

    return { score: riskScore, level, factors, recommendation }
  }

  // Cashflow Forecast
  async cashflowForecast(days: number): Promise<CashflowReport[]> {
    const reports: CashflowReport[] = []
    const today = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)

      // Get expected inflows
      const inflows = await prisma.order.aggregate({
        where: {
          status: { in: ['PAID', 'PROCESSING'] },
          createdAt: {
            gte: new Date(date.setDate(date.getDate() - 7)),
            lt: new Date(date.setDate(date.getDate() + 7))
          }
        },
        _sum: { total: true }
      })

      // Get expected outflows (simplified)
      const outflows = inflows._sum.total ? inflows._sum.total * 0.6 : 0

      reports.push({
        date: new Date(today.getTime() + i * 24 * 60 * 60 * 1000),
        inflows: inflows._sum.total || 0,
        outflows,
        net: (inflows._sum.total || 0) - outflows,
        projection: []
      })
    }

    return reports
  }

  // Expense Auto-Categorization
  async categorizeExpense(expense: {
    description: string
    amount: number
    date: Date
  }): Promise<{ category: string; confidence: number }> {
    const categories = [
      'marketing', 'operations', 'payroll', 'software', 
      'shipping', 'supplies', 'taxes', 'other'
    ]

    // Simple keyword-based categorization (would use ML in production)
    const keywords: Record<string, string[]> = {
      marketing: ['ads', 'facebook', 'google', 'campaign'],
      operations: ['warehouse', 'rent', 'utilities'],
      payroll: ['salary', 'wages', 'bonus'],
      software: ['aws', 'server', 'hosting', 'software'],
      shipping: ['dhl', 'ups', 'fedex', 'transport'],
      supplies: ['office', 'supplies', 'equipment']
    }

    let category = 'other'
    let maxMatch = 0

    for (const [cat, words] of Object.entries(keywords)) {
      const matches = words.filter(w => 
        expense.description.toLowerCase().includes(w)
      ).length
      
      if (matches > maxMatch) {
        maxMatch = matches
        category = cat
      }
    }

    return { category, confidence: maxMatch > 0 ? 0.8 : 0.3 }
  }

  // Product Margin Analysis
  async marginAnalysis(productId: string): Promise<MarginReport> {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    
    if (!product) throw new Error('Product not found')

    const revenue = product.price
    const cost = product.cost || product.price * 0.5
    const margin = revenue - cost
    const marginPercent = (margin / revenue) * 100

    return {
      productId,
      revenue,
      cost,
      margin,
      marginPercent
    }
  }

  // Tax Calculation (simplified for EU)
  async calculateTax(orderId: string): Promise<{
    subtotal: number
    taxRate: number
    taxAmount: number
    total: number
  }> {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    
    if (!order) throw new Error('Order not found')

    const taxRate = order.taxRate || 20
    const taxAmount = order.subtotal * (taxRate / 100)
    const total = order.subtotal + taxAmount

    return {
      subtotal: order.subtotal,
      taxRate,
      taxAmount,
      total
    }
  }

  // Auto-refund approval
  async refundApproval(refundId: string): Promise<{
    approved: boolean
    reason?: string
  }> {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { payment: { include: { order: true } }
    })

    if (!refund) throw new Error('Refund not found')

    // Check policy
    const orderAge = Date.now() - refund.payment.order.createdAt.getTime()
    const within30Days = orderAge < 30 * 24 * 60 * 60 * 1000

    if (refund.amount < 50 || within30Days) {
      return { approved: true }
    }

    // Check fraud score
    const fraudScore = await this.fraudDetection({
      userId: refund.payment.userId,
      amount: refund.amount,
      paymentMethod: refund.payment.method
    })

    if (fraudScore.recommendation === 'reject') {
      return { approved: false, reason: 'Fraud detected' }
    }

    return { approved: true }
  }

  // Daily Financial Summary
  async dailySummary(date: Date = new Date()): Promise<{
    revenue: number
    orders: number
    refunds: number
    topProducts: { name: string; revenue: number }[]
    avgOrderValue: number
  }> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PAID', 'DELIVERED'] }
      }
    })

    const revenue = orders.reduce((sum, o) => sum + o.total, 0)
    const refunds = await prisma.refund.findMany({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: 'COMPLETED'
      }
    })

    const refundsTotal = refunds.reduce((sum, r) => sum + r.amount, 0)

    // Top products (simplified)
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 5
    })

    return {
      revenue: revenue - refundsTotal,
      orders: orders.length,
      refunds: refunds.length,
      topProducts: topProducts.map(t => ({ 
        name: 'Product', // Would join with product name
        revenue: t._sum.total || 0 
      })),
      avgOrderValue: orders.length > 0 ? revenue / orders.length : 0
    }
  }
}

export default FinanceAgent