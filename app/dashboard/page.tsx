'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface List {
  id: string
  name: string
  isPublic: boolean
  shareId: string
  _count: {
    series: number
  }
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [newListName, setNewListName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [showNewList, setShowNewList] = useState(false)

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
      const response = await fetch('/api/lists')
      if (response.ok) {
        const data = await response.json()
        setLists(data)
      }
    } catch (error) {
      console.error('Error fetching lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const createList = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName, isPublic }),
      })

      if (response.ok) {
        setNewListName('')
        setIsPublic(false)
        setShowNewList(false)
        fetchLists()
      }
    } catch (error) {
      console.error('Error creating list:', error)
    }
  }

  const deleteList = async (id: string) => {
    if (!confirm('Are you sure you want to delete this list?')) return

    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchLists()
      }
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  const copyShareLink = (shareId: string) => {
    const link = `${window.location.origin}/share/${shareId}`
    navigator.clipboard.writeText(link)
    alert('Share link copied to clipboard!')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome, {session?.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-6">
          {!showNewList ? (
            <button
              onClick={() => setShowNewList(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Create New List
            </button>
          ) : (
            <form onSubmit={createList} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Create New List</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    List Name
                  </label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg text-gray-900"
                    placeholder="My Favorite Series"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Make this list public
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewList(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <div key={list.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{list.name}</h3>
                  <p className="text-sm text-gray-600">
                    {list._count.series} series
                  </p>
                </div>
                {list.isPublic && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Public
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Link
                  href={`/dashboard/lists/${list.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
                {list.isPublic && (
                  <button
                    onClick={() => copyShareLink(list.shareId)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Copy Share Link
                  </button>
                )}
                <button
                  onClick={() => deleteList(list.id)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {lists.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p>No lists yet. Create your first list to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
