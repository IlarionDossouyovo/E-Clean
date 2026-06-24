'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  const handleCatalog = () => router.push('/catalog')
  const handleAbout = () => router.push('/about')
  const handleCart = () => router.push('/cart')
  const handleCheckout = () => router.push('/checkout')
  const handleLogin = () => router.push('/login')
  const goBack = () => router.back()

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec navigation complète */}
      <header className="bg-blue-900 text-white py-4 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="text-blue-200 hover:text-white" title="Retour">←</button>
            <Link href="/" className="text-xl font-bold hover:text-blue-200">E-Clean</Link>
          </div>
          <nav className="flex gap-4">
            <Link href="/catalog" className="hover:text-blue-200">Catalogue</Link>
            <Link href="/cart" className="hover:text-blue-200">Panier 🛒</Link>
            <Link href="/checkout" className="hover:text-blue-200">Commander</Link>
            <Link href="/about" className="hover:text-blue-200">À propos</Link>
            <Link href="/admin/dashboard" className="hover:text-blue-200 text-yellow-300">⚙️ Admin</Link>
            <Link href="/login" className="hover:text-blue-200">Connexion</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 sm:text-5xl md:text-6xl">
            E-Clean
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Solutions de nettoyage haut de gamme pour la vie moderne
          </p>
          <p className="mt-2 text-lg text-blue-700 font-medium">
            Membre du groupe ELECTRON
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleCatalog}
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 cursor-pointer"
            >
              Achetez maintenant
            </button>
            <button
              onClick={handleAbout}
              className="border border-blue-900 text-blue-900 px-8 py-3 rounded-lg font-medium hover:bg-blue-900 hover:text-white cursor-pointer"
            >
              Apprendre encore plus
            </button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <button onClick={handleCatalog} className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 cursor-pointer">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="text-lg font-semibold text-blue-900">E-Commerce</h3>
            <p className="text-gray-600 mt-2">Catalogue & Panier →</p>
          </button>
          
          <button onClick={handleCheckout} className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 cursor-pointer">
            <div className="text-3xl mb-2">💳</div>
            <h3 className="text-lg font-semibold text-blue-900">Paiements</h3>
            <p className="text-gray-600 mt-2">Stripe, PayPal →</p>
          </button>
          
          <button onClick={() => router.push('/order-tracking')} className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 cursor-pointer">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold text-blue-900">Logistique</h3>
            <p className="text-gray-600 mt-2">Suivi commandes →</p>
          </button>
          
          <button onClick={() => router.push('/admin/dashboard')} className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 cursor-pointer">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-lg font-semibold text-blue-900">Agents IA</h3>
            <p className="text-gray-600 mt-2">Dashboard IA →</p>
          </button>
        </div>
      </main>
      
      <footer className="bg-blue-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">E-Clean</h3>
              <p className="text-blue-300 text-sm">Solutions de nettoyage haut de gamme</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Boutique</h4>
              <button onClick={handleCatalog} className="text-blue-300 text-sm block hover:text-white">Catalogue</button>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <button onClick={handleAbout} className="text-blue-300 text-sm block hover:text-white">À propos</button>
              <Link href="/contact" className="text-blue-300 text-sm block hover:text-white">Contact</Link>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <Link href="/privacy" className="text-blue-300 text-sm block hover:text-white">Confidentialité</Link>
              <Link href="/terms" className="text-blue-300 text-sm block hover:text-white">Conditions</Link>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-400 text-sm">
            © 2026 E-Clean - ELECTRON Group
          </div>
        </div>
      </footer>
    </div>
  )
}