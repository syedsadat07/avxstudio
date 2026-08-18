import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'auravix-dev-secret-2025'
)

async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('auravix-session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as { userId: string; email: string; role: string; name: string }
  } catch {
    return null
  }
}

// GET — list all materials
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const materials = await db.material.findMany({
      orderBy: { category: 'asc' },
    })
    return NextResponse.json({ success: true, materials })
  } catch {
    return NextResponse.json({ success: true, materials: [] })
  }
}

// POST — create a new material
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.name || !body.category || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and price are required' },
        { status: 400 }
      )
    }

    const material = await db.material.create({
      data: {
        name: body.name,
        category: body.category,
        brand: body.brand || null,
        unit: body.unit || 'piece',
        price: parseFloat(body.price),
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        active: body.active !== false,
      },
    })

    return NextResponse.json({ success: true, material }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create material' }, { status: 500 })
  }
}

// PATCH — update a material
export async function PATCH(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updateData } = body
    if (!id) {
      return NextResponse.json({ success: false, error: 'Material ID required' }, { status: 400 })
    }

    const material = await db.material.update({
      where: { id },
      data: {
        ...updateData,
        price: updateData.price !== undefined ? parseFloat(updateData.price) : undefined,
      },
    })

    return NextResponse.json({ success: true, material })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update material' }, { status: 500 })
  }
}

// DELETE — delete a material
export async function DELETE(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Material ID required' }, { status: 400 })
    }

    await db.material.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete material' }, { status: 500 })
  }
}
