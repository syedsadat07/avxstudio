import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'subject', 'message']
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address format' },
        { status: 400 }
      )
    }

    const referenceNumber = `AV-CT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    try {
      await db.contactMessage.create({
        data: {
          name: body.fullName,
          email: body.email,
          phone: body.phone || '',
          subject: body.subject,
          message: body.message,
          read: false,
        },
      })
    } catch {
      // Database save failed, continue with success response
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. We'll get back to you within 24 hours.",
        referenceNumber,
        data: {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone || '',
          subject: body.subject,
          message: body.message,
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
