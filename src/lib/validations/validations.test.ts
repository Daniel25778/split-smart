import { describe, it, expect } from 'vitest'

import {
  addMemberSchema,
  createExpenseSchema,
  createGroupSchema,
  createUserSchema,
  updateExpenseSchema,
  updateUserSchema,
} from './index'

describe('User Validations', () => {
  describe('createUserSchema', () => {
    it('should validate a valid user creation', () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      }
      const result = createUserSchema.safeParse(validUser)
      expect(result.success).toBe(true)
    })

    it('should reject name shorter than 2 characters', () => {
      const invalidUser = {
        name: 'J',
        email: 'john@example.com',
        password: 'SecurePass123',
      }
      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject name longer than 50 characters', () => {
      const invalidUser = {
        name: 'a'.repeat(51),
        email: 'john@example.com',
        password: 'SecurePass123',
      }
      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123',
      }
      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject password shorter than 8 characters', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '1234567',
      }
      const result = createUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })
  })

  describe('updateUserSchema', () => {
    it('should validate a valid user update', () => {
      const validUpdate = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      }
      const result = updateUserSchema.safeParse(validUpdate)
      expect(result.success).toBe(true)
    })

    it('should allow partial updates', () => {
      const partialUpdate = {
        name: 'Jane Doe',
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
        coverImageUrl: 'https://example.com/image.jpg',
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
          { userId: 'user1', share: 500, paid: false },
          { userId: 'user2', share: 500, paid: false },
          { userId: 'user3', share: 500, paid: false },
        ],
        splitMethod: 'equal',
        date: '2024-01-15',
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
        participants: [{ userId: 'user1', share: 1500, paid: false }],
        splitMethod: 'equal',
        date: '2024-01-15',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject negative amount', () => {
      const invalidExpense = {
        title: 'Hotel Copacabana',
        amount: -100,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: -100, paid: false }],
        splitMethod: 'equal',
        date: '2024-01-15',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject invalid currency', () => {
      const invalidExpense = {
        title: 'Hotel Copacabana',
        amount: 1500,
        currency: 'INVALID',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500, paid: false }],
        splitMethod: 'equal',
        date: '2024-01-15',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject invalid category', () => {
      const invalidExpense = {
        title: 'Hotel Copacabana',
        amount: 1500,
        currency: 'BRL',
        category: 'invalid',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500, paid: false }],
        splitMethod: 'equal',
        date: '2024-01-15',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject invalid split method', () => {
      const invalidExpense = {
        title: 'Hotel Copacabana',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500, paid: false }],
        splitMethod: 'invalid',
        date: '2024-01-15',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject invalid date format', () => {
      const invalidExpense = {
        title: 'Hotel Copacabana',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: 1500, paid: false }],
        splitMethod: 'equal',
        date: 'invalid-date',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject empty participants', () => {
      const invalidExpense = {
        title: 'Hotel Copacabana',
        amount: 1500,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [],
        splitMethod: 'equal',
        date: '2024-01-15',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })

    it('should reject participant with negative share', () => {
      const invalidExpense = {
        title: 'Hotel Copacabana',
        amount: -100,
        currency: 'BRL',
        category: 'accommodation',
        paidBy: 'user1',
        participants: [{ userId: 'user1', share: -100, paid: false }],
        splitMethod: 'equal',
        date: '2024-01-15',
      }
      const result = createExpenseSchema.safeParse(invalidExpense)
      expect(result.success).toBe(false)
    })
  })

  describe('updateExpenseSchema', () => {
    it('should validate a valid expense update', () => {
      const validUpdate = {
        title: 'Updated Hotel',
        amount: 1600,
      }
      const result = updateExpenseSchema.safeParse(validUpdate)
      expect(result.success).toBe(true)
    })

    it('should allow partial updates', () => {
      const partialUpdate = {
        title: 'Updated Hotel',
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
