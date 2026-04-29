-- ============================================
-- E-CLEAN DATABASE SCHEMA
-- PostgreSQL / Supabase
-- ============================================

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
-- PRODUCTS & CATALOG
-- ============================================

-- Categories
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
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost DECIMAL(10,2),
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    
    -- Inventory
    stock INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 10,
    manage_stock BOOLEAN DEFAULT true,
    
    -- Shipping
    weight DECIMAL(10,3),
    length DECIMAL(10,2),
    width DECIMAL(10,2),
    height DECIMAL(10,2),
    shipping_class TEXT,
    
    -- Media
    images JSONB DEFAULT '[]',
    video_url TEXT,
    3d_model_url TEXT,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Status
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
    
    -- Status
    status ORDER_STATUS DEFAULT 'pending',
    payment_status PAYMENT_STATUS DEFAULT 'pending',
    fulfillment_status FULFILLMENT_STATUS DEFAULT 'unfulfilled',
    
    -- Customer
    customer_email TEXT,
    customer_phone TEXT,
    
    -- Addresses
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Payment
    payment_method TEXT,
    payment_id TEXT,
    transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    
    -- Shipping
    shipping_method TEXT,
    tracking_number TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Notes
    customer_note TEXT,
    internal_note TEXT,
    
    -- Affiliate
    affiliate_id UUID,
    commission_amount DECIMAL(10,2),
    
    -- Metadata
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
    per_user_limit INT DEFAULT 1,
    
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email campaigns
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template_id TEXT,
    
    segment TEXT,
    target_count INT,
    
    status CAMPAIGN_STATUS DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    
    stats JSONB DEFAULT '{"sent": 0, "opened": 0, "clicked": 0, "bounced": 0}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email subscribers
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id),
    
    first_name TEXT,
    last_name TEXT,
    
    status SUBSCRIBER_STATUS DEFAULT 'active',
    source TEXT,
    
    preferences JSONB DEFAULT '{"newsletter": true, "sms": false}',
    
    subscribed_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LOYALTY & REFERRALS
-- ============================================

-- Loyalty points
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    points INT NOT NULL,
    type POINT_TRANSACTION_TYPE NOT NULL,
    
    order_id UUID REFERENCES orders(id),
    description TEXT,
    
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES profiles(id),
    referee_id UUID REFERENCES profiles(id),
    
    referral_code TEXT UNIQUE NOT NULL,
    reward_claimed BOOLEAN DEFAULT false,
    
    order_id UUID REFERENCES orders(id),
    reward_amount DECIMAL(10,2),
    
    status REFERRAL_STATUS DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
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
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    
    status TICKET_STATUS DEFAULT 'open',
    priority TICKET_PRIORITY DEFAULT 'medium',
    category TEXT,
    
    assigned_to UUID,
    resolved_at TIMESTAMPTZ,
    
    rating INT,
    feedback TEXT,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket messages
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AFFILIATES
-- ============================================

-- Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    
    affiliate_code TEXT UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    
    status AFFILIATE_STATUS DEFAULT 'pending',
    approved_at TIMESTAMPTZ,
    
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0,
    
    payout_method TEXT,
    payout_email TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate commissions
CREATE TABLE IF NOT EXISTS affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    order_id UUID REFERENCES orders(id),
    
    sale_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    
    status COMMISSION_STATUS DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    
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
-- ENUMS (Custom Types)
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

-- Full text search
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('french', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_categories_search ON categories USING gin(to_tsvector('french', name));

-- ============================================
-- TRIGGERS
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

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Users can see their own data
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own addresses" ON addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- SEQUENCES
-- ============================================

CREATE SEQUENCE order_number_seq START WITH 1000;
CREATE SEQUENCE ticket_number_seq START WITH 10000;

-- ============================================
-- FUNCTIONS
-- ============================================

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

-- Calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO total
    FROM order_items
    WHERE order_id = order_id;
    RETURN total;
END;
$$ LANGUAGE plpgsql;

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