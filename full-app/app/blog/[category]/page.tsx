'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BLOG_CATEGORIES, BLOG_ARTICLES, getArticlesByCategory } from '@/lib/blog'
import Navigation, { Footer, Breadcrumb } from '@/components/Navigation'

export default function BlogCategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  
  const category = BLOG_CATEGORIES.find(c => c.slug === categorySlug)
  const articles = getArticlesByCategory(categorySlug)

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Catégorie non trouvée</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Retour au blog
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { name: 'Blog', href: '/blog' },
          { name: category.name }
        ]} />

        {/* Category Header */}
        <section 
          className="rounded-2xl p-8 mb-8 text-white"
          style={{ backgroundColor: category.color }}
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-lg opacity-90">{category.description}</p>
            </div>
          </div>
        </section>

        {/* All Categories */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Toutes les catégories</h2>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <Link 
                key={cat.id}
                href={`/blog/${cat.slug}`}
                className={`px-4 py-2 rounded-full transition ${
                  cat.slug === categorySlug 
                    ? 'text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                style={cat.slug === categorySlug ? { backgroundColor: cat.color } : {}}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Articles */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link 
                key={article.id}
                href={`/blog/${article.category}/${article.slug}`}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gray-200 h-40 flex items-center justify-center text-4xl">
                  📄
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun article dans cette catégorie</p>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Retour au blog
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
