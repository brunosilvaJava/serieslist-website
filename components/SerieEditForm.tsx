'use client'

import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'

interface SerieEditFormProps {
  serie: {
    id: string
    title: string
    description: string | null
  }
  onSave: (id: string, title: string, description: string | null) => Promise<void>
  onCancel: () => void
}

export default function SerieEditForm({ serie, onSave, onCancel }: SerieEditFormProps) {
  const [title, setTitle] = useState(serie.title)
  const [description, setDescription] = useState(serie.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await onSave(serie.id, title, description || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update serie')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Serie Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Breaking Bad"
        error={error || undefined}
        disabled={loading}
      />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="Optional description"
          rows={3}
          disabled={loading}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="primary" isLoading={loading}>
          Save Changes
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
