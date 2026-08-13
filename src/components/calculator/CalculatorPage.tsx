'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Download,
  Clock,
  Info,
  Check,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  X,
  Shield,
} from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { useAuth } from '@/store/auth'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

/* ──────────────── Types & Data ──────────────── */

type PackageTier = 'basic' | 'premium' | 'luxury'
type TileType = 'ceramic' | 'vitrified'
type VanityType = 'wall-mounted' | 'floor-standing' | 'designer' | 'custom'
type ShowerType = 'standard' | 'rain-shower' | 'shower-panel' | 'shower-body-jets'
type AddOnKey =
  | 'shower-enclosure'
  | 'bathtub'
  | 'led-mirror'

// ─── Package pricing (per square foot) ───
const PACKAGE_RATE: Record<PackageTier, number> = {
  basic: 2500,
  premium: 3500,
  luxury: 4500,
}

const PACKAGE_PRICE_LABEL: Record<PackageTier, string> = {
  basic: '₹2,500/Sq. Ft.',
  premium: '₹3,500/Sq. Ft.',
  luxury: '₹4,500/Sq. Ft.',
}

const TILE_LABELS: Record<TileType, string> = {
  ceramic: 'Ceramic',
  vitrified: 'Vitrified',
}

// Tile costs (hidden from UI — used in cost breakdown only)
const TILE_COSTS: Record<TileType, number> = {
  ceramic: 40,
  vitrified: 70,
}

const VANITY_LABELS: Record<VanityType, string> = {
  'wall-mounted': 'Wall-mounted',
  'floor-standing': 'Floor-standing',
  designer: 'Designer',
  custom: 'Custom',
}

// Vanity costs (hidden from UI — used in cost breakdown only)
const VANITY_COSTS: Record<VanityType, number> = {
  'wall-mounted': 8000,
  'floor-standing': 12000,
  designer: 25000,
  custom: 40000,
}

const SHOWER_LABELS: Record<ShowerType, string> = {
  standard: 'Standard',
  'rain-shower': 'Rain Shower',
  'shower-panel': 'Shower Panel',
  'shower-body-jets': 'Shower + Body Jets',
}

// Shower costs (hidden from UI — used in cost breakdown only)
const SHOWER_COSTS: Record<ShowerType, number> = {
  standard: 3000,
  'rain-shower': 8000,
  'shower-panel': 15000,
  'shower-body-jets': 25000,
}

const ADD_ONS: Record<AddOnKey, { label: string; cost: number }> = {
  'shower-enclosure': { label: 'Shower Enclosure', cost: 12000 },
  bathtub: { label: 'Bathtub', cost: 25000 },
  'led-mirror': { label: 'LED Mirror', cost: 3500 },
}

/* ──────────────── Helpers ──────────────── */

function formatIndianCurrency(amount: number): string {
  const str = amount.toString()
  let lastThree = str.substring(str.length - 3)
  const otherNumbers = str.substring(0, str.length - 3)
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
  return `₹${formatted}`
}

function getTimeline(tier: PackageTier): string {
  const tierDays: Record<PackageTier, [number, number]> = {
    basic: [20, 25],
    premium: [25, 30],
    luxury: [30, 35],
  }
  const [min, max] = tierDays[tier]
  return `Estimated: ${min}-${max} days`
}

/* ──────────────── Animation variants ──────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: custom },
  }),
}

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

/* ──────────────── Component ──────────────── */

export function CalculatorPage() {
  const { navigate } = useNavigation()
  const { toast } = useToast()
  const { user, fetchSession } = useAuth()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' })
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  // Form state
  const [bathroomLength, setBathroomLength] = useState('')
  const [bathroomWidth, setBathroomWidth] = useState('')
  const [packageTier, setPackageTier] = useState<PackageTier>('premium')
  const [tileType, setTileType] = useState<TileType>('vitrified')
  const [vanityType, setVanityType] = useState<VanityType>('floor-standing')
  const [showerType, setShowerType] = useState<ShowerType>('rain-shower')
  const [selectedAddOns, setSelectedAddOns] = useState<Set<AddOnKey>>(new Set())

  // ─── Weekly calendar booking state ───
  const [weekOffset, setWeekOffset] = useState(0) // 0 = current week, 1 = next week, etc.
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' })
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingReference, setBookingReference] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Refs for animation
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const formRef = useRef<HTMLDivElement>(null)
  const formInView = useInView(formRef, { once: true, margin: '-80px' })

  // Toggle add-on
  const toggleAddOn = (key: AddOnKey) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // ─── Bathroom area calculation (Length × Width in feet) ───
  const bathroomArea = useMemo(() => {
    const l = parseFloat(bathroomLength)
    const w = parseFloat(bathroomWidth)
    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) return 0
    return Math.round(l * w)
  }, [bathroomLength, bathroomWidth])

  // Cost calculations
  const costs = useMemo(() => {
    const rate = PACKAGE_RATE[packageTier]
    const baseCost = bathroomArea * rate

    // Add-on costs (tiles, vanity, shower, add-ons are included in the per-sqft rate
    // but we track them for display in the cost breakdown as selected items)
    const tilesCost = TILE_COSTS[tileType] * bathroomArea
    const vanityCost = VANITY_COSTS[vanityType]
    const showerCost = SHOWER_COSTS[showerType]

    let addOnsTotal = 0
    selectedAddOns.forEach((key) => {
      addOnsTotal += ADD_ONS[key].cost
    })

    // Total = package rate × area + add-ons (no separate labor line — it's included in the rate)
    const totalCost = baseCost + addOnsTotal

    return {
      baseCost,
      tilesCost,
      vanityCost,
      showerCost,
      addOnsTotal,
      totalCost,
    }
  }, [bathroomArea, packageTier, tileType, vanityType, showerType, selectedAddOns])

  // Download quotation handler
  const handleDownload = () => {
    toast({
      title: 'Quotation Downloaded',
      description: `Your estimated quotation of ${formatIndianCurrency(costs.totalCost)} has been saved.`,
      duration: 4000,
    })
  }

  // ─── Weekly calendar logic ───
  const weekDays = useMemo(() => {
    const today = new Date()
    // Start from Sunday of the current week (or Monday — we'll use Monday for business)
    const start = new Date(today)
    const dayOfWeek = today.getDay() // 0 = Sunday
    // Shift to Monday of current week
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    start.setDate(today.getDate() + diffToMonday + weekOffset * 7)
    const days: { id: string; day: string; dateNum: string; month: string; fullDate: string; isToday: boolean; isPast: boolean }[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const isToday = d.toDateString() === today.toDateString()
      const isPast = d < today && !isToday
      days.push({
        id: d.toISOString().slice(0, 10),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.toLocaleDateString('en-US', { day: 'numeric' }),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        isToday,
        isPast,
      })
    }
    return days
  }, [weekOffset])

  const TIME_SLOTS = [
    { id: '11:00 AM', label: '11:00 AM', sub: 'Morning' },
    { id: '2:00 PM', label: '2:00 PM', sub: 'Afternoon' },
    { id: '4:00 PM', label: '4:00 PM', sub: 'Evening' },
  ]

  const weekLabel = useMemo(() => {
    if (weekDays.length === 0) return ''
    const first = weekDays[0]
    const last = weekDays[6]
    return `${first.dateNum} ${first.month} – ${last.dateNum} ${last.month}`
  }, [weekDays])

  // ─── Login popup handlers ───
  const handlePopupLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    try {
      const { error: sbError } = await supabaseBrowser.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })
      if (sbError) {
        setAuthError(sbError.message)
        setAuthLoading(false)
        return
      }
      await fetchSession()
      setShowLoginPopup(false)
      // Auto-proceed with booking (skip login check — user just logged in)
      submitBooking()
    } catch {
      setAuthError('Login failed. Please try again.')
      setAuthLoading(false)
    }
  }

  const handlePopupSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    if (signupForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters')
      return
    }
    setAuthLoading(true)
    try {
      const { data, error: sbError } = await supabaseBrowser.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: { data: { full_name: signupForm.name } },
      })
      if (sbError) {
        setAuthError(sbError.message)
        setAuthLoading(false)
        return
      }
      if (data.user && !data.session) {
        setAuthError('Account created! Check your email to confirm, then log in.')
        setAuthMode('login')
        setLoginForm({ email: signupForm.email, password: '' })
        setAuthLoading(false)
        return
      }
      if (data.session) {
        await fetchSession()
        setShowLoginPopup(false)
        submitBooking()
      }
    } catch {
      setAuthError('Signup failed. Please try again.')
      setAuthLoading(false)
    }
  }

  const handlePopupGoogleLogin = async () => {
    setAuthError('')
    try {
      await supabaseBrowser.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
    } catch {
      setAuthError('Google login failed.')
    }
  }

  // ─── Submit booking (no login check — used after login) ───
  const submitBooking = async () => {
    if (!selectedDateId || !selectedTimeSlot || !bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.address) return
    setIsSubmitting(true)
    const selectedDay = weekDays.find((d) => d.id === selectedDateId)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: bookingForm.name,
          email: bookingForm.email,
          phone: bookingForm.phone,
          city: bookingForm.address,
          preferredDate: selectedDay?.fullDate || selectedDateId,
          timeSlot: selectedTimeSlot,
          consultationType: 'studio-visit',
          bathroomStatus: `${bathroomArea}sqft-${packageTier}`,
          budgetRange: formatIndianCurrency(costs.totalCost),
          requirements: `Calculator estimate: ${formatIndianCurrency(costs.totalCost)} | Address: ${bookingForm.address} | Notes: ${bookingForm.notes}`,
        }),
      })
      const data = await res.json()
      setBookingReference(data.referenceNumber || `AVX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
    } catch {
      setBookingReference(`AVX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
    }
    setIsSubmitting(false)
    setBookingConfirmed(true)
  }

  // ─── Confirm Booking (checks login first) ───
  const handleConfirmBooking = async () => {
    if (!selectedDateId || !selectedTimeSlot || !bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.address) return

    // ─── Check if user is logged in ───
    if (!user) {
      setShowLoginPopup(true)
      return
    }

    // User is logged in — proceed with booking
    await submitBooking()
  }

  return (
    <div className="pt-20 sm:pt-24">
      {/* ─── Page Header ─── */}
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        aria-label="Calculator header"
        ref={headerRef}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-background" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,105,0.4) 0%, transparent 60%)',
          }}
        />

        <motion.div
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-4">
            <Calculator className="size-4" />
            AURAVIX Bath Studio
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Instant Quotation <span className="text-gold">Calculator</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get an estimated cost for your bathroom renovation in minutes
          </p>
        </motion.div>
      </section>

      {/* ─── Calculator Body ─── */}
      <section className="pb-16 md:pb-24" aria-label="Quotation calculator" ref={formRef}>
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          variants={sectionVariant}
          initial="hidden"
          animate={formInView ? 'visible' : 'hidden'}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {/* ─── Left: Calculator Form ─── */}
            <div className="lg:col-span-3 space-y-6">
              {/* Section 1: Bathroom Details */}
              <motion.div variants={fadeInUp} custom={0}>
                <Card className="border-border/50 bg-card shadow-sm">
                  <CardHeader className="pb-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center size-7 rounded-lg bg-gold/10 text-gold text-xs font-bold">
                        1
                      </span>
                      Bathroom Dimensions
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Length × Width Calculator */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bath-length" className="text-sm font-medium text-foreground">
                          Length (ft)
                        </Label>
                        <Input
                          id="bath-length"
                          type="number"
                          min="1"
                          step="0.5"
                          value={bathroomLength}
                          onChange={(e) => setBathroomLength(e.target.value)}
                          placeholder="e.g. 8"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bath-width" className="text-sm font-medium text-foreground">
                          Width (ft)
                        </Label>
                        <Input
                          id="bath-width"
                          type="number"
                          min="1"
                          step="0.5"
                          value={bathroomWidth}
                          onChange={(e) => setBathroomWidth(e.target.value)}
                          placeholder="e.g. 6"
                          className="h-11"
                        />
                      </div>
                    </div>

                    {/* Calculated Area */}
                    <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Bathroom Area</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Length × Width</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gold">
                          {bathroomArea > 0 ? bathroomArea : '—'}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">Sq. Ft.</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Section 2: Package Selection */}
              <motion.div variants={fadeInUp} custom={0.1}>
                <Card className="border-border/50 bg-card shadow-sm">
                  <CardHeader className="pb-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center size-7 rounded-lg bg-gold/10 text-gold text-xs font-bold">
                        2
                      </span>
                      Package Selection
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Package Tier */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground">
                        Package Tier
                      </Label>
                      <RadioGroup
                        value={packageTier}
                        onValueChange={(v) => setPackageTier(v as PackageTier)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                      >
                        {[
                          {
                            value: 'basic',
                            label: 'Basic',
                            desc: 'Essential fittings & standard tiles',
                          },
                          {
                            value: 'premium',
                            label: 'Premium',
                            desc: 'Better aesthetics & accessories',
                          },
                          {
                            value: 'luxury',
                            label: 'Luxury',
                            desc: 'Smart bathroom & premium finishes',
                          },
                        ].map((tier) => (
                          <label
                            key={tier.value}
                            htmlFor={`tier-${tier.value}`}
                            className={`flex flex-col rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                              packageTier === tier.value
                                ? 'border-gold/60 bg-gold/5 shadow-sm'
                                : 'border-border/50 hover:border-border hover:bg-muted/30'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <RadioGroupItem
                                value={tier.value}
                                id={`tier-${tier.value}`}
                                className="data-[state=checked]:border-gold data-[state=checked]:text-gold [&>svg]:fill-gold [&>svg]:text-gold"
                              />
                              <span className="text-sm font-semibold text-foreground">
                                {tier.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                              {tier.desc}
                            </p>
                            <span className="text-lg font-bold text-gold">
                              {PACKAGE_PRICE_LABEL[tier.value as PackageTier]}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Tile Selection (names only, no prices) */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Tile Selection
                      </Label>
                      <Select
                        value={tileType}
                        onValueChange={(v) => setTileType(v as TileType)}
                      >
                        <SelectTrigger className="w-full h-11">
                          <SelectValue placeholder="Select tile type" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(TILE_LABELS) as TileType[]).map((key) => (
                            <SelectItem key={key} value={key}>
                              {TILE_LABELS[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Section 3: Fixtures & Fittings */}
              <motion.div variants={fadeInUp} custom={0.2}>
                <Card className="border-border/50 bg-card shadow-sm">
                  <CardHeader className="pb-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center size-7 rounded-lg bg-gold/10 text-gold text-xs font-bold">
                        3
                      </span>
                      Fixtures &amp; Fittings
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Vanity Type (names only, no prices) */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Vanity Type
                      </Label>
                      <Select
                        value={vanityType}
                        onValueChange={(v) => setVanityType(v as VanityType)}
                      >
                        <SelectTrigger className="w-full h-11">
                          <SelectValue placeholder="Select vanity type" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(VANITY_LABELS) as VanityType[]).map((key) => (
                            <SelectItem key={key} value={key}>
                              {VANITY_LABELS[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Shower Type (names only, no prices) */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Shower Type
                      </Label>
                      <Select
                        value={showerType}
                        onValueChange={(v) => setShowerType(v as ShowerType)}
                      >
                        <SelectTrigger className="w-full h-11">
                          <SelectValue placeholder="Select shower type" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(SHOWER_LABELS) as ShowerType[]).map((key) => (
                            <SelectItem key={key} value={key}>
                              {SHOWER_LABELS[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Add-ons (names only, no prices) */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground">
                        Add-ons
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(Object.keys(ADD_ONS) as AddOnKey[]).map((key) => {
                          const isChecked = selectedAddOns.has(key)
                          return (
                            <label
                              key={key}
                              htmlFor={`addon-${key}`}
                              className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                                isChecked
                                  ? 'border-gold/60 bg-gold/5 shadow-sm'
                                  : 'border-border/50 hover:border-border hover:bg-muted/30'
                              }`}
                            >
                              <Checkbox
                                id={`addon-${key}`}
                                checked={isChecked}
                                onCheckedChange={() => toggleAddOn(key)}
                                className="data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-gold-foreground"
                              />
                              <span className="text-sm text-foreground">{ADD_ONS[key].label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ─── Right: Live Cost Preview ─── */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28">
                <motion.div variants={fadeInUp} custom={0.15}>
                  <Card className="border-gold/30 bg-card shadow-xl shadow-gold/5 overflow-hidden">
                    {/* Gold accent bar */}
                    <div className="h-1 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />

                    <CardHeader className="pb-2">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Calculator className="size-5 text-gold" />
                        Cost Breakdown
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Selected items & estimated total
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Selected items (names only, no individual prices) */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Package</span>
                          <span className="font-medium text-foreground capitalize">{packageTier} ({PACKAGE_PRICE_LABEL[packageTier]})</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Bathroom Area</span>
                          <span className="font-medium text-foreground">{bathroomArea > 0 ? `${bathroomArea} Sq. Ft.` : '—'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tile</span>
                          <span className="font-medium text-foreground">{TILE_LABELS[tileType]}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Vanity</span>
                          <span className="font-medium text-foreground">{VANITY_LABELS[vanityType]}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Shower</span>
                          <span className="font-medium text-foreground">{SHOWER_LABELS[showerType]}</span>
                        </div>
                        {selectedAddOns.size > 0 && (
                          <div className="flex items-start justify-between text-sm gap-4">
                            <span className="text-muted-foreground shrink-0">Add-ons</span>
                            <span className="font-medium text-foreground text-right">
                              {[...selectedAddOns].map((k) => ADD_ONS[k].label).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator className="bg-border/50" />

                      {/* Total (excluding GST) */}
                      <div className="flex items-center justify-between py-1">
                        <span className="text-base font-bold text-foreground">
                          Estimated Total Cost
                        </span>
                        <span className="text-xs text-muted-foreground">(excl. GST)</span>
                        <motion.span
                          key={costs.totalCost}
                          initial={{ scale: 1.05, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="text-2xl font-bold text-gold"
                        >
                          {bathroomArea > 0 ? formatIndianCurrency(costs.totalCost) : '—'}
                        </motion.span>
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3">
                        <Clock className="size-4 text-gold shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {getTimeline(packageTier)}
                        </span>
                      </div>

                      {/* Thank you message */}
                      <div className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-center">
                        <p className="text-sm font-semibold text-foreground">
                          Thank you for visiting AURAVIX BATH STUDIO.
                        </p>
                        <p className="text-sm text-gold font-semibold mt-1">
                          Book a Consultation for just ₹299/-
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-2">
                        <Button
                          onClick={handleDownload}
                          className="w-full h-12 font-semibold tracking-wide text-sm bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300"
                        >
                          <Download className="size-4 mr-2" />
                          Download Quotation
                        </Button>
                        <a
                          href="#weekly-calendar"
                          className="block w-full"
                        >
                          <Button
                            variant="outline"
                            className="w-full h-12 font-semibold tracking-wide text-sm border-border hover:border-gold/40 hover:text-gold transition-all duration-300"
                          >
                            <CalendarDays className="size-4 mr-2" />
                            Book a Consultation Below
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Weekly Calendar Slot Booking ─── */}
      <section
        id="weekly-calendar"
        className="relative py-16 md:py-24 overflow-hidden scroll-mt-24"
        aria-label="Book your slot"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,105,0.4) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-4">
              <CalendarDays className="size-4" />
              Weekly Availability
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Book Your <span className="text-gold">Slot</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Pick a day and time that works for you. Free 60-minute design consultation at our studio.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-gold" /> 123 Design District, Mumbai
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-gold" /> 60-minute session
              </span>
            </div>
          </motion.div>

          {/* Booking card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <Card className="border-gold/30 bg-card shadow-xl shadow-gold/5 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />

              {bookingConfirmed ? (
                /* ─── Success state ─── */
                <CardContent className="p-8 sm:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-gold/15 mb-6"
                  >
                    <CheckCircle2 className="size-11 text-gold" />
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Slot <span className="text-gold">Booked!</span>
                  </h3>
                  <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                    Your design consultation is confirmed. We&apos;ve sent a confirmation to{' '}
                    <span className="font-medium text-foreground">{bookingForm.email}</span>.
                  </p>
                  <div className="mt-8 rounded-xl border border-border bg-muted/40 p-6 text-left max-w-md mx-auto space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Session</span>
                      <span className="font-medium text-foreground">Design Consultation (60 min)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-foreground">
                        {weekDays.find((d) => d.id === selectedDateId)?.fullDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium text-gold">{selectedTimeSlot}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimate</span>
                      <span className="font-medium text-foreground">{formatIndianCurrency(costs.totalCost)}</span>
                    </div>
                    {bookingForm.address && (
                      <div className="flex justify-between text-sm gap-4">
                        <span className="text-muted-foreground shrink-0">Address</span>
                        <span className="font-medium text-foreground text-right">{bookingForm.address}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reference</span>
                      <span className="font-mono font-medium text-foreground">{bookingReference}</span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setBookingConfirmed(false)
                        setSelectedDateId(null)
                        setSelectedTimeSlot(null)
                        setBookingForm({ name: '', email: '', phone: '', address: '', notes: '' })
                      }}
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                    >
                      Book Another Slot
                    </Button>
                    <Button onClick={() => navigate('home')} className="bg-gold text-gold-foreground hover:bg-gold/90">
                      Back to Home
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-6 sm:p-8 lg:p-10">
                  {/* ─── Week navigator ─── */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                        <CalendarDays className="size-5 text-gold" />
                        Select a day
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {weekLabel}{weekOffset === 0 ? ' (This week)' : weekOffset === 1 ? ' (Next week)' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setWeekOffset((w) => Math.max(0, w - 1))
                          setSelectedDateId(null)
                          setSelectedTimeSlot(null)
                        }}
                        disabled={weekOffset === 0}
                        aria-label="Previous week"
                        className="h-10 w-10 border-border hover:border-gold/40 hover:text-gold"
                      >
                        <ChevronLeft className="size-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setWeekOffset((w) => Math.min(4, w + 1))
                          setSelectedDateId(null)
                          setSelectedTimeSlot(null)
                        }}
                        disabled={weekOffset >= 4}
                        aria-label="Next week"
                        className="h-10 w-10 border-border hover:border-gold/40 hover:text-gold"
                      >
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                  </div>

                  {/* ─── Day pills ─── */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 mb-8">
                    {weekDays.map((d, idx) => {
                      const isActive = selectedDateId === d.id
                      const isDisabled = d.isPast
                      return (
                        <motion.button
                          key={d.id}
                          type="button"
                          disabled={isDisabled}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.3 }}
                          whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
                          whileTap={!isDisabled ? { scale: 0.95 } : {}}
                          onClick={() => {
                            setSelectedDateId(d.id)
                            setSelectedTimeSlot(null)
                          }}
                          className={`relative rounded-xl border px-2 py-3 sm:py-4 text-center transition-all duration-200 ${
                            isActive
                              ? 'border-gold bg-gold text-gold-foreground shadow-lg shadow-gold/20'
                              : isDisabled
                                ? 'border-border bg-muted/30 text-muted-foreground/40 cursor-not-allowed'
                                : 'border-border bg-card text-foreground hover:border-gold/40 hover:bg-gold/5'
                          }`}
                        >
                          {d.isToday && !isActive && (
                            <span className="absolute top-1 right-1 size-1.5 rounded-full bg-gold animate-pulse" aria-label="Today" />
                          )}
                          <div className="text-[10px] sm:text-xs font-medium tracking-wide uppercase opacity-80">
                            {d.day}
                          </div>
                          <div className="text-lg sm:text-xl font-bold mt-0.5">{d.dateNum}</div>
                          <div className="text-[9px] sm:text-[10px] opacity-70">{d.month}</div>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* ─── Time slots ─── */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: selectedDateId ? 1 : 0.4, height: 'auto' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`${selectedDateId ? '' : 'pointer-events-none'}`}
                  >
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 mb-4"
                    >
                      <Clock className="size-5 text-gold" />
                      Select a time
                      {selectedDateId && (
                        <span className="text-sm font-normal text-muted-foreground">
                          · {weekDays.find((d) => d.id === selectedDateId)?.fullDate}
                        </span>
                      )}
                    </motion.h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
                      {TIME_SLOTS.map((slot, idx) => {
                        const isActive = selectedTimeSlot === slot.id
                        return (
                          <motion.button
                            key={slot.id}
                            type="button"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + idx * 0.06, duration: 0.3 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTimeSlot(slot.id)}
                            className={`rounded-xl border px-3 py-3 text-center transition-all duration-200 ${
                              isActive
                                ? 'border-gold bg-gold/15 shadow-md shadow-gold/10'
                                : 'border-border bg-card hover:border-gold/40 hover:bg-gold/5'
                            }`}
                          >
                            <div className={`text-sm font-semibold ${isActive ? 'text-gold' : 'text-foreground'}`}>
                              {slot.label}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{slot.sub}</div>
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* ─── Contact form ─── */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: selectedTimeSlot ? 1 : 0.4, height: 'auto' }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={`${selectedTimeSlot ? '' : 'pointer-events-none'}`}
                    >
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 mb-4"
                      >
                        <User className="size-5 text-gold" />
                        Your details
                      </motion.h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name — staggered entrance */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.4 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="bk-name" className="text-sm font-medium">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-gold" />
                            <Input
                              id="bk-name"
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              placeholder="John Doe"
                              className="pl-9 h-11 transition-all duration-300 focus:border-gold/50 focus:shadow-[0_0_0_3px_rgba(212,175,105,0.1)]"
                            />
                          </div>
                        </motion.div>

                        {/* Phone */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.4 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="bk-phone" className="text-sm font-medium">
                            Phone <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-gold" />
                            <Input
                              id="bk-phone"
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="pl-9 h-11 transition-all duration-300 focus:border-gold/50 focus:shadow-[0_0_0_3px_rgba(212,175,105,0.1)]"
                            />
                          </div>
                        </motion.div>

                        {/* Email */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.4 }}
                          className="space-y-2 sm:col-span-2"
                        >
                          <Label htmlFor="bk-email" className="text-sm font-medium">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-gold" />
                            <Input
                              id="bk-email"
                              type="email"
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              placeholder="you@example.com"
                              className="pl-9 h-11 transition-all duration-300 focus:border-gold/50 focus:shadow-[0_0_0_3px_rgba(212,175,105,0.1)]"
                            />
                          </div>
                        </motion.div>

                        {/* Address — NEW field with animation */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45, duration: 0.4 }}
                          className="space-y-2 sm:col-span-2"
                        >
                          <Label htmlFor="bk-address" className="text-sm font-medium">
                            Address <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-gold" />
                            <Input
                              id="bk-address"
                              value={bookingForm.address}
                              onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                              placeholder="Flat 101, Sunrise Apartments, Bandra West, Mumbai 400050"
                              className="pl-9 h-11 transition-all duration-300 focus:border-gold/50 focus:shadow-[0_0_0_3px_rgba(212,175,105,0.1)]"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-3 text-gold" />
                            Our designer will visit this address for the consultation
                          </p>
                        </motion.div>
                      </div>

                      {/* Booking summary + confirm */}
                      <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-4 sm:p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <Sparkles className="size-5 text-gold shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground">Booking Summary</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {selectedDateId
                                ? weekDays.find((d) => d.id === selectedDateId)?.fullDate
                                : 'Select a date'}
                              {' · '}
                              {selectedTimeSlot || 'Select a time'}
                              {' · '}
                              Estimate: {formatIndianCurrency(costs.totalCost)}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={handleConfirmBooking}
                          disabled={
                            !selectedDateId ||
                            !selectedTimeSlot ||
                            !bookingForm.name ||
                            !bookingForm.email ||
                            !bookingForm.phone ||
                            !bookingForm.address ||
                            isSubmitting
                          }
                          className="w-full h-12 bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="size-4 mr-2 animate-spin rounded-full border-2 border-gold-foreground/30 border-t-gold-foreground" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              Confirm Booking
                              <ArrowRight className="size-4 ml-2" />
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
                          <Check className="size-3 text-gold" />
                          Free & no-obligation. We&apos;ll send a confirmation email instantly.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Initial hint when no date selected */}
                  {!selectedDateId && (
                    <div className="text-center py-6 text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <CalendarDays className="size-4 text-gold" />
                      Please select a day above to see available time slots
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ─── Disclaimer ─── */}
      <section className="pb-16 md:pb-24" aria-label="Disclaimer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 p-5 sm:p-6"
          >
            <Info className="size-5 text-gold shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              This is an estimated quotation. Final pricing may vary based on site conditions and specific requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Login Required Popup ─── */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl shadow-2xl border border-border max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-6 text-center">
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gold/15 mb-3 mx-auto">
                  <Lock className="size-7 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {authMode === 'login' ? 'Sign In to Continue' : 'Create Account'}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Please sign in to confirm your booking
                </p>
              </div>

              {/* Toggle */}
              <div className="px-6 pt-4">
                <div className="relative grid grid-cols-2 bg-muted rounded-full p-1">
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError('') }}
                    className={`relative z-10 py-2 text-sm font-medium transition-colors ${authMode === 'login' ? 'text-gold-foreground' : 'text-muted-foreground'}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthError('') }}
                    className={`relative z-10 py-2 text-sm font-medium transition-colors ${authMode === 'signup' ? 'text-gold-foreground' : 'text-muted-foreground'}`}
                  >
                    Sign Up
                  </button>
                  <motion.div
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gold"
                    animate={{ left: authMode === 'login' ? 4 : 'calc(50%)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                {authMode === 'login' ? (
                  <form onSubmit={handlePopupLogin} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="h-11"
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      className="h-11"
                    />
                    {authError && <p className="text-sm text-red-500">{authError}</p>}
                    <Button type="submit" disabled={authLoading} className="w-full h-11 bg-gold text-gold-foreground hover:bg-gold/90">
                      {authLoading ? 'Signing in...' : 'Sign In & Confirm Booking'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handlePopupSignup} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      required
                      className="h-11"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      className="h-11"
                    />
                    <Input
                      type="password"
                      placeholder="Password (min 6 chars)"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      className="h-11"
                    />
                    {authError && <p className="text-sm text-red-500">{authError}</p>}
                    <Button type="submit" disabled={authLoading} className="w-full h-11 bg-gold text-gold-foreground hover:bg-gold/90">
                      {authLoading ? 'Creating account...' : 'Sign Up & Confirm Booking'}
                    </Button>
                  </form>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Google */}
                <button
                  onClick={handlePopupGoogleLogin}
                  className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
                >
                  <svg className="size-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Your booking details will be saved after you sign in
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ──────────────── Sub-component ──────────────── */

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">
        {formatIndianCurrency(value)}
      </span>
    </div>
  )
}
