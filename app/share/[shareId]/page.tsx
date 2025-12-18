import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    shareId: string
  }>
}

export default async function SharePage({ params }: PageProps) {
  const { shareId } = await params
  const list = await prisma.list.findUnique({
    where: {
      shareId,
      isPublic: true,
    },
    include: {
      series: {
        orderBy: { createdAt: 'desc' },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!list) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Home
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-3xl font-bold">{list.name}</h1>
          <p className="text-gray-600 mt-2">
            Shared by {list.user.name || list.user.email}
          </p>
          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            Public List
          </span>
        </div>

        <div className="space-y-4">
          {list.series.map((serie) => (
            <div key={serie.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold">{serie.title}</h3>
              {serie.description && (
                <p className="mt-2 text-gray-600">{serie.description}</p>
              )}
            </div>
          ))}
        </div>

        {list.series.length === 0 && (
          <div className="text-center py-12 text-gray-600 bg-white rounded-lg">
            <p>This list is empty.</p>
          </div>
        )}
      </div>
    </div>
  )
}
