import { useState, useEffect, useCallback } from 'react'

import { getGroups, getGroupById } from '@/services'

import type { Group, GroupSummary } from '@/types'

export const useGroups = (userId: string) => {
  const [groups, setGroups] = useState<GroupSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getGroups(userId)
      if (response.error) {
        setError(response.error)
        setGroups([])
      } else {
        setGroups(response.data)
      }
    } catch (_err) {
      setError('Falha ao buscar grupos')
      setGroups([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGroups()
  }, [fetchGroups])

  const refetch = useCallback(() => {
    fetchGroups()
  }, [fetchGroups])

  return { groups, loading, error, refetch }
}

export const useGroup = (groupId: string) => {
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGroup = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getGroupById(groupId)
      if (response.error) {
        setError(response.error)
        setGroup(null)
      } else {
        setGroup(response.data)
      }
    } catch (_err) {
      setError('Falha ao buscar grupo')
      setGroup(null)
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGroup()
  }, [fetchGroup])

  const refetch = useCallback(() => {
    fetchGroup()
  }, [fetchGroup])

  return { group, loading, error, refetch }
}
