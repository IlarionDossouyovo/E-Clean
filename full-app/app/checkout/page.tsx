'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { useCartStore } from '@/lib/cart'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !session) {
      router.push('/login')
    }
  }, [mounted, session, router])

  if (!mounted || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    )
  }

  const subtotal = getTotal()
  const tax = subtotal * 0.2
  const total = subtotal + tax

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      if (data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      toast.error('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Shipping Address
              </h2>
              <div className="text-gray-600">
                <p>User: {session.user?.name}</p>
                <p>Email: {session.user?.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Configure your address in Account Settings
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Payment Method
              </h2>
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  Card
                </div>
                <span className="text-gray-600">Visa, Mastercard, Amex</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (20%)</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full bg-secondary text-primary py-3 rounded-lg font-medium mt-6 hover:bg-secondary/90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay with Stripe'}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Secured by Stripe
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}