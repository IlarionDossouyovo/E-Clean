# E-Clean Database Schema

## PostgreSQL Database Design

---

## 🔐 Users & Authentication

### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | User ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| phone | VARCHAR(20) | | Phone number |
| type | ENUM | NOT NULL | individual/professional/dropshipper/vendor |
| status | ENUM | DEFAULT 'active' | active/inactive/suspended |
| email_verified | BOOLEAN | DEFAULT FALSE | Email verified |
| phone_verified | BOOLEAN | DEFAULT FALSE | Phone verified |
| kyc_status | ENUM | | pending/approved/rejected |
| referrer_id | UUID | FK→users | Referrer user |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | | Updated |

### user_addresses
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Address ID |
| user_id | UUID | FK→users | User |
| label | VARCHAR(50) | | Maison/Bureau/Point relais |
| street | VARCHAR(255) | NOT NULL | Street address |
| street2 | VARCHAR(255) | | Additional |
| city | VARCHAR(100) | NOT NULL | City |
| state | VARCHAR(100) | | State/Region |
| country | CHAR(2) | NOT NULL | Country code (ISO) |
| postal_code | VARCHAR(20) | | Postal code |
| latitude | DECIMAL(10,8) | | GPS latitude |
| longitude | DECIMAL(11,8) | | GPS longitude |
| is_default | BOOLEAN | DEFAULT FALSE | Default address |
| is_shipping | BOOLEAN | DEFAULT TRUE | Can ship here |
| is_billing | BOOLEAN | DEFAULT TRUE | Can bill here |
| created_at | TIMESTAMP | DEFAULT NOW() | |

### user_sessions
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Session ID |
| user_id | UUID | FK→users | User |
| token | VARCHAR(500) | NOT NULL | Refresh token |
| ip_address | VARCHAR(45) | | Client IP |
| user_agent | VARCHAR(255) | | Browser |
| expires_at | TIMESTAMP | NOT NULL | Expiry |
| created_at | TIMESTAMP | DEFAULT NOW() | |

---

## 🏷️ Products

### categories
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Category ID |
| name | VARCHAR(100) | NOT NULL | Name |
| slug | VARCHAR(100) | UNIQUE | URL slug |
| description | TEXT | | Description |
| parent_id | UUID | FK→categories | Parent |
| image | VARCHAR(500) | | Image URL |
| icon | VARCHAR(50) | | Icon class |
| sort_order | INTEGER | DEFAULT 0 | Sort |
| is_active | BOOLEAN | DEFAULT TRUE | Active |
| created_at | TIMESTAMP | DEFAULT NOW() | |

### brands
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Brand ID |
| name | VARCHAR(100) | NOT NULL | Brand |
| slug | VARCHAR(100) | UNIQUE | URL slug |
| logo | VARCHAR(500) | | Logo URL |
| description | TEXT | | Description |
| website | VARCHAR(255) | | Brand website |
| is_active | BOOLEAN | DEFAULT TRUE | Active |

### products
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Product ID |
| name | VARCHAR(255) | NOT NULL | Name |
| slug | VARCHAR(255) | UNIQUE | URL slug |
| description | TEXT | | Full description |
| summary | VARCHAR(500) | | Short summary |
| category_id | UUID | FK→categories | Category |
| brand_id | UUID | FK→brands | Brand |
| sku | VARCHAR(100) | UNIQUE | SKU |
| barcode | VARCHAR(100) | | EAN/UPC |
| price | DECIMAL(12,2) | NOT NULL | Price |
| compare_at_price | DECIMAL(12,2) | | Compare price |
| cost | DECIMAL(12,2) | | Cost |
| currency | CHAR(3) | DEFAULT 'EUR' | Currency |
| tax_rate | DECIMAL(5,2) | DEFAULT 20 | Tax % |
| stock | INTEGER | DEFAULT 0 | Stock quantity |
| low_stock_threshold | INTEGER | DEFAULT 10 | Alert threshold |
| weight | DECIMAL(10,3) | | Weight (kg) |
| weight_unit | VARCHAR(10) | DEFAULT 'kg' | kg/lb |
| is_featured | BOOLEAN | DEFAULT FALSE | Featured |
| is_active | BOOLEAN | DEFAULT TRUE | Active |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

### product_images
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Image ID |
| product_id | UUID | FK→products | Product |
| url | VARCHAR(500) | NOT NULL | Image URL |
| alt | VARCHAR(255) | | Alt text |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| is_primary | BOOLEAN | DEFAULT FALSE | Primary image |

### product_variants
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Variant ID |
| product_id | UUID | FK→products | Product |
| name | VARCHAR(100) | NOT NULL | Variant name |
| sku | VARCHAR(100) | UNIQUE | SKU |
| barcode | VARCHAR(100) | | EAN/UPC |
| price | DECIMAL(12,2) | | Override price |
| compare_at_price | DECIMAL(12,2) | | Compare price |
| stock | INTEGER | DEFAULT 0 | Stock |
| weight | DECIMAL(10,3) | | Weight |
| is_active | BOOLEAN | DEFAULT TRUE | Active |

### product_options
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Option ID |
| product_id | UUID | FK→products | Product |
| name | VARCHAR(50) | NOT NULL | ex: Taille, Couleur |
| values | JSONB | NOT NULL | ["S", "M", "L"] |

---

## 🛒 Orders

### orders
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Order ID |
| order_number | VARCHAR(20) | UNIQUE | Order # |
| user_id | UUID | FK→users | Customer |
| status | ENUM | DEFAULT 'pending' | pending/paid/processing/shipped/delivered/cancelled/refunded |
| currency | CHAR(3) | NOT NULL | Currency |
| subtotal | DECIMAL(12,2) | NOT NULL | Subtotal |
| shipping_cost | DECIMAL(12,2) | DEFAULT 0 | Shipping |
| tax_amount | DECIMAL(12,2) | DEFAULT 0 | Tax |
| discount_amount | DECIMAL(12,2) | DEFAULT 0 | Discount |
| total | DECIMAL(12,2) | NOT NULL | Total |
| shipping_address_id | UUID | FK→user_addresses | Ship to |
| billing_address_id | UUID | FK→user_addresses | Bill to |
| payment_method | VARCHAR(50) | | card/paypal/crypto |
| payment_reference | VARCHAR(255) | | Payment ID |
| notes | TEXT | | Customer notes |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

### order_items
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Item ID |
| order_id | UUID | FK→orders | Order |
| product_id | UUID | FK→products | Product |
| variant_id | UUID | FK→product_variants | Variant |
| name | VARCHAR(255) | NOT NULL | Product name |
| sku | VARCHAR(100) | | SKU |
| price | DECIMAL(12,2) | NOT NULL | Unit price |
| quantity | INTEGER | NOT NULL | Qty |
| tax_rate | DECIMAL(5,2) | | Tax % |
| tax_amount | DECIMAL(12,2) | | Tax |
| total | DECIMAL(12,2) | NOT NULL | Line total |

### shipments
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Shipment ID |
| order_id | UUID | FK→orders | Order |
| carrier | VARCHAR(100) | | Carrier |
| service | VARCHAR(100) | | Service |
| tracking_number | VARCHAR(255) | | Tracking |
| tracking_url | VARCHAR(500) | | URL |
| shipped_at | TIMESTAMP | | Shipped |
| delivered_at | TIMESTAMP | | Delivered |

---

## 💳 Payments & Finance

### payments
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Payment ID |
| order_id | UUID | FK→orders | Order |
| user_id | UUID | FK→users | Customer |
| amount | DECIMAL(12,2) | NOT NULL | Amount |
| currency | CHAR(3) | NOT NULL | Currency |
| method | VARCHAR(50) | | card/paypal/crypto |
| status | ENUM | DEFAULT 'pending' | pending/paid/failed/refunded |
| reference | VARCHAR(255) | | Payment ID |
| provider | VARCHAR(50) | | stripe/paypal |
| provider_reference | VARCHAR(255) | | Provider ID |
| paid_at | TIMESTAMP | | Paid date |
| created_at | TIMESTAMP | DEFAULT NOW() | |

### refunds
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Refund ID |
| payment_id | UUID | FK→payments | Payment |
| order_id | UUID | FK→orders | Order |
| amount | DECIMAL(12,2) | NOT NULL | Amount |
| reason | TEXT | | Reason |
| status | ENUM | | pending/processed/completed/failed |
| processed_at | TIMESTAMP | | Processed |
| created_at | TIMESTAMP | DEFAULT NOW() | |

### invoices
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Invoice ID |
| invoice_number | VARCHAR(20) | UNIQUE | Invoice # |
| order_id | UUID | FK→orders | Order |
| user_id | UUID | FK→users | Customer |
| issue_date | DATE | NOT NULL | Issue date |
| due_date | DATE | | Due date |
| status | ENUM | DEFAULT 'draft' | draft/sent/paid/overdue |
| pdf_url | VARCHAR(500) | | PDF URL |
| created_at | TIMESTAMP | DEFAULT NOW() | |

---

## 🏷️ Marketing

### coupons
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Coupon ID |
| code | VARCHAR(50) | UNIQUE | Code |
| type | ENUM | NOT NULL | percent/fixed/free_shipping |
| value | DECIMAL(10,2) | NOT NULL | Value |
| min_order_amount | DECIMAL(12,2) | | Min order |
| max_uses | INTEGER | | Max uses |
| uses_count | INTEGER | DEFAULT 0 | Used |
| starts_at | TIMESTAMP | | Start |
| expires_at | TIMESTAMP | | Expiry |
| is_active | BOOLEAN | DEFAULT TRUE | Active |

### coupon_usage
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| coupon_id | UUID | FK→coupons | Coupon |
| user_id | UUID | FK→users | User |
| order_id | UUID | FK→orders | Order |
| discount_amount | DECIMAL(12,2) | NOT NULL | Discount |
| used_at | TIMESTAMP | DEFAULT NOW() | |

### loyalty_points
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK→users | User |
| points | INTEGER | NOT NULL | Points |
| type | ENUM | | earned/redeemed/expired |
| reference | VARCHAR(255) | | Order ref |
| expires_at | TIMESTAMP | | Expiry |
| created_at | TIMESTAMP | DEFAULT NOW() | |

---

## 📊 Analytics Tables

### analytics_daily
| Column | Type | Description |
|--------|------|-------------|
| date | DATE | PK |
| orders_count | INTEGER | Orders |
| orders_total | DECIMAL(14,2) | Revenue |
| customers_count | INTEGER | New customers |
| products_sold | INTEGER | Items |
| returns_count | INTEGER | Returns |

### product_views
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK→products |
| user_id | UUID | FK→users |
| viewed_at | TIMESTAMP | DEFAULT NOW() |

---

## 🔧 Admin Tables

### admin_users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Admin ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| role | ENUM | admin/manager/support |
| permissions | JSONB | [] |
| last_login | TIMESTAMP | | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

### activity_logs
| Column | Type | Description |
|----------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK |
| action | VARCHAR(100) | What |
| entity_type | VARCHAR(50) | Table |
| entity_id | UUID | Row |
| data | JSONB | Changes |
| ip_address | VARCHAR(45) | |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

## 🚀 Indexes Recommandés

```sql
-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_active ON products(is_active);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Products
CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_product_views_date ON product_views(viewed_at);
```

---

*Generated: 2026-04-20*