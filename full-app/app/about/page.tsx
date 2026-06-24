import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos - E-Clean',
  description: 'En savoir plus sur E-Clean - Votre plateforme e-commerce premium',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          À propos de E-Clean
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Notre Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              E-Clean est une plateforme e-commerce premium conçue pour offrir une expérience d'achat en ligne exceptionnelle. 
              Nous combinons technologie de pointe et service de qualité pour vous proposer 
              une solution de shopping moderne et sécurisée.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Nos Valeurs
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Qualité premium
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Sécurité des données
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Service client réactif
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Innovation continue
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Next.js 14', 'React', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind CSS', 'Stripe'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Contact
            </h2>
            <p className="text-gray-600">
              Pour toute question, contactez-nous à :{' '}
              <a href="mailto:contact@e-clean.com" className="text-blue-600 hover:underline">
                contact@e-clean.com
              </a>
            </p>
          </section>
        </div>

        <div className="text-center mt-8 text-gray-500">
          <p>© 2024 E-Clean. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}