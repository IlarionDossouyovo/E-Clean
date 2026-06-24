// 🤖 API OLLAMA - E-CLEAN
// Endpoint pour utiliser Ollama en local

import { NextRequest, NextResponse } from 'next/server'

// Configuration Ollama locale
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const DEFAULT_MODEL = process.env.OLLAMA_MODEL_CHAT || 'llama3.2'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  max_tokens?: number
}

// 💬 Chat avec Ollama
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, temperature = 0.7, max_tokens = 4000 } = body
    
    const model = body.model || DEFAULT_MODEL

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        temperature,
        max_tokens,
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Ollama error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: data.message,
      model: data.model,
    })
  } catch (error) {
    console.error('❌ Ollama API error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Ollama. Make sure Ollama is running on localhost:11434' },
      { status: 500 }
    )
  }
}

// 📋 Lister les modèles
export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Ollama not available' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      models: data.models || [],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Ollama not running. Start with: ollama serve', models: [] },
      { status: 500 }
    )
  }
}