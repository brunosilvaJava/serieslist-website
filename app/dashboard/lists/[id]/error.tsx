'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function ListDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('List detail error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Unable to Load List
        </h2>
        <p className="mb-6 text-gray-600">
          We couldn&apos;t load this list. It may have been deleted or you don&apos;t have permission to view it.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
