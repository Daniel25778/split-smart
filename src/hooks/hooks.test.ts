import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import * as services from '@/services'

import { useGroupBalances, useSettlements } from './useBalance'
import { useExpenses } from './useExpenses'
import { useGroups, useGroup } from './useGroup'
import { useCreateGroup, useCreateExpense, useDeleteExpense } from './useMutations'

vi.mock('@/services')

describe('useGroups', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns groups on success', async () => {
    const mockGroups = [{ id: '1', name: 'Test Group', memberCount: 2 }]
    vi.mocked(services.getGroups).mockResolvedValue({ data: mockGroups })

    const { result } = renderHook(() => useGroups('user1'))

    expect(result.current.loading).toBe(true)
    expect(result.current.groups).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.groups).toEqual(mockGroups)
    expect(result.current.error).toBeNull()
  })

  it('returns error on failure', async () => {
    vi.mocked(services.getGroups).mockResolvedValue({ error: 'Failed to fetch' })

    const { result } = renderHook(() => useGroups('user1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.groups).toEqual([])
    expect(result.current.error).toBe('Failed to fetch')
  })

  it('refetches data when refetch is called', async () => {
    const mockGroups = [{ id: '1', name: 'Test Group', memberCount: 2 }]
    vi.mocked(services.getGroups).mockResolvedValue({ data: mockGroups })

    const { result } = renderHook(() => useGroups('user1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(services.getGroups).toHaveBeenCalledTimes(1)

    result.current.refetch()

    await waitFor(() => {
      expect(services.getGroups).toHaveBeenCalledTimes(2)
    })
  })
})

describe('useGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns group on success', async () => {
    const mockGroup = { id: '1', name: 'Test Group', members: [], expenses: [] }
    vi.mocked(services.getGroupById).mockResolvedValue({ data: mockGroup })

    const { result } = renderHook(() => useGroup('1'))

    expect(result.current.loading).toBe(true)
    expect(result.current.group).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.group).toEqual(mockGroup)
    expect(result.current.error).toBeNull()
  })

  it('returns error on failure', async () => {
    vi.mocked(services.getGroupById).mockResolvedValue({ error: 'Group not found' })

    const { result } = renderHook(() => useGroup('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.group).toBeNull()
    expect(result.current.error).toBe('Group not found')
  })
})

describe('useExpenses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns expenses on success', async () => {
    const mockExpenses = [
      {
        id: '1',
        description: 'Test expense',
        amount: 100,
        paidBy: 'user1',
        participants: ['user1', 'user2'],
      },
    ]
    vi.mocked(services.getExpensesByGroup).mockResolvedValue({ data: mockExpenses })

    const { result } = renderHook(() => useExpenses('group1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.expenses).toEqual(mockExpenses)
    expect(result.current.error).toBeNull()
  })

  it('returns error on failure', async () => {
    vi.mocked(services.getExpensesByGroup).mockResolvedValue({ error: 'Failed to fetch expenses' })

    const { result } = renderHook(() => useExpenses('group1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.expenses).toEqual([])
    expect(result.current.error).toBe('Failed to fetch expenses')
  })
})

describe('useGroupBalances', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns balances on success', async () => {
    const mockBalances = [{ userId: 'user1', balance: 50 }]
    vi.mocked(services.getGroupBalances).mockResolvedValue({ data: mockBalances })

    const { result } = renderHook(() => useGroupBalances('group1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.balances).toEqual(mockBalances)
    expect(result.current.error).toBeNull()
  })
})

describe('useSettlements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns settlements on success', async () => {
    const mockSettlements = [{ from: 'user1', to: 'user2', amount: 25 }]
    vi.mocked(services.getSettlements).mockResolvedValue({ data: mockSettlements })

    const { result } = renderHook(() => useSettlements('group1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.settlements).toEqual(mockSettlements)
    expect(result.current.error).toBeNull()
  })
})

describe('useCreateGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates group successfully', async () => {
    const mockGroup = { id: '1', name: 'New Group', members: [], expenses: [] }
    vi.mocked(services.createGroup).mockResolvedValue({ data: mockGroup })

    const { result } = renderHook(() => useCreateGroup())

    const createdGroup = await result.current.createGroup({ name: 'New Group', members: ['user1'] })

    expect(createdGroup).toEqual(mockGroup)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('returns error on failure', async () => {
    vi.mocked(services.createGroup).mockResolvedValue({ error: 'Failed to create' })

    const { result } = renderHook(() => useCreateGroup())

    const createdGroup = await result.current.createGroup({ name: 'New Group', members: ['user1'] })

    expect(createdGroup).toBeNull()
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to create')
    })
  })
})

describe('useCreateExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates expense successfully', async () => {
    const mockExpense = {
      id: '1',
      description: 'Test expense',
      amount: 100,
      paidBy: 'user1',
      participants: ['user1', 'user2'],
    }
    vi.mocked(services.createExpense).mockResolvedValue({ data: mockExpense })

    const { result } = renderHook(() => useCreateExpense())

    const createdExpense = await result.current.createExpense({
      groupId: 'group1',
      description: 'Test expense',
      amount: 100,
      paidBy: 'user1',
      participants: ['user1', 'user2'],
    })

    expect(createdExpense).toEqual(mockExpense)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})

describe('useDeleteExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes expense successfully', async () => {
    vi.mocked(services.deleteExpense).mockResolvedValue({ data: true })

    const { result } = renderHook(() => useDeleteExpense())

    const success = await result.current.deleteExpense('expense1')

    expect(success).toBe(true)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('returns error on failure', async () => {
    vi.mocked(services.deleteExpense).mockResolvedValue({ error: 'Failed to delete' })

    const { result } = renderHook(() => useDeleteExpense())

    const success = await result.current.deleteExpense('expense1')

    expect(success).toBe(false)
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to delete')
    })
  })
})
