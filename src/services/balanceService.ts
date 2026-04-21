import { calculateGroupBalances, calculateSettlements } from '@/lib/calculations'
import { mockDelay } from '@/lib/mockDelay'

import { getExpensesByGroup } from './expenseService'
import { getGroupById } from './groupService'

import type { ApiResponse, Settlement, UserBalance } from '@/types'

export const getGroupBalances = async (groupId: string): Promise<ApiResponse<UserBalance[]>> => {
  await mockDelay()

  try {
    const groupResponse = await getGroupById(groupId)
    if (groupResponse.error) {
      return {
        data: [],
        error: groupResponse.error,
        loading: false,
      }
    }

    const expensesResponse = await getExpensesByGroup(groupId)
    if (expensesResponse.error) {
      return {
        data: [],
        error: expensesResponse.error,
        loading: false,
      }
    }

    const balances = calculateGroupBalances(expensesResponse.data, groupResponse.data.members)

    return {
      data: balances,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: [],
      error: 'Falha ao calcular saldos',
      loading: false,
    }
  }
}

export const getSettlements = async (groupId: string): Promise<ApiResponse<Settlement[]>> => {
  await mockDelay()

  try {
    const balancesResponse = await getGroupBalances(groupId)
    if (balancesResponse.error) {
      return {
        data: [],
        error: balancesResponse.error,
        loading: false,
      }
    }

    const settlements = calculateSettlements(balancesResponse.data)

    return {
      data: settlements,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: [],
      error: 'Falha ao calcular acertos',
      loading: false,
    }
  }
}
