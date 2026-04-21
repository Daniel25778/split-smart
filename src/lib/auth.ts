import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { MOCK_AUTH_USERS } from './mockUsers'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = MOCK_AUTH_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password,
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.image = user.image
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
        session.user.image = token.image as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
