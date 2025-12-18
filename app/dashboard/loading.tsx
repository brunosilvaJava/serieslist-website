import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-xl text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
}
