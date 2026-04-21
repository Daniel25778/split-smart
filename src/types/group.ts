import type { UserSummary } from './user'

export interface Group {
  id: string
  name: string
  description?: string
  coverImageUrl?: string
  members: UserSummary[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface GroupSummary {
  id: string
  name: string
  coverImageUrl?: string
  memberCount: number
  totalExpenses: number
}

export interface CreateGroupInput {
  name: string
  description?: string
  coverImageUrl?: string
}

export interface UpdateGroupInput {
  name?: string
  description?: string
  coverImageUrl?: string
}

export interface AddMemberInput {
  userId: string
}
