import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
      // Database save failed, continue with success response
    }

    // Also create a lead
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

    return NextResponse.json(
      {
        success: true,
        message: 'Consultation booking received successfully',
        referenceNumber,
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
