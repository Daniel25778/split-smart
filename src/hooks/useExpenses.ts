import { useState, useEffect, useCallback } from 'react'

import { getExpensesByGroup } from '@/services'

import type { Expense } from '@/types'

export const useExpenses = (groupId: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getExpensesByGroup(groupId)
      if (response.error) {
        setError(response.error)
        setExpenses([])
      } else {
        setExpenses(response.data)
      }
    } catch (_err) {
      setError('Falha ao buscar despesas')
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExpenses()
  }, [fetchExpenses])

  const refetch = useCallback(() => {
    fetchExpenses()
  }, [fetchExpenses])

  return { expenses, loading, error, refetch }
}
