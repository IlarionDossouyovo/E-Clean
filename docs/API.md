# E-Clean API Specification

## Base URL
```
Production: https://api.e-clean.com/v1
Staging: https://api-staging.e-clean.com/v1
```

---

## 🏷️ Authentication

### POST /auth/register
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2250123456789",
  "type": "individual" // individual | professional | dropshipper
}
```

### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### POST /auth/refresh
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/logout
**Headers**: `Authorization: Bearer <token>`

---

## 👤 Users

### GET /users/me
**Headers**: `Authorization: Bearer <token>`

### PATCH /users/me
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2250123456789",
  "avatar": "https://cdn.e-clean.com/avatars/123.jpg"
}
```

### GET /users/me/addresses
### POST /users/me/addresses
```json
{
  "label": "Maison",
  "street": "123 Rue Principale",
  "city": "Abidjan",
  "country": "CI",
  "postalCode": "01 BP 1234",
  "isDefault": true
}
```

---

## 🛒 Products

### GET /products
| Paramètre | Type | Description |
|-----------|------|-------------|
| page | int | Page number |
| limit | int | Items per page (default: 20) |
| category | string | Category slug |
| search | string | Search term |
| minPrice | float | Min price |
| maxPrice | float | Max price |
| brand | string | Brand filter |
| inStock | bool | In stock only |
| sort | string | price_asc, price_desc, newest |

### GET /products/{id}
### GET /products/{id}/variants

### POST /products (Admin)
```json
{
  "name": "Nettoyeur Professionnel Ultra",
  "description": "Description du produit",
  "category": " nettoyants-industriels",
  "brand": "E-Clean Pro",
  "sku": "ECP-001",
  "price": 29.99,
  "compareAtPrice": 39.99,
  "cost": 15.00,
  "currency": "EUR",
  "taxRate": 20,
  "stock": 100,
  "lowStockThreshold": 10,
  "weight": 0.5,
  "dimensions": {
    "length": 10,
    "width": 10,
    "height": 25
  },
  "images": [
    "https://cdn.e-clean.com/products/1.jpg",
    "https://cdn.e-clean.com/products/2.jpg"
  ],
  "variants": [
    {
      "name": "500ml",
      "sku": "ECP-001-500",
      "price": 29.99,
      "stock": 50
    },
    {
      "name": "1L",
      "sku": "ECP-001-1L",
      "price": 49.99,
      "stock": 50
    }
  ]
}
```

### PATCH /products/{id} (Admin)
### DELETE /products/{id} (Admin)

---

## 🛒 Categories

### GET /categories
```json
{
  "data": [
    {
      "id": "cat_001",
      "name": "Nettoyants Ménagers",
      "slug": "nettoyants-menagers",
      "parentId": null,
      "image": "https://cdn.e-clean.com/cats/1.jpg",
      "children": []
    }
  ]
}
```

---

## 🛒 Cart

### GET /cart
**Headers**: `Authorization: Bearer <token>`

### POST /cart/items
```json
{
  "productId": "prod_123",
  "variantId": "var_456",
  "quantity": 2
}
```

### PATCH /cart/items/{itemId}
```json
{
  "quantity": 5
}
```

### DELETE /cart/items/{itemId}
### DELETE /cart

---

## 💳 Orders

### GET /orders
| Paramètre | Type | Description |
|-----------|------|-------------|
| status | string | pending, processing, shipped, delivered, cancelled, refunded |
| page | int | Page |
| limit | int | Items |

### GET /orders/{id}

### POST /orders (Checkout)
```json
{
  "shippingAddress": "addr_123",
  "billingAddress": "addr_456",
  "paymentMethod": "card", // card | paypal | bank | crypto
  "paymentToken": "tok_xxx", // Stripe token
  "couponCode": "SAVE20",
  "notes": "Merci de livrer avant 18h"
}
```

### POST /orders/{id}/cancel
```json
{
  "reason": "Client a annulé"
}
```

---

## 💳 Payments

### POST /payments/methods
```json
{
  "type": "card", // card | bank | wallet
  "token": "tok_stripe_xxx"
}
```

### GET /payments/methods
### DELETE /payments/methods/{id}

### GET /payments/invoices/{orderId}
### GET /payments/refunds

---

## 📦 Shipping

### GET /shipping/rates
```json
{
  "addressId": "addr_123",
  "items": [
    { "productId": "prod_1", "quantity": 2 }
  ]
}
```

### POST /shipping/rates/calculate
```json
{
  "country": "FR",
  "city": "Paris",
  "postalCode": "75001",
  "weight": 1.5
}
```

### GET /trackings/{trackingNumber}

---

## 💰 Coupons

### GET /coupons
### POST /coupons (Admin)
```json
{
  "code": "SUMMER2026",
  "type": "percent", // percent | fixed
  "value": 20,
  "minOrderAmount": 50,
  "maxUses": 100,
  "startsAt": "2026-06-01",
  "expiresAt": "2026-08-31",
  "categories": ["cat_001"],
  "products": []
}
```

---

## 📊 Analytics

### GET /analytics/sales
| Paramètre | Type | Description |
|-----------|------|-------------|
| startDate | date | YYYY-MM-DD |
| endDate | date | YYYY-MM-DD |
| groupBy | string | day | week | month |

### GET /analytics/products
### GET /analytics/customers
### GET /analytics/traffic

---

## 🔧 Admin

### GET /admin/orders
### PATCH /admin/orders/{id}
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123"
}
```

### GET /admin/products
### POST /admin/products
### GET /admin/customers
### PATCH /admin/customers/{id}

---

## 📡 Webhooks

### Supported Events
```json
{
  "events": [
    "order.created",
    "order.paid",
    "order.shipped",
    "order.delivered",
    "order.cancelled",
    "customer.registered",
    "product.lowstock",
    "payment.refunded"
  ]
}
```

### Webhook Payload
```json
{
  "event": "order.created",
  "timestamp": "2026-04-20T12:00:00Z",
  "data": {
    "orderId": "ord_123",
    "customerId": "usr_456",
    "total": 99.99,
    "currency": "EUR"
  }
}
```

---

## 📝 Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  }
}
```

### Error Codes
| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid input |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | No permission |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal error |

---

## 📌 Rate Limits

| Plan | Requests/min |
|------|-------------|
| Free | 60 |
| Pro | 600 |
| Enterprise | 6000 |

---

*Version: 1.0.0*  
*Generated: 2026-04-20*