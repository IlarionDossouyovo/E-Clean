'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQ[] = [
    {
      question: 'Comment passer une commande ?',
      answer: 'Parcourez notre catalogue, ajoutez les produits à votre panier, puis validez votre commande lors du checkout.'
    },
    {
      question: 'Quels sont les délais de livraison ?',
      answer: 'Les livraisons prennent généralement 3-7 jours ouvrés en France métropolitaine.'
    },
    {
      question: 'Comment retourner un produit ?',
      answer: 'Contactez notre service client dans les 14 jours pour demander un retour.'
    },
    {
      question: 'Comment payer en plusieurs fois ?',
      answer: 'Nous acceptons le paiement en 3x sans frais par carte bancaire.'
    },
    {
      question: 'Où trouver le numéro de suivi ?',
      answer: 'Le numéro de suivi est envoyé par email après expedition, et disponible dans votre compte.'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white py-4 px-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">E-Clean</Link>
          <Link href="/" className="text-blue-200 hover:text-white">Accueil</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h1>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Vous ne trouvez pas votre réponse ?</p>
          <Link href="/contact" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Nous contacter
          </Link>
        </div>
      </main>
    </div>
  )
}