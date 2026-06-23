import prisma from '@/lib/prisma'

type TriggerEvent = 
  | 'order.created'
  | 'order.paid'
  | 'order.shipped'
  | 'order.delivered'
  | 'user.registered'
  | 'cart.abandoned'
  | 'product.low_stock'
  | 'payment.refunded'

interface WorkflowStep {
  id: string
  name: string
  action: string
  delay?: number // seconds
  config?: Record<string, any>
}

interface Workflow {
  id: string
  name: string
  trigger: TriggerEvent
  steps: WorkflowStep[]
  isActive: boolean
}

class WorkflowEngine {
  private workflows: Map<TriggerEvent, Workflow[]> = new Map()
  
  constructor() {
    this.initializeDefaultWorkflows()
  }
  
  private initializeDefaultWorkflows() {
    const defaultWorkflows: Workflow[] = [
      // Order to Fulfillment Pipeline
      {
        id: 'order_fulfillment',
        name: 'Order to Fulfillment',
        trigger: 'order.paid',
        isActive: true,
        steps: [
          { id: '1', name: 'Verify Payment', action: 'payment.verify', delay: 5 },
          { id: '2', name: 'Check Stock', action: 'inventory.reserve', delay: 10 },
          { id: '3', name: 'Calculate Shipping', action: 'shipping.calculate', delay: 3 },
          { id: '4', name: 'Select Carrier', action: 'carrier.select', delay: 5 },
          { id: '5', name: 'Generate Label', action: 'label.generate', delay: 2 },
          { id: '6', name: 'Notify Customer', action: 'notification.send', delay: 0 },
        ],
      },
      
      // Customer Welcome Journey
      {
        id: 'customer_welcome',
        name: 'Welcome New Customer',
        trigger: 'user.registered',
        isActive: true,
        steps: [
          { id: '1', name: 'Send Welcome Email', action: 'email.send', delay: 0, config: { template: 'welcome' } },
          { id: '2', name: 'Profile Guide', action: 'email.send', delay: 3600, config: { template: 'profile_guide' } },
          { id: '3', name: 'First Discount', action: 'coupon.send', delay: 86400, config: { discount: 10 } },
          { id: '4', name: 'Product Recommendations', action: 'email.send', delay: 172800, config: { template: 'recommendations' } },
        ],
      },
      
      // Abandoned Cart Recovery
      {
        id: 'abandoned_cart',
        name: 'Cart Abandonment Recovery',
        trigger: 'cart.abandoned',
        isActive: true,
        steps: [
          { id: '1', name: 'Email Reminder', action: 'email.send', delay: 3600, config: { template: 'cart_reminder' } },
          { id: '2', name: 'SMS Notification', action: 'sms.send', delay: 14400, config: {} },
          { id: '3', name: 'Discount Offer', action: 'coupon.send', delay: 86400, config: { discount: 15, minAmount: 50 } },
          { id: '4', name: 'Final Reminder', action: 'email.send', delay: 172800, config: { template: 'final_reminder' } },
        ],
      },
      
      // Inventory Management
      {
        id: 'inventory_alert',
        name: 'Low Stock Alerts',
        trigger: 'product.low_stock',
        isActive: true,
        steps: [
          { id: '1', name: 'Check Stock Level', action: 'inventory.check', delay: 0 },
          { id: '2', name: 'Calculate Reorder', action: 'inventory.reorder', delay: 60 },
          { id: '3', name: 'Generate PO Draft', action: 'purchase_order.create', delay: 0 },
          { id: '4', name: 'Alert Admin', action: 'notification.send', delay: 0, config: { channel: 'admin' } },
        ],
      },
      
      // Refund Processing
      {
        id: 'refund_processing',
        name: 'Automated Refund Flow',
        trigger: 'payment.refunded',
        isActive: true,
        steps: [
          { id: '1', name: 'Validate Request', action: 'refund.validate', delay: 0 },
          { id: '2', name: 'Check Policy', action: 'refund.check_policy', delay: 0 },
          { id: '3', name: 'Analyze History', action: 'refund.analyze', delay: 0 },
          { id: '4', name: 'Fraud Check', action: 'fraud.check', delay: 0 },
          { id: '5', name: 'Process Refund', action: 'refund.process', delay: 0 },
          { id: '6', name: 'Send Return Label', action: 'label.create_return', delay: 0 },
          { id: '7', name: 'Update Inventory', action: 'inventory.update', delay: 0 },
        ],
      },
      
      // Review Generation
      {
        id: 'review_request',
        name: 'Post-Delivery Review Request',
        trigger: 'order.delivered',
        isActive: true,
        steps: [
          { id: '1', name: 'Wait Period', action: 'delay', delay: 604800 }, // 7 days
          { id: '2', name: 'Check Support Tickets', action: 'support.check', delay: 0 },
          { id: '3', name: 'Send Review Request', action: 'email.send', delay: 0, config: { template: 'review' } },
          { id: '4', name: 'Thank You', action: 'email.send', delay: 259200, config: { template: 'thank_you' } },
        ],
      },
    ]
    
    for (const workflow of defaultWorkflows) {
      const existing = this.workflows.get(workflow.trigger) || []
      existing.push(workflow)
      this.workflows.set(workflow.trigger, existing)
    }
  }
  
  async trigger(event: TriggerEvent, data: any) {
    const workflows = this.workflows.get(event) || []
    
    for (const workflow of workflows) {
      if (!workflow.isActive) continue
      
      console.log(`[Workflow] Triggering: ${workflow.name}`)
      
      for (const step of workflow.steps) {
        if (step.delay && step.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, step.delay! * 1000))
        }
        
        await this.executeStep(step, data)
      }
    }
  }
  
  private async executeStep(step: WorkflowStep, data: any) {
    console.log(`[Workflow] Executing step: ${step.name} (${step.action})`)
    
    switch (step.action) {
      case 'email.send':
        // Would integrate with SendGrid
        break
      case 'sms.send':
        // Would integrate with Twilio
        break
      case 'notification.send':
        // Would send push/email notification
        break
      case 'inventory.reserve':
        await this.reserveInventory(data)
        break
      case 'label.generate':
        await this.generateLabel(data)
        break
      default:
        console.log(`[Workflow] Unknown action: ${step.action}`)
    }
  }
  
  private async reserveInventory(data: any) {
    console.log('[Workflow] Reserving inventory for order:', data.orderId)
  }
  
  private async generateLabel(data: any) {
    console.log('[Workflow] Generating shipping label for order:', data.orderId)
  }
  
  getWorkflows(trigger?: TriggerEvent): Workflow[] {
    if (trigger) {
      return this.workflows.get(trigger) || []
    }
    
    const all: Workflow[] = []
    for (const workflows of this.workflows.values()) {
      all.push(...workflows)
    }
    return all
  }
}

export default new WorkflowEngine()