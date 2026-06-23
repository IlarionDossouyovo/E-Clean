import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret'

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, firstName, lastName } = body
    
    if (action === 'register') {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
      }
      
      const passwordHash = await bcrypt.hash(password, 12)
      
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
        },
      })
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
      
      return NextResponse.json({ user, token }, { status: 201 })
    }
    
    if (action === 'login') {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
      
      return NextResponse.json({ user, token })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('POST /api/auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}