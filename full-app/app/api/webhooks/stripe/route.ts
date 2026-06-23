import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event
    try {
      event = await constructWebhookEvent(body, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        
        // Find order by session metadata
        if (session.payment_status === 'paid') {
          const orderNumber = session.metadata?.orderNumber
          if (orderNumber) {
            await prisma.order.update({
              where: { orderNumber },
              data: {
                status: 'PAID',
                paymentMethod: 'card',
                paymentReference: session.payment_intent,
              },
            })

            // Create payment record
            await prisma.payment.create({
              data: {
                orderId: session.metadata?.orderId,
                userId: session.metadata?.userId,
                amount: session.amount_total / 100,
                method: 'card',
                status: 'PAID',
                reference: session.payment_intent,
                provider: 'stripe',
                paidAt: new Date(),
              },
            })
          }
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any
        console.log('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}