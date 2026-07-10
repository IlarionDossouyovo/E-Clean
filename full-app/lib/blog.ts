/**
 * E-Clean Blog System
 * Blog categories, articles et personalization
 */

// Blog Categories
export const BLOG_CATEGORIES = [
  {
    id: 'actualites',
    name: 'Actualités',
    slug: 'actualites',
    description: 'Dernières nouvelles et annonces E-Clean',
    color: '#3B82F6',
    icon: '📰',
  },
  {
    id: 'conseils',
    name: 'Conseils',
    slug: 'conseils',
    description: 'Astuces et conseils pour le nettoyage',
    color: '#10B981',
    icon: '💡',
  },
  {
    id: 'tutoriels',
    name: 'Tutoriels',
    slug: 'tutoriels',
    description: 'Guides pas à pas pour un nettoyage efficace',
    color: '#8B5CF6',
    icon: '📚',
  },
  {
    id: 'ecologie',
    name: 'Ecologie',
    slug: 'ecologie',
    description: 'Produits écologiques et nettoyage durable',
    color: '#22C55E',
    icon: '🌍',
  },
  {
    id: 'promotions',
    name: 'Promotions',
    slug: 'promotions',
    description: 'Offres speciales et promotions',
    color: '#EF4444',
    icon: '🏷️',
  },
]

// Blog Articles - Personalized content for E-Clean
export const BLOG_ARTICLES = [
  // Actualites
  {
    id: '1',
    title: 'E-Clean lance sa nouvelle gamme de produits eco-responsables',
    slug: 'nouvelle-gamme-eco',
    category: 'actualites',
    excerpt: 'Decouvrez notre nouvelle collection de produits 100% naturels et biodegradables.',
    content: `
# Nouvelle Gamme Eco-Responsables

E-Clean a le plaisir d'annoncer le lancement de sa nouvelle gamme de produits nettoyants eco-responsables.

## Caracteristiques

- **100% naturel** : Ingredients d'origine vegetale
- **Biodegradable** : Se decompose en 28 jours
- **Sans perturbateurs endocriniens** : Formule safe pour toute la famille
- **Emballages recyclables** : Contribution a l'economie circulaire

## Engagement

En choisissant nos produits eco-responsables, vous contribuez a:
- Reduire votre empreinte carbone
- Preserver les ressources en eau
- Proteger la faune et la flore aquatique

Rendez-vous en magasin ou sur notre site pour decouvrir cette nouvelle gamme!
    `,
    author: 'Equipe E-Clean',
    date: '2026-01-15',
    image: '/blog/eco-clean.jpg',
    tags: ['ecologie', 'nouveau', 'naturel'],
    featured: true,
  },
  {
    id: '2',
    title: 'E-Clean opening: 5 nouveaux points de vente en France',
    slug: 'nouveaux-points-vente',
    category: 'actualites',
    excerpt: 'Decouvrez nos nouveaux magasins a Paris, Lyon, Marseille, Bordeaux et Lille.',
    content: `
# Expansion du Reseau E-Clean

Nous sommes heureux de vous annoncer l'ouverture de 5 nouveaux points de vente en France!

## Nouveaux Magasins

1. **Paris Centre** - 15 rue de la Paix
2. **Lyon Part-Dieu** - Centre Commercial Part-Dieu
3. **Marseille** - 45 rue Saint-Ferreol
4. **Bordeaux** - 30 cours de l'Intendance
5. **Lille** - 25 Place du General de Gaulle

Chaque magasin propose:
- Conseils personnalises
- Demonstrations de produits
- Points de retrait Click & Collect
    `,
    author: 'Equipe E-Clean',
    date: '2026-02-01',
    image: '/blog/store.jpg',
    tags: ['magasin', 'france', 'expansion'],
    featured: false,
  },

  // Conseils
  {
    id: '3',
    title: '10 conseils pour un nettoyage ecologique quotidien',
    slug: 'conseils-nettoyage-ecologique',
    category: 'conseils',
    excerpt: 'Adoptez des habitudes de nettoyage respeecieuses de lenvironnement au quotidien.',
    content: `
# 10 Conseils pour un Nettoyage Ecologique

## 1. Privilegiez les produits concentrés
Les produits concentres reduisent les transports et les emballage

## 2. Utilisez des chiffons reutilisables
Epongez les chiffons en microfibre au lieu de jetables

## 3. Fabriquez vos propres nettoyants
Vinaigre blanc + eau = nettoyant multi-usage!

## 4. Nettoyez regulierement
Un entretien regulier evite laccumulation et les produits agressifs

## 5. Choississez des produits certifies
Labels Eco, Ecocert, Nature & Progres

## 6. Protegez naturellement
Bicarbonate de soude pour absorber les odeurs

## 7. Aeriez votre interieur
Reduit les besoins de produits de traitement

## 8. Triez vos eaux usées
Ne versez pas de produits toxiques dans le lavabo

## 9. Optez pour le dosage juste
Trop de produit ne nettoy pas mieux

## 10. Preferiez le qualitatif
Moins de produits mais de meilleure qualite
    `,
    author: 'Marie Dupont',
    date: '2026-01-20',
    image: '/blog/tips.jpg',
    tags: ['ecologie', 'conseils', 'quotidien'],
    featured: true,
  },
  {
    id: '4',
    title: 'Comment eliminer les odeurs indesees de votre maison',
    slug: 'eliminer-odeurs',
    category: 'conseils',
    excerpt: 'Solutions naturelles pour une maison qui sent bon.',
    content: `
# Guide Anti-Odeurs

## Identifier la source
Avant de traiter, identifiez la cause:
- Probleme dhumidite
- Animaux domestiques
- Cuisine
- Tabac

## Solutions Naturelles

### Pour la cuisine
- Bol de vinaigre blanc
- Marc de cafe sec
- Citrons cuts

### Pour le salon
- Huiles essentielles (lavande, eucalyptus)
- Plantes depolutantes
- Baking soda

### Pour la salle de bain
- Ventilation
- Vinaigre blanc
- Bicarbonate
    `,
    author: 'Jean Martin',
    date: '2026-01-25',
    image: '/blog/odor.jpg',
    tags: ['odeurs', 'naturel', 'maison'],
    featured: false,
  },

  // Tutoriels
  {
    id: '5',
    title: 'Tuto: Nettoyer vitres parfaitement sans traces',
    slug: 'tuto-vitres-sans-traces',
    category: 'tutoriels',
    excerpt: 'La technique infaillible pour des vitres impeccables.',
    content: `
# Tutoriel: Vitres Parfaites

## Preparation
- Nettoyer le cadre des vitres
- Enlever la poussiere superficielle

## Produit ideal
- 1/3 vinaigre blanc
- 2/3 eau demineralisee
- Optionnel: 5 gouttes liquide vaisselle

## Etapes

### 1. Pulverisez
Vaporisez le melange sur la vitre

### 2. Frottez
Utilisez un chiffon microfibre ou journal

### 3. Essuyez
 الحركة horizontale ou verticale, toujours meme sens

### 4. Finissez
Passez un chiffon sec pour le brillant final

## Secret pro
Nettoyez vos vitres par temps couvert pour eviter le séchage trop rapide!
    `,
    author: 'Sophie Bernard',
    date: '2026-02-05',
    image: '/blog/windows.jpg',
    tags: ['tutoriel', 'vitre', 'astuce'],
    featured: true,
  },
  {
    id: '6',
    title: 'Guide: Entretien de vos appareils electromenagers',
    slug: 'guide-entretien-electromenager',
    category: 'tutoriels',
    excerpt: 'Prolongez la vie de vos appareils avec ces conseils.',
    content: `
# Guide Entretien Electromenager

## Refrigerateur
- Nettoyez les joints regulierement
- Degivrez au moins 2x/an
- Verifiez la temperature (4°C ideal)

## Lave-vaisselle
- Nettoyez le filtre chaque mois
- Lancez un lavage a vide avec vinaigre
- Verifiez les bras de pulverisation

## Lave-linge
- Laissez la porte ouverte entre utilisations
- Nettoyez le bac a lessive
- Lancez un lavage a 60°C vide mensuel

## Four
- Nettoyez les renversements immediatement
- Utilisez la fonction pyrolyse regulierement
    `,
    author: 'Pierre Durand',
    date: '2026-02-10',
    image: '/blog/appliances.jpg',
    tags: ['tutoriel', 'electromenager', 'entretien'],
    featured: false,
  },

  // Ecologie
  {
    id: '7',
    title: 'Pourquoi choisir des produits biodegradables?',
    slug: 'pourquoi-biodegradables',
    category: 'ecologie',
    excerpt: 'Impact environnemental et raisons de passer au vert.',
    content: `
# Biodegradables: Pourquoi Choisir?

## Impact environnemental

Les produits nettoyants classiques contiennent souvent:
- Perturbateurs endocriniens
- Phosphates
- Tensioactifs synthetiques
- Colorants artificiels

## Qu'est-ce que biodegradable?

Un produit est biodegradable quand:
- Il se decompose en 28 jours max
- Il ne laisse pas de residus toxiques
- Il ne pollue pas les eaux

## Engagement E-Clean

Tous nos produits ecologiques sont:
- Certifies biodegradables
- Testes sur la faune aquatique
- Emballes dans des materiaux recyclables
    `,
    author: 'Green Team',
    date: '2026-01-10',
    image: '/blog/biodegradable.jpg',
    tags: ['ecologie', 'environnement', 'bio'],
    featured: true,
  },
  {
    id: '8',
    title: 'Zero dechet: Le guide complet du nettoyage durable',
    slug: 'zero-dechet-nettoyage',
    category: 'ecologie',
    excerpt: 'Adoptez le zero dechet dans votre routine menagere.',
    content: `
# Guide Zero Dechet

## Les essentiels

### Produit unique
- Savon noir: sols, voiture, jardin
- Vinaigre blanc: detartrant, nettoyant
- Bicarbonate de soude: abrasif doux

### Accessoires durables
- Eponges naturelles
- Chiffons microfibre
- Gants de menage lavables

## Recettes maison

### Nettoyant universel
- 250ml vinaigre blanc
- 250ml eau
- 10 gouttes HE lavande

### Lessive maison
- 100g savon de Marseille
- 50g bicarbonate
- 50g cristaux de soude
    `,
    author: 'Green Team',
    date: '2026-01-30',
    image: '/blog/zero-waste.jpg',
    tags: ['zero dechet', 'durable', 'maison'],
    featured: false,
  },

  // Promotions
  {
    id: '9',
    title: 'Soldes d\'hiver: -30% sur toute la gamme ecologique',
    slug: 'soldes-hiver-30',
    category: 'promotions',
    excerpt: 'Profitez de nos offres speciales!',
    content: `
# Soldes d'Hiver -30%

## Periode
Du 15 Janvier au 28 Fevrier 2026

## Offres exceptionnelles

### Gamme Eco: -30%
Tous les produits certifies ecologiques

### Achat groupe: -15% supplementaire
A partir de 100€ dachat

### Nouveau client: -10%
Code: BIENVENUE10

## Cumulable?
Non, uniquement la meilleure offre applicable
    `,
    author: 'Service Commercial',
    date: '2026-01-15',
    image: '/blog/sales.jpg',
    tags: ['promotion', 'solde', 'offre'],
    featured: true,
  },
  {
    id: '10',
    title: 'Programme de fidelite: Cumulez des points',
    slug: 'programme-fidelite',
    category: 'promotions',
    excerpt: 'Decouvrez comment gagner des points et les echanger contre des produits.',
    content: `
# Programme de Fidelite E-Clean

## Comment gagner des points?

- 1€ depense = 1 point
- 10€ = 1 point bonus
- Avis produit = 5 points
- Parrainage = 50 points

## Comment utiliser vos points?

- 100 points = 5€ de reduction
- 200 points = produit gratuit
- 500 points = acces VIP

## Grade VIP

Accumulez plus de 1000 points/an pour devenir VIP:
- Acces anticipe aux soldes
- Conseils personnalises
- Cadeaux d'anniversaire
    `,
    author: 'Service Commercial',
    date: '2026-02-01',
    image: '/blog/loyalty.jpg',
    tags: ['fidelite', 'points', 'cadeaux'],
    featured: false,
  },
]

// Helper functions
export function getArticlesByCategory(categorySlug: string) {
  return BLOG_ARTICLES.filter(article => article.category === categorySlug)
}

export function getArticleBySlug(categorySlug: string, articleSlug: string) {
  return BLOG_ARTICLES.find(
    article => article.category === categorySlug && article.slug === articleSlug
  )
}

export function getFeaturedArticles() {
  return BLOG_ARTICLES.filter(article => article.featured)
}

export function getRecentArticles(limit: number = 5) {
  return [...BLOG_ARTICLES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function searchArticles(query: string) {
  const lowerQuery = query.toLowerCase()
  return BLOG_ARTICLES.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
