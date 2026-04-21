import { useState, useEffect, useCallback } from 'react'

import { getGroupBalances, getSettlements } from '@/services'

import type { Settlement, UserBalance } from '@/types'

export const useGroupBalances = (groupId: string) => {
  const [balances, setBalances] = useState<UserBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getGroupBalances(groupId)
      if (response.error) {
        setError(response.error)
        setBalances([])
      } else {
        setBalances(response.data)
      }
    } catch (_err) {
      setError('Falha ao buscar saldos')
      setBalances([])
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBalances()
  }, [fetchBalances])

  return { balances, loading, error }
}

export const useSettlements = (groupId: string) => {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettlements = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getSettlements(groupId)
      if (response.error) {
        setError(response.error)
        setSettlements([])
      } else {
        setSettlements(response.data)
      }
    } catch (_err) {
      setError('Falha ao buscar settlements')
      setSettlements([])
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettlements()
  }, [fetchSettlements])

  return { settlements, loading, error }
}
