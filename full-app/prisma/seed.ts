import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@e-clean.com' },
    update: {},
    create: {
      email: 'admin@e-clean.com',
      passwordHash: adminPassword,
      name: 'Admin E-Clean',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'nettoyage-domestique' },
      update: {},
      create: {
        name: 'Nettoyage Domestique',
        slug: 'nettoyage-domestique',
        description: 'Produits de nettoyage pour la maison',
        icon: '🏠',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'hygiene-personnelle' },
      update: {},
      create: {
        name: 'Hygiène Personnelle',
        slug: 'hygiene-personnelle',
        description: 'Produits d\'hygiène personnelle',
        icon: '🧴',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'equipements-nettoyage' },
      update: {},
      create: {
        name: 'Équipements de Nettoyage',
        slug: 'equipements-nettoyage',
        description: 'Outils et équipements de nettoyage',
        icon: '🧹',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'produits-ecologiques' },
      update: {},
      create: {
        name: 'Produits Écologiques',
        slug: 'produits-ecologiques',
        description: 'Produits nettoyants écologiques et durables',
        icon: '🌿',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'buanderie' },
      update: {},
      create: {
        name: 'Buanderie',
        slug: 'buanderie',
        description: 'Produits pour le linge',
        icon: '👕',
        sortOrder: 5,
      },
    }),
  ])
  console.log('✅ Categories created:', categories.length)

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'ecover' },
      update: {},
      create: {
        name: 'Ecover',
        slug: 'ecover',
        description: 'Marque belge de produits écologiques',
        website: 'https://www.ecover.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'diversey' },
      update: {},
      create: {
        name: 'Diversey',
        slug: 'diversey',
        description: 'Solutions de nettoyage professionnelles',
        website: 'https://www.diversey.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'SC-Johnson' },
      update: {},
      create: {
        name: 'SC Johnson',
        slug: 'SC-Johnson',
        description: 'Produits ménagers internationaux',
        website: 'https://www.scjohnson.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'finish' },
      update: {},
      create: {
        name: 'Finish',
        slug: 'finish',
        description: 'Produits pour lave-vaisselle',
        website: 'https://www.finish.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'vanish' },
      update: {},
      create: {
        name: 'Vanish',
        slug: 'vanish',
        description: 'Agents détachants et blanchissants',
        website: 'https://www.vanish.com',
      },
    }),
  ])
  console.log('✅ Brands created:', brands.length)

  // Create Products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'ECL-001' },
      update: {},
      create: {
        name: 'Nettoyant Multi-surfaces Ecologique',
        slug: 'nettoyant-multi-surfaces-ecologique',
        description: 'Nettoyant universel écologique pour toutes les surfaces. Sans danger pour l\'environnement.',
        summary: 'Nettoyant écologique multi-surfaces',
        categoryId: categories[0].id,
        brandId: brands[0].id,
        sku: 'ECL-001',
        barcode: '1234567890123',
        price: 12.99,
        compareAtPrice: 15.99,
        cost: 5.00,
        currency: 'EUR',
        taxRate: 20,
        stock: 150,
        lowStockThreshold: 20,
        weight: 1.0,
        weightUnit: 'kg',
        isFeatured: true,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-002' },
      update: {},
      create: {
        name: 'Liquide Vaisselle Concentré',
        slug: 'liquide-vaisselle-concentre',
        description: 'Liquide vaisselle concentré, efficace même à basse température.',
        summary: 'Liquide vaisselle écologique',
        categoryId: categories[0].id,
        brandId: brands[0].id,
        sku: 'ECL-002',
        barcode: '1234567890124',
        price: 8.99,
        compareAtPrice: 10.99,
        cost: 3.00,
        currency: 'EUR',
        taxRate: 20,
        stock: 200,
        lowStockThreshold: 30,
        weight: 0.75,
        weightUnit: 'kg',
        isFeatured: true,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-003' },
      update: {},
      create: {
        name: 'Gel WC Anti-calcaire',
        slug: 'gel-wc-anti-calcaire',
        description: 'Gel WC puissante anti-calcaire et détartrant. Odeur fraîche.',
        summary: 'Gel WC nettoyant détartrant',
        categoryId: categories[0].id,
        brandId: brands[1].id,
        sku: 'ECL-003',
        barcode: '1234567890125',
        price: 6.49,
        cost: 2.00,
        currency: 'EUR',
        taxRate: 20,
        stock: 180,
        lowStockThreshold: 25,
        weight: 0.75,
        weightUnit: 'kg',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-004' },
      update: {},
      create: {
        name: 'Pastilles Lave-vaisselle Complete',
        slug: 'pastilles-lave-vaisselle-complete',
        description: 'Pastilles tout-en-un pour lave-vaisselle. Lavage, rinçage, sel, brillant.',
        summary: 'Pastilles lave-vaisselle 3-en-1',
        categoryId: categories[4].id,
        brandId: brands[3].id,
        sku: 'ECL-004',
        barcode: '1234567890126',
        price: 14.99,
        compareAtPrice: 18.99,
        cost: 6.00,
        currency: 'EUR',
        taxRate: 20,
        stock: 120,
        lowStockThreshold: 15,
        weight: 1.2,
        weightUnit: 'kg',
        isFeatured: true,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-005' },
      update: {},
      create: {
        name: 'Détachant Vanish Oxi Action',
        slug: 'detachant-vanish-oxi-action',
        description: 'Détachant puissant pour tous types de tissus. Élimine les tâches difficiles.',
        summary: 'Détachant Oxi pour linge',
        categoryId: categories[4].id,
        brandId: brands[4].id,
        sku: 'ECL-005',
        barcode: '1234567890127',
        price: 11.99,
        cost: 4.50,
        currency: 'EUR',
        taxRate: 20,
        stock: 90,
        lowStockThreshold: 20,
        weight: 0.6,
        weightUnit: 'kg',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-006' },
      update: {},
      create: {
        name: 'Brosse Nettoyage Multi-usages',
        slug: 'brosse-nettoyage-multi-usages',
        description: 'Brosse ergonomique pour le nettoyage de toutes les surfaces.',
        summary: 'Brosse de nettoyage universelle',
        categoryId: categories[2].id,
        brandId: brands[2].id,
        sku: 'ECL-006',
        barcode: '1234567890128',
        price: 5.99,
        cost: 2.00,
        currency: 'EUR',
        taxRate: 20,
        stock: 250,
        lowStockThreshold: 50,
        weight: 0.15,
        weightUnit: 'kg',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-007' },
      update: {},
      create: {
        name: 'Gants de Ménage Résistants',
        slug: 'gants-menage-resistants',
        description: 'Gants de nettoyage réutilisables, résistance chimique élevée.',
        summary: 'Gants de protection pour nettoyage',
        categoryId: categories[2].id,
        brandId: brands[2].id,
        sku: 'ECL-007',
        barcode: '1234567890129',
        price: 8.99,
        cost: 3.00,
        currency: 'EUR',
        taxRate: 20,
        stock: 180,
        lowStockThreshold: 30,
        weight: 0.2,
        weightUnit: 'kg',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-008' },
      update: {},
      create: {
        name: 'Savon Main Naturel',
        slug: 'savon-main-naturel',
        description: 'Savon liquide pour les mains, formule douce et écologique.',
        summary: 'Savon main écologique',
        categoryId: categories[1].id,
        brandId: brands[0].id,
        sku: 'ECL-008',
        barcode: '1234567890130',
        price: 7.49,
        compareAtPrice: 9.49,
        cost: 2.50,
        currency: 'EUR',
        taxRate: 20,
        stock: 200,
        lowStockThreshold: 40,
        weight: 0.5,
        weightUnit: 'kg',
        isFeatured: true,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-009' },
      update: {},
      create: {
        name: 'Lingettes Désinfectantes',
        slug: 'lingettes-desinfectantes',
        description: 'Lingettes nettoyantes et désinfectantes. Éliminent 99.9% des bactéries.',
        summary: 'Lingettes désinfectantes antibactériennes',
        categoryId: categories[1].id,
        brandId: brands[2].id,
        sku: 'ECL-009',
        barcode: '1234567890131',
        price: 4.99,
        cost: 1.50,
        currency: 'EUR',
        taxRate: 20,
        stock: 300,
        lowStockThreshold: 50,
        weight: 0.3,
        weightUnit: 'kg',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'ECL-010' },
      update: {},
      create: {
        name: 'Kit Nettoyage Écologique Complet',
        slug: 'kit-nettoyage-ecologique-complet',
        description: 'Kit complet avec nettoyant multi-surfaces, liquide vaisselle, et accessoires.',
        summary: 'Pack produits écologiques',
        categoryId: categories[3].id,
        brandId: brands[0].id,
        sku: 'ECL-010',
        barcode: '1234567890132',
        price: 34.99,
        compareAtPrice: 44.99,
        cost: 15.00,
        currency: 'EUR',
        taxRate: 20,
        stock: 50,
        lowStockThreshold: 10,
        weight: 3.0,
        weightUnit: 'kg',
        isFeatured: true,
        isActive: true,
      },
    }),
  ])
  console.log('✅ Products created:', products.length)

  // Add Product Images (placeholder URLs)
  for (const product of products) {
    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id },
    })
    
    if (!existingImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `/images/products/${product.sku}.jpg`,
          alt: product.name,
          sortOrder: 0,
          isPrimary: true,
        },
      })
    }
  }
  console.log('✅ Product images created')

  // Create a demo user
  const userPassword = await bcrypt.hash('user123', 10)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@e-clean.com' },
    update: {},
    create: {
      email: 'demo@e-clean.com',
      passwordHash: userPassword,
      firstName: 'Demo',
      lastName: 'User',
      phone: '+33612345678',
      type: 'INDIVIDUAL',
      status: 'ACTIVE',
      emailVerified: true,
    },
  })
  console.log('✅ Demo user created:', demoUser.email)

  // Create sample coupons
  const coupons = await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'BIENVENUE10' },
      update: {},
      create: {
        code: 'BIENVENUE10',
        type: 'PERCENT',
        value: 10,
        minOrderAmount: 50,
        maxUses: 100,
        startsAt: new Date(),
        expiresAt: new Date('2026-12-31'),
        isActive: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'ECLEAN20' },
      update: {},
      create: {
        code: 'ECLEAN20',
        type: 'PERCENT',
        value: 20,
        minOrderAmount: 100,
        maxUses: 50,
        startsAt: new Date(),
        expiresAt: new Date('2026-06-30'),
        isActive: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'FREESHIP' },
      update: {},
      create: {
        code: 'FREESHIP',
        type: 'FREE_SHIPPING',
        value: 0,
        minOrderAmount: 75,
        maxUses: 200,
        startsAt: new Date(),
        expiresAt: new Date('2026-12-31'),
        isActive: true,
      },
    }),
  ])
  console.log('✅ Coupons created:', coupons.length)

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📋 Login credentials:')
  console.log('   Admin: admin@e-clean.com / admin123')
  console.log('   User: demo@e-clean.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
