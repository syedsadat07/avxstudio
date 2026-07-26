import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'auravix-secret-key-change-in-production-2025'
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

// GET — list all admin quotations
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const quotations = await db.adminQuotation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, quotations })
  } catch {
    // DB unavailable — return empty
    return NextResponse.json({ success: true, quotations: [] })
  }
}

// POST — create a new admin quotation
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const required = ['customerName', 'customerEmail', 'bathroomSize', 'packageTier', 'estimatedCost']
    const missing = required.filter((f) => !body[f])
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    try {
      const quotation = await db.adminQuotation.create({
        data: {
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone || null,
          bathroomSize: body.bathroomSize,
          packageTier: body.packageTier,
          estimatedCost: parseFloat(body.estimatedCost),
          timeline: body.timeline || null,
          status: body.status || 'draft',
          notes: body.notes || null,
          createdById: user.userId,
          createdByName: user.name,
        },
      })
      return NextResponse.json({ success: true, quotation }, { status: 201 })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to save quotation to database' },
        { status: 500 }
      )
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}

// PATCH — update a quotation
export async function PATCH(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updateData } = body
    if (!id) {
      return NextResponse.json({ success: false, error: 'Quotation ID required' }, { status: 400 })
    }

    try {
      const quotation = await db.adminQuotation.update({
        where: { id },
        data: {
          ...updateData,
          estimatedCost: updateData.estimatedCost ? parseFloat(updateData.estimatedCost) : undefined,
        },
      })
      return NextResponse.json({ success: true, quotation })
    } catch {
      return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}

// DELETE — delete a quotation
export async function DELETE(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Quotation ID required' }, { status: 400 })
    }

    try {
      await db.adminQuotation.delete({ where: { id } })
    } catch {
      // ignore
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}
