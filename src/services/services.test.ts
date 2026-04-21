import { describe, it, expect, beforeEach, vi } from 'vitest'

import * as balanceService from './balanceService'
import * as expenseService from './expenseService'
import * as groupService from './groupService'
import { MOCK_GROUPS } from './mockData'

vi.mock('@/lib/mockDelay', () => ({
  mockDelay: vi.fn(),
}))

describe('Group Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getGroups', () => {
    it('should return groups for a user', async () => {
      const response = await groupService.getGroups('user1')

      expect(response.error).toBeNull()
      expect(response.loading).toBe(false)
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.data.length).toBeGreaterThan(0)

      for (const group of response.data) {
        expect(group.id).toBeDefined()
        expect(group.name).toBeDefined()
        expect(typeof group.memberCount).toBe('number')
        expect(typeof group.totalExpenses).toBe('number')
      }
    })

    it('should return empty array for user in no groups', async () => {
      const response = await groupService.getGroups('user999')

      expect(response.error).toBeNull()
      expect(response.data).toHaveLength(0)
    })

    it('should include totalExpenses in GroupSummary', async () => {
      const response = await groupService.getGroups('user1')

      expect(response.error).toBeNull()
      for (const group of response.data) {
        expect(typeof group.totalExpenses).toBe('number')
        expect(group.totalExpenses).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('getGroupById', () => {
    it('should return group by id', async () => {
      const response = await groupService.getGroupById('group1')

      expect(response.error).toBeNull()
      expect(response.data?.id).toBe('group1')
      expect(response.data?.name).toBeDefined()
      expect(Array.isArray(response.data?.members)).toBe(true)
    })

    it('should return error for non-existent group', async () => {
      const response = await groupService.getGroupById('non-existent')

      expect(response.error).toBe('Grupo não encontrado')
      expect(response.data).toBeNull()
    })
  })

  describe('createGroup', () => {
    it('should create a new group', async () => {
      const newGroup = {
        name: 'New Test Group',
        description: 'A test group',
      }

      const response = await groupService.createGroup(newGroup, 'user1')

      expect(response.error).toBeNull()
      expect(response.data?.name).toBe(newGroup.name)
      expect(response.data?.description).toBe(newGroup.description)
      expect(response.data?.members).toHaveLength(1)
      expect(response.data?.members[0].id).toBe('user1')
    })
  })

  describe('updateGroup', () => {
    it('should update group name', async () => {
      const update = { name: 'Updated Name' }
      const response = await groupService.updateGroup('group1', update)

      expect(response.error).toBeNull()
      expect(response.data?.name).toBe(update.name)
    })

    it('should return error for non-existent group', async () => {
      const update = { name: 'Updated Name' }
      const response = await groupService.updateGroup('non-existent', update)

      expect(response.error).toBe('Grupo não encontrado')
    })
  })

  describe('addMember', () => {
    it('should add a member to group', async () => {
      const initialGroup = MOCK_GROUPS.find((g) => g.id === 'group1')!
      const initialCount = initialGroup.members.length

      const response = await groupService.addMember('group1', {
        userId: 'user4',
      })

      expect(response.error).toBeNull()
      expect(response.data?.members.length).toBe(initialCount + 1)
    })

    it('should return error for non-existent group', async () => {
      const response = await groupService.addMember('non-existent', {
        userId: 'user1',
      })

      expect(response.error).toBe('Grupo não encontrado')
    })
  })

  describe('removeMember', () => {
    it('should remove member from group', async () => {
      const response = await groupService.removeMember('group1', 'user2')

      expect(response.error).toBeNull()
      expect(response.data?.members.find((m) => m.id === 'user2')).toBeUndefined()
    })

    it('should return error for non-existent group', async () => {
      const response = await groupService.removeMember('non-existent', 'user1')

      expect(response.error).toBe('Grupo não encontrado')
    })
  })
})

describe('Expense Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getExpensesByGroup', () => {
    it('should return expenses for a group', async () => {
      const response = await expenseService.getExpensesByGroup('group1')

      expect(response.error).toBeNull()
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.data.length).toBeGreaterThan(0)

      for (const expense of response.data) {
        expect(expense.groupId).toBe('group1')
        expect(expense.title).toBeDefined()
        expect(typeof expense.amount).toBe('number')
      }
    })

    it('should return empty array for group with no expenses', async () => {
      const response = await expenseService.getExpensesByGroup('group999')

      expect(response.error).toBeNull()
      expect(response.data).toHaveLength(0)
    })
  })

  describe('getExpenseById', () => {
    it('should return expense by id', async () => {
      const response = await expenseService.getExpenseById('exp1')

      expect(response.error).toBeNull()
      expect(response.data?.id).toBe('exp1')
      expect(response.data?.title).toBeDefined()
    })

    it('should return error for non-existent expense', async () => {
      const response = await expenseService.getExpenseById('non-existent')

      expect(response.error).toBe('Despesa não encontrada')
      expect(response.data).toBeNull()
    })
  })

  describe('createExpense', () => {
    it('should create a new expense', async () => {
      const newExpense = {
        title: 'Test Expense',
        amount: 100,
        currency: 'BRL',
        category: 'food' as const,
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 100, paid: false }],
        splitMethod: 'equal' as const,
        date: '2024-01-01',
      }

      const response = await expenseService.createExpense(newExpense)

      expect(response.error).toBeNull()
      expect(response.data?.title).toBe(newExpense.title)
      expect(response.data?.amount).toBe(newExpense.amount)
    })
  })

  describe('updateExpense', () => {
    it('should update expense title', async () => {
      const update = { title: 'Updated Title' }
      const response = await expenseService.updateExpense('exp1', update)

      expect(response.error).toBeNull()
      expect(response.data?.title).toBe(update.title)
    })

    it('should return error for non-existent expense', async () => {
      const update = { title: 'Updated Title' }
      const response = await expenseService.updateExpense('non-existent', update)

      expect(response.error).toBe('Despesa não encontrada')
    })
  })

  describe('deleteExpense', () => {
    it('should delete an expense', async () => {
      const response = await expenseService.deleteExpense('exp1')

      expect(response.error).toBeNull()
      expect(response.data).toBe(true)
    })

    it('should return error for non-existent expense', async () => {
      const response = await expenseService.deleteExpense('non-existent')

      expect(response.error).toBe('Despesa não encontrada')
    })
  })
})

describe('Balance Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getGroupBalances', () => {
    it('should calculate balances for group', async () => {
      const response = await balanceService.getGroupBalances('group1')

      expect(response.error).toBeNull()
      expect(response.loading).toBe(false)
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.data.length).toBeGreaterThan(0)

      for (const balance of response.data) {
        expect(balance.userId).toBeDefined()
        expect(balance.userName).toBeDefined()
        expect(typeof balance.totalPaid).toBe('number')
        expect(typeof balance.totalOwed).toBe('number')
        expect(typeof balance.netBalance).toBe('number')
      }
    })

    it('should return error for non-existent group', async () => {
      const response = await balanceService.getGroupBalances('non-existent')

      expect(response.error).toBe('Grupo não encontrado')
      expect(response.data).toHaveLength(0)
    })

    it('should calculate positive net balance for creditors', async () => {
      const response = await balanceService.getGroupBalances('group1')

      expect(response.error).toBeNull()
      const creditors = response.data.filter((b) => b.netBalance > 0)
      expect(creditors.length).toBeGreaterThan(0)
    })
  })

  describe('getSettlements', () => {
    it('should return settlements for group', async () => {
      const response = await balanceService.getSettlements('group1')

      expect(response.error).toBeNull()
      expect(Array.isArray(response.data)).toBe(true)
    })

    it('should return error for non-existent group', async () => {
      const response = await balanceService.getSettlements('non-existent')

      expect(response.error).toBe('Grupo não encontrado')
      expect(response.data).toHaveLength(0)
    })

    it('should create settlements with valid structure', async () => {
      const response = await balanceService.getSettlements('group1')

      expect(Array.isArray(response.data)).toBe(true)

      for (const settlement of response.data) {
        expect(settlement.fromUserId).toBeDefined()
        expect(settlement.fromUserName).toBeDefined()
        expect(settlement.toUserId).toBeDefined()
        expect(settlement.toUserName).toBeDefined()
        expect(settlement.amount).toBeGreaterThan(0)
        expect(settlement.fromUserId).not.toBe(settlement.toUserId)
      }
    })
  })
})
