import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'auravix-dev-secret-2025'
)

// ─── One-Time Admin Setup ───────────────────────────────────────────────────
// POST: Creates the FIRST admin account. After an admin exists, this route
// refuses to create more (returns 403). This ensures only ONE admin can ever
// be created via this endpoint.

export async function GET() {
  // Check if any admin already exists
  const adminCount = await db.user.count({
    where: { role: 'admin' },
  })

  return NextResponse.json({
    setupAvailable: adminCount === 0,
    adminExists: adminCount > 0,
  })
}

export async function POST(request: NextRequest) {
  try {
    // ─── LOCK CHECK: If any admin already exists, refuse ───
    const adminCount = await db.user.count({
      where: { role: 'admin' },
    })

    if (adminCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin account already exists. Setup is locked. Contact the existing admin to create more accounts.',
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, email, password, phone } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if email already used
    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Create the FIRST (and only) admin
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        role: 'admin',
      },
    })

    // Create JWT token
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name || '',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(SECRET_KEY)

    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin account created successfully! Setup is now locked.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
      },
      { status: 201 }
    )

    // Set HTTP-only cookie
    response.cookies.set('auravix-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create admin account' },
      { status: 500 }
    )
  }
}
