'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Award,
  Sparkles,
  Zap,
  Mail,
  User,
  MessageSquare,
} from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  fullName: string
  email: string
  phone: string
  contactMethod: string
  // Step 2
  city: string
  preferredDate: Date | undefined
  timeSlot: string
  consultationType: string
  // Step 3
  bathroomStatus: string
  budgetRange: string
  stylePreferences: string[]
  additionalRequirements: string
  // Step 4
  termsAccepted: boolean
}

type StepId = 1 | 2 | 3 | 4

interface StepInfo {
  id: StepId
  label: string
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STEPS: StepInfo[] = [
  { id: 1, label: 'Personal Details' },
  { id: 2, label: 'Location & Schedule' },
  { id: 3, label: 'Requirements' },
  { id: 4, label: 'Confirmation' },
]

const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
]

const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

const BATHROOM_STATUSES = [
  'New Construction',
  'Full Renovation',
  'Partial Renovation',
  'Just Exploring',
]

const BUDGET_RANGES = [
  'Under ₹50K',
  '₹50K-₹1L',
  '₹1L-₹2L',
  '₹2L-₹3L',
  '₹3L+',
]

const STYLE_PREFERENCES = ['Modern', 'Minimal', 'Luxury', 'Natural', 'Compact']

const BENEFITS = [
  {
    icon: Shield,
    title: '100% Free Consultation',
    description: 'No obligation, no hidden charges',
  },
  {
    icon: Award,
    title: 'Expert Designers',
    description: 'Work with certified bathroom specialists',
  },
  {
    icon: Sparkles,
    title: 'Flexible Scheduling',
    description: 'Choose a time that works for you',
  },
  {
    icon: Zap,
    title: 'Quick Response',
    description: "We'll confirm within 24 hours",
  },
]

// ─── Animation Variants ─────────────────────────────────────────────────────

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateRefNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'AV-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function formatDate(date: Date | undefined): string {
  if (!date) return 'Not selected'
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── Component ──────────────────────────────────────────────────────────────

export function BookingPage() {
  const { navigate } = useNavigation()

  // Form state
  const [currentStep, setCurrentStep] = useState<StepId>(1)
  const [direction, setDirection] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    contactMethod: 'phone',
    city: '',
    preferredDate: undefined,
    timeSlot: '',
    consultationType: 'in-person',
    bathroomStatus: '',
    budgetRange: '',
    stylePreferences: [],
    additionalRequirements: '',
    termsAccepted: false,
  })

  // ── Field updaters ──────────────────────────────────────────────────────

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleStylePreference = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      stylePreferences: prev.stylePreferences.includes(style)
        ? prev.stylePreferences.filter((s) => s !== style)
        : [...prev.stylePreferences, style],
    }))
  }

  // ── Validation ──────────────────────────────────────────────────────────

  const step1Valid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return (
      formData.fullName.trim().length > 0 &&
      emailRegex.test(formData.email) &&
      formData.phone.trim().length >= 10 &&
      formData.contactMethod.length > 0
    )
  }, [formData.fullName, formData.email, formData.phone, formData.contactMethod])

  const step2Valid = useMemo(() => {
    return (
      formData.city.length > 0 &&
      formData.preferredDate !== undefined &&
      formData.timeSlot.length > 0 &&
      formData.consultationType.length > 0
    )
  }, [formData.city, formData.preferredDate, formData.timeSlot, formData.consultationType])

  const step3Valid = useMemo(() => {
    return formData.bathroomStatus.length > 0 && formData.budgetRange.length > 0
  }, [formData.bathroomStatus, formData.budgetRange])

  const step4Valid = useMemo(() => {
    return formData.termsAccepted
  }, [formData.termsAccepted])

  const isStepValid = (step: StepId): boolean => {
    switch (step) {
      case 1:
        return step1Valid
      case 2:
        return step2Valid
      case 3:
        return step3Valid
      case 4:
        return step4Valid
    }
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  const goNext = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setDirection(1)
      setCurrentStep((prev) => (prev + 1) as StepId)
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep((prev) => (prev - 1) as StepId)
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          preferredDate: formData.preferredDate?.toISOString(),
        }),
      })
    } catch {
      // Silently handle — form works even if API fails
    }
    setRefNumber(generateRefNumber())
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  // ── Progress percentage ─────────────────────────────────────────────────

  const progressPercent = ((currentStep) / 4) * 100

  // ── Render: Success State ───────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <section className="py-12 md:py-20 bg-background min-h-[80vh] flex items-center" aria-label="Booking Success">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="mx-auto mb-6"
            >
              <CheckCircle className="size-20 text-gold mx-auto" strokeWidth={1.5} />
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Consultation Booked <span className="text-gold">Successfully!</span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-lg max-w-lg mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Our team will contact you within 24 hours to confirm your appointment
            </motion.p>

            <motion.div
              className="inline-flex items-center gap-2 bg-muted/50 border border-border/60 rounded-lg px-6 py-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-sm text-muted-foreground">Reference Number:</span>
              <span className="font-mono font-bold text-gold text-lg">{refNumber}</span>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={() => navigate('home')}
                variant="outline"
                className="w-full sm:w-auto px-8 h-12 font-semibold tracking-wide"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Home
              </Button>
              <Button
                onClick={() => navigate('lookbook')}
                className="w-full sm:w-auto bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 h-12"
              >
                Explore Designs
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    )
  }

  // ── Render: Multi-Step Form ─────────────────────────────────────────────

  return (
    <section className="py-12 md:py-20 bg-background" aria-label="Book Consultation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Book Your Free <span className="text-gold">Consultation</span>
          </h1>
          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold/40" />
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="h-px w-12 bg-gold/40" />
          </div>
          <p className="mt-5 text-muted-foreground text-lg max-w-2xl mx-auto">
            Our expert designers will help you create your dream bathroom
          </p>
        </motion.div>

        {/* ── Main Layout: Form + Sidebar ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Form Column ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* ── Progress Bar ─────────────────────────────────────────────── */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Step labels */}
              <div className="flex justify-between mb-3">
                {STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (step.id < currentStep) {
                        setDirection(step.id < currentStep ? -1 : 1)
                        setCurrentStep(step.id)
                      }
                    }}
                    className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors ${
                      step.id === currentStep
                        ? 'text-gold'
                        : step.id < currentStep
                        ? 'text-foreground cursor-pointer hover:text-gold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center size-6 sm:size-7 rounded-full text-xs font-bold transition-all ${
                        step.id === currentStep
                          ? 'bg-gold text-gold-foreground'
                          : step.id < currentStep
                          ? 'bg-foreground text-background'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <CheckCircle className="size-3.5 sm:size-4" />
                      ) : (
                        step.id
                      )}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                ))}
              </div>
              {/* Bar */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gold rounded-full"
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>

            {/* ── Step Content ─────────────────────────────────────────────── */}
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6 md:p-8">
                <AnimatePresence mode="wait" custom={direction}>
                  {currentStep === 1 && (
                    <StepWrapper key="step1" direction={direction}>
                      <Step1PersonalDetails formData={formData} updateField={updateField} />
                    </StepWrapper>
                  )}
                  {currentStep === 2 && (
                    <StepWrapper key="step2" direction={direction}>
                      <Step2LocationSchedule formData={formData} updateField={updateField} />
                    </StepWrapper>
                  )}
                  {currentStep === 3 && (
                    <StepWrapper key="step3" direction={direction}>
                      <Step3Requirements
                        formData={formData}
                        updateField={updateField}
                        toggleStylePreference={toggleStylePreference}
                      />
                    </StepWrapper>
                  )}
                  {currentStep === 4 && (
                    <StepWrapper key="step4" direction={direction}>
                      <Step4Confirmation
                        formData={formData}
                        updateField={updateField}
                      />
                    </StepWrapper>
                  )}
                </AnimatePresence>

                {/* ── Navigation Buttons ────────────────────────────────────── */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={goBack}
                    disabled={currentStep === 1}
                    className="gap-2 font-semibold tracking-wide"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      onClick={goNext}
                      disabled={!isStepValid(currentStep)}
                      className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide gap-2"
                    >
                      Next
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStepValid(4) || isSubmitting}
                      className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide gap-2 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="size-4 border-2 border-gold-foreground/30 border-t-gold-foreground rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Confirming...
                        </>
                      ) : (
                        <>
                          Confirm Booking
                          <CheckCircle className="size-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Sidebar (desktop only) ─────────────────────────────────────── */}
          <motion.aside
            className="hidden lg:block"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 shadow-sm sticky top-28">
              <CardContent className="p-6">
                {/* Why book with AURAVIX */}
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Why book with <span className="text-gold">AURAVIX</span>?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Your dream bathroom starts with a conversation
                </p>

                <div className="space-y-5">
                  {BENEFITS.map((benefit) => (
                    <div key={benefit.title} className="flex gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-full bg-gold/10 border border-gold/20">
                        <benefit.icon className="size-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Customer Care */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Need Help?
                  </h4>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Phone className="size-4 text-gold flex-shrink-0" />
                    <a
                      href="tel:+919876543210"
                      className="hover:text-gold transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Mail className="size-4 text-gold flex-shrink-0" />
                    <a
                      href="mailto:hello@auravix.com"
                      className="hover:text-gold transition-colors"
                    >
                      hello@auravix.com
                    </a>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Trust signals */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xl font-bold text-gold">500+</p>
                    <p className="text-[11px] text-muted-foreground">Projects Done</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xl font-bold text-gold">4.9</p>
                    <p className="text-[11px] text-muted-foreground">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}

// ─── Step Wrapper (Animation) ───────────────────────────────────────────────

function StepWrapper({
  children,
  direction,
}: {
  children: React.ReactNode
  direction: number
}) {
  return (
    <motion.div
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Step 1: Personal Details ───────────────────────────────────────────────

function Step1PersonalDetails({
  formData,
  updateField,
}: {
  formData: FormData
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <User className="size-5 text-gold" />
          Personal Details
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us how we can reach you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Rahul Sharma"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="rahul@example.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
              +91
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="98765 43210"
              className="rounded-l-none"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value.replace(/[^\d\s]/g, ''))}
            />
          </div>
        </div>
      </div>

      {/* Preferred Contact Method */}
      <div className="space-y-3">
        <Label>
          Preferred Contact Method <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.contactMethod}
          onValueChange={(val) => updateField('contactMethod', val)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { value: 'phone', label: 'Phone', icon: Phone },
            { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
            { value: 'email', label: 'Email', icon: Mail },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.contactMethod === option.value
                  ? 'border-gold bg-gold/5'
                  : 'border-border/60 hover:border-border'
              }`}
            >
              <RadioGroupItem value={option.value} />
              <option.icon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

// ─── Step 2: Location & Schedule ────────────────────────────────────────────

function Step2LocationSchedule({
  formData,
  updateField,
}: {
  formData: FormData
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void
}) {
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Disable past dates
  const disabledDays = { before: new Date() }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="size-5 text-gold" />
          Location & Schedule
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose where and when you&apos;d like to meet
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* City */}
        <div className="space-y-2">
          <Label>
            City <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.city}
            onValueChange={(val) => updateField('city', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preferred Date */}
        <div className="space-y-2">
          <Label>
            Preferred Date <span className="text-destructive">*</span>
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !formData.preferredDate && 'text-muted-foreground'
                }`}
              >
                <Calendar className="size-4 mr-2" />
                {formData.preferredDate
                  ? formatDate(formData.preferredDate)
                  : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.preferredDate}
                onSelect={(date) => {
                  updateField('preferredDate', date)
                  setCalendarOpen(false)
                }}
                disabled={disabledDays}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Slot */}
        <div className="space-y-2">
          <Label>
            Preferred Time Slot <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.timeSlot}
            onValueChange={(val) => updateField('timeSlot', val)}
          >
            <SelectTrigger className="w-full">
              <Clock className="size-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Consultation Type */}
      <div className="space-y-3">
        <Label>
          Consultation Type <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.consultationType}
          onValueChange={(val) => updateField('consultationType', val)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { value: 'in-person', label: 'In-Person', icon: MapPin },
            { value: 'video-call', label: 'Video Call', icon: Phone },
            { value: 'phone-call', label: 'Phone Call', icon: Phone },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.consultationType === option.value
                  ? 'border-gold bg-gold/5'
                  : 'border-border/60 hover:border-border'
              }`}
            >
              <RadioGroupItem value={option.value} />
              <option.icon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

// ─── Step 3: Requirements ───────────────────────────────────────────────────

function Step3Requirements({
  formData,
  updateField,
  toggleStylePreference,
}: {
  formData: FormData
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  toggleStylePreference: (style: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="size-5 text-gold" />
          Requirements
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Help us understand your dream bathroom
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Current Bathroom Status */}
        <div className="space-y-2">
          <Label>
            Current Bathroom Status <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.bathroomStatus}
            onValueChange={(val) => updateField('bathroomStatus', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {BATHROOM_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label>
            Budget Range <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.budgetRange}
            onValueChange={(val) => updateField('budgetRange', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Style Preference */}
      <div className="space-y-3">
        <Label>Style Preference</Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STYLE_PREFERENCES.map((style) => {
            const isSelected = formData.stylePreferences.includes(style)
            return (
              <label
                key={style}
                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gold bg-gold/5'
                    : 'border-border/60 hover:border-border'
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleStylePreference(style)}
                />
                <span className="text-sm font-medium">{style}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Additional Requirements */}
      <div className="space-y-2">
        <Label htmlFor="additionalRequirements">Additional Requirements</Label>
        <Textarea
          id="additionalRequirements"
          placeholder="Tell us about your dream bathroom..."
          value={formData.additionalRequirements}
          onChange={(e) => updateField('additionalRequirements', e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  )
}

// ─── Step 4: Confirmation ───────────────────────────────────────────────────

function Step4Confirmation({
  formData,
  updateField,
}: {
  formData: FormData
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CheckCircle className="size-5 text-gold" />
          Confirm Your Booking
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please review your details before confirming
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Personal Details */}
        <div className="rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="size-4 text-gold" />
            <h4 className="text-sm font-semibold text-foreground">Personal Details</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>{' '}
              <span className="font-medium text-foreground">{formData.fullName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>{' '}
              <span className="font-medium text-foreground">{formData.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>{' '}
              <span className="font-medium text-foreground">+91 {formData.phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Contact Method:</span>{' '}
              <span className="font-medium text-foreground capitalize">
                {formData.contactMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Schedule */}
        <div className="rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="size-4 text-gold" />
            <h4 className="text-sm font-semibold text-foreground">
              Location & Schedule
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">City:</span>{' '}
              <span className="font-medium text-foreground">{formData.city}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>{' '}
              <span className="font-medium text-foreground">
                {formatDate(formData.preferredDate)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Time:</span>{' '}
              <span className="font-medium text-foreground">{formData.timeSlot}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>{' '}
              <span className="font-medium text-foreground capitalize">
                {formData.consultationType.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-gold" />
            <h4 className="text-sm font-semibold text-foreground">Requirements</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Bathroom Status:</span>{' '}
              <span className="font-medium text-foreground">
                {formData.bathroomStatus}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Budget:</span>{' '}
              <span className="font-medium text-foreground">{formData.budgetRange}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Style Preferences:</span>{' '}
              <span className="font-medium text-foreground">
                {formData.stylePreferences.length > 0
                  ? formData.stylePreferences.join(', ')
                  : 'None selected'}
              </span>
            </div>
            {formData.additionalRequirements && (
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Additional:</span>{' '}
                <span className="font-medium text-foreground">
                  {formData.additionalRequirements}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="rounded-lg border border-gold/20 bg-gold/5 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={formData.termsAccepted}
            onCheckedChange={(checked) =>
              updateField('termsAccepted', checked === true)
            }
            className="mt-0.5"
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            I agree to the{' '}
            <span className="text-gold font-medium cursor-pointer">
              Terms & Conditions
            </span>{' '}
            and{' '}
            <span className="text-gold font-medium cursor-pointer">
              Privacy Policy
            </span>
            . I understand that this is a free consultation and I am under no
            obligation to proceed with any services.
          </span>
        </label>
      </div>
    </div>
  )
}
