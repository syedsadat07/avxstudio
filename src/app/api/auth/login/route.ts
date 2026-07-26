import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'auravix-secret-key-change-in-production-2025'
)

// Admin credentials (hardcoded as fallback — works even if DB is unavailable)
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

    // ─── Admin login (hardcoded — works even without a database) ───
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Try to create/update admin in DB, but don't fail if DB is unavailable
      try {
        let adminUser = await db.user.findUnique({
          where: { email: ADMIN_EMAIL },
        })
        if (!adminUser) {
          const hashedPassword = await bcrypt.hash(password, 10)
          adminUser = await db.user.create({
            data: {
              email: ADMIN_EMAIL,
              name: 'Steve',
              password: hashedPassword,
              role: 'admin',
            },
          })
        }
      } catch {
        // DB error — continue with hardcoded admin (JWT only, no DB record needed)
      }

      // Create JWT token for admin
      const token = await new SignJWT({
        userId: 'admin-steve',
        email: ADMIN_EMAIL,
        role: 'admin',
        name: 'Steve',
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(SECRET_KEY)

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'admin-steve',
          email: ADMIN_EMAIL,
          name: 'Steve',
          role: 'admin',
          phone: null,
        },
      })

      response.cookies.set('auravix-session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    // ─── Customer login (via local DB) ───
    let user
    try {
      user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
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

    response.cookies.set('auravix-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
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
