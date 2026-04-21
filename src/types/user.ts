export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: Date
}

export interface UserSummary {
  id: string
  name: string
  avatarUrl?: string
}
