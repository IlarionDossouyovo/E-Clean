// 🛡️ E-CLEAN MIDDLEWARE
// Authentication, Rate Limiting, Logging for API

import { config } from '../config'
import type { NextApiRequest, NextApiResponse } from 'next'

// ==========================================
// AUTHENTICATION
// ==========================================

export interface AuthUser {
  id: string
  email: string
  role: string
  status: string
}

export interface AuthRequest extends NextApiRequest {
  user?: AuthUser
}

/**
 * Verify JWT token from authorization header
 */
export async function authenticate(
  req: AuthRequest,
  res: NextApiResponse,
  next: (user: AuthUser) => void
) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided'
      })
    }
    
    const token = authHeader.substring(7)
    
    // Verify token (simplified - in production use proper JWT)
    const user = await verifyToken(token)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Invalid token'
      })
    }
    
    req.user = user
    return next(user)
    
  } catch (error) {
    console.error('[Auth Error]', error)
    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    })
  }
}

/**
 * Verify token (placeholder - implement with real JWT)
 */
async function verifyToken(token: string): Promise<AuthUser | null> {
  // TODO: Implement with Supabase auth or JWT library
  // This is a placeholder
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    return decoded
  } catch {
    return null
  }
}

/**
 * Require specific role
 */
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: NextApiResponse, next: () => void) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Insufficient permissions'
      })
    }
    
    return next()
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuth(
  req: AuthRequest,
  res: NextApiResponse,
  next: (user?: AuthUser) => void
) {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const user = await verifyToken(token)
      req.user = user || undefined
    }
    
    return next(req.user)
    
  } catch {
    return next(undefined)
  }
}

// ==========================================
// RATE LIMITING
// ==========================================

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const rateLimits = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiter middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return (req: AuthRequest, res: NextApiResponse, next: () => void) => {
    const identifier = req.user?.id || req.headers['x-forwarded-for'] as string || 
                   req.connection?.remoteAddress || 'unknown'
    
    const now = Date.now()
    const key = `${identifier}:${req.url}`
    
    let limit = rateLimits.get(key)
    
    if (!limit || limit.resetTime < now) {
      limit = {
        count: 1,
        resetTime: now + config.windowMs
      }
      rateLimits.set(key, limit)
      return next()
    }
    
    limit.count++
    
    if (limit.count > config.maxRequests) {
      const retryAfter = Math.ceil((limit.resetTime - now) / 1000)
      
      res.setHeader('Retry-After', retryAfter)
      res.setHeader('X-RateLimit-Remaining', 0)
      res.setHeader('X-RateLimit-Reset', limit.resetTime)
      
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter
      })
    }
    
    res.setHeader('X-RateLimit-Limit', config.maxRequests)
    res.setHeader('X-RateLimit-Remaining', config.maxRequests - limit.count)
    res.setHeader('X-RateLimit-Reset', limit.resetTime)
    
    return next()
  }
}

/**
 * Pre-defined rate limits
 */
export const rateLimits = {
  // Strict: 10 requests per minute
  strict: { windowMs: 60000, maxRequests: 10 },
  
  // Standard: 100 requests per minute
  standard: { windowMs: 60000, maxRequests: 100 },
  
  // Relaxed: 1000 requests per minute
  relaxed: { windowMs: 60000, maxRequests: 1000 },
  
  // Auth: 5 attempts per minute
  auth: { windowMs: 60000, maxRequests: 5 },
  
  // Payment: 3 attempts per minute
  payment: { windowMs: 60000, maxRequests: 3 },
}

// ==========================================
// INPUT VALIDATION
// ==========================================

interface ValidationRule {
  field: string
  type: 'string' | 'number' | 'email' | 'boolean' | 'object' | 'array'
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  enum?: string[]
}

/**
 * Validate request body against rules
 */
export function validate(rules: ValidationRule[]) {
  return (req: AuthRequest, res: NextApiResponse, next: () => void) => {
    const errors: string[] = []
    const data = req.body || {}
    
    for (const rule of rules) {
      const value = data[rule.field]
      
      // Required check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`)
        continue
      }
      
      if (value === undefined || value === null) continue
      
      // Type check
      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push(`${rule.field} must be a string`)
      }
      else if (rule.type === 'number' && typeof value !== 'number') {
        errors.push(`${rule.field} must be a number`)
      }
      else if (rule.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${rule.field} must be a boolean`)
      }
      else if (rule.type === 'email' && !isValidEmail(value)) {
        errors.push(`${rule.field} must be a valid email`)
      }
      else if (rule.type === 'array' && !Array.isArray(value)) {
        errors.push(`${rule.field} must be an array`)
      }
      
      // Length checks
      if (rule.type === 'string' && rule.min && value.length < rule.min) {
        errors.push(`${rule.field} must be at least ${rule.min} characters`)
      }
      if (rule.type === 'string' && rule.max && value.length > rule.max) {
        errors.push(`${rule.field} must be at most ${rule.max} characters`)
      }
      
      // Pattern check
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${rule.field} has invalid format`)
      }
      
      // Enum check
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${rule.field} must be one of: ${rule.enum.join(', ')}`)
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors
      })
    }
    
    return next()
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * Global error handler
 */
export function errorHandler(
  error: Error,
  req: AuthRequest,
  res: NextApiResponse
) {
  console.error('[API Error]', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id
  })
  
  // Don't expose internal errors in production
  const message = config.app.env === 'production'
    ? 'An error occurred'
    : error.message
  
  return res.status(500).json({
    success: false,
    error: message
  })
}

/**
 * Not found handler
 */
export function notFound(req: AuthRequest, res: NextApiResponse) {
  return res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  })
}

/**
 * Method not allowed
 */
export function methodNotAllowed(req: AuthRequest, res: NextApiResponse) {
  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
}

// ==========================================
// CORS
// ==========================================

/**
 * CORS headers
 */
export function cors(req: AuthRequest, res: NextApiResponse) {
  const origin = req.headers.origin
  
  // Configure allowed origins
  const allowedOrigins = [
    'https://e-clean.com',
    'https://www.e-clean.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ]
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
}

// ==========================================
// LOGGING
// ==========================================

/**
 * API Request logger
 */
export function logger(req: AuthRequest, res: NextApiResponse, next: () => void) {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    
    console.log(JSON.stringify({
      type: 'api_request',
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    }))
  })
  
  return next()
}

// ==========================================
// SECURITY HEADERS
// ==========================================

/**
 * Security headers middleware
 */
export function securityHeaders(req: AuthRequest, res: NextApiResponse, next: () => void) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS (only in production)
  if (config.app.env === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  return next()
}

// ==========================================
// PREVENT DUPLICATE SUBMISSIONS
// ==========================================

const submittedRequests = new Map<string, number>()

/**
 * Prevent duplicate form submissions
 */
export function preventDuplicateSubmission(windowMs: number = 30000) {
  return (req: AuthRequest, res: NextApiResponse, next: () => void) => {
    if (req.method !== 'POST') return next()
    
    const key = `${req.user?.id || req.connection?.remoteAddress}:${req.url}:${JSON.stringify(req.body)}`
    const hash = Buffer.from(key).toString('base64').substring(0, 32)
    const now = Date.now()
    
    const last = submittedRequests.get(hash)
    
    if (last && now - last < windowMs) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate submission detected'
      })
    }
    
    submittedRequests.set(hash, now)
    
    // Cleanup old entries
    for (const [k, v] of submittedRequests) {
      if (now - v > windowMs * 2) {
        submittedRequests.delete(k)
      }
    }
    
    return next()
  }
}

// ==========================================
// EXPORTS
// ==========================================

export {
  authenticate,
  requireRole,
  optionalAuth,
  rateLimit,
  validate,
  errorHandler,
  notFound,
  methodNotAllowed,
  cors,
  logger,
  securityHeaders,
  preventDuplicateSubmission
}