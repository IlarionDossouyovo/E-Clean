'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BLOG_CATEGORIES, BLOG_ARTICLES, getArticleBySlug, getArticlesByCategory } from '@/lib/blog'
import Navigation, { Footer, Breadcrumb } from '@/components/Navigation'

export default function BlogArticlePage() {
  const params = useParams()
  const categorySlug = params.category as string
  const articleSlug = params.slug as string
  
  const category = BLOG_CATEGORIES.find(c => c.slug === categorySlug)
  const article = getArticleBySlug(categorySlug, articleSlug)
  const relatedArticles = article 
    ? getArticlesByCategory(article.category).filter(a => a.id !== article.id).slice(0, 3)
    : []

  if (!article || !category) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Article non trouvé</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Retour au blog
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{trimmed.replace('## ', '')}</h2>
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-semibold mt-6 mb-3">{trimmed.replace('### ', '')}</h3>
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
        return <li key={i} className="ml-4 mb-2">{trimmed.replace(/^[0-9]+\. /, '').replace('- ', '')}</li>
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={i} className="font-bold mb-2">{trimmed.replace(/\*\*/g, '')}</p>
      }
      if (trimmed.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{trimmed.replace('# ', '')}</h1>
      }
      if (trimmed === '') {
        return <br key={i} />
      }
      return <p key={i} className="mb-4 text-gray-700 leading-relaxed">{trimmed}</p>
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { name: 'Blog', href: '/blog' },
          { name: category.name, href: `/blog/${category.slug}` },
          { name: article.title }
        ]} />

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link 
                href={`/blog/${category.slug}`}
                className="flex items-center gap-1 hover:text-blue-600"
                style={{ color: category.color }}
              >
                {category.icon} {category.name}
              </Link>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.author}</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-xl text-gray-600">{article.excerpt}</p>
          </header>

          {/* Featured Image */}
          <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center text-6xl mb-8">
            📄
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map(tag => (
              <Link 
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            {renderContent(article.content)}
          </div>

          {/* Share */}
          <div className="border-t mt-12 pt-8">
            <p className="font-semibold mb-4">Partager cet article:</p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Facebook
              </button>
              <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                Twitter
              </button>
              <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                LinkedIn
              </button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Articles Similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link 
                  key={related.id}
                  href={`/blog/${related.category}/${related.slug}`}
                  className="border rounded-xl p-4 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-2">{related.title}</h3>
                  <p className="text-sm text-gray-600">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Category */}
        <div className="mt-12 text-center">
          <Link 
            href={`/blog/${category.slug}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            ← Retour à {category.name}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
