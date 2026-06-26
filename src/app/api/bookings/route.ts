import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'city', 'preferredDate', 'timeSlot', 'consultationType', 'bathroomStatus', 'budgetRange']
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const referenceNumber = `AV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // ─── Save to local SQLite database ───
    try {
      await db.booking.create({
        data: {
          name: body.fullName,
          email: body.email,
          phone: body.phone,
          city: body.city,
          preferredDate: body.preferredDate,
          preferredTime: body.timeSlot,
          requirements: JSON.stringify({
            consultationType: body.consultationType,
            bathroomStatus: body.bathroomStatus,
            budgetRange: body.budgetRange,
            stylePreferences: body.stylePreferences || [],
            contactMethod: body.contactMethod || 'phone',
          }),
          status: 'pending',
        },
      })
    } catch {
      // Local DB save failed, continue
    }

    // Also create a lead locally
    try {
      await db.lead.create({
        data: {
          name: body.fullName,
          email: body.email,
          phone: body.phone,
          city: body.city,
          source: 'consultation_booking',
          status: 'new',
          message: `Consultation request: ${body.consultationType} - ${body.bathroomStatus} - Budget: ${body.budgetRange}`,
        },
      })
    } catch {
      // Lead creation failed, continue
    }

    // ─── Save to Supabase ───
    let supabaseSaved = false
    let supabaseError: string | null = null

    try {
      const { error: sbError } = await supabase.from('bookings').insert({
        reference_number: referenceNumber,
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        address: body.city, // 'city' field holds the address from the booking form
        preferred_date: body.preferredDate,
        preferred_time: body.timeSlot,
        consultation_type: body.consultationType,
        bathroom_status: body.bathroomStatus,
        budget_range: body.budgetRange,
        style_preferences: JSON.stringify(body.stylePreferences || []),
        contact_method: body.contactMethod || 'phone',
        requirements: JSON.stringify({
          consultationType: body.consultationType,
          bathroomStatus: body.bathroomStatus,
          budgetRange: body.budgetRange,
          stylePreferences: body.stylePreferences || [],
          contactMethod: body.contactMethod || 'phone',
        }),
        status: 'pending',
      })

      if (sbError) {
        console.error('Supabase insert error:', sbError.message)
        supabaseError = sbError.message
      } else {
        supabaseSaved = true
      }
    } catch (err) {
      console.error('Supabase connection error:', err)
      supabaseError = err instanceof Error ? err.message : 'Unknown error'
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Consultation booking received successfully',
        referenceNumber,
        supabase: {
          saved: supabaseSaved,
          error: supabaseError,
        },
        data: {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          city: body.city,
          preferredDate: body.preferredDate,
          timeSlot: body.timeSlot,
          consultationType: body.consultationType,
          bathroomStatus: body.bathroomStatus,
          budgetRange: body.budgetRange,
          stylePreferences: body.stylePreferences || [],
          contactMethod: body.contactMethod || 'phone',
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
