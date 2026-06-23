# E-Clean Full Application

Premium E-commerce Platform with AI-Powered Automation

## 🚀 Quick Start

```bash
# Install dependencies
cd full-app
npm install

# Generate Prisma Client
npm run db:generate

# Set up database (requires PostgreSQL)
npm run db:push

# Start development server
npm run dev
```

## 📋 Environment Variables

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 16, Prisma ORM
- **AI**: OpenAI GPT-4

## 🤖 AI Agents (5)

1. **Sales Agent** - Customer analysis, lead qualification, product recommendations
2. **Support Agent** - Ticket classification, sentiment analysis, knowledge base
3. **Finance Agent** - Invoice generation, fraud detection, cashflow forecasting
4. **Operations Agent** - Inventory management, routing optimization
5. **Marketing Agent** - Campaign creation, content generation, A/B testing

## 🔄 Automated Workflows (6+)

- Order → Fulfillment Pipeline
- Customer Welcome Journey
- Abandoned Cart Recovery
- Inventory Management
- Refund Processing
- Review Generation

## 📁 Project Structure

```
full-app/
├── app/                 # Next.js App Router
│   ├── api/           # API Routes
│   │   ├── products/
│   │   ├── categories/
│   │   └── auth/
│   ├── layout.tsx
│   └── page.tsx
├── agents/             # AI Agents
│   ├── sales-agent.ts
│   ├── support-agent.ts
│   ├── finance-agent.ts
│   ├── operations-agent.ts
│   └── marketing-agent.ts
├── automation/          # Workflow Engine
│   └── workflow-engine.ts
├── prisma/
│   └── schema.prisma   # Database Schema
└── lib/
    └── prisma.ts       # Prisma Client
```

## 📄 License

Copyright © 2026 E-Clean - ELECTRON Group