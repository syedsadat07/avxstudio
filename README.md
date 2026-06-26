# AURAVIX Bath Studio

A premium bathroom renovation website built with Next.js 16, featuring a luxury dark + gold design, booking system, admin panel, authentication, and Supabase backend integration.

## ✨ Features

- **Luxury Homepage** — Dark hero with animated gold particles, parallax scrolling, premium hover effects
- **7 Pages** — Home, Lookbook, Packages, Calculator, Blog, About, Contact
- **Book a Slot** — Weekly calendar with time slots, address field, animated booking flow
- **Cost Calculator** — Real-time bathroom renovation cost estimation with live breakdown
- **Authentication** — Login/Signup with JWT cookies, customer & admin roles, profile dropdown menu
- **Admin Dashboard** — Create quotations, view bookings/leads, statistics overview
- **Supabase Backend** — All bookings and contact messages save to Supabase
- **Premium Animations** — Scroll progress bar, page transitions, staggered reveals, glass morphism

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion |
| State | Zustand |
| Database | SQLite (Prisma ORM) + Supabase |
| Auth | JWT (jose) + bcryptjs |
| Icons | Lucide React |

## 📦 Installation

### Prerequisites
- Node.js 18+ or [Bun](https://bun.sh)
- A Supabase account (free tier works)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/auravix-bath-studio.git
cd auravix-bath-studio

# 2. Install dependencies
bun install        # or: npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase URL, key, and JWT secret

# 4. Set up the database
bunx prisma db push     # Creates SQLite tables
bunx prisma generate    # Generates Prisma client
bun run db:seed         # Seeds admin + customer users + sample data

# 5. Start the dev server
bun run dev
```

Visit `http://localhost:3000`

## 🔐 Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New query**
3. Paste the contents of [`supabase-schema.sql`](./supabase-schema.sql) and click **Run**
4. Go to **Project Settings → API** and copy your:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Paste these into your `.env` file

## 👤 Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@auravix.com` | `admin123` |
| Customer | `customer@example.com` | `customer123` |

## 📁 Project Structure

```
auravix-bath-studio/
├── prisma/
│   ├── schema.prisma          # Database schema (10 models)
│   └── seed.ts                # Seeds users, testimonials, packages, etc.
├── public/
│   ├── auravix-mark.svg       # Gold hexagonal brand logo
│   ├── favicon.svg            # Gold favicon
│   └── images/                # AI-generated bathroom photos
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # login, signup, logout, session
│   │   │   ├── admin/         # quotations CRUD, stats (protected)
│   │   │   ├── bookings/      # Book a Slot → SQLite + Supabase
│   │   │   └── contacts/      # Contact form → SQLite + Supabase
│   │   ├── globals.css        # Tailwind + premium animation utilities
│   │   ├── layout.tsx         # Root layout + metadata
│   │   └── page.tsx           # SPA router (all pages)
│   ├── components/
│   │   ├── admin/             # AdminLoginPage, AdminDashboardPage
│   │   ├── auth/              # AuthPage (login/signup toggle)
│   │   ├── booking/           # BookingPage, SlotBookingPage
│   │   ├── home/              # Hero, WhyChooseUs, Packages, Gallery, etc.
│   │   ├── layout/            # Header, Footer, ScrollProgress
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── supabase.ts        # Supabase client
│   │   └── utils.ts           # Utility functions
│   ├── store/
│   │   ├── navigation.ts      # Zustand page router
│   │   └── auth.ts            # Zustand auth state
│   └── hooks/
│       ├── use-toast.ts       # Toast notifications
│       └── use-mobile.ts      # Mobile detection
├── supabase-schema.sql        # Run this in Supabase SQL Editor
├── .env.example               # Template for environment variables
├── package.json
└── README.md
```

## 🚀 Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add environment variables (from `.env`):
   - `DATABASE_URL` — use a PostgreSQL URL (Vercel Postgres or Supabase)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `JWT_SECRET` — generate with `openssl rand -base64 32`
4. Deploy

> **Note:** SQLite won't work on Vercel (serverless = no persistent filesystem). For production, switch `prisma/schema.prisma` datasource to PostgreSQL and update `DATABASE_URL`.

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (port 3000) |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:seed` | Seed database with sample data |

## 📄 License

This is a private project. All rights reserved.

---

Built with ❤️ using [Z.ai Code](https://z.ai)
