'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CatalogPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchProducts() }, [])

  // Produits de démonstration si l'API échoue
  const demoProducts = [
    { id: '1', name: 'Nettoyant Multi-Surfaces', price: 12.90, summary: 'Nettoyant écologique pour toutes surfaces', category: { name: 'Nettoyants' } },
    { id: '2', name: 'Désinfectant Main', price: 8.50, summary: 'Gel hydroalcoolique 500ml', category: { name: 'Hygiène' } },
    { id: '3', name: 'Eponge Magique', price: 5.90, summary: 'Eponge nettoyante réutilisable', category: { name: 'Accessoires' } },
    { id: '4', name: 'Gants Latex XL', price: 15.90, summary: 'Boîte de 100 gants', category: { name: 'Protection' } },
    { id: '5', name: 'Sac Poubelle', price: 9.90, summary: 'Rouleau de 30 sacs', category: { name: 'Accessoires' } },
    { id: '6', name: 'Liquide Vaissel', price: 11.90, summary: 'Liquide lave-vaisselle 1L', category: { name: 'Nettoyants' } },
  ]

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setProducts(data || [])
    } catch (error) {
      // Utiliser les produits démo si l'API échoue
      console.log('Using demo products')
      setProducts(demoProducts)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.length > 0 
    ? products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
    : demoProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header inline */}
      <header className="bg-blue-900 text-white py-4 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-blue-200 hover:text-white">←</button>
            <Link href="/" className="text-xl font-bold hover:text-blue-200">E-Clean</Link>
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-blue-200">Accueil</Link>
            <Link href="/cart" className="hover:text-blue-200">Panier 🛒</Link>
            <Link href="/checkout" className="hover:text-blue-200">Commander</Link>
            <Link href="/login" className="hover:text-blue-200">Connexion</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Catalog</h1>
          <p className="text-gray-600 mt-2">Browse our premium cleaning products</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-secondary">{product.category.name}</p>
                  <h3 className="font-semibold text-primary mt-1">{product.name}</h3>
                  <p className="text-lg font-bold text-primary mt-2">
                    €{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </main>
    </div>
  )
}