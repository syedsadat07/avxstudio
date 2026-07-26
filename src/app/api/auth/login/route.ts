import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'auravix-secret-key-change-in-production-2025'
)

// Admin credentials from environment variables (fallback to defaults)
const ADMIN_EMAIL = 'steve@aura'
const ADMIN_PASSWORD = 'tajmahal43'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    let user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // ─── Auto-create admin on first login attempt ───
    // If the admin doesn't exist yet AND the credentials match the admin email/password,
    // create the admin account automatically. This ensures admin login works on any
    // deployment without needing to run the seed script.
    if (!user && email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user = await db.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: 'Steve',
          password: hashedPassword,
          role: 'admin',
        },
      })
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

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

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set('auravix-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
