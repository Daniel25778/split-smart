import { describe, it, expect } from 'vitest'

import {
  calculateGroupBalances,
  calculateSettlements,
  formatCurrency,
  splitByExactAmount,
  splitByPercentage,
  splitEqually,
} from './calculations'

import type { Expense, UserSummary } from '@/types'

const mockMembers: UserSummary[] = [
  { id: 'user1', name: 'Alice', avatarUrl: 'https://example.com/alice.jpg' },
  { id: 'user2', name: 'Bob' },
  { id: 'user3', name: 'Charlie' },
]

describe('calculateGroupBalances', () => {
  it('should calculate balances for 2-person equal split', () => {
    const expenses: Expense[] = [
      {
        id: 'exp1',
        groupId: 'group1',
        title: 'Lunch',
        amount: 100,
        currency: 'BRL',
        category: 'food',
        paidBy: 'user1',
        participants: [
          { userId: 'user1', share: 50, paid: false },
          { userId: 'user2', share: 50, paid: false },
        ],
        splitMethod: 'equal',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const balances = calculateGroupBalances(expenses, mockMembers.slice(0, 2))

    expect(balances).toHaveLength(2)
    expect(balances[0].userId).toBe('user1')
    expect(balances[0].totalPaid).toBe(100)
    expect(balances[0].totalOwed).toBe(50)
    expect(balances[0].netBalance).toBe(50)

    expect(balances[1].userId).toBe('user2')
    expect(balances[1].totalPaid).toBe(0)
    expect(balances[1].totalOwed).toBe(50)
    expect(balances[1].netBalance).toBe(-50)
  })

  it('should calculate balances for 3-person split', () => {
    const expenses: Expense[] = [
      {
        id: 'exp1',
        groupId: 'group1',
        title: 'Dinner',
        amount: 300,
        currency: 'BRL',
        category: 'food',
        paidBy: 'user1',
        participants: [
          { userId: 'user1', share: 100, paid: false },
          { userId: 'user2', share: 100, paid: false },
          { userId: 'user3', share: 100, paid: false },
        ],
        splitMethod: 'equal',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const balances = calculateGroupBalances(expenses, mockMembers)

    expect(balances).toHaveLength(3)
    const alice = balances.find((b) => b.userId === 'user1')
    const bob = balances.find((b) => b.userId === 'user2')
    const charlie = balances.find((b) => b.userId === 'user3')

    expect(alice?.netBalance).toBe(200)
    expect(bob?.netBalance).toBe(-100)
    expect(charlie?.netBalance).toBe(-100)
  })

  it('should handle one person paying everything', () => {
    const expenses: Expense[] = [
      {
        id: 'exp1',
        groupId: 'group1',
        title: 'Trip',
        amount: 1000,
        currency: 'BRL',
        category: 'transport',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1000, paid: false }],
        splitMethod: 'exact',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const balances = calculateGroupBalances(expenses, mockMembers.slice(0, 2))

    expect(balances[0].netBalance).toBe(0)
    expect(balances[1].netBalance).toBe(0)
  })

  it('should sort by netBalance descending', () => {
    const expenses: Expense[] = [
      {
        id: 'exp1',
        groupId: 'group1',
        title: 'Expense',
        amount: 90,
        currency: 'BRL',
        category: 'food',
        paidBy: 'user1',
        participants: [
          { userId: 'user1', share: 30, paid: false },
          { userId: 'user2', share: 30, paid: false },
          { userId: 'user3', share: 30, paid: false },
        ],
        splitMethod: 'equal',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const balances = calculateGroupBalances(expenses, mockMembers)

    for (let i = 0; i < balances.length - 1; i += 1) {
      expect(balances[i].netBalance).toBeGreaterThanOrEqual(balances[i + 1].netBalance)
    }
  })
})

describe('calculateSettlements', () => {
  it('should create minimum settlements to balance all users', () => {
    const balances = [
      {
        userId: 'user1',
        userName: 'Alice',
        netBalance: 200,
        totalPaid: 300,
        totalOwed: 100,
        avatarUrl: undefined,
      },
      {
        userId: 'user2',
        userName: 'Bob',
        netBalance: -100,
        totalPaid: 0,
        totalOwed: 100,
        avatarUrl: undefined,
      },
      {
        userId: 'user3',
        userName: 'Charlie',
        netBalance: -100,
        totalPaid: 0,
        totalOwed: 100,
        avatarUrl: undefined,
      },
    ]

    const settlements = calculateSettlements(balances)

    expect(settlements.length).toBe(2)
    expect(settlements[0].toUserId).toBe('user1')
    expect(settlements[0].amount).toBe(100)
    expect(settlements[1].toUserId).toBe('user1')
    expect(settlements[1].amount).toBe(100)
  })

  it('should verify all balances zero out after settlements', () => {
    const balances = [
      {
        userId: 'user1',
        userName: 'Alice',
        netBalance: 300,
        totalPaid: 500,
        totalOwed: 200,
        avatarUrl: undefined,
      },
      {
        userId: 'user2',
        userName: 'Bob',
        netBalance: -150,
        totalPaid: 50,
        totalOwed: 200,
        avatarUrl: undefined,
      },
      {
        userId: 'user3',
        userName: 'Charlie',
        netBalance: -150,
        totalPaid: 50,
        totalOwed: 200,
        avatarUrl: undefined,
      },
    ]

    const settlements = calculateSettlements(balances)

    const finalBalances: Record<string, number> = {
      user1: 300,
      user2: -150,
      user3: -150,
    }

    for (const settlement of settlements) {
      finalBalances[settlement.fromUserId] += settlement.amount
      finalBalances[settlement.toUserId] -= settlement.amount
    }

    for (const balance of Object.values(finalBalances)) {
      expect(Math.abs(balance)).toBeLessThan(0.01)
    }
  })

  it('should handle single settlement case', () => {
    const balances = [
      {
        userId: 'user1',
        userName: 'Alice',
        netBalance: 50,
        totalPaid: 100,
        totalOwed: 50,
        avatarUrl: undefined,
      },
      {
        userId: 'user2',
        userName: 'Bob',
        netBalance: -50,
        totalPaid: 0,
        totalOwed: 50,
        avatarUrl: undefined,
      },
    ]

    const settlements = calculateSettlements(balances)

    expect(settlements).toHaveLength(1)
    expect(settlements[0].fromUserId).toBe('user2')
    expect(settlements[0].toUserId).toBe('user1')
    expect(settlements[0].amount).toBe(50)
  })

  it('should handle no settlements needed', () => {
    const balances = [
      {
        userId: 'user1',
        userName: 'Alice',
        netBalance: 0,
        totalPaid: 100,
        totalOwed: 100,
        avatarUrl: undefined,
      },
      {
        userId: 'user2',
        userName: 'Bob',
        netBalance: 0,
        totalPaid: 100,
        totalOwed: 100,
        avatarUrl: undefined,
      },
    ]

    const settlements = calculateSettlements(balances)

    expect(settlements).toHaveLength(0)
  })
})

describe('formatCurrency', () => {
  it('should format BRL currency', () => {
    const formatted = formatCurrency(100.5, 'BRL')
    expect(formatted).toContain('100')
    expect(formatted).toContain(',')
  })

  it('should format USD currency', () => {
    const formatted = formatCurrency(100.5, 'USD')
    expect(formatted).toContain('100')
    expect(formatted).toContain('.')
  })

  it('should format EUR currency', () => {
    const formatted = formatCurrency(100.5, 'EUR')
    expect(formatted).toContain('100')
  })

  it('should default to BRL when not specified', () => {
    const formatted = formatCurrency(100.5)
    expect(formatted).toContain('100')
  })

  it('should handle large amounts', () => {
    const formatted = formatCurrency(1000000.99, 'BRL')
    expect(formatted).toContain('1.000.000')
  })
})

describe('splitEqually', () => {
  it('should split amount equally among participants', () => {
    const participants = ['user1', 'user2', 'user3']
    const result = splitEqually(90, participants)

    expect(result).toHaveLength(3)
    expect(result[0].share).toBe(30)
    expect(result[1].share).toBe(30)
    expect(result[2].share).toBe(30)

    const total = result.reduce((acc, p) => acc + p.share, 0)
    expect(Math.abs(total - 90)).toBeLessThan(0.01)
  })

  it('should handle odd amounts with remainder distribution', () => {
    const participants = ['user1', 'user2', 'user3']
    const result = splitEqually(100, participants)

    expect(result).toHaveLength(3)
    expect(result[0].share).toBe(33.34)
    expect(result[1].share).toBe(33.33)
    expect(result[2].share).toBe(33.33)

    const total = result.reduce((acc, p) => acc + p.share, 0)
    expect(Math.abs(total - 100)).toBeLessThan(0.01)
  })

  it('should handle single participant', () => {
    const participants = ['user1']
    const result = splitEqually(50, participants)

    expect(result).toHaveLength(1)
    expect(result[0].share).toBe(50)
    expect(result[0].userId).toBe('user1')
    expect(result[0].paid).toBe(false)
  })

  it('should return empty array for empty participants', () => {
    const result = splitEqually(100, [])
    expect(result).toHaveLength(0)
  })

  it('should handle two participants with remainder', () => {
    const participants = ['user1', 'user2']
    const result = splitEqually(99, participants)

    expect(result[0].share).toBe(49.5)
    expect(result[1].share).toBe(49.5)

    const total = result.reduce((acc, p) => acc + p.share, 0)
    expect(Math.abs(total - 99)).toBeLessThan(0.01)
  })
})

describe('splitByPercentage', () => {
  it('should split by 50/50 percentage', () => {
    const participants = [
      { userId: 'user1', percentage: 50 },
      { userId: 'user2', percentage: 50 },
    ]
    const result = splitByPercentage(100, participants)

    expect(result).toHaveLength(2)
    expect(result[0].share).toBe(50)
    expect(result[1].share).toBe(50)
  })

  it('should split by 33/33/34 percentage', () => {
    const participants = [
      { userId: 'user1', percentage: 33 },
      { userId: 'user2', percentage: 33 },
      { userId: 'user3', percentage: 34 },
    ]
    const result = splitByPercentage(100, participants)

    expect(result).toHaveLength(3)
    expect(result[0].share).toBe(33)
    expect(result[1].share).toBe(33)
    expect(result[2].share).toBe(34)

    const total = result.reduce((acc, p) => acc + p.share, 0)
    expect(Math.abs(total - 100)).toBeLessThan(0.01)
  })

  it('should handle decimal amounts with percentage', () => {
    const participants = [
      { userId: 'user1', percentage: 50 },
      { userId: 'user2', percentage: 50 },
    ]
    const result = splitByPercentage(99.99, participants)

    const total = result.reduce((acc, p) => acc + p.share, 0)
    expect(Math.abs(total - 99.99)).toBeLessThan(0.01)
  })

  it('should handle rounding correctly', () => {
    const participants = [
      { userId: 'user1', percentage: 33.33 },
      { userId: 'user2', percentage: 33.33 },
      { userId: 'user3', percentage: 33.34 },
    ]
    const result = splitByPercentage(100, participants)

    const total = result.reduce((acc, p) => acc + p.share, 0)
    expect(Math.abs(total - 100)).toBeLessThan(0.01)
  })

  it('should mark all participants as not paid', () => {
    const participants = [
      { userId: 'user1', percentage: 50 },
      { userId: 'user2', percentage: 50 },
    ]
    const result = splitByPercentage(100, participants)

    expect(result.every((p) => p.paid === false)).toBe(true)
  })
})

describe('splitByExactAmount', () => {
  it('should map exact amounts to participants', () => {
    const participants = [
      { userId: 'user1', amount: 60 },
      { userId: 'user2', amount: 40 },
    ]
    const result = splitByExactAmount(participants)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ userId: 'user1', share: 60, paid: false })
    expect(result[1]).toEqual({ userId: 'user2', share: 40, paid: false })
  })

  it('should handle decimal amounts', () => {
    const participants = [
      { userId: 'user1', amount: 50.25 },
      { userId: 'user2', amount: 49.75 },
    ]
    const result = splitByExactAmount(participants)

    expect(result[0].share).toBe(50.25)
    expect(result[1].share).toBe(49.75)
  })

  it('should handle single participant', () => {
    const participants = [{ userId: 'user1', amount: 100 }]
    const result = splitByExactAmount(participants)

    expect(result).toHaveLength(1)
    expect(result[0].share).toBe(100)
  })

  it('should return empty array for empty input', () => {
    const result = splitByExactAmount([])
    expect(result).toHaveLength(0)
  })
})
