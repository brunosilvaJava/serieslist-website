'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Something went wrong!
        </h2>
        <p className="mb-6 text-gray-600">
          We encountered an error while loading your dashboard. Please try again.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="secondary">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
