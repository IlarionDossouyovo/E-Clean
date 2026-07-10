'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Navigation data with all routes
export const NAVIGATION = {
  main: [
    { name: 'Accueil', href: '/', icon: '🏠' },
    { name: 'Catalogue', href: '/catalog', icon: '🛒' },
    { name: 'Panier', href: '/cart', icon: '🛒' },
    { name: 'Commander', href: '/checkout', icon: '💳' },
    { name: 'Suivi', href: '/order-tracking', icon: '📦' },
    { name: 'FAQ', href: '/faq', icon: '❓' },
    { name: 'Contact', href: '/contact', icon: '📧' },
    { name: 'À propos', href: '/about', icon: '📖' },
  ],
  
  categories: [
    { 
      name: 'Nettoyage Domestique', 
      slug: 'nettoyage-domestique',
      icon: '🏠',
      subcategories: [
        { name: 'Sol', slug: 'sol', description: 'Produits pour sols' },
        { name: 'Vitres', slug: 'vitres', description: 'Nettoyant vitres' },
        { name: 'Meubles', slug: 'meubles', description: 'Entretien meubles' },
        { name: 'Cuisine', slug: 'cuisine', description: 'Nettoyage cuisine' },
        { name: 'Salle de bain', slug: 'salle-de-bain', description: 'Hygiène salle de bain' },
      ]
    },
    { 
      name: 'Hygiène Personnelle', 
      slug: 'hygiene-personnelle',
      icon: '🧴',
      subcategories: [
        { name: 'Savons', slug: 'savons', description: 'Savons liquides' },
        { name: 'Shampooings', slug: 'shampooings', description: 'Shampooings' },
        { name: 'Dentifrices', slug: 'dentifrices', description: 'Hygiène dentaire' },
        { name: 'Déodorants', slug: 'deodorants', description: 'Protection corporelle' },
      ]
    },
    { 
      name: 'Équipements', 
      slug: 'equipements-nettoyage',
      icon: '🧹',
      subcategories: [
        { name: 'Aspirateurs', slug: 'aspirateurs', description: 'Aspirateurs' },
        { name: 'Serpillières', slug: 'serpilleres', description: 'Outils nettoyage' },
        { name: 'Gants', slug: 'gants', description: 'Protection mains' },
        { name: 'Seaux', slug: 'seaux', description: 'Matériel nettoyage' },
      ]
    },
    { 
      name: 'Écologiques', 
      slug: 'produits-ecologiques',
      icon: '🌿',
      subcategories: [
        { name: 'Bio', slug: 'bio', description: 'Produits biologiques' },
        { name: 'Recyclables', slug: 'recyclables', description: 'Emballages recyclables' },
        { name: 'Concentrés', slug: 'concentres', description: 'Produits concentrés' },
      ]
    },
    { 
      name: 'Buanderie', 
      slug: 'buanderie',
      icon: '👕',
      subcategories: [
        { name: 'Lessives', slug: 'lessives', description: 'Produits lessive' },
        { name: 'Adoucissants', slug: 'adoucissants', description: 'Adoucissants' },
        { name: 'Détachants', slug: 'detachants', description: 'Enlever tâches' },
      ]
    },
  ],

  blog: [
    { name: 'Actualités', href: '/blog', slug: 'actualites', icon: '📰' },
    { name: 'Conseils', href: '/blog/conseils', slug: 'conseils', icon: '💡' },
    { name: 'Tutoriels', href: '/blog/tutoriels', slug: 'tutoriels', icon: '📚' },
    { name: 'Ecologie', href: '/blog/ecologie', slug: 'ecologie', icon: '🌍' },
  ],

  account: [
    { name: 'Mon Compte', href: '/account', icon: '👤' },
    { name: 'Mes Commandes', href: '/account/orders', icon: '📦' },
    { name: 'Mes Favoris', href: '/account/wishlist', icon: '❤️' },
    { name: 'Adresses', href: '/account/addresses', icon: '📍' },
  ],

  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Produits', href: '/admin/products', icon: '📦' },
    { name: 'Commandes', href: '/admin/orders', icon: '🛒' },
    { name: 'Clients', href: '/admin/customers', icon: '👥' },
    { name: 'Stats', href: '/admin/stats', icon: '📈' },
  ],

  founder: [
    { name: 'Dashboard IA', href: '/founder', icon: '🤖' },
    { name: 'Agents', href: '/founder/agents', icon: '⚙️' },
    { name: 'Services', href: '/founder/services', icon: '🔌' },
    { name: 'Rapports', href: '/founder/reports', icon: '📋' },
  ],

  legal: [
    { name: 'CGV', href: '/cgv', icon: '📄' },
    { name: 'Confidentialité', href: '/privacy', icon: '🔒' },
    { name: 'Mentions légales', href: '/legal', icon: '⚖️' },
    { name: 'Retours', href: '/returns', icon: '↩️' },
  ],
}

// Main Navigation Component
export default function Navigation() {
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <header className="bg-blue-900 text-white py-4 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-2xl font-bold hover:text-blue-200">
            🧹 E-Clean
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/cart" className="hover:text-blue-200 flex items-center gap-1">
              🛒 Panier
            </Link>
            <Link href="/login" className="hover:text-blue-200">
              Connexion
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-wrap gap-2 text-sm">
          {NAVIGATION.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg hover:bg-blue-800 transition ${
                pathname === item.href ? 'bg-blue-800' : ''
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
          
          {/* Categories Dropdown */}
          <div className="relative">
            <button 
              className="px-3 py-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-1"
              onMouseEnter={() => setActiveMenu('categories')}
            >
              📂 Catégories
            </button>
            {activeMenu === 'categories' && (
              <div 
                className="absolute top-full left-0 mt-1 bg-white text-gray-800 rounded-lg shadow-xl p-4 min-w-64 z-50"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <div className="grid gap-2">
                  {NAVIGATION.categories.map((cat) => (
                    <div key={cat.slug} className="border-b pb-2 last:border-0">
                      <Link href={`/catalog/${cat.slug}`} className="font-semibold hover:text-blue-600 flex items-center gap-2">
                        {cat.icon} {cat.name}
                      </Link>
                      <div className="ml-6 mt-1 space-y-1">
                        {cat.subcategories.map((sub) => (
                          <Link 
                            key={sub.slug} 
                            href={`/catalog/${cat.slug}/${sub.slug}`}
                            className="block text-sm text-gray-600 hover:text-blue-600"
                          >
                            → {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blog Dropdown */}
          <div className="relative">
            <button 
              className="px-3 py-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-1"
              onMouseEnter={() => setActiveMenu('blog')}
            >
              📰 Blog
            </button>
            {activeMenu === 'blog' && (
              <div 
                className="absolute top-full left-0 mt-1 bg-white text-gray-800 rounded-lg shadow-xl p-4 min-w-48 z-50"
                onMouseLeave={() => setActiveMenu(null)}
              >
                {NAVIGATION.blog.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 hover:bg-blue-50 rounded-lg"
                  >
                    {item.icon} {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Account */}
          <Link href="/account" className="px-3 py-2 rounded-lg hover:bg-blue-800 transition">
            👤 Compte
          </Link>

          {/* Admin */}
          <Link href="/admin/dashboard" className="px-3 py-2 rounded-lg hover:bg-blue-800 transition text-yellow-300">
            ⚙️ Admin
          </Link>

          {/* Founder */}
          <Link href="/founder" className="px-3 py-2 rounded-lg hover:bg-blue-800 transition text-red-400">
            🤖 IA
          </Link>
        </nav>
      </div>
    </header>
  )
}

// Footer Component
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">E-Clean</h3>
            <p className="text-sm">Solutions de nettoyage haut de gamme pour la vie moderne.</p>
            <p className="text-sm mt-2 text-yellow-400">Membre du groupe ELECTRON</p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Boutique</h4>
            <ul className="space-y-2 text-sm">
              {NAVIGATION.categories.slice(0, 3).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/catalog/${cat.slug}`} className="hover:text-white">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/catalog" className="hover:text-white">Tout le catalogue</Link></li>
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h4 className="text-white font-semibold mb-4">Blog</h4>
            <ul className="space-y-2 text-sm">
              {NAVIGATION.blog.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.icon} {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white">📧 Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white">❓ FAQ</Link></li>
              <li><Link href="/order-tracking" className="hover:text-white">📦 Suivi commande</Link></li>
              <li><Link href="/returns" className="hover:text-white">↩️ Retours</Link></li>
              <li><Link href="/legal" className="hover:text-white">⚖️ Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>© 2026 E-Clean - ELECTRON Group. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

// Breadcrumb Component
export function Breadcrumb({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:text-blue-600">Accueil</Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600">{item.name}</Link>
          ) : (
            <span className="text-gray-800">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
