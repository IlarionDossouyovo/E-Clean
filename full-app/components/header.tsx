'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/cart'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { getItemCount } = useCartStore()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = getItemCount()

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-secondary">E-Clean</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="hover:text-secondary transition">
              Catalog
            </Link>
            <Link href="/about" className="hover:text-secondary transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-secondary transition">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 hover:text-secondary transition">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative group">
                <button className="p-2 hover:text-secondary transition">
                  <User className="w-6 h-6" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-primary rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/account" className="block px-4 py-2 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-secondary text-primary px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            <Link href="/catalog" className="block py-2 hover:text-secondary">
              Catalog
            </Link>
            <Link href="/about" className="block py-2 hover:text-secondary">
              About
            </Link>
            <Link href="/contact" className="block py-2 hover:text-secondary">
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}