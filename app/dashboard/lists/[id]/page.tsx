'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Serie {
  id: string
  title: string
  description: string | null
  createdAt: string
}

interface List {
  id: string
  name: string
  isPublic: boolean
  shareId: string
  series: Serie[]
}

export default function ListDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [list, setList] = useState<List | null>(null)
  const [loading, setLoading] = useState(true)
  const [newSerieTitle, setNewSerieTitle] = useState('')
  const [newSerieDesc, setNewSerieDesc] = useState('')
  const [showNewSerie, setShowNewSerie] = useState(false)
  const [editingList, setEditingList] = useState(false)
  const [listName, setListName] = useState('')
  const [listIsPublic, setListIsPublic] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const fetchList = useCallback(async () => {
    try {
      const response = await fetch(`/api/lists/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setList(data)
        setListName(data.name)
        setListIsPublic(data.isPublic)
      }
    } catch (error) {
      console.error('Error fetching list:', error)
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
    try {
      const response = await fetch(`/api/lists/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: listName, isPublic: listIsPublic }),
      })

      if (response.ok) {
        setEditingList(false)
        fetchList()
      }
    } catch (error) {
      console.error('Error updating list:', error)
    }
  }

  const createSerie = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSerieTitle,
          description: newSerieDesc,
          listId: params.id,
        }),
      })

      if (response.ok) {
        setNewSerieTitle('')
        setNewSerieDesc('')
        setShowNewSerie(false)
        fetchList()
      }
    } catch (error) {
      console.error('Error creating serie:', error)
    }
  }

  const deleteSerie = async (id: string) => {
    if (!confirm('Are you sure you want to delete this serie?')) return

    try {
      const response = await fetch(`/api/series/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchList()
      }
    } catch (error) {
      console.error('Error deleting serie:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
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
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          {!editingList ? (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{list.name}</h1>
                  {list.isPublic && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Public
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setEditingList(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit List
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={updateList}>
              <h3 className="text-xl font-bold mb-4">Edit List</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    List Name
                  </label>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg text-gray-900"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    checked={listIsPublic}
                    onChange={(e) => setListIsPublic(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="editIsPublic" className="text-sm">
                    Make this list public
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingList(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="mb-6">
          {!showNewSerie ? (
            <button
              onClick={() => setShowNewSerie(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add Serie
            </button>
          ) : (
            <form onSubmit={createSerie} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Add New Serie</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Serie Title
                  </label>
                  <input
                    type="text"
                    value={newSerieTitle}
                    onChange={(e) => setNewSerieTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg text-gray-900"
                    placeholder="Breaking Bad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={newSerieDesc}
                    onChange={(e) => setNewSerieDesc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-900"
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewSerie(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-4">
          {list.series.map((serie) => (
            <div key={serie.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{serie.title}</h3>
                  {serie.description && (
                    <p className="mt-2 text-gray-600">{serie.description}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteSerie(serie.id)}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {list.series.length === 0 && (
          <div className="text-center py-12 text-gray-600 bg-white rounded-lg">
            <p>No series yet. Add your first serie to this list!</p>
          </div>
        )}
      </div>
    </div>
  )
}
