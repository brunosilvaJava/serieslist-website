'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SerieItem from '@/components/SerieItem'
import { ListWithSeries, Serie } from '@/types'

export default function ListDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [list, setList] = useState<ListWithSeries | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newSerieTitle, setNewSerieTitle] = useState('')
  const [newSerieDesc, setNewSerieDesc] = useState('')
  const [showNewSerie, setShowNewSerie] = useState(false)
  const [editingList, setEditingList] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [listName, setListName] = useState('')
  const [listIsPublic, setListIsPublic] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const fetchList = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/lists/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch list')
      }
      
      const data = await response.json()
      setList(data)
      setListName(data.name)
      setListIsPublic(data.isPublic)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load list')
      console.error('Error fetching list:', err)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchList()
    }
  }, [status, params.id, fetchList])

  const updateList = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!listName.trim()) {
      setError('List name is required')
      return
    }

    try {
      setUpdating(true)
      setError(null)
      const response = await fetch(`/api/lists/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: listName, isPublic: listIsPublic }),
      })

      if (!response.ok) {
        throw new Error('Failed to update list')
      }

      setEditingList(false)
      await fetchList()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update list')
      console.error('Error updating list:', err)
    } finally {
      setUpdating(false)
    }
  }

  const createSerie = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSerieTitle.trim()) {
      setError('Serie title is required')
      return
    }

    try {
      setCreating(true)
      setError(null)
      const response = await fetch('/api/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSerieTitle,
          description: newSerieDesc || null,
          listId: params.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create serie')
      }

      setNewSerieTitle('')
      setNewSerieDesc('')
      setShowNewSerie(false)
      await fetchList()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create serie')
      console.error('Error creating serie:', err)
    } finally {
      setCreating(false)
    }
  }

  const updateSerie = async (id: string, title: string, description: string | null) => {
    try {
      setError(null)
      const response = await fetch(`/api/series/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) {
        throw new Error('Failed to update serie')
      }

      await fetchList()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update serie')
      console.error('Error updating serie:', err)
      throw err
    }
  }

  const deleteSerie = async (id: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/series/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete serie')
      }

      await fetchList()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete serie')
      console.error('Error deleting serie:', err)
      throw err
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (status === 'unauthenticated' || !list) {
    return null
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          {!editingList ? (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{list.name}</h1>
                  {list.isPublic && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                      Public
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => setEditingList(true)}
                  variant="primary"
                  aria-label="Edit list"
                >
                  Edit List
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={updateList}>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Edit List</h3>
              <div className="space-y-4">
                <Input
                  label="List Name"
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  required
                  disabled={updating}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    checked={listIsPublic}
                    onChange={(e) => setListIsPublic(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={updating}
                  />
                  <label htmlFor="editIsPublic" className="text-sm text-gray-700">
                    Make this list public
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" isLoading={updating}>
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingList(false)
                      setError(null)
                    }}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="mb-6">
          {!showNewSerie ? (
            <Button
              onClick={() => setShowNewSerie(true)}
              variant="success"
              size="lg"
              aria-label="Add new serie"
            >
              + Add Serie
            </Button>
          ) : (
            <form onSubmit={createSerie} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Add New Serie</h3>
              <div className="space-y-4">
                <Input
                  label="Serie Title"
                  type="text"
                  value={newSerieTitle}
                  onChange={(e) => setNewSerieTitle(e.target.value)}
                  required
                  placeholder="Breaking Bad"
                  disabled={creating}
                />
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newSerieDesc}
                    onChange={(e) => setNewSerieDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Optional description"
                    rows={3}
                    disabled={creating}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="success" isLoading={creating}>
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowNewSerie(false)
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

        {list.series.length > 0 ? (
          <div className="space-y-4">
            {list.series.map((serie) => (
              <SerieItem
                key={serie.id}
                serie={serie}
                onUpdate={updateSerie}
                onDelete={deleteSerie}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No series yet. Add your first serie to this list!</p>
          </div>
        )}
      </div>
    </div>
  )
}
