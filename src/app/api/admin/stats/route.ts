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

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const [
    bookingCount,
    leadCount,
    quotationCount,
    adminQuotationCount,
    contactMessageCount,
    recentBookings,
    recentLeads,
  ] = await Promise.all([
    db.booking.count(),
    db.lead.count(),
    db.quotation.count(),
    db.adminQuotation.count(),
    db.contactMessage.count(),
    db.booking.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    db.lead.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ])

  return NextResponse.json({
    success: true,
    stats: {
      bookings: bookingCount,
      leads: leadCount,
      quotations: quotationCount,
      adminQuotations: adminQuotationCount,
      messages: contactMessageCount,
    },
    recentBookings,
    recentLeads,
  })
}
