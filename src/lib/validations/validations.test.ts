import { describe, it, expect } from 'vitest'

import {
  createUserSchema,
  updateUserSchema,
  createGroupSchema,
  addMemberSchema,
  createExpenseSchema,
  updateExpenseSchema,
} from './index'

describe('User Validations', () => {
  describe('createUserSchema', () => {
    it('should validate a valid user creation', () => {
      const validUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123',
      }
      const result = createUserSchema.safeParse(validUser)
      expect(result.success).toBe(true)
    })

    it('should reject name shorter than 2 characters', () => {
      const invalidUser = {
        name: 'A',
        email: 'joao@example.com',
        password: 'SecurePass123',
      }
      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject name longer than 50 characters', () => {
      const invalidUser = {
        name: 'A'.repeat(51),
        email: 'joao@example.com',
        password: 'SecurePass123',
      }
      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const invalidUser = {
        name: 'João Silva',
        email: 'invalid-email',
        password: 'SecurePass123',
      }
      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject password shorter than 8 characters', () => {
      const invalidUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'Short1',
      }
      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })
  })

  describe('updateUserSchema', () => {
    it('should validate a valid user update', () => {
      const validUpdate = {
        name: 'João Silva Updated',
      }
      const result = updateUserSchema.safeParse(validUpdate)
      expect(result.success).toBe(true)
    })

    it('should allow partial updates', () => {
      const partialUpdate = {
        avatarUrl: 'https://example.com/avatar.jpg',
      }
      const result = updateUserSchema.safeParse(partialUpdate)
      expect(result.success).toBe(true)
    })

    it('should reject empty update', () => {
      const emptyUpdate = {}
      const result = updateUserSchema.safeParse(emptyUpdate)
      expect(result.success).toBe(false)
    })
  })
})

describe('Group Validations', () => {
  describe('createGroupSchema', () => {
    it('should validate a valid group creation', () => {
      const validGroup = {
        name: 'Trip to Rio',
        description: 'Amazing trip to Rio de Janeiro',
      }
      const result = createGroupSchema.safeParse(validGroup)
      expect(result.success).toBe(true)
    })

    it('should reject name shorter than 2 characters', () => {
      const invalidGroup = {
        name: 'A',
        description: 'Amazing trip to Rio de Janeiro',
      }
      const result = createGroupSchema.safeParse(invalidGroup)
      expect(result.success).toBe(false)
    })

    it('should reject name longer than 50 characters', () => {
      const invalidGroup = {
        name: 'a'.repeat(51),
        description: 'Amazing trip to Rio de Janeiro',
      }
      const result = createGroupSchema.safeParse(invalidGroup)
      expect(result.success).toBe(false)
    })

    it('should allow group creation without description and coverImageUrl', () => {
      const minimalGroup = {
        name: 'Trip to Rio',
      }
      const result = createGroupSchema.safeParse(minimalGroup)
      expect(result.success).toBe(true)
    })
  })

  describe('addMemberSchema', () => {
    it('should validate a valid member addition', () => {
      const validMember = {
        userId: 'user123',
      }
      const result = addMemberSchema.safeParse(validMember)
      expect(result.success).toBe(true)
    })

    it('should reject empty userId', () => {
      const invalidMember = {
        userId: '',
      }
      const result = addMemberSchema.safeParse(invalidMember)
      expect(result.success).toBe(false)
    })
  })
})

describe('Expense Validations', () => {
  describe('createExpenseSchema', () => {
    it('should validate a valid expense creation', () => {
      const validExpense = {
        title: 'Hotel Copacabana',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [
          { userId: 'user1', share: 500 },
          { userId: 'user2', share: 500 },
          { userId: 'user3', share: 500 },
        ],
        splitMethod: 'equal',
        date: '2024-01-15T10:00:00Z',
      }
      const result = createExpenseSchema.safeParse(validExpense)
      expect(result.success).toBe(true)
    })

    it('should reject title shorter than 2 characters', () => {
      const invalidExpense = {
        title: 'A',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500 }],
        splitMethod: 'exact',
        date: '2024-01-15T10:00:00Z',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject negative amount', () => {
      const invalidExpense = {
        title: 'Hotel',
        amount: -1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500 }],
        splitMethod: 'exact',
        date: '2024-01-15T10:00:00Z',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject invalid currency', () => {
      const invalidExpense = {
        title: 'Hotel',
        amount: 1500,
        currency: 123,
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500 }],
        splitMethod: 'exact',
        date: '2024-01-15T10:00:00Z',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject invalid category', () => {
      const invalidExpense = {
        title: 'Hotel',
        amount: 1500,
        currency: 'BRL',
        category: 'invalid_category',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500 }],
        splitMethod: 'exact',
        date: '2024-01-15T10:00:00Z',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject invalid split method', () => {
      const invalidExpense = {
        title: 'Hotel',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500 }],
        splitMethod: 'invalid_method',
        date: '2024-01-15T10:00:00Z',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject invalid date format', () => {
      const invalidExpense = {
        title: 'Hotel',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500 }],
        splitMethod: 'exact',
        date: '2024-01-15',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject empty participants', () => {
      const invalidExpense = {
        title: 'Hotel',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [],
        splitMethod: 'exact',
        date: '2024-01-15T10:00:00Z',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject participant with negative share', () => {
      const invalidExpense = {
        title: 'Hotel',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: -500 }],
        splitMethod: 'exact',
        date: '2024-01-15T10:00:00Z',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })
  })

  describe('updateExpenseSchema', () => {
    it('should validate a valid expense update', () => {
      const validUpdate = {
        title: 'Hotel Updated',
      }
      const result = updateExpenseSchema.safeParse(validUpdate)
      expect(result.success).toBe(true)
    })

    it('should allow partial updates', () => {
      const partialUpdate = {
        amount: 2000,
      }
      const result = updateExpenseSchema.safeParse(partialUpdate)
      expect(result.success).toBe(true)
    })

    it('should reject empty update', () => {
      const emptyUpdate = {}
      const result = updateExpenseSchema.safeParse(emptyUpdate)
      expect(result.success).toBe(false)
    })
  })
})
