// ⚙️ E-CLEAN ENVIRONMENT CONFIGURATION
// All environment variables and API keys configuration

export const config = {
  // ==========================================
  // DATABASE (PostgreSQL / Supabase)
  // ==========================================
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'e_clean',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    
    // Supabase (alternative)
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_ANON_KEY || '',
  },

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  auth: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    expiresIn: '7d',
    saltRounds: 10,
  },

  // ==========================================
  // OPENAI CONFIGURATION
  // ==========================================
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    organization: process.env.OPENAI_ORG_ID || '',
    
    // Models
    model: 'gpt-4-turbo',
    visionModel: 'gpt-4-vision-preview',
    embeddingModel: 'text-embedding-3-small',
    
    // Limits
    maxTokens: 4000,
    temperature: 0.7,
  },

  // ==========================================
  // CLAUDE (Anthropic) CONFIGURATION
  // ==========================================
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: 'claude-3-opus-20240229',
    maxTokens: 4000,
  },

  // ==========================================
  // STRIPE PAYMENT
  // ==========================================
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    
    // Connect for payouts
    connectClientId: process.env.STRIPE_CONNECT_CLIENT_ID || '',
    
    // Options
    currency: 'eur',
    locale: 'fr',
  },

  // ==========================================
  // SENDGRID EMAIL
  // ==========================================
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: 'noreply@e-clean.com',
    fromName: 'E-Clean',
    replyTo: 'contact@e-clean.com',
  },

  // ==========================================
  // TWILIO (SMS / WhatsApp)
  // ==========================================
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
  },

  // ==========================================
  // DHL / LOGISTICS
  // ==========================================
  dhl: {
    apiKey: process.env.DHL_API_KEY || '',
    secret: process.env.DHL_SECRET || '',
    account: process.env.DHL_ACCOUNT_ID || '',
    prefix: 'JD',
  },

  // ==========================================
  // GOOGLE SERVICES
  // ==========================================
  google: {
    analyticsId: process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
    tagManagerId: process.env.GTM_ID || 'GTM-XXXXXXX',
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  },

  // ==========================================
  // META (Facebook/Instagram)
  // ==========================================
  meta: {
    pixelId: process.env.META_PIXEL_ID || '',
    accessToken: process.env.META_ACCESS_TOKEN || '',
    instagramAccountId: process.env.META_INSTAGRAM_ID || '',
  },

  // ==========================================
  // WHATSAPP BUSINESS
  // ==========================================
  whatsapp: {
    businessAccountId: process.env.WHATSAPP_BUSINESS_ID || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_ID || '',
    token: process.env.WHATSAPP_TOKEN || '',
  },

  // ==========================================
  // SENTRY ERROR TRACKING
  // ==========================================
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    sampleRate: 0.1,
  },

  // ==========================================
  // APPLICATION CONFIG
  // ==========================================
  app: {
    name: 'E-Clean',
    tagline: 'Professional Cleaning Solutions',
    url: process.env.APP_URL || 'https://e-clean.com',
    supportEmail: 'support@e-clean.com',
    contactEmail: 'contact@e-clean.com',
    
    // Business info
    company: 'E-Clean by ELECTRON Group',
    address: '123 Rue de la Paix, 75001 Paris, France',
    phone: '+33 1 23 45 67 89',
    siret: '123 456 789 00001',
    vatNumber: 'FR12345678901',
    
    // Limits
    maxUploadSize: 10 * 1024 * 1024, // 10MB
    sessionTimeout: 30 * 60 * 1000, // 30 min
  },

  // ==========================================
  // FEATURE FLAGS
  // ==========================================
  features: {
    aiChat: process.env.FEATURE_AI_CHAT !== 'false',
    voiceMessages: process.env.FEATURE_VOICE === 'true',
    videoProducts: process.env.FEATURE_VIDEO === 'true',
    loyaltyProgram: process.env.FEATURE_LOYALTY !== 'false',
    referral: process.env.FEATURE_REFERRAL !== 'false',
    multiVendor: process.env.FEATURE_MULTIVENDOR === 'true',
    multiLanguage: process.env.FEATURE_I18N === 'true',
  },

  // ==========================================
  // RATES & LIMITS
  // ==========================================
  rates: {
    // Shipping
    shippingFreeThreshold: 50, // euros
    shippingStandardCost: 5.99,
    shippingExpressCost: 12.99,
    
    // Commission
    platformFee: 0.10, // 10%
    paymentFee: 0.029, // 2.9%
    paymentFixed: 0.25, // 0.25€
    
    // Loyalty
    loyaltyPointsPerEuro: 1,
    loyaltyRedemptionRate: 0.01, // 1 point = 0.01€
    
    // Referral
    referrer reward: 10, // euros
    refereeDiscount: 5, // euros
  },

  // ==========================================
  // SLACK / TEAM NOTIFICATIONS
  // ==========================================
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
    channel: process.env.SLACK_CHANNEL || '#orders',
    alertsChannel: process.env.SLACK_ALERTS_CHANNEL || '#alerts',
  },

  // ==========================================
  // CLOUD STORAGE
  // ==========================================
  storage: {
    // AWS S3
    s3Bucket: process.env.AWS_S3_BUCKET || '',
    s3Region: process.env.AWS_REGION || 'eu-west-1',
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID || '',
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    
    // Or Cloudflare R2
    r2AccountId: process.env.R2_ACCOUNT_ID || '',
    r2Bucket: process.env.R2_BUCKET || '',
    r2AccessKey: process.env.R2_ACCESS_KEY_ID || '',
    r2SecretKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },

  // ==========================================
  // REDIS CACHE
  // ==========================================
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    db: 0,
  },
}

// ==========================================
// ENVIRONMENT CHECK
// ==========================================

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function isStaging(): boolean {
  return process.env.NODE_ENV === 'staging'
}

export function getEnv(): string {
  return process.env.NODE_ENV || 'development'
}

// ==========================================
// REQUIRED KEYS VALIDATION
// ==========================================

export function validateConfig(): { valid: boolean; missing: string[] } {
  const required: string[] = []
  
  if (!config.database.supabaseUrl && !config.database.host) {
    required.push('Database (SUPABASE_URL or DB_HOST)')
  }
  
  if (isProduction()) {
    if (!config.openai.apiKey) required.push('OPENAI_API_KEY')
    if (!config.stripe.secretKey) required.push('STRIPE_SECRET_KEY')
    if (!config.auth.secret || config.auth.secret.startsWith('your-')) {
      required.push('JWT_SECRET')
    }
  }
  
  return { valid: required.length === 0, missing: required }
}

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default config