-- ============================================
-- E-CLEAN DATABASE SCHEMA - PostgreSQL
-- Clean Stack Database
-- ============================================

-- ============================================
-- ENUMS (Custom Types) - Create first!
-- ============================================

CREATE TYPE USER_ROLE AS ENUM ('customer', 'admin', 'manager', 'affiliate', 'supplier');
CREATE TYPE ACCOUNT_STATUS AS ENUM ('active', 'inactive', 'suspended', 'deleted');
CREATE TYPE ADDRESS_TYPE AS ENUM ('shipping', 'billing', 'both');
CREATE TYPE PRODUCT_STATUS AS ENUM ('draft', 'published', 'archived');
CREATE TYPE ORDER_STATUS AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE PAYMENT_STATUS AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE FULFILLMENT_STATUS AS ENUM ('unfulfilled', 'partial', 'fulfilled');
CREATE TYPE PAYMENT_TYPE AS ENUM ('order', 'refund', 'payout');
CREATE TYPE PAYMENT_METHOD AS ENUM ('card', 'paypal', 'bank_transfer', 'crypto', 'mobile_money');
CREATE TYPE REFUND_STATUS AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE COUPON_TYPE AS ENUM ('percent', 'fixed', 'free_shipping');
CREATE TYPE CAMPAIGN_STATUS AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'failed');
CREATE TYPE SUBSCRIBER_STATUS AS ENUM ('active', 'unsubscribed', 'bounced');
CREATE TYPE POINT_TRANSACTION_TYPE AS ENUM ('earn', 'redeem', 'expire', 'adjust');
CREATE TYPE TICKET_TYPE AS ENUM ('order', 'product', 'payment', 'technical', 'billing', 'general');
CREATE TYPE TICKET_STATUS AS ENUM ('open', 'in_progress', 'waiting', 'resolved', 'closed');
CREATE TYPE TICKET_PRIORITY AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE AFFILIATE_STATUS AS ENUM ('pending', 'active', 'suspended', 'cancelled');
CREATE TYPE COMMISSION_STATUS AS ENUM ('pending', 'approved', 'paid', 'cancelled');
CREATE TYPE REFERRAL_STATUS AS ENUM ('pending', 'completed', 'expired');

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role USER_ROLE DEFAULT 'customer',
    status ACCOUNT_STATUS DEFAULT 'active',
    language VARCHAR(10) DEFAULT 'fr',
    currency VARCHAR(3) DEFAULT 'EUR',
    timezone TEXT DEFAULT 'Europe/Paris',
    password_hash TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin user for Clean Stack
INSERT INTO profiles (email, first_name, last_name, role, status, password_hash)
VALUES ('admin@eclean.com', 'Clean', 'Stack', 'admin', 'active', 'TODO_HASH_PLACEHOLDER')
ON CONFLICT (email) DO NOTHING;

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type ADDRESS_TYPE DEFAULT 'shipping',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    street TEXT NOT NULL,
    street2 TEXT,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country CHAR(2) DEFAULT 'FR',
    phone TEXT,
    is_default BOOLEAN DEFAULT false,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG CATEGORIES & ARTICLES
-- ============================================

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color VARCHAR(7),
    parent_id UUID REFERENCES blog_categories(id),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, icon, color, sort_order) VALUES
('Conseils', 'conseils', 'Conseils et astuces pour un nettoyage efficace', '💡', '#00C2CB', 1),
('Guides', 'guides', 'Guides pratiques pas à pas', '📖', '#2ECC71', 2),
('Nouveautés', 'nouveautes', 'Dernières nouvelles et innovations', '🆕', '#0A2540', 3),
('Écoresponsable', 'ecoresponsable', 'Produits et méthodes écologiques', '🌿', '#27AE60', 4),
('Santé', 'sante', 'Conseils pour un intérieur sain', '❤️', '#E74C3C', 5),
('Maison', 'maison', 'Entretien par pièce de la maison', '🏠', '#9B59B6', 6);

-- Blog Articles
CREATE TABLE IF NOT EXISTS blog_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category_id UUID REFERENCES blog_categories(id),
    author_id UUID REFERENCES profiles(id),
    featured_image TEXT,
    status VARCHAR(20) DEFAULT 'published',
    is_featured BOOLEAN DEFAULT false,
    views_count INT DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample blog articles
INSERT INTO blog_articles (title, slug, excerpt, category_id, is_featured, status, published_at) VALUES
('10 Astuces pour un Nettoyage Écoresponsable', '10-astuces-nettoyage-ecoresponsable', 
 'Découvrez comment nettoyer votre maison tout en respectant l''environnement. Astuces simples, efficaces et écologiques pour un intérieur sain sans produits chimiques agressifs.',
 (SELECT id FROM blog_categories WHERE slug = 'ecoresponsable'), true, 'published', NOW()),
('Bien Choisir son Nettoyant', 'choisir-nettoyant', 
 'Guide complet pour sélectionner les produits adaptés à chaque surface de votre maison.',
 (SELECT id FROM blog_categories WHERE slug = 'conseils'), false, 'published', NOW()),
('Produits Maison: 5 Recettes Faciles', 'recettes-nettoyants-maison', 
 'FABriquez vos propres nettoyants avec des ingrédients simples du placard.',
 (SELECT id FROM blog_categories WHERE slug = 'ecoresponsable'), false, 'published', NOW()),
('Linge de Lit: Fréquence de Lavage', 'frequence-lavage-linge', 
 'À quelle fréquence changer vos draps? Voici les recommandations des experts.',
 (SELECT id FROM blog_categories WHERE slug = 'sante'), false, 'published', NOW()),
('Nettoyer la Cuisine Après Cuisine', 'nettoyer-cuisine', 
 'Astuces pour éliminer graisses et odeurs tenaces dans la cuisine.',
 (SELECT id FROM blog_categories WHERE slug = 'maison'), false, 'published', NOW()),
('Maison avec Animaux: Guide Complet', 'maison-animaux', 
 'Astuces pour garder votre maison propre avec des animaux de compagnie.',
 (SELECT id FROM blog_categories WHERE slug = 'conseils'), false, 'published', NOW()),
('5 Erreurs de Nettoyage à Éviter', 'erreurs-nettoyage', 
 'Les erreurs courantes qui risquent d''endommager vos surfaces et équipements.',
 (SELECT id FROM blog_categories WHERE slug = 'guides'), false, 'published', NOW());

-- ============================================
-- PRODUCTS & CATALOG
-- ============================================

-- Product Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES categories(id),
    brand TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost DECIMAL(10,2),
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    stock INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 10,
    manage_stock BOOLEAN DEFAULT true,
    weight DECIMAL(10,3),
    length DECIMAL(10,2),
    width DECIMAL(10,2),
    height DECIMAL(10,2),
    shipping_class TEXT,
    images JSONB DEFAULT '[]',
    video_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    status PRODUCT_STATUS DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(10,2),
    stock INT DEFAULT 0,
    attributes JSONB DEFAULT '{}',
    image_url TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Product reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    order_id UUID,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    pros TEXT[],
    cons TEXT[],
    images TEXT[],
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS & COMMERCE
-- ============================================

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id),
    status ORDER_STATUS DEFAULT 'pending',
    payment_status PAYMENT_STATUS DEFAULT 'pending',
    fulfillment_status FULFILLMENT_STATUS DEFAULT 'unfulfilled',
    customer_email TEXT,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_method TEXT,
    payment_id TEXT,
    transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    shipping_method TEXT,
    tracking_number TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    customer_note TEXT,
    internal_note TEXT,
    affiliate_id UUID,
    commission_amount DECIMAL(10,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    user_id UUID REFERENCES profiles(id),
    items JSONB DEFAULT '[]',
    subtotal DECIMAL(10,2) DEFAULT 0,
    discount_code TEXT,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS & TRANSACTIONS
-- ============================================

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    user_id UUID REFERENCES profiles(id),
    type PAYMENT_TYPE DEFAULT 'order',
    method PAYMENT_METHOD DEFAULT 'card',
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status PAYMENT_STATUS DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    stripe_customer_id TEXT,
    transaction_id TEXT,
    authorization_code TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Refunds
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    payment_id UUID REFERENCES payments(id),
    user_id UUID REFERENCES profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status REFUND_STATUS DEFAULT 'pending',
    stripe_refund_id TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MARKETING
-- ============================================

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    type COUPON_TYPE DEFAULT 'percent',
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2),
    max_uses INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT,
    status CAMPAIGN_STATUS DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    recipient_count INT DEFAULT 0,
    open_count INT DEFAULT 0,
    click_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscribers
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    status SUBSCRIBER_STATUS DEFAULT 'active',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

-- ============================================
-- SUPPORT
-- ============================================

-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id),
    type TICKET_TYPE DEFAULT 'general',
    status TICKET_STATUS DEFAULT 'open',
    priority TICKET_PRIORITY DEFAULT 'medium',
    subject TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket messages
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    is_published BOOLEAN DEFAULT true,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LOYALTY & AFFILIATES
-- ============================================

-- Loyalty points
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    points INT NOT NULL,
    type POINT_TRANSACTION_TYPE NOT NULL,
    description TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    status AFFILIATE_STATUS DEFAULT 'pending',
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commissions
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    order_id UUID REFERENCES orders(id),
    amount DECIMAL(10,2) NOT NULL,
    status COMMISSION_STATUS DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES profiles(id),
    referee_id UUID REFERENCES profiles(id),
    status REFERRAL_STATUS DEFAULT 'pending',
    reward_given BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYTICS
-- ============================================

-- Page views
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    user_id UUID,
    url TEXT NOT NULL,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product views
CREATE TABLE IF NOT EXISTS product_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    user_id UUID,
    session_id TEXT,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI AGENTS & CONFIG
-- ============================================

-- AI Agent configs
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    agent_type TEXT NOT NULL,
    system_prompt TEXT,
    capabilities JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    model_name TEXT DEFAULT 'llama3.2',
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INT DEFAULT 2048,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert AI agents
INSERT INTO ai_agents (name, slug, description, agent_type, capabilities) VALUES
('Sales Agent', 'sales-agent', 'AI Sales Manager - Customer acquisition, lead qualification, product recommendations', 'sales', 
 '["analyze_customer", "qualify_lead", "product_recommendation", "pricing_negotiation", "upselling", "handle_objection"]'),
('Support Agent', 'support-agent', 'AI Customer Service - Ticket classification, auto-response, knowledge base', 'support',
 '["classify_ticket", "auto_respond", "escalate_to_human", "generate_solution", "find_knowledge_base", "sentiment_analysis"]'),
('Finance Agent', 'finance-agent', 'AI Financial Controller - Invoicing, reconciliation, fraud detection, cashflow', 'finance',
 '["invoice_generation", "auto_reconciliation", "fraud_detection", "cashflow_forecast", "expense_categorization", "tax_calculation"]'),
('Operations Agent', 'operations-agent', 'AI Logistics Manager - Routing, inventory, quality control', 'operations',
 '["optimize_routing", "predict_delivery", "inventory_alert", "reorder_point", "warehouse_optimization", "quality_check"]'),
('Marketing Agent', 'marketing-agent', 'AI Marketing Manager - Campaigns, content generation, audience segmentation', 'marketing',
 '["campaign_creation", "audience_segmentation", "content_generation", "email_optimization", "ad_bid_strategy", "seo_optimization"]');

-- AI Conversation logs
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES ai_agents(id),
    user_id UUID REFERENCES profiles(id),
    session_id TEXT,
    user_message TEXT NOT NULL,
    ai_response TEXT,
    tokens_used INT DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Workflows
CREATE TABLE IF NOT EXISTS ai_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    trigger_event TEXT,
    steps JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_blog_articles_category ON blog_articles(category_id);
CREATE INDEX idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX idx_ai_agents_slug ON ai_agents(slug);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_articles_updated_at
    BEFORE UPDATE ON blog_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ai_agents_updated_at
    BEFORE UPDATE ON ai_agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    seq_val TEXT;
BEGIN
    seq_val := LPAD(nextval('order_number_seq')::TEXT, 6, '0');
    RETURN 'EC-' || year || '-' || seq_val;
END;
$$ LANGUAGE plpgsql;

-- Generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    seq_val TEXT;
BEGIN
    seq_val := LPAD(nextval('ticket_number_seq')::TEXT, 5, '0');
    RETURN 'TKT-' || seq_val;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEQUENCES
-- ============================================

CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1000;
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START WITH 10000;

-- ============================================
-- VIEWS
-- ============================================

-- Order summary view
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.created_at,
    o.status,
    o.total,
    o.payment_status,
    p.email as customer_email,
    p.first_name || ' ' || p.last_name as customer_name
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id;

-- Product sales view
CREATE OR REPLACE VIEW product_sales AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    COUNT(oi.id) as order_count,
    SUM(oi.quantity) as units_sold,
    SUM(oi.total) as revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status NOT IN ('cancelled', 'refunded')
GROUP BY p.id, p.name, p.sku;

-- Customer lifetime value view
CREATE VIEW customer_lifetime_value AS
SELECT 
    p.id as user_id,
    p.email,
    p.first_name,
    p.last_name,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as lifetime_value,
    MAX(o.created_at) as last_order_date
FROM profiles p
LEFT JOIN orders o ON p.id = o.user_id AND o.status NOT IN ('cancelled', 'refunded')
GROUP BY p.id, p.email, p.first_name, p.last_name;

-- ============================================
-- FINAL STATUS
-- ============================================

SELECT 'E-Clean Database initialized successfully!' as status;