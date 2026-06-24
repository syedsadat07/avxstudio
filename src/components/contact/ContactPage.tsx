'use client'

import { useRef, useState, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  Navigation,
  Pin,
} from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from '@/hooks/use-toast'

/* ──────────────────────────── Data ──────────────────────────── */

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'consultation', label: 'Renovation Consultation' },
  { value: 'packages', label: 'Package Information' },
  { value: 'feedback', label: 'Complaint/Feedback' },
  { value: 'partnership', label: 'Partnership' },
]

const contactCards = [
  {
    icon: MapPin,
    title: 'AURAVIX Bath Studio',
    lines: ['123 Design District, Andheri West', 'Mumbai, Maharashtra 400058'],
  },
  {
    icon: Phone,
    title: '+91 98765 43210',
    lines: ['Mon-Sat: 9AM - 7PM'],
  },
  {
    icon: Mail,
    title: 'hello@auravix.com',
    lines: ['We respond within 24 hours'],
  },
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Pin, label: 'Pinterest', href: '#' },
]

const faqs = [
  {
    question: 'How do I book a consultation?',
    answer:
      'You can book a free consultation through our Booking page, by calling us at +91 98765 43210, or by filling out the contact form on this page. Our team will get back to you within 24 hours to schedule a convenient time.',
  },
  {
    question: 'What cities do you serve?',
    answer:
      'We currently serve over 10 major cities across India including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, and Goa. We are constantly expanding — reach out to check if we cover your area.',
  },
  {
    question: 'How long does a typical renovation take?',
    answer:
      'A standard bathroom renovation typically takes 15-45 days depending on the scope and complexity of the project. Our Essential package takes about 15-20 days, Premium around 25-35 days, and the Luxury package up to 45 days for the full bespoke experience. All packages come with a 5-10 year warranty for your peace of mind.',
  },
  {
    question: 'Do you offer free consultations?',
    answer:
      'Yes! We offer completely free, no-obligation consultations. Our design experts will visit your home, assess your bathroom space, understand your vision, and provide a detailed quote — all at no cost to you.',
  },
  {
    question: 'Can I visit your showroom?',
    answer:
      'Absolutely! Our Experience Studio at Andheri West, Mumbai is open Monday to Saturday, 9 AM to 7 PM. You can walk in or schedule a dedicated tour where our team will walk you through various bathroom styles, materials, and fixture options.',
  },
]

/* ──────────────────────── Animation Variants ──────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const cardFade = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

/* ──────────────────────── Section Divider ──────────────────────── */

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="block h-[2px] w-8 bg-gold/30" />
      <span className="block h-[3px] w-16 bg-gold rounded-full" />
      <span className="block h-[2px] w-8 bg-gold/30" />
    </div>
  )
}

/* ──────────────────────── Main Component ──────────────────────── */

export function ContactPage() {
  const { navigate } = useNavigation()

  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Section refs
  const formRef = useRef<HTMLDivElement>(null)
  const formInView = useInView(formRef, { once: true, margin: '-80px' })

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInView = useInView(mapRef, { once: true, margin: '-80px' })

  const faqRef = useRef<HTMLDivElement>(null)
  const faqInView = useInView(faqRef, { once: true, margin: '-80px' })

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      toast({ title: 'Validation Error', description: 'Please enter your full name.', variant: 'destructive' })
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: 'Validation Error', description: 'Please enter a valid email address.', variant: 'destructive' })
      return
    }
    if (!subject) {
      toast({ title: 'Validation Error', description: 'Please select a subject.', variant: 'destructive' })
      return
    }
    if (!message.trim()) {
      toast({ title: 'Validation Error', description: 'Please enter your message.', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject,
          message: message.trim(),
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Message Sent!',
          description: data.message || 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
        })
        // Reset form
        setFullName('')
        setEmail('')
        setPhone('')
        setSubject('')
        setMessage('')
      } else {
        toast({
          title: 'Something went wrong',
          description: data.error || 'Could not send your message. Please try again or call us.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Could not reach the server. Please check your connection and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenMaps = () => {
    const query = encodeURIComponent('AURAVIX Bath Studio, 123 Design District, Andheri West, Mumbai, Maharashtra 400058')
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-background">
      {/* ────────────── 1. Hero Section ────────────── */}
      <section
        className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
        aria-label="Contact hero"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#111111]" />

        {/* Gold accent glow */}
        <div
          className="absolute top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,105,0.4) 0%, rgba(212,175,105,0.1) 40%, transparent 70%)',
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,105,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,105,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative gold accent */}
          <motion.div
            className="mb-8 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="block h-[2px] w-12 bg-gold/40" />
            <span className="block h-2 w-2 rounded-full bg-gold" />
            <span className="block h-[2px] w-12 bg-gold/40" />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Get in <span className="text-gold">Touch</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            We&apos;d love to hear about your bathroom project
          </motion.p>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </motion.div>
      </section>

      {/* ────────────── 2. Contact Form + Info Section ────────────── */}
      <section
        className="py-16 md:py-24"
        aria-label="Contact form and information"
        ref={formRef}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -40 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="border-border/50 bg-card">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Send Us a <span className="text-gold">Message</span>
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and our team will get back to you promptly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                        Full Name <span className="text-gold">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11 border-border/60 focus-visible:border-gold/50 focus-visible:ring-gold/20"
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email Address <span className="text-gold">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-border/60 focus-visible:border-gold/50 focus-visible:ring-gold/20"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number (optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 border-border/60 focus-visible:border-gold/50 focus-visible:ring-gold/20"
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Subject <span className="text-gold">*</span>
                      </Label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="w-full h-11 border-border/60 focus-visible:border-gold/50 focus-visible:ring-gold/20">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-foreground">
                        Message <span className="text-gold">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project or inquiry..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[140px] border-border/60 focus-visible:border-gold/50 focus-visible:ring-gold/20"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 h-12 text-base shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="size-4 border-2 border-gold-foreground/30 border-t-gold-foreground rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="size-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Contact Information */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 40 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Contact <span className="text-gold">Information</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Reach us through any of the channels below.
                  </p>
                </div>

                {/* Contact Cards */}
                <motion.div
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate={formInView ? 'visible' : 'hidden'}
                >
                  {contactCards.map((card) => (
                    <motion.div key={card.title} variants={cardFade}>
                      <Card className="group border-border/50 bg-card hover:border-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/5">
                        <CardContent className="p-5 flex items-start gap-4">
                          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gold/10 text-gold shrink-0 group-hover:bg-gold/20 transition-colors duration-300">
                            <card.icon className="size-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{card.title}</p>
                            {card.lines.map((line, idx) => (
                              <p key={idx} className="text-sm text-muted-foreground mt-0.5">
                                {line}
                              </p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Social Media Row */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Follow Us</p>
                  <div className="flex items-center gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 bg-card text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all duration-300"
                      >
                        <social.icon className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick CTA */}
                <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                  <CardContent className="p-5">
                    <p className="font-semibold text-foreground mb-1">
                      Need Immediate Assistance?
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reserve a slot with our design experts today.
                    </p>
                    <Button
                      onClick={() => navigate('calculator')}
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold/50 font-medium transition-all duration-300"
                    >
                      Book a Slot
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────── 3. Map Section ────────────── */}
      <section
        className="py-16 md:py-24 bg-muted/30"
        aria-label="Map and location"
        ref={mapRef}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={mapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Visit Our Experience <span className="text-gold">Studio</span>
            </h2>
            <div className="mt-4">
              <GoldDivider />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={mapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="overflow-hidden border-border/50">
              <CardContent className="p-0">
                {/* Map Placeholder with gradient */}
                <div className="relative h-[300px] sm:h-[400px] lg:h-[450px]">
                  {/* Gradient background representing a map */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 25%, #1e1e1e 50%, #2d2d2d 75%, #1a1a1a 100%)',
                    }}
                  />

                  {/* Grid overlay to simulate map */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(212,175,105,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,105,0.3) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />

                  {/* Road-like lines */}
                  <div className="absolute top-0 bottom-0 left-[35%] w-[3px] bg-white/5" />
                  <div className="absolute top-0 bottom-0 right-[25%] w-[2px] bg-white/[0.03]" />
                  <div className="absolute left-0 right-0 top-[45%] h-[3px] bg-white/5" />
                  <div className="absolute left-0 right-0 bottom-[30%] h-[2px] bg-white/[0.03]" />

                  {/* Gold glow at center */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full opacity-30"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(212,175,105,0.5) 0%, rgba(212,175,105,0.1) 40%, transparent 70%)',
                    }}
                  />

                  {/* Center pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className="w-10 h-10 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/30"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <MapPin className="size-5 text-gold-foreground" />
                      </motion.div>
                      <div className="w-3 h-3 rotate-45 bg-gold -mt-1.5 shadow-lg shadow-gold/30" />
                    </div>
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4 z-10">
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-sm rounded-xl px-6 py-5 text-center border border-gold/20 max-w-sm">
                      <p className="font-semibold text-white text-lg">
                        AURAVIX Bath Studio
                      </p>
                      <p className="text-white/60 text-sm mt-1">
                        123 Design District, Andheri West
                      </p>
                      <p className="text-white/60 text-sm">
                        Mumbai, Maharashtra 400058
                      </p>
                      <Button
                        onClick={handleOpenMaps}
                        className="mt-4 bg-gold text-gold-foreground hover:bg-gold/90 font-medium text-sm px-6 h-9 shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
                      >
                        <Navigation className="size-3.5" />
                        Open in Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ────────────── 4. FAQ Section ────────────── */}
      <section
        className="py-16 md:py-24"
        aria-label="Frequently asked questions"
        ref={faqRef}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
            <div className="mt-4">
              <GoldDivider />
            </div>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about working with AURAVIX
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="border-border/50 bg-card">
              <CardContent className="p-6 sm:p-8">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-border/50"
                    >
                      <AccordionTrigger className="text-left text-foreground hover:text-gold hover:no-underline transition-colors duration-200 text-sm sm:text-base font-medium py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA at bottom */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-muted-foreground mb-4">
              Still have questions? We&apos;re here to help.
            </p>
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold/50 font-medium transition-all duration-300"
            >
              <Mail className="size-4" />
              Contact Us Above
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
