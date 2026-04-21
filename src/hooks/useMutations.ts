import { useState, useCallback } from 'react'

import { createExpense, createGroup, deleteExpense } from '@/services'

import type { CreateExpenseInput, CreateGroupInput } from '@/types'

export const useCreateGroup = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createGroupMutation = useCallback(async (input: CreateGroupInput) => {
    setLoading(true)
    setError(null)

    try {
      const response = await createGroup(input, 'user1')
      if (response.error) {
        setError(response.error)
        return null
      }
      return response.data
    } catch (_err) {
      setError('Falha ao criar grupo')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { createGroup: createGroupMutation, loading, error }
}

export const useCreateExpense = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createExpenseMutation = useCallback(async (input: CreateExpenseInput) => {
    setLoading(true)
    setError(null)

    try {
      const response = await createExpense(input)
      if (response.error) {
        setError(response.error)
        return null
      }
      return response.data
    } catch (_err) {
      setError('Falha ao criar despesa')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { createExpense: createExpenseMutation, loading, error }
}

export const useDeleteExpense = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteExpenseMutation = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await deleteExpense(id)
      if (response.error) {
        setError(response.error)
        return false
      }
      return response.data
    } catch (_err) {
      setError('Falha ao deletar despesa')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteExpense: deleteExpenseMutation, loading, error }
}
