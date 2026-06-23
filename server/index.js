// ============================================
// E-CLEAN AI BACKEND SERVER
// Clean Stack - AI-Powered Business Management
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'eclean_db',
    user: process.env.DB_USER || 'eclean',
    password: process.env.DB_PASSWORD || 'eclean_secure_pass'
});

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// ============================================
// AI AGENT SYSTEM PROMPTS
// ============================================

const AGENT_PROMPTS = {
    sales: `Tu es E-Clean Sales Agent, un assistant commercial expert. Ton rôle est d'aider les clients à trouver les produits de nettoyage adaptés à leurs besoins, de qualifier les leads, et de recommandations personnalisées. Tu es professionnel, courtois et orienté résultats.`,
    
    support: `Tu es E-Clean Support Agent, un assistant client expert. Ton rôle est de répondre aux questions des clients, de résoudre leurs problèmes et de fournir un excellent service après-vente. Sois patient, empathique et efficace.`,
    
    finance: `Tu es E-Clean Finance Agent, un expert financier. Ton rôle est de répondre aux questions sur la facturation, les paiements, les remboursements et la gestion financière. Sois précis et professionnel.`,
    
    operations: `Tu es E-Clean Operations Agent, un expert en logistique. Ton rôle est de répondre aux questions sur les commandes, la livraison, le stock et les opérations. Sois clair et efficace.`,
    
    marketing: `Tu es E-Clean Marketing Agent, un expert marketing. Ton rôle est de conseiller sur les promotions, les campagnes et les stratégies marketing. Sois créatif et orienté résultats.`
};

// ============================================
// OLLAMA AI FUNCTIONS
// ============================================

async function callOllama(prompt, systemPrompt, context = {}) {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                prompt: prompt,
                system: systemPrompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    max_tokens: 2048
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`);
        }
        
        const data = await response.json();
        return {
            response: data.response,
            tokens: data.eval_count || 0,
            done: data.done
        };
    } catch (error) {
        console.error('Ollama call error:', error);
        return {
            response: 'Désolé, je rencontre actuellement des difficultés. Veuillez réessayer plus tard.',
            tokens: 0,
            error: error.message
        };
    }
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all AI agents
app.get('/api/ai-agents', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, slug, description, agent_type, capabilities, is_active, model_name, temperature
            FROM ai_agents
            ORDER BY agent_type
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single AI agent
app.get('/api/ai-agents/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await pool.query(`
            SELECT * FROM ai_agents WHERE slug = $1
        `, [slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Agent non trouvé' });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Chat with AI agent
app.post('/api/ai-agents/:slug/chat', async (req, res) => {
    try {
        const { slug } = req.params;
        const { message, context = {} } = req.body;
        
        if (!message) {
            return res.status(400).json({ success: false, error: 'Message requis' });
        }
        
        // Get agent config
        const agentResult = await pool.query(`
            SELECT * FROM ai_agents WHERE slug = $1 AND is_active = true
        `, [slug]);
        
        if (agentResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Agent non trouvé ou inactif' });
        }
        
        const agent = agentResult.rows[0];
        const systemPrompt = agent.system_prompt || AGENT_PROMPTS[agent.agent_type] || 'Tu es un assistant E-Clean.';
        
        // Call Ollama
        const aiResponse = await callOllama(message, systemPrompt, context);
        
        // Log conversation
        await pool.query(`
            INSERT INTO ai_conversations (agent_id, user_message, ai_response, tokens_used)
            VALUES ($1, $2, $3, $4)
        `, [agent.id, message, aiResponse.response, aiResponse.tokens]);
        
        res.json({
            success: true,
            data: {
                agent: agent.name,
                response: aiResponse.response,
                tokens: aiResponse.tokens
            }
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get blog categories
app.get('/api/blog/categories', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM blog_categories
            WHERE is_active = true
            ORDER BY sort_order
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get blog articles
app.get('/api/blog/articles', async (req, res) => {
    try {
        const { category, limit = 10 } = req.query;
        let query = `
            SELECT ba.*, bc.name as category_name, bc.slug as category_slug
            FROM blog_articles ba
            LEFT JOIN blog_categories bc ON ba.category_id = bc.id
            WHERE ba.status = 'published'
        `;
        const params = [];
        
        if (category) {
            query += ` AND bc.slug = $1`;
            params.push(category);
        }
        
        query += ` ORDER BY ba.is_featured DESC, ba.published_at DESC LIMIT $${params.length + 1}`;
        params.push(limit);
        
        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single blog article
app.get('/api/blog/articles/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await pool.query(`
            SELECT ba.*, bc.name as category_name
            FROM blog_articles ba
            LEFT JOIN blog_categories bc ON ba.category_id = bc.id
            WHERE ba.slug = $1 AND ba.status = 'published'
        `, [slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Article non trouvé' });
        }
        
        // Increment view count
        await pool.query(`
            UPDATE blog_articles SET views_count = views_count + 1 WHERE id = $1
        `, [result.rows[0].id]);
        
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get products
app.get('/api/products', async (req, res) => {
    try {
        const { category, featured, limit = 20 } = req.query;
        let query = `
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = true
        `;
        const params = [];
        
        if (featured === 'true') {
            query += ` AND p.is_featured = true`;
        }
        
        if (category) {
            query += ` AND c.slug = $1`;
            params.push(category);
        }
        
        query += ` ORDER BY p.is_featured DESC, p.created_at DESC LIMIT $${params.length + 1}`;
        params.push(limit);
        
        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get orders
app.get('/api/orders', async (req, res) => {
    try {
        const { user_id, status, limit = 20 } = req.query;
        let query = `SELECT * FROM orders WHERE 1=1`;
        const params = [];
        
        if (user_id) {
            query += ` AND user_id = $${params.length + 1}`;
            params.push(user_id);
        }
        
        if (status) {
            query += ` AND status = $${params.length + 1}`;
            params.push(status);
        }
        
        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(limit);
        
        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get analytics
app.get('/api/analytics', async (req, res) => {
    try {
        // Get various stats
        const [
            totalOrders,
            totalRevenue,
            activeCustomers,
            pendingTickets,
            totalProducts,
            lowStockProducts
        ] = await Promise.all([
            pool.query(`SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders WHERE status NOT IN ('cancelled', 'refunded')`),
            pool.query(`SELECT COUNT(*) as count FROM profiles WHERE role = 'customer' AND status = 'active'`),
            pool.query(`SELECT COUNT(*) as count FROM support_tickets WHERE status IN ('open', 'in_progress')`),
            pool.query(`SELECT COUNT(*) as count FROM products WHERE is_active = true`),
            pool.query(`SELECT COUNT(*) as count FROM products WHERE stock <= low_stock_threshold`)
        ]);
        
        res.json({
            success: true,
            data: {
                orders: {
                    total: parseInt(totalOrders.rows[0].count),
                    revenue: parseFloat(totalOrders.rows[0].revenue)
                },
                customers: {
                    active: parseInt(activeCustomers.rows[0].count)
                },
                support: {
                    pending: parseInt(pendingTickets.rows[0].count)
                },
                products: {
                    total: parseInt(totalProducts.rows[0].count),
                    lowStock: parseInt(lowStockProducts.rows[0].count)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// WORKFLOW ENDPOINTS
// ============================================

// Get workflows
app.get('/api/workflows', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM ai_workflows
            WHERE is_active = true
            ORDER BY name
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Trigger workflow
app.post('/api/workflows/:slug/trigger', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data = {} } = req.body;
        
        const result = await pool.query(`
            SELECT * FROM ai_workflows WHERE slug = $1 AND is_active = true
        `, [slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Workflow non trouvé' });
        }
        
        const workflow = result.rows[0];
        
        // Log workflow execution
        console.log(`Triggering workflow: ${workflow.name}`, data);
        
        res.json({
            success: true,
            message: `Workflow ${workflow.name} déclenché`,
            workflow: workflow.name
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Admin login check
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query(`
            SELECT id, email, first_name, last_name, role
            FROM profiles
            WHERE email = $1 AND role = 'admin'
        `, [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Admin non trouvé' });
        }
        
        // In production, verify password hash
        res.json({
            success: true,
            data: {
                id: result.rows[0].id,
                email: result.rows[0].email,
                name: `${result.rows[0].first_name} ${result.rows[0].last_name}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🚀 E-Clean AI Server                              ║
║   Clean Stack - AI-Powered Business Management       ║
║   Server: http://localhost:${PORT}                    ║
║   Ollama:  ${OLLAMA_URL}                  ║
║   Model:  ${OLLAMA_MODEL}                                ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;