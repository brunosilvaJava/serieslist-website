'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from './ui/Button'
import ConfirmDialog from './ui/ConfirmDialog'
import { getShareUrl } from '@/lib/utils'

interface ListCardProps {
  list: {
    id: string
    name: string
    isPublic: boolean
    shareId: string
    _count: {
      series: number
    }
  }
  onDelete: (id: string) => Promise<void>
  onCopyLink: (shareId: string) => void
}

export default function ListCard({ list, onDelete, onCopyLink }: ListCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    await onDelete(list.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{list.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {list._count.series} {list._count.series === 1 ? 'serie' : 'series'}
            </p>
          </div>
          {list.isPublic && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
              Public
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Link href={`/dashboard/lists/${list.id}`} className="block">
            <Button variant="primary" className="w-full">
              View Details
            </Button>
          </Link>
          {list.isPublic && (
            <Button
              onClick={() => onCopyLink(list.shareId)}
              variant="success"
              className="w-full"
              aria-label={`Copy share link for ${list.name}`}
            >
              Copy Share Link
            </Button>
          )}
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="danger"
            className="w-full"
            aria-label={`Delete ${list.name}`}
          >
            Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete List"
        message={`Are you sure you want to delete "${list.name}"? This will also delete all series in this list. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}
