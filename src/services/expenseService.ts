import { mockDelay } from '@/lib/mockDelay'

import { MOCK_EXPENSES } from './mockData'

import type { ApiResponse, CreateExpenseInput, Expense, UpdateExpenseInput } from '@/types'

export const getExpensesByGroup = async (groupId: string): Promise<ApiResponse<Expense[]>> => {
  await mockDelay()

  try {
    const expenses = MOCK_EXPENSES.filter((exp) => exp.groupId === groupId)

    return {
      data: expenses,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: [],
      error: 'Falha ao buscar despesas',
      loading: false,
    }
  }
}

export const getExpenseById = async (expenseId: string): Promise<ApiResponse<Expense>> => {
  await mockDelay()

  try {
    const expense = MOCK_EXPENSES.find((exp) => exp.id === expenseId)

    if (!expense) {
      return {
        data: null as unknown as Expense,
        error: 'Despesa não encontrada',
        loading: false,
      }
    }

    return {
      data: expense,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: null as unknown as Expense,
      error: 'Falha ao buscar despesa',
      loading: false,
    }
  }
}

export const createExpense = async (input: CreateExpenseInput): Promise<ApiResponse<Expense>> => {
  await mockDelay()

  try {
    const newExpense: Expense = {
      id: `exp${Date.now()}`,
      groupId: 'group1',
      title: input.title,
      amount: input.amount,
      currency: input.currency,
      category: input.category,
      paidBy: input.paidBy,
      participants: input.participants,
      splitMethod: input.splitMethod,
      date: new Date(input.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    MOCK_EXPENSES.push(newExpense)

    return {
      data: newExpense,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: null as unknown as Expense,
      error: 'Falha ao criar despesa',
      loading: false,
    }
  }
}

export const updateExpense = async (
  expenseId: string,
  input: UpdateExpenseInput,
): Promise<ApiResponse<Expense>> => {
  await mockDelay()

  try {
    const expense = MOCK_EXPENSES.find((exp) => exp.id === expenseId)

    if (!expense) {
      return {
        data: null as unknown as Expense,
        error: 'Despesa não encontrada',
        loading: false,
      }
    }

    if (input.title) expense.title = input.title
    if (input.amount) expense.amount = input.amount
    if (input.currency) expense.currency = input.currency
    if (input.category) expense.category = input.category
    if (input.paidBy) expense.paidBy = input.paidBy
    if (input.participants) expense.participants = input.participants
    if (input.splitMethod) expense.splitMethod = input.splitMethod
    if (input.date) expense.date = new Date(input.date)
    expense.updatedAt = new Date()

    return {
      data: expense,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: null as unknown as Expense,
      error: 'Falha ao atualizar despesa',
      loading: false,
    }
  }
}

export const deleteExpense = async (expenseId: string): Promise<ApiResponse<void>> => {
  await mockDelay()

  try {
    const index = MOCK_EXPENSES.findIndex((exp) => exp.id === expenseId)

    if (index === -1) {
      return {
        data: undefined,
        error: 'Despesa não encontrada',
        loading: false,
      }
    }

    MOCK_EXPENSES.splice(index, 1)

    return {
      data: undefined,
      error: null,
      loading: false,
    }
  } catch (_error) {
    return {
      data: undefined,
      error: 'Falha ao deletar despesa',
      loading: false,
    }
  }
}
