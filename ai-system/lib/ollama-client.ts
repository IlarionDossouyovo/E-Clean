// 🤖 OLLAMA CLIENT - E-CLEAN AI SYSTEM
// Connexion aux modèles IA locaux via Ollama

import { config } from '../config'

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OllamaRequest {
  model: string
  messages: OllamaMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export interface OllamaResponse {
  model: string
  message: {
    role: 'assistant'
    content: string
  }
  done: boolean
}

class OllamaClient {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = config.ollama.baseUrl
  }

  // 💬 Envoyer un message au chatbot
  async chat(messages: OllamaMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.ollama.models.chat,
          messages,
          stream: false,
          temperature: config.ollama.temperature,
          max_tokens: config.ollama.maxTokens,
        } as OllamaRequest),
      })

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`)
      }

      const data: OllamaResponse = await response.json()
      return data.message.content
    } catch (error) {
      console.error('❌ Ollama chat error:', error)
      throw error
    }
  }

  // 📝 Générer du texte
  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: OllamaMessage[] = []
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: prompt })
    return await this.chat(messages)
  }

  // 🔢 Obtenir les embeddings
  async embed(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.ollama.models.embedding,
          prompt: text,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`)
      }

      const data = await response.json()
      return data.embedding
    } catch (error) {
      console.error('❌ Ollama embed error:', error)
      throw error
    }
  }

  // 📋 Liste des modèles disponibles
  async listModels(): Promise<{ name: string; size: number }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      const data = await response.json()
      return data.models || []
    } catch {
      return []
    }
  }

  // ✅ Vérifier si Ollama est disponible
  async isAvailable(): Promise<boolean> {
    try {
      const models = await this.listModels()
      return models.length > 0
    } catch {
      return false
    }
  }
}

// Export unique instance
export const ollama = new OllamaClient()
export default ollama