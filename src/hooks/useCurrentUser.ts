import { useSession } from 'next-auth/react'

interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export const useCurrentUser = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        avatarUrl: session.user.image || null,
      }
    : null

  return { user, loading }
}
