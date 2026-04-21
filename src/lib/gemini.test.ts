import { describe, expect, it, vi } from 'vitest'

describe('gemini client', () => {
  it('initializes without throwing when GEMINI_API_KEY is set', async () => {
    vi.resetModules()
    process.env.GEMINI_API_KEY = 'test_key'

    await expect(import('./gemini')).resolves.toBeDefined()
  })
})
