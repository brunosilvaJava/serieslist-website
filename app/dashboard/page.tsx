'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ListCard from '@/components/ListCard'
import { ListWithCount } from '@/types'
import { getShareUrl, copyToClipboard } from '@/lib/utils'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [lists, setLists] = useState<ListWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [showNewList, setShowNewList] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLists()
    }
  }, [status])

  const fetchLists = async () => {
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
      setError(err instanceof Error ? err.message : 'Failed to load lists')
      console.error('Error fetching lists:', err)
    } finally {
      setLoading(false)
    }
  }

  const createList = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newListName.trim()) {
      setError('List name is required')
      return
    }

    try {
      setCreating(true)
      setError(null)
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName, isPublic }),
      })

      if (!response.ok) {
        throw new Error('Failed to create list')
      }

      setNewListName('')
      setIsPublic(false)
      setShowNewList(false)
      await fetchLists()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list')
      console.error('Error creating list:', err)
    } finally {
      setCreating(false)
    }
  }

  const deleteList = async (id: string) => {
    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete list')
      }

      await fetchLists()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete list')
      console.error('Error deleting list:', err)
    }
  }

  const handleCopyShareLink = async (shareId: string) => {
    const link = getShareUrl(shareId)
    const success = await copyToClipboard(link)
    
    if (success) {
      alert('Share link copied to clipboard!')
    } else {
      alert('Failed to copy link. Please try again.')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome, {session?.user?.email}
            </p>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="danger"
            aria-label="Sign out"
          >
            Sign Out
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-6">
          {!showNewList ? (
            <Button
              onClick={() => setShowNewList(true)}
              variant="primary"
              size="lg"
              aria-label="Create new list"
            >
              + Create New List
            </Button>
          ) : (
            <form onSubmit={createList} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Create New List</h3>
              <div className="space-y-4">
                <Input
                  label="List Name"
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  required
                  placeholder="My Favorite Series"
                  disabled={creating}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={creating}
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this list public
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" isLoading={creating}>
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowNewList(false)
                      setError(null)
                    }}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        {lists.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onDelete={deleteList}
                onCopyLink={handleCopyShareLink}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No lists yet. Create your first list to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
