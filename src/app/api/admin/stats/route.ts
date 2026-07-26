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

  // Initialize with zeros
  let bookingCount = 0
  let leadCount = 0
  let quotationCount = 0
  let adminQuotationCount = 0
  let contactMessageCount = 0
  let recentBookings: Array<{
    id: string; name: string; email: string; phone: string;
    preferredDate: string; preferredTime: string; status: string; createdAt: string;
  }> = []
  let recentLeads: Array<{
    id: string; name: string; email: string; phone: string | null;
    city: string | null; source: string; status: string; message: string | null; createdAt: string;
  }> = []

  // Try local DB (might fail on fresh deployments)
  try {
    const [b, l, q, aq, cm, rb, rl] = await Promise.all([
      db.booking.count().catch(() => 0),
      db.lead.count().catch(() => 0),
      db.quotation.count().catch(() => 0),
      db.adminQuotation.count().catch(() => 0),
      db.contactMessage.count().catch(() => 0),
      db.booking.findMany({ take: 5, orderBy: { createdAt: 'desc' } }).catch(() => []),
      db.lead.findMany({ take: 5, orderBy: { createdAt: 'desc' } }).catch(() => []),
    ])
    bookingCount = b as number
    leadCount = l as number
    quotationCount = q as number
    adminQuotationCount = aq as number
    contactMessageCount = cm as number
    recentBookings = rb as typeof recentBookings
    recentLeads = rl as typeof recentLeads
  } catch {
    // DB unavailable — continue with zeros
  }

  // Also fetch from Supabase (works on any deployment)
  let supabaseBookings: Array<{
    id: string; name: string; email: string; phone: string;
    preferredDate: string; preferredTime: string; status: string; createdAt: string;
    address?: string; budgetRange?: string;
  }> = []

  try {
    const { supabase } = await import('@/lib/supabase')
    const { data: sbData, error: sbError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!sbError && sbData && sbData.length > 0) {
      supabaseBookings = sbData.map((b: Record<string, unknown>) => ({
        id: String(b.id ?? ''),
        name: (b.full_name as string) || '',
        email: (b.email as string) || '',
        phone: (b.phone as string) || '',
        preferredDate: (b.preferred_date as string) || '',
        preferredTime: (b.preferred_time as string) || '',
        status: (b.status as string) || 'pending',
        createdAt: (b.created_at as string) || '',
        address: (b.address as string) || '',
        budgetRange: (b.budget_range as string) || '',
      }))
      bookingCount += supabaseBookings.length
    }
  } catch {
    // Supabase unavailable
  }

  // Merge local + Supabase bookings (dedupe by email+date)
  const allBookings = [...recentBookings, ...supabaseBookings]
  const seen = new Set<string>()
  const mergedBookings = allBookings.filter((b) => {
    const key = `${b.email}-${b.preferredDate}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return NextResponse.json({
    success: true,
    stats: {
      bookings: bookingCount,
      leads: leadCount,
      quotations: quotationCount,
      adminQuotations: adminQuotationCount,
      messages: contactMessageCount,
    },
    recentBookings: mergedBookings.slice(0, 20),
    recentLeads,
  })
}
