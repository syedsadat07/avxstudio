import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'auravix-dev-secret-2025'
)

// Quotation password (separate from login password)
const QUOTATION_PASSWORD = 'auravix-quote-2025'

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

// GET — list all generated quotations
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const quotations = await db.generatedQuotation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, quotations })
  } catch {
    return NextResponse.json({ success: true, quotations: [] })
  }
}

// POST — generate a new quotation
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Verify quotation password
    if (body.quotationPassword !== QUOTATION_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid quotation password. Access denied.' },
        { status: 403 }
      )
    }

    if (!body.customerName || !body.customerEmail || !body.materials || !Array.isArray(body.materials)) {
      return NextResponse.json(
        { success: false, error: 'Customer name, email, and materials are required' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = body.materials.reduce((sum: number, m: { price: number; quantity: number }) => {
      return sum + (m.price * m.quantity)
    }, 0)

    const gstRate = body.gstRate || 18.0
    const gstAmount = Math.round(subtotal * (gstRate / 100) * 100) / 100
    const totalAmount = Math.round((subtotal + gstAmount) * 100) / 100

    const quoteNumber = `AVX-Q-${Date.now().toString(36).toUpperCase()}`

    const quotation = await db.generatedQuotation.create({
      data: {
        quoteNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone || null,
        customerAddress: body.customerAddress || null,
        bathroomArea: body.bathroomArea || null,
        projectType: body.projectType || 'bathroom-renovation',
        materials: JSON.stringify(body.materials),
        subtotal,
        gstRate,
        gstAmount,
        totalAmount,
        notes: body.notes || null,
        createdById: user.userId,
        createdByName: user.name,
      },
    })

    return NextResponse.json({ success: true, quotation }, { status: 201 })
  } catch (err) {
    console.error('Quotation generation error:', err)
    return NextResponse.json({ success: false, error: 'Failed to generate quotation' }, { status: 500 })
  }
}
