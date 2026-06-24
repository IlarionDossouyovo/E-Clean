// 🌐 API I18N - E-CLEAN
// Gestion des traductions par pays/langue

import { NextRequest, NextResponse } from 'next/server'

// Traductions par pays
const translations: Record<string, Record<string, string>> = {
  // 🇫🇷 France
  'fr': {
    // Navigation
    'nav.home': 'Accueil',
    'nav.catalog': 'Catalogue',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.cart': 'Panier',
    'nav.account': 'Mon compte',
    'nav.login': 'Connexion',
    'nav.register': 'Inscription',
    'nav.logout': 'Déconnexion',
    
    // Catalogue
    'catalog.title': 'Catalogue',
    'catalog.search': 'Rechercher un produit...',
    'catalog.filter': 'Filtres',
    'catalog.categories': 'Catégories',
    'catalog.all': 'Toutes',
    'catalog.noResults': 'Aucun produit trouvé',
    
    // Panier
    'cart.title': 'Mon panier',
    'cart.empty': 'Votre panier est vide',
    'cart.total': 'Total',
    'cart.checkout': 'Commander',
    'cart.continue': 'Continuer mes achats',
    
    // Checkout
    'checkout.title': 'Paiement',
    'checkout.shipping': 'Livraison',
    'checkout.payment': 'Paiement',
    'checkout.confirmation': 'Confirmation',
    'checkout.email': 'Email',
    'checkout.phone': 'Téléphone',
    'checkout.address': 'Adresse',
    
    // Account
    'account.title': 'Mon compte',
    'account.orders': 'Mes commandes',
    'account.addresses': 'Mes adresses',
    'account.settings': 'Paramètres',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.agents': 'Agents IA',
    'admin.workflows': 'Workflows',
    'admin.products': 'Produits',
    'admin.orders': 'Commandes',
    
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
  },
  
  // 🇬🇧 United Kingdom
  'en': {
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.account': 'My Account',
    'nav.login': 'Login',
    'nav.register': 'Sign Up',
    'nav.logout': 'Logout',
    
    'catalog.title': 'Catalog',
    'catalog.search': 'Search products...',
    'catalog.filter': 'Filters',
    'catalog.categories': 'Categories',
    'catalog.all': 'All',
    'catalog.noResults': 'No products found',
    
    'cart.title': 'My Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continue': 'Continue Shopping',
    
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping',
    'checkout.payment': 'Payment',
    'checkout.confirmation': 'Confirmation',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.address': 'Address',
    
    'account.title': 'My Account',
    'account.orders': 'My Orders',
    'account.addresses': 'My Addresses',
    'account.settings': 'Settings',
    
    'admin.dashboard': 'Dashboard',
    'admin.agents': 'AI Agents',
    'admin.workflows': 'Workflows',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  
  // 🇪🇸 Spain
  'es': {
    'nav.home': 'Inicio',
    'nav.catalog': 'Catálogo',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.cart': 'Carrito',
    'nav.account': 'Mi cuenta',
    'nav.login': 'Iniciar sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar sesión',
    
    'catalog.title': 'Catálogo',
    'catalog.search': 'Buscar productos...',
    'catalog.filter': 'Filtros',
    'catalog.categories': 'Categorías',
    'catalog.all': 'Todos',
    'catalog.noResults': 'No se encontraron productos',
    
    'cart.title': 'Mi carrito',
    'cart.empty': 'Tu carrito está vacío',
    'cart.total': 'Total',
    'cart.checkout': 'Finalizar compra',
    'cart.continue': 'Seguir comprando',
    
    'checkout.title': 'Pago',
    'checkout.shipping': 'Envío',
    'checkout.payment': 'Pago',
    'checkout.confirmation': 'Confirmación',
    'checkout.email': 'Correo',
    'checkout.phone': 'Teléfono',
    'checkout.address': 'Dirección',
    
    'account.title': 'Mi cuenta',
    'account.orders': 'Mis pedidos',
    'account.addresses': 'Mis direcciones',
    'account.settings': 'Configuración',
    
    'admin.dashboard': 'Panel',
    'admin.agents': 'Agentes IA',
    'admin.workflows': 'Flujos',
    'admin.products': 'Productos',
    'admin.orders': 'Pedidos',
    
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
  },
  
  // 🇩🇪 Germany
  'de': {
    'nav.home': 'Startseite',
    'nav.catalog': 'Katalog',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.cart': 'Warenkorb',
    'nav.account': 'Mein Konto',
    'nav.login': 'Anmelden',
    'nav.register': 'Registrieren',
    'nav.logout': 'Abmelden',
    
    'catalog.title': 'Katalog',
    'catalog.search': 'Produkte suchen...',
    'catalog.filter': 'Filter',
    'catalog.categories': 'Kategorien',
    'catalog.all': 'Alle',
    'catalog.noResults': 'Keine Produkte gefunden',
    
    'cart.title': 'Mein Warenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.total': 'Gesamt',
    'cart.checkout': 'Zur Kasse',
    'cart.continue': 'Weiter einkaufen',
    
    'checkout.title': 'Kasse',
    'checkout.shipping': 'Versand',
    'checkout.payment': 'Zahlung',
    'checkout.confirmation': 'Bestätigung',
    'checkout.email': 'E-Mail',
    'checkout.phone': 'Telefon',
    'checkout.address': 'Adresse',
    
    'account.title': 'Mein Konto',
    'account.orders': 'Meine Bestellungen',
    'account.addresses': 'Meine Adressen',
    'account.settings': 'Einstellungen',
    
    'admin.dashboard': 'Dashboard',
    'admin.agents': 'KI-Agenten',
    'admin.workflows': 'Workflows',
    'admin.products': 'Produkte',
    'admin.orders': 'Bestellungen',
    
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.view': 'Ansehen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
  },
  
  // 🇵🇹 Portugal
  'pt': {
    'nav.home': 'Início',
    'nav.catalog': 'Catálogo',
    'nav.about': 'Sobre',
    'nav.contact': 'Contacto',
    'nav.cart': 'Carrinho',
    'nav.account': 'Minha conta',
    'nav.login': 'Entrar',
    'nav.register': 'Registar',
    'nav.logout': 'Sair',
    
    'catalog.title': 'Catálogo',
    'catalog.search': 'Pesquisar produtos...',
    'catalog.filter': 'Filtros',
    'catalog.categories': 'Categorias',
    'catalog.all': 'Todos',
    'catalog.noResults': 'Nenhum produto encontrado',
    
    'cart.title': 'Meu carrinho',
    'cart.empty': 'O seu carrinho está vazio',
    'cart.total': 'Total',
    'cart.checkout': 'Finalizar compra',
    'cart.continue': 'Continuar compras',
    
    'checkout.title': 'Pagamento',
    'checkout.shipping': 'Entrega',
    'checkout.payment': 'Pagamento',
    'checkout.confirmation': 'Confirmação',
    'checkout.email': 'Email',
    'checkout.phone': 'Telefone',
    'checkout.address': 'Morada',
    
    'account.title': 'Minha conta',
    'account.orders': 'As minhas encomendas',
    'account.addresses': 'As minhas moradas',
    'account.settings': 'Configurações',
    
    'admin.dashboard': 'Painel',
    'admin.agents': 'Agentes IA',
    'admin.workflows': 'Fluxos',
    'admin.products': 'Produtos',
    'admin.orders': 'Encomendas',
    
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.delete': 'Apagar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.back': 'Voltar',
    'common.next': 'Seguinte',
    'common.loading': 'A carregar...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
  },
  
  // 🇧🇫 Benin
  'bj': {
    'nav.home': 'Akọ̀',
    'nav.catalog': 'Àkàlán',
    'nav.about': 'Nù su',
    'nav.contact': 'Fọ̀nọ́',
    'nav.cart': 'Àpótí',
    'nav.account': 'Akọ̀ntì mì',
    'nav.login': 'Kọ́tù',
    'nav.register': 'Fọ̀nà',
    'nav.logout': 'Kọ́ja',
    
    'catalog.title': 'Àkàlán',
    'catalog.search': 'Wlá nǔ gbo...',
    'catalog.filter': 'Fọ̀tọ́n',
    'catalog.categories': 'Ìwọ̀n',
    'catalog.all': 'Gbè',
    'catalog.noResults': 'Àlǔ kan wà',
    
    'cart.title': 'Àpótí',
    'cart.empty': 'Àpótí re ku',
    'cart.total': 'Lọ́kù',
    'cart.checkout': 'Dè fọ̀',
    'cart.continue': 'Tẹ̀le wá',
    
    'checkout.title': 'Fọ̀nà',
    'checkout.shipping': 'Túnwá',
    'checkout.payment': 'Fọ̀nà',
    'checkout.confirmation': 'Ìdájú',
    'checkout.email': 'Imeeli',
    'checkout.phone': 'Fọ̀n',
    'checkout.address': 'Adì',
    
    'account.title': 'Akọ̀ntì',
    'account.orders': 'Àmì',
    'account.addresses': 'Adì',
    'account.settings': 'Ìdọ̀',
    
    'admin.dashboard': 'Pánẹ́lì',
    'admin.agents': 'Ajanlá',
    'admin.workflows': 'Ìsinsin',
    'admin.products': 'Àlǔ',
    'admin.orders': 'Àmì',
    
    'common.save': 'Tọ́',
    'common.cancel': 'Kù',
    'common.confirm': 'Ìdájú',
    'common.delete': 'Kú',
    'common.edit': 'Pàtì',
    'common.view': 'Wò',
    'common.back': 'Padà',
    'common.next': 'Tẹ̀le',
    'common.loading': 'Ń sá...',
    'common.error': 'Àṣì',
    'common.success': 'Ọ̀run',
  },
  
  // 🇹🇬 Togo
  'tg': {
    'nav.home': 'Dom',
    'nav.catalog': 'Kɛla',
    'nav.about': 'Nyɔla',
    'nav.contact': 'Nuto',
    'nav.cart': 'Kɔkɔ',
    'nav.account': 'Nyamɛ',
    'nav.login': 'Kɛ ɖo',
    'nav.register': 'Kɛ mɔ',
    'nav.logout': 'Kɛ fua',
    
    'catalog.title': 'Kɛla',
    'catalog.search': 'Xlẽ anyi...',
    'catalog.filter': 'Nzɔkpo',
    'catalog.categories': 'Anyi',
    'catalog.all': 'Gbɛ',
    'catalog.noResults': 'Mɔ ɖe',
    
    'cart.title': 'Kɔkɔ',
    'cart.empty': 'Kɔkɔ li mɔ',
    'cart.total': 'Fɔ',
    'cart.checkout': 'Fɔna',
    'cart.continue': 'Tso ɖo',
    
    'checkout.title': 'Fɔna',
    'checkout.shipping': 'Kpla',
    'checkout.payment': 'Fɔna',
    'checkout.confirmation': 'Nu ɖo',
    'checkout.email': 'Email',
    'checkout.phone': 'Tel',
    'checkout.address': 'Ad',
    
    'account.title': 'Nyamɛ',
    'account.orders': 'Nyamɛ',
    'account.addresses': 'Ad',
    'account.settings': 'Nu ɖo',
    
    'admin.dashboard': 'Dashboard',
    'admin.agents': 'Agents',
    'admin.workflows': 'Workflows',
    'admin.products': 'Mɔ',
    'admin.orders': 'Nyamɛ',
    
    'common.save': 'Dena',
    'common.cancel': 'Kena',
    'common.confirm': 'Nu ɖo',
    'common.delete': 'Lena',
    'common.edit': 'Sena',
    'common.view': 'Wena',
    'common.back': 'Gbe',
    'common.next': 'Tso',
    'common.loading': 'Kpla...',
    'common.error': 'Azɔ',
    'common.success': 'Wo',
  },
  
  // 🇨🇮 Côte d'Ivoire
  'ci': {
    'nav.home': 'Ngbɛ',
    'nav.catalog': 'Katalog',
    'nav.about': 'N\'gbo',
    'nav.contact': 'Sɛ',
    'nav.cart': 'Kan',
    'nav.account': 'Kɔnɛ mɔ',
    'nav.login': 'Sɔndɔ',
    'nav.register': 'Krɛ',
    'nav.logout': 'Flɛ',
    
    'catalog.title': 'Katalog',
    'catalog.search': 'Sɔn li...',
    'catalog.filter': 'Flitr',
    'catalog.categories': 'Katɛgori',
    'catalog.all': 'Dji',
    'catalog.noResults': 'Ablɔ kan',
    
    'cart.title': 'Kan',
    'cart.empty': 'Kan tɔ̂',
    'cart.total': 'Kɔn',
    'cart.checkout': 'Sɔ',
    'cart.continue': 'Ko n\'gɛ',
    
    'checkout.title': 'Sɔ',
    'checkout.shipping': 'Bu',
    'checkout.payment': 'Sɔ',
    'checkout.confirmation': 'Kɩn',
    'checkout.email': 'Email',
    'checkout.phone': 'Tel',
    'checkout.address': 'Adrɛs',
    
    'account.title': 'Kɔnɛ',
    'account.orders': 'Kwakɛ',
    'account.addresses': 'Adrɛs',
    'account.settings': 'Lɛn',
    
    'admin.dashboard': 'Tabwɛ',
    'admin.agents': 'Ajan',
    'admin.workflows': 'Flɔ',
    'admin.products': 'Li',
    'admin.orders': 'Kwakɛ',
    
    'common.save': 'Sɔndɔ',
    'common.cancel': 'Kan',
    'common.confirm': 'Kɩn',
    'common.delete': 'Flɛ',
    'common.edit': 'Sɔ',
    'common.view': 'Kul',
    'common.back': 'Bu',
    'common.next': 'Ko',
    'common.loading': 'Ko n\'gɛ...',
    'common.error': 'Zɩ',
    'common.success': 'Kɔn',
  },
  
  // 🇸🇳 Senegal
  'sn': {
    'nav.home': 'Kër',
    'nav.catalog': 'Katalóg',
    'nav.about': 'Nguur',
    'nav.contact': 'SELL',
    'nav.cart': 'Khar',
    'nav.account': 'Xayma',
    'nav.login': 'Ndap',
    'nav.register': 'Mäpp',
    'nav.logout': 'Yitti',
    
    'catalog.title': 'Katalóg',
    'catalog.search': 'Wutul...',
    'catalog.filter': 'Njël',
    'catalog.categories': 'Katégori',
    'catalog.all': 'Yeb',
    'catalog.noProducts': 'Luute',
    
    'cart.title': 'Khar',
    'cart.empty': 'Khar mbó',
    'cart.total': 'Ndah',
    'cart.checkout': 'Jot',
    'cart.continue': 'Yegg',
    
    'checkout.title': 'Jot',
    'checkout.shipping': 'Nepp',
    'checkout.payment': 'Jot',
    'checkout.confirmation': 'Nel',
    'checkout.email': 'Email',
    'checkout.phone': 'Tel',
    'checkout.address': 'Adr',
    
    'account.title': 'Xayma',
    'account.orders': 'Ndó',
    'account.addresses': 'Adr',
    'account.settings': 'Xar',
    
    'admin.dashboard': 'Panel',
    'admin.agents': 'Ajan',
    'admin.workflows': 'Flë',
    'admin.products': 'Luu',
    'admin.orders': 'Ndó',
    
    'common.save': 'Món',
    'common.cancel': 'Hèp',
    'common.confirm': 'Nel',
    'common.delete': 'Doy',
    'common.edit': 'Sem',
    'common.view': 'Wut',
    'common.back': 'Weri',
    'common.next': 'Yegg',
    'common.loading': 'Dëgël...',
    'common.error': 'Mbooloo',
    'common.success': 'Ndah',
  },
  
  // 🇨🇲 Cameroon
  'cm': {
    'nav.home': 'Tə́',
    'nav.catalog': 'Katalog',
    'nav.about': 'gɔ̌',
    'nav.contact': 'kǝ́tâ',
    'nav.cart': 'bô',
    'nav.account': 'pǝ na',
    'nav.login': 'zǝ nyap',
    'nav.register': 'kǝ́ zǝ̂',
    'nav.logout': 'kǝ fǝ̂',
    
    'catalog.title': 'Katalog',
    'catalog.search': 'shǝ̂ yǝ̂...',
    'catalog.filter': 'filǝ',
    'catalog.categories': 'katigori',
    'catalog.all': 'yǝ̂',
    'catalog.noProducts': 'pǝtǝ̂ lǝ',
    
    'cart.title': 'bô',
    'cart.empty': 'bô fǝ̂',
    'cart.total': 'bǝ̂',
    'cart.checkout': 'kǝ shǝ̂',
    'cart.continue': 'yǝ̂ na',
    
    'checkout.title': 'kǝ shǝ̂',
    'checkout.shipping': 'kǝ fǝ̂',
    'checkout.payment': 'shǝ̂',
    'checkout.confirmation': 'nyǝ̂',
    'checkout.email': 'email',
    'checkout.phone': 'tel',
    'checkout.address': 'adǝs',
    
    'account.title': 'pǝ na',
    'account.orders': 'nǝ̂nǝ̂',
    'account.addresses': 'adǝs',
    'account.settings': 'nzǝ̂',
    
    'admin.dashboard': 'dashbo',
    'admin.agents': 'ajan',
    'admin.workflows': 'flow',
    'admin.products': 'pǝtǝ̂',
    'admin.orders': 'nǝ̂nǝ̂',
    
    'common.save': 'nyǝ̂ nyap',
    'common.cancel': 'fǝ̂',
    'common.confirm': 'nyǝ̂',
    'common.delete': 'kǝ̂',
    'common.edit': 'nyǝ̂',
    'common.view': 'nyǝ̂',
    'common.back': 'kǝ bô',
    'common.next': 'yǝ̂ na',
    'common.loading': 'shǝ̂...',
    'common.error': 'mǝ̂',
    'common.success': 'yǝ̂',
  },
}

// Liste des pays supportés avec langue par défaut
const countries = [
  { code: 'fr', name: 'France', lang: 'fr', currency: 'EUR', flag: '🇫🇷' },
  { code: 'en', name: 'United Kingdom', lang: 'en', currency: 'GBP', flag: '🇬🇧' },
  { code: 'es', name: 'Spain', lang: 'es', currency: 'EUR', flag: '🇪🇸' },
  { code: 'de', name: 'Germany', lang: 'de', currency: 'EUR', flag: '🇩🇪' },
  { code: 'pt', name: 'Portugal', lang: 'pt', currency: 'EUR', flag: '🇵🇹' },
  { code: 'it', name: 'Italy', lang: 'it', currency: 'EUR', flag: '🇮🇹' },
  { code: 'be', name: 'Belgium', lang: 'fr', currency: 'EUR', flag: '🇧🇪' },
  { code: 'nl', name: 'Netherlands', lang: 'nl', currency: 'EUR', flag: '🇳🇱' },
  { code: 'ch', name: 'Switzerland', lang: 'fr', currency: 'CHF', flag: '🇨🇭' },
  { code: 'bj', name: 'Benin', lang: 'fr', currency: 'XOF', flag: '🇧🇫' },
  { code: 'tg', name: 'Togo', lang: 'fr', currency: 'XOF', flag: '🇹🇬' },
  { code: 'ci', name: "Côte d'Ivoire", lang: 'fr', currency: 'XOF', flag: '🇨🇮' },
  { code: 'sn', name: 'Senegal', lang: 'fr', currency: 'XOF', flag: '🇸🇳' },
  { code: 'cm', name: 'Cameroon', lang: 'fr', currency: 'XAF', flag: '🇨🇲' },
  { code: 'ng', name: 'Nigeria', lang: 'en', currency: 'NGN', flag: '🇳🇬' },
  { code: 'gh', name: 'Ghana', lang: 'en', currency: 'GHS', flag: '🇬🇭' },
  { code: 'ma', name: 'Morocco', lang: 'ar', currency: 'MAD', flag: '🇲🇦' },
  { code: 'dz', name: 'Algeria', lang: 'ar', currency: 'DZD', flag: '🇩🇿' },
  { code: 'tn', name: 'Tunisia', lang: 'ar', currency: 'TND', flag: '🇹🇳' },
  { code: 'us', name: 'United States', lang: 'en', currency: 'USD', flag: '🇺🇸' },
  { code: 'ca', name: 'Canada', lang: 'fr', currency: 'CAD', flag: '🇨🇦' },
]

// Obtenir les pays supportés
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    defaultLocale: 'fr',
    countries: countries.map(c => ({
      code: c.code,
      name: c.name,
      lang: c.lang,
      currency: c.currency,
      flag: c.flag,
    })),
  })
}

// Obtenir les traductions pour une locale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locale, key } = body
    
    if (!locale || !translations[locale]) {
      return NextResponse.json({
        success: false,
        error: 'Invalid locale',
        availableLocales: Object.keys(translations),
      }, { status: 400 })
    }
    
    // Retourner toutes les traductions ou une spécifique
    if (key) {
      return NextResponse.json({
        success: true,
        locale,
        key,
        translation: translations[locale][key] || key,
      })
    }
    
    return NextResponse.json({
      success: true,
      locale,
      translations: translations[locale],
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request',
    }, { status: 400 })
  }
}