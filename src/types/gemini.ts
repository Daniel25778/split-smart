export type GeminiRole = 'user' | 'model'

export type GeminiMessage = {
  role: GeminiRole
  content: string
}

export type GeminiResponse = {
  text: string
}
