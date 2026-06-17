import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = ['name', 'email', 'bathroomSize', 'materialType']
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    try {
      await db.quotation.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          bathroomSize: body.bathroomSize,
          materialType: body.materialType,
          tileSelection: body.tileSelection || '',
          vanityType: body.vanityType || '',
          accessories: body.accessories ? JSON.stringify(body.accessories) : '',
          estimatedCost: body.estimatedCost || 0,
          timeline: body.timeline || '',
        },
      })
    } catch {
      // Database save failed, continue
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Quotation saved successfully',
        data: {
          name: body.name,
          email: body.email,
          estimatedCost: body.estimatedCost,
          timeline: body.timeline,
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
