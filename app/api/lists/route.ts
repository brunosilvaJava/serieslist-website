import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { listSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Optimized query with specific select to avoid fetching unnecessary data
    const lists = await prisma.list.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        isPublic: true,
        shareId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { series: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(lists)
  } catch (error) {
    console.error('Error fetching lists:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = listSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, isPublic } = validation.data

    const list = await prisma.list.create({
      data: {
        name,
        isPublic,
        userId: session.user.id,
      },
    })

    return NextResponse.json(list, { status: 201 })
  } catch (error) {
    console.error('Error creating list:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
