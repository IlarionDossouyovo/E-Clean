import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    
    const where: any = { isActive: true }
    
    if (category) {
      where.category = { slug: category }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (featured === 'true') {
      where.isFeatured = true
    }
    
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        summary: body.summary,
        categoryId: body.categoryId,
        brandId: body.brandId,
        sku: body.sku,
        barcode: body.barcode,
        price: body.price,
        compareAtPrice: body.compareAtPrice,
        cost: body.cost,
        currency: body.currency || 'EUR',
        taxRate: body.taxRate || 20,
        stock: body.stock || 0,
        lowStockThreshold: body.lowStockThreshold || 10,
        weight: body.weight,
        weightUnit: body.weightUnit || 'kg',
        isFeatured: body.isFeatured || false,
        isActive: body.isActive ?? true,
      },
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}