'use client'

import { useState } from 'react'
import Button from './ui/Button'
import SerieEditForm from './SerieEditForm'
import ConfirmDialog from './ui/ConfirmDialog'

interface SerieItemProps {
  serie: {
    id: string
    title: string
    description: string | null
  }
  onUpdate: (id: string, title: string, description: string | null) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function SerieItem({ serie, onUpdate, onDelete }: SerieItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async (id: string, title: string, description: string | null) => {
    await onUpdate(id, title, description)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    await onDelete(serie.id)
    setShowDeleteConfirm(false)
  }

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-4">Edit Serie</h4>
        <SerieEditForm
          serie={serie}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{serie.title}</h3>
            {serie.description && (
              <p className="mt-2 text-gray-600">{serie.description}</p>
            )}
          </div>
          <div className="ml-4 flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              variant="primary"
              size="sm"
              aria-label={`Edit ${serie.title}`}
            >
              Edit
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              size="sm"
              aria-label={`Delete ${serie.title}`}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Serie"
        message={`Are you sure you want to delete "${serie.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}
