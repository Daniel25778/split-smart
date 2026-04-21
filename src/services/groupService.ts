import { mockDelay } from '@/lib/mockDelay'

import { MOCK_GROUPS, MOCK_USERS, MOCK_EXPENSES } from './mockData'

import type {
  ApiResponse,
  CreateGroupInput,
  Group,
  GroupSummary,
  UpdateGroupInput,
  AddMemberInput,
} from '@/types'

export const getGroups = async (userId: string): Promise<ApiResponse<GroupSummary[]>> => {
  await mockDelay()

  try {
    const userGroups = MOCK_GROUPS.filter((group) =>
      group.members.some((member) => member.id === userId),
    )

    const summaries: GroupSummary[] = userGroups.map((group) => {
      const groupExpenses = MOCK_EXPENSES.filter((exp) => exp.groupId === group.id)
      const totalExpenses = groupExpenses.reduce((acc, exp) => acc + exp.amount, 0)

      return {
        id: group.id,
        name: group.name,
        coverImageUrl: group.coverImageUrl,
        memberCount: group.members.length,
        totalExpenses,
      }
    })

    return {
      data: summaries,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: [],
      error: 'Falha ao buscar grupos',
      loading: false,
    }
  }
}

export const getGroupById = async (groupId: string): Promise<ApiResponse<Group>> => {
  await mockDelay()

  try {
    const group = MOCK_GROUPS.find((g) => g.id === groupId)

    if (!group) {
      return {
        data: null as unknown as Group,
        error: 'Grupo não encontrado',
        loading: false,
      }
    }

    return {
      data: group,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: null as unknown as Group,
      error: 'Falha ao buscar grupo',
      loading: false,
    }
  }
}

export const createGroup = async (
  input: CreateGroupInput,
  createdBy: string,
): Promise<ApiResponse<Group>> => {
  await mockDelay()

  try {
    const newGroup: Group = {
      id: `group${Date.now()}`,
      name: input.name,
      description: input.description,
      coverImageUrl: input.coverImageUrl,
      members: [MOCK_USERS.find((u) => u.id === createdBy) || MOCK_USERS[0]],
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    MOCK_GROUPS.push(newGroup)

    return {
      data: newGroup,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: null as unknown as Group,
      error: 'Falha ao criar grupo',
      loading: false,
    }
  }
}

export const updateGroup = async (
  groupId: string,
  input: UpdateGroupInput,
): Promise<ApiResponse<Group>> => {
  await mockDelay()

  try {
    const group = MOCK_GROUPS.find((g) => g.id === groupId)

    if (!group) {
      return {
        data: null as unknown as Group,
        error: 'Grupo não encontrado',
        loading: false,
      }
    }

    if (input.name) group.name = input.name
    if (input.description) group.description = input.description
    if (input.coverImageUrl) group.coverImageUrl = input.coverImageUrl
    group.updatedAt = new Date()

    return {
      data: group,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: null as unknown as Group,
      error: 'Falha ao atualizar grupo',
      loading: false,
    }
  }
}

export const addMember = async (
  groupId: string,
  input: AddMemberInput,
): Promise<ApiResponse<Group>> => {
  await mockDelay()

  try {
    const group = MOCK_GROUPS.find((g) => g.id === groupId)

    if (!group) {
      return {
        data: null as unknown as Group,
        error: 'Grupo não encontrado',
        loading: false,
      }
    }

    const user = MOCK_USERS.find((u) => u.id === input.userId)

    if (!user) {
      return {
        data: null as unknown as Group,
        error: 'Usuário não encontrado',
        loading: false,
      }
    }

    const alreadyMember = group.members.some((m) => m.id === user.id)
    if (!alreadyMember) {
      group.members.push(user)
      group.updatedAt = new Date()
    }

    return {
      data: group,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: null as unknown as Group,
      error: 'Falha ao adicionar membro',
      loading: false,
    }
  }
}

export const removeMember = async (
  groupId: string,
  userId: string,
): Promise<ApiResponse<Group>> => {
  await mockDelay()

  try {
    const group = MOCK_GROUPS.find((g) => g.id === groupId)

    if (!group) {
      return {
        data: null as unknown as Group,
        error: 'Grupo não encontrado',
        loading: false,
      }
    }

    group.members = group.members.filter((m) => m.id !== userId)
    group.updatedAt = new Date()

    return {
      data: group,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: null as unknown as Group,
      error: 'Falha ao remover membro',
      loading: false,
    }
  }
}
