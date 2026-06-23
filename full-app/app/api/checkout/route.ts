import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddressId, billingAddressId } = body

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const shippingCost = 0 // Free shipping
    const taxRate = 0.2
    const taxAmount = subtotal * taxRate
    const total = subtotal + shippingCost + taxAmount

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `EC-${Date.now()}`,
        userId: (session.user as any).id,
        status: 'PENDING',
        currency: 'EUR',
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount: 0,
        total,
        shippingAddressId,
        billingAddressId,
      },
    })

    // Create order items
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
          taxRate: 20,
          taxAmount: item.price * item.quantity * 0.2,
          total: item.price * item.quantity * 1.2,
        },
      })
    }

    // Create Stripe checkout session
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const checkoutSession = await createCheckoutSession(
      items,
      `${baseUrl}/order-confirmation?orderId=${order.id}`,
      `${baseUrl}/cart`
    )

    return NextResponse.json({
      orderId: order.id,
      checkoutUrl: checkoutSession.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}