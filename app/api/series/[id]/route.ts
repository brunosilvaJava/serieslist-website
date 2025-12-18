import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { serieSchema } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validation = serieSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { title, description, listId } = validation.data

    const serie = await prisma.serie.findUnique({
      where: { id },
      include: { list: true },
    })

    if (!serie || serie.list.userId !== session.user.id) {
      return NextResponse.json({ error: 'Serie not found' }, { status: 404 })
    }

    const updatedSerie = await prisma.serie.update({
      where: { id },
      data: { title, description, listId },
    })

    return NextResponse.json(updatedSerie)
  } catch (error) {
    console.error('Error updating serie:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const serie = await prisma.serie.findUnique({
      where: { id },
      include: { list: true },
    })

    if (!serie || serie.list.userId !== session.user.id) {
      return NextResponse.json({ error: 'Serie not found' }, { status: 404 })
    }

    await prisma.serie.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Serie deleted successfully' })
  } catch (error) {
    console.error('Error deleting serie:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
