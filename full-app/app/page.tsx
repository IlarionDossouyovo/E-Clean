import Link from 'next/link'
import Header from '@/components/header'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
            E-Clean
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Premium Cleaning Solutions for Modern Living
          </p>
          <p className="mt-2 text-lg text-secondary font-medium">
            Part of ELECTRON Group
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/catalog"
              className="bg-secondary text-primary px-8 py-3 rounded-lg font-medium hover:bg-secondary/90"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="text-lg font-semibold text-primary">E-Commerce</h3>
            <p className="text-gray-600 mt-2">Complete catalog & cart system</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">💳</div>
            <h3 className="text-lg font-semibold text-primary">Payments</h3>
            <p className="text-gray-600 mt-2">Stripe, PayPal, Crypto</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold text-primary">Logistics</h3>
            <p className="text-gray-600 mt-2">Multi-carrier shipping</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-lg font-semibold text-primary">AI Agents</h3>
            <p className="text-gray-600 mt-2">5 intelligent agents</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-primary text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">E-Clean</h3>
              <p className="text-gray-300 text-sm">Premium Cleaning Solutions</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <Link href="/catalog" className="text-gray-300 text-sm block hover:text-white">Catalog</Link>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <Link href="/about" className="text-gray-300 text-sm block hover:text-white">About</Link>
              <Link href="/contact" className="text-gray-300 text-sm block hover:text-white">Contact</Link>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <Link href="/privacy" className="text-gray-300 text-sm block hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-gray-300 text-sm block hover:text-white">Terms</Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 E-Clean - ELECTRON Group
          </div>
        </div>
      </footer>
    </div>
  )
}