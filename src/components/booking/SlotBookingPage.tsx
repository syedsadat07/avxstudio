'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  Sofa,
  Info,
} from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

// ─── Types ──────────────────────────────────────────────────────────────────

type SeatStatus = 'available' | 'reserved' | 'premium' | 'selected'

interface Seat {
  id: string          // e.g. "A1"
  row: string         // e.g. "A"
  col: number         // 1..N
  status: SeatStatus
  price: number       // INR
}

type SessionId = 'morning' | 'afternoon' | 'evening'

interface Session {
  id: SessionId
  label: string
  time: string
  badge?: string
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const
const COLS = 10

const SESSIONS: Session[] = [
  { id: 'morning', label: 'Morning', time: '10:00 AM', badge: 'Fresh' },
  { id: 'afternoon', label: 'Afternoon', time: '2:00 PM', badge: 'Popular' },
  { id: 'evening', label: 'Evening', time: '6:00 PM', badge: 'Premium' },
]

const DATES: { id: string; day: string; date: string; weekday: string }[] = (() => {
  const out: { id: string; day: string; date: string; weekday: string }[] = []
  const now = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    out.push({
      id: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
    })
  }
  return out
})()

const STUDIO_INFO = {
  name: 'AURAVIX BATH STUDIO',
  session: 'Design Consultation Session',
  duration: '60 min',
  address: '123 Design District, Mumbai, India',
}

// Deterministic "reserved" seats per session so the UI is stable
const RESERVED_MAP: Record<SessionId, string[]> = {
  morning: ['A3', 'A4', 'B6', 'C1', 'C2', 'D7', 'E5', 'F8', 'G3', 'G4'],
  afternoon: ['A1', 'A2', 'B3', 'B4', 'C5', 'D1', 'D2', 'E8', 'F2', 'G6', 'H1', 'H2'],
  evening: ['A5', 'A6', 'B1', 'B2', 'C7', 'C8', 'D3', 'E1', 'E2', 'F5', 'G7', 'H4', 'H5'],
}

const PREMIUM_ROWS = ['A', 'B'] // front rows = premium designer seats
const BASE_PRICE = 0 // consultation is free, but we show "₹0" for transparency
const PREMIUM_PRICE = 0

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildSeats(sessionId: SessionId): Seat[] {
  const reserved = new Set(RESERVED_MAP[sessionId])
  const seats: Seat[] = []
  for (const row of ROWS) {
    for (let col = 1; col <= COLS; col++) {
      const id = `${row}${col}`
      const isReserved = reserved.has(id)
      const isPremium = PREMIUM_ROWS.includes(row)
      seats.push({
        id,
        row,
        col,
        status: isReserved ? 'reserved' : isPremium ? 'premium' : 'available',
        price: isPremium ? PREMIUM_PRICE : BASE_PRICE,
      })
    }
  }
  return seats
}

function formatINR(n: number) {
  if (n === 0) return 'Free'
  return `₹${n.toLocaleString('en-IN')}`
}

// ─── Legend ─────────────────────────────────────────────────────────────────

const LEGEND: { label: string; className: string }[] = [
  { label: 'Selected', className: 'bg-gold border-gold' },
  { label: 'Available', className: 'bg-emerald-500/15 border-emerald-500/40' },
  { label: 'Reserved', className: 'bg-muted border-border' },
  { label: 'Premium', className: 'bg-sky-500/15 border-sky-500/40' },
]

// ─── Main Component ─────────────────────────────────────────────────────────

export function SlotBookingPage() {
  const { navigate } = useNavigation()

  const [selectedDate, setSelectedDate] = useState(DATES[0].id)
  const [selectedSession, setSelectedSession] = useState<SessionId>('afternoon')
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set())
  const [showDetails, setShowDetails] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })

  const seats = useMemo(() => buildSeats(selectedSession), [selectedSession])

  const selectedDateObj = DATES.find((d) => d.id === selectedDate) ?? DATES[0]
  const selectedSessionObj = SESSIONS.find((s) => s.id === selectedSession) ?? SESSIONS[0]

  // Reset selection when session/date changes
  const handleSessionChange = (id: SessionId) => {
    setSelectedSession(id)
    setSelectedSeatIds(new Set())
  }
  const handleDateChange = (id: string) => {
    setSelectedDate(id)
    setSelectedSeatIds(new Set())
  }

  const toggleSeat = useCallback((seat: Seat) => {
    if (seat.status === 'reserved') return
    setSelectedSeatIds((prev) => {
      const next = new Set(prev)
      if (next.has(seat.id)) next.delete(seat.id)
      else next.add(seat.id)
      return next
    })
  }, [])

  const selectedSeats = useMemo(
    () => seats.filter((s) => selectedSeatIds.has(s.id)),
    [seats, selectedSeatIds]
  )

  const canProceed = selectedSeatIds.size > 0

  const handleConfirm = async () => {
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          city: 'Mumbai',
          preferredDate: selectedDateObj.date,
          preferredTime: selectedSessionObj.time,
          timeSlot: selectedSessionObj.time,
          consultationType: 'studio-visit',
          bathroomStatus: 'studio-booking',
          budgetRange: 'N/A',
          requirements: `Seats: ${[...selectedSeatIds].join(', ')} | Session: ${selectedSessionObj.label} | Notes: ${form.notes}`,
        }),
      })
    } catch {
      // swallow — we still show success in this demo
    }
    setConfirmed(true)
  }

  // ─── Success screen ──────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <section className="min-h-screen pt-24 pb-16 bg-background flex items-center" aria-label="Booking confirmed">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-gold/30 shadow-xl">
              <CardContent className="p-8 sm:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-gold/15 mb-6"
                >
                  <CheckCircle2 className="size-11 text-gold" />
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Slot <span className="text-gold">Booked!</span>
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Your design studio seats are reserved. We&apos;ve sent a confirmation to{' '}
                  <span className="text-foreground font-medium">{form.email || 'your email'}</span>.
                </p>

                <div className="mt-8 rounded-xl border border-border bg-muted/40 p-6 text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Session</span>
                    <span className="font-medium text-foreground">{STUDIO_INFO.session}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{selectedDateObj.weekday}, {selectedDateObj.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedSessionObj.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-medium text-gold">{[...selectedSeatIds].sort().join(', ')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono font-medium text-foreground">
                      AVX-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => navigate('home')} className="bg-gold text-gold-foreground hover:bg-gold/90">
                    Back to Home
                  </Button>
                  <Button variant="outline" onClick={() => navigate('lookbook')}>
                    Explore Designs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  // ─── Details modal ───────────────────────────────────────────────────────
  if (showDetails) {
    return (
      <section className="min-h-screen pt-24 pb-16 bg-background" aria-label="Enter your details">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowDetails(false)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" /> Back to seat selection
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="border-gold/20 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Confirm Your <span className="text-gold">Booking</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  {STUDIO_INFO.session} · {selectedDateObj.weekday}, {selectedDateObj.date} · {selectedSessionObj.time}
                </p>

                <div className="mt-4 rounded-lg bg-gold/10 border border-gold/20 px-4 py-3 text-sm text-gold flex items-center gap-2">
                  <Sofa className="size-4" />
                  Seats: <span className="font-semibold">{[...selectedSeatIds].sort().join(', ')}</span>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Input
                      id="notes"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Bathroom size, style preference, etc."
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    Free, no-obligation design consultation. Your seat is held for 15 minutes before the session starts.
                  </span>
                </div>

                <Button
                  onClick={handleConfirm}
                  disabled={!form.name || !form.email || !form.phone}
                  className="w-full mt-6 h-12 bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                  <CheckCircle2 className="size-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  // ─── Main seat selection ─────────────────────────────────────────────────
  return (
    <section className="min-h-screen pt-20 sm:pt-24 pb-16 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a]" aria-label="Book a slot">
      {/* Gold glow accents */}
      <div
        className="absolute top-0 right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,105,0.4) 0%, rgba(212,175,105,0.1) 40%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft className="size-4" /> Back to Home
        </button>

        {/* Studio header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-2"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-lg ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5 shrink-0">
            <img src="/auravix-logo.jpg" alt="" className="w-7 h-7 object-contain" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-lg sm:text-xl font-bold tracking-[0.15em] text-white">
              {STUDIO_INFO.name}
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-gold mt-1">
              DESIGN STUDIO
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
        >
          Select your <span className="text-gold">slot</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-gold" />
            {STUDIO_INFO.session}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-gold" />
            {STUDIO_INFO.duration}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-gold" />
            {STUDIO_INFO.address}
          </span>
        </motion.div>

        {/* Date selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-white/70">
            <Calendar className="size-4 text-gold" />
            <span className="font-medium">Choose a date</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
            {DATES.map((d) => {
              const active = d.id === selectedDate
              return (
                <button
                  key={d.id}
                  onClick={() => handleDateChange(d.id)}
                  className={`shrink-0 w-[88px] sm:w-[96px] rounded-xl border px-3 py-3 text-center transition-all duration-300 ${
                    active
                      ? 'border-gold bg-gold text-gold-foreground shadow-lg shadow-gold/20'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-gold/40 hover:text-white'
                  }`}
                >
                  <div className="text-[11px] font-medium tracking-wide uppercase opacity-80">{d.day}</div>
                  <div className="text-sm font-bold mt-0.5">{d.date}</div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Session selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-white/70">
            <Clock className="size-4 text-gold" />
            <span className="font-medium">Choose a session</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {SESSIONS.map((s) => {
              const active = s.id === selectedSession
              return (
                <button
                  key={s.id}
                  onClick={() => handleSessionChange(s.id)}
                  className={`relative rounded-xl border px-3 py-4 text-center transition-all duration-300 ${
                    active
                      ? 'border-gold bg-gold/15 text-white shadow-lg shadow-gold/10'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-gold/40 hover:text-white'
                  }`}
                >
                  {s.badge && (
                    <span
                      className={`absolute -top-2 right-2 text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded-full ${
                        active ? 'bg-gold text-gold-foreground' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {s.badge}
                    </span>
                  )}
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className={`text-xs mt-1 ${active ? 'text-gold' : 'text-white/50'}`}>{s.time}</div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Seat map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-4 sm:p-8"
        >
          {/* Screen indicator */}
          <div className="flex flex-col items-center mb-8">
            <div className="text-[10px] sm:text-xs tracking-[0.3em] text-gold font-medium uppercase mb-2">
              Design Display Wall
            </div>
            <div
              className="w-full max-w-md h-2 rounded-t-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,105,0.7) 50%, transparent 100%)',
              }}
            />
            <div className="text-[10px] text-white/30 mt-2">⬇ seats face this way ⬇</div>
          </div>

          {/* Seat grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[320px] mx-auto" style={{ maxWidth: '640px' }}>
              {ROWS.map((row) => {
                const rowSeats = seats.filter((s) => s.row === row)
                return (
                  <div key={row} className="flex items-center justify-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                    {/* Row label left */}
                    <span className="w-5 text-center text-[11px] sm:text-xs font-medium text-white/40">{row}</span>
                    {rowSeats.map((seat, idx) => {
                      const isSelected = selectedSeatIds.has(seat.id)
                      const isAisle = idx === splitAt - 1
                      return (
                        <span key={seat.id} className="contents">
                          <SeatCell
                            seat={seat}
                            selected={isSelected}
                            onToggle={toggleSeat}
                          />
                          {isAisle && <span className="w-2 sm:w-3" aria-hidden="true" />}
                        </span>
                      )
                    })}
                    {/* Row label right */}
                    <span className="w-5 text-center text-[11px] sm:text-xs font-medium text-white/40">{row}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`inline-block w-4 h-4 rounded-md border ${l.className}`} />
                <span className="text-xs text-white/60">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/40">
            <Info className="size-3.5" />
            <span>Premium seats (front rows) include a dedicated designer & material samples</span>
          </div>
        </motion.div>

        {/* Summary + Next */}
        <AnimatePresence>
          {canProceed && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sticky bottom-4 z-30"
            >
              <Card className="border-gold/40 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/40">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="flex-1 flex items-center gap-3">
                      <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gold/15 shrink-0">
                        <Sofa className="size-5 text-gold" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Selected seats ({selectedSeatIds.size})</div>
                        <div className="text-sm sm:text-base font-semibold text-foreground truncate">
                          {[...selectedSeatIds].sort().join(', ')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {selectedDateObj.weekday}, {selectedDateObj.date} · {selectedSessionObj.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-muted-foreground">Total</div>
                        <div className="text-lg font-bold text-gold">{formatINR(0)}</div>
                      </div>
                      <Button
                        onClick={() => setShowDetails(true)}
                        className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-6 sm:px-8 h-11 sm:h-12 shadow-lg shadow-gold/20"
                      >
                        Next
                        <ArrowRight className="size-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!canProceed && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40">
            <Users className="size-4" />
            <span>Select one or more seats to continue</span>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, title: 'Free & No-Obligation', desc: 'No payment required to book' },
            { icon: Star, title: 'Expert Designers', desc: '10+ years of bathroom expertise' },
            { icon: Clock, title: '60-min Session', desc: 'Includes material samples & 3D mockups' },
          ].map((b) => (
            <div key={b.title} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
              <b.icon className="size-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-white">{b.title}</div>
                <div className="text-xs text-white/50 mt-0.5">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SeatCell ───────────────────────────────────────────────────────────────

const splitAt = 5 // aisle after the 5th column

function SeatCell({
  seat,
  selected,
  onToggle,
}: {
  seat: Seat
  selected: boolean
  onToggle: (seat: Seat) => void
}) {
  const isReserved = seat.status === 'reserved'
  const isPremium = seat.status === 'premium'
  const disabled = isReserved

  let cls = ''
  if (selected) {
    cls = 'bg-gold border-gold text-gold-foreground shadow-md shadow-gold/30 scale-105'
  } else if (isReserved) {
    cls = 'bg-muted border-border text-muted-foreground/40 cursor-not-allowed'
  } else if (isPremium) {
    cls = 'bg-sky-500/15 border-sky-500/40 text-sky-200/80 hover:bg-sky-500/25 hover:border-sky-500/60'
  } else {
    cls = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100/70 hover:bg-emerald-500/25 hover:border-emerald-500/60'
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(seat)}
      aria-label={`Seat ${seat.id}${isReserved ? ' (reserved)' : isPremium ? ' (premium)' : ''}${selected ? ' (selected)' : ''}`}
      aria-pressed={selected}
      className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-md border text-[9px] sm:text-[10px] font-semibold flex items-center justify-center transition-all duration-200 ${cls}`}
    >
      {seat.col}
    </button>
  )
}
