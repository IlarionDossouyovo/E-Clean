'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, ChevronDown, Star } from 'lucide-react'

// Catégories avec sous-catégories
const categories = [
  {
    id: 'nettoyants',
    name: 'Nettoyants',
    icon: '🧽',
    subcategories: ['Multi-surfaces', 'Vitres', 'Sols', 'Salle de bain', 'Cuisine', 'Lave-vaisselle']
  },
  {
    id: 'hygiene',
    name: 'Hygiène',
    icon: '🧴',
    subcategories: ['Gel hydroalcoolique', 'Savon', 'Désinfectants', 'Lingettes']
  },
  {
    id: 'accessoires',
    name: 'Accessoires',
    icon: '🧤',
    subcategories: ['Éponges', 'Balais', 'Seaux', 'Sac poubelle', 'Gants']
  },
  {
    id: 'protection',
    name: 'Protection',
    icon: '🛡️',
    subcategories: ['Gants latex', 'Masques', 'Tabliers', 'Lunettes']
  },
  {
    id: 'equipments',
    name: 'Équipements',
    icon: '🔧',
    subcategories: ['Aspirateurs', 'Nettoyeurs vapeurs', 'Monobrosses']
  },
]

export default function CatalogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'))
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchProducts() }, [])

  // Produits de démonstration
  const demoProducts = [
    { id: '1', name: 'Nettoyant Multi-Surfaces', price: 12.90, summary: 'Nettoyant écologique pour toutes surfaces', category: 'nettoyants', subcategory: 'Multi-surfaces', rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1585421514284-efb6c2f11eda?w=400' }] },
    { id: '2', name: 'Désinfectant Gel 500ml', price: 8.50, summary: 'Gel hydroalcoolique 70°', category: 'hygiene', subcategory: 'Gel hydroalcoolique', rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400' }] },
    { id: '3', name: 'Éponge Magique', price: 5.90, summary: 'Eponge nettoyante réutilisable', category: 'accessoires', subcategory: 'Éponges', rating: 4.2, images: [{ url: 'https://images.unsplash.com/photo-1585671969322-f732d5dfb3f2?w=400' }] },
    { id: '4', name: 'Gants Latex XL (100)', price: 15.90, summary: 'Boîte de 100 gants', category: 'protection', subcategory: 'Gants latex', rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1584827642868-86fcb6e6f83c?w=400' }] },
    { id: '5', name: 'Sac Poubelle 30L', price: 9.90, summary: 'Rouleau de 30 sacs', category: 'accessoires', subcategory: 'Sac poubelle', rating: 4.4, images: [{ url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400' }] },
    { id: '6', name: 'Liquide Vaisselle', price: 11.90, summary: 'Lave-vaisselle 1L', category: 'nettoyants', subcategory: 'Lave-vaisselle', rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400' }] },
    { id: '7', name: 'Nettoyant Vitres', price: 6.90, summary: 'Spray vitres antibuée', category: 'nettoyants', subcategory: 'Vitres', rating: 4.3, images: [{ url: 'https://images.unsplash.com/photo-1584622650116-71778f69d468?w=400' }] },
    { id: '8', name: 'Aspirateur Sans Sac', price: 89.90, summary: 'Aspirateur cyclonique 2000W', category: 'equipments', subcategory: 'Aspirateurs', rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1558317374-067fb5f35020?w=400' }] },
  ]

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setProducts(data || [])
    } catch (error) {
      setProducts(demoProducts)
    } finally {
      setLoading(false)
    }
  }

  const allProducts = products.length > 0 ? products : demoProducts
  
  const filteredProducts = allProducts.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.summary?.toLowerCase().includes(search.toLowerCase())
    // Handle both API data (object) and demo data (string)
    const productCategoryId = typeof p.category === 'object' ? p.category?.slug : p.category
    const matchCategory = !selectedCategory || productCategoryId === selectedCategory
    const matchSubcategory = !selectedSubcategory || p.subcategory === selectedSubcategory
    return matchSearch && matchCategory && matchSubcategory
  })

  // Handle both API data (object) and demo data (string)
  const getCategoryName = (cat: any) => {
    if (!cat) return ''
    if (typeof cat === 'string') return categories.find(c => c.id === cat)?.name || cat
    return cat.name || ''
  }
  
  const getCategoryIcon = (cat: any) => {
    if (!cat) return ''
    if (typeof cat === 'string') return categories.find(c => c.id === cat)?.icon || ''
    return ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-primary">Catalogue</h1>
          <p className="text-gray-600 mt-2">Produits de nettoyage et hygiene premium</p>
        </div>

        {/* Catégories principales */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null) }}
              className={`px-4 py-2 rounded-full transition ${
                !selectedCategory ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Toutes
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory(null) }}
                className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
                  selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sous-catégories */}
        {selectedCategory && (
          <div className="mb-6 p-4 bg-white rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">
              {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.name} - Sous-catégories
            </h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  !selectedSubcategory ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Toutes
              </button>
              {categories.find(c => c.id === selectedCategory)?.subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedSubcategory === sub ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search et Filtres */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Filtres
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-lg">
            <h3 className="font-medium mb-3">Filtres avancés</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Prix min</label>
                <input type="number" placeholder="0€" className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Prix max</label>
                <input type="number" placeholder="100€" className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Note min</label>
                <select className="w-full px-3 py-2 border rounded">
                  <option value="">Toutes</option>
                  <option value="4">4★ et plus</option>
                  <option value="3">3★ et plus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Disponibilité</label>
                <select className="w-full px-3 py-2 border rounded">
                  <option value="">Toutes</option>
                  <option value="in_stock">En stock</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Pas d'image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-blue-600">
                    {getCategoryIcon(product.category)} {getCategoryName(product.category)}
                  </p>
                  <h3 className="font-semibold text-gray-900 mt-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.summary}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    {product.price?.toFixed(2) || '0.00'} €
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory(null); setSelectedSubcategory(null) }}
              className="text-blue-600 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>
    </div>
  )
}