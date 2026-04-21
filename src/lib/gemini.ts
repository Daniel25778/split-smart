import { GoogleGenerativeAI } from '@google/generative-ai'

import type { GenerativeModel } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error(
    [
      'GEMINI_API_KEY is missing.',
      'Add it to `.env.local` (not committed) or provide it in the environment.',
      'Example: GEMINI_API_KEY=your_api_key',
    ].join(' '),
  )
}

export const geminiClient = new GoogleGenerativeAI(apiKey)

export const getGeminiModel = (modelName: string): GenerativeModel => {
  return geminiClient.getGenerativeModel({ model: modelName })
}
