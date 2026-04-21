import type { DefaultSession, DefaultJWT } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string
      image: string | null
    } & DefaultSession['user']
  }

  interface JWT extends DefaultJWT {
    id: string
    image: string | null
  }
}
