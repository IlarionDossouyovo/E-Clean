/**
 * Ollama Client for E-Clean AI Agents
 * Connects to local Ollama instance for LLM capabilities
 * 
 * Models available:
 * - llama3.2:latest (2.0 GB) - Default for reasoning
 * - llama3.1:8b (4.9 GB) - Larger model
 * - qwen2.5-coder:7b (4.7 GB) - Code-focused
 * - phi3:mini (2.2 GB) - Lightweight
 */

export interface OllamaConfig {
  baseUrl: string
  defaultModel: string
  timeout: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  model: string
  messages: ChatMessage[]
  stream?: boolean
  temperature?: number
  top_p?: number
  max_tokens?: number
}

export interface ChatResponse {
  model: string
  message: {
    role: string
    content: string
  }
  done: boolean
  total_duration?: number
  load_duration?: number
}

export interface EmbedRequest {
  model: string
  input: string | string[]
}

export interface EmbedResponse {
  model: string
  embeddings: number[][]
  total_duration?: number
}

// Default configuration - connects to host machine
const defaultConfig: OllamaConfig = {
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://host.docker.internal:11434',
  defaultModel: 'llama3.2:latest',
  timeout: 60000,
}

class OllamaClient {
  private config: OllamaConfig
  private baseUrl: string

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.baseUrl = this.config.baseUrl
  }

  /**
   * Send a chat request to Ollama
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || this.config.defaultModel,
        messages: request.messages,
        stream: false,
        temperature: request.temperature || 0.7,
        top_p: request.top_p || 0.9,
        max_tokens: request.max_tokens || 2048,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Generate embeddings for text
   */
  async embed(request: EmbedRequest): Promise<EmbedResponse> {
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'nomic-embed-text:latest',
        prompt: typeof request.input === 'string' ? request.input : request.input.join('\n'),
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama embedding error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<{ models: { name: string; size: number; modified_at: string }[] }> {
    const response = await fetch(`${this.baseUrl}/api/tags`)
    if (!response.ok) {
      throw new Error('Failed to list models')
    }
    return response.json()
  }

  /**
   * Generate completion (non-chat)
   */
  async generate(prompt: string, model?: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || this.config.defaultModel,
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama generate error: ${response.status}`)
    }

    const data = await response.json()
    return data.response
  }

  /**
   * Build context for agents with system prompt
   */
  buildSystemMessage(instructions: string, context?: string): ChatMessage[] {
    const systemPrompt = `Tu es un agent IA d'E-Clean, une plateforme e-commerce de produits de nettoyage haut de gamme.
    
${instructions}

${context ? `Contexte supplémentaire:\n${context}` : ''}

Tu dois répondre de manière professionnelle, empathetic et efficace. Utilise le français comme langue principale.`

    return [
      { role: 'system', content: systemPrompt },
    ]
  }

  /**
   * Chat with agent context
   */
  async agentChat(
    instructions: string,
    userMessage: string,
    context?: string,
    model?: string
  ): Promise<string> {
    const messages = this.buildSystemMessage(instructions, context)
    messages.push({ role: 'user', content: userMessage })

    const response = await this.chat({
      model: model || this.config.defaultModel,
      messages,
      temperature: 0.7,
    })

    return response.message.content
  }
}

// Export singleton instance
export const ollama = new OllamaClient()

// Export class for custom instances
export { OllamaClient }

// Helper to detect best model for task
export function getBestModelForTask(task: 'reasoning' | 'coding' | 'fast' | 'balanced'): string {
  const models = {
    reasoning: 'llama3.1:8b',      // Better reasoning
    coding: 'qwen2.5-coder:7b',   // Code-focused
    fast: 'phi3:mini',             // Lightweight
    balanced: 'llama3.2:latest',    // Default balanced
  }
  return models[task] || models.balanced
}

export default ollama
