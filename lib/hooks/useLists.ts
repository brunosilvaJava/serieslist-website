'use client'

import { useState, useEffect, useCallback } from 'react'
import { ListWithCount } from '@/types'

export function useLists() {
  const [lists, setLists] = useState<ListWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/lists')
      
      if (!response.ok) {
        throw new Error('Failed to fetch lists')
      }
      
      const data = await response.json()
      setLists(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching lists:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  return {
    lists,
    loading,
    error,
    refetch: fetchLists,
  }
}
