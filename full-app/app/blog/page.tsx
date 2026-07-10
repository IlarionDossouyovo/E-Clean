'use client'

import Link from 'next/link'
import { BLOG_CATEGORIES, BLOG_ARTICLES, getFeaturedArticles, getRecentArticles } from '@/lib/blog'
import Navigation, { Footer } from '@/components/Navigation'

export default function BlogPage() {
  const featured = getFeaturedArticles()
  const recent = getRecentArticles(5)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl p-12 mb-12">
          <h1 className="text-4xl font-bold mb-4">📰 Blog E-Clean</h1>
          <p className="text-xl">Conseils, tutoriels et actualites pour un nettoyage optimal</p>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {BLOG_CATEGORIES.map((cat) => (
              <Link 
                key={cat.id}
                href={`/blog/${cat.slug}`}
                className="p-4 rounded-xl border-2 hover:border-blue-500 transition text-center"
                style={{ borderColor: cat.color + '40' }}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm text-gray-500">{cat.description}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">⭐ Articles en Vedette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((article) => (
              <Link 
                key={article.id}
                href={`/blog/${article.category}/${article.slug}`}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center text-4xl">
                  📄
                </div>
                <div className="p-4">
                  <div className="text-sm text-blue-600 mb-2">
                    {BLOG_CATEGORIES.find(c => c.id === article.category)?.icon}{' '}
                    {BLOG_CATEGORIES.find(c => c.id === article.category)?.name}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm">{article.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Articles */}
        <section>
          <h2 className="text-2xl font-bold mb-6">🕐 Derniers Articles</h2>
          <div className="space-y-4">
            {recent.map((article) => (
              <Link 
                key={article.id}
                href={`/blog/${article.category}/${article.slug}`}
                className="flex gap-4 p-4 border rounded-xl hover:bg-gray-50 transition"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📄
                </div>
                <div>
                  <h3 className="font-semibold">{article.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                  <div className="flex gap-2 mt-2">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
