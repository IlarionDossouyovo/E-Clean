'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import { useCartStore } from '@/lib/cart'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const total = getTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link
              href="/catalog"
              className="inline-block bg-secondary text-primary px-6 py-2 rounded-lg font-medium hover:bg-secondary/90"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || ''}`}
                  className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">{item.name}</h3>
                    <p className="text-lg font-bold text-primary mt-1">
                      €{item.price.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          disabled={item.quantity <= 1}
                          className="p-1 border rounded disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="p-1 border rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-primary mb-4">Order Summary</h2>
                
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (20%)</span>
                    <span>€{(total * 0.2).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>Total</span>
                    <span>€{(total * 1.2).toFixed(2)}</span>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="block w-full bg-secondary text-primary text-center py-3 rounded-lg font-medium mt-6 hover:bg-secondary/90"
                >
                  Proceed to Checkout
                </Link>
                
                <button
                  onClick={clearCart}
                  className="block w-full text-red-500 text-center py-2 mt-2 hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}