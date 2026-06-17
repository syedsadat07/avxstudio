'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Eye, Heart, Lightbulb, Award, Users, MapPin, ArrowRight, Calendar, Package } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ──────────────────────────── Data ──────────────────────────── */

const stats = [
  { value: '500+', label: 'Projects' },
  { value: '10+', label: 'Cities' },
  { value: '50+', label: 'Designers' },
  { value: '98%', label: 'Satisfaction' },
]

const values = [
  {
    icon: Shield,
    title: 'Quality First',
    description: 'We never compromise on materials or quality',
  },
  {
    icon: Eye,
    title: 'Transparent Pricing',
    description: 'No hidden costs, no surprises. What we quote is what you pay',
  },
  {
    icon: Heart,
    title: 'Customer Delight',
    description: 'Your satisfaction drives every decision we make',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Constantly evolving with the latest design trends and technology',
  },
]

const team = [
  {
    name: 'Arjun Mehta',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 15+ years in interior design and construction management, driving AURAVIX\'s mission to redefine bathroom luxury in India.',
    gradient: 'from-amber-600 via-yellow-500 to-amber-400',
  },
  {
    name: 'Kavita Sharma',
    role: 'Head of Design',
    bio: 'Award-winning interior designer who brings an artistic eye and functional sensibility to every bathroom project she oversees.',
    gradient: 'from-rose-500 via-orange-400 to-amber-400',
  },
  {
    name: 'Rohan Patel',
    role: 'Operations Lead',
    bio: 'Supply chain and logistics expert ensuring every project is delivered on time with the highest quality standards maintained.',
    gradient: 'from-emerald-500 via-teal-400 to-amber-400',
  },
  {
    name: 'Neha Singh',
    role: 'Customer Success',
    bio: 'Passionate about creating seamless client experiences, from first consultation to final handover and beyond.',
    gradient: 'from-violet-500 via-pink-400 to-amber-400',
  },
]

const awards = [
  {
    title: 'Best Bathroom Renovation 2023',
    org: 'Home Design Awards',
  },
  {
    title: 'Top 10 Interior Startups',
    org: 'Startup India 2022',
  },
  {
    title: 'Customer Choice Award',
    org: 'Urban Living 2024',
  },
  {
    title: 'Innovation in Design',
    org: 'Design Summit 2023',
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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

export function AboutPage() {
  const { navigate } = useNavigation()

  const storyRef = useRef<HTMLDivElement>(null)
  const storyInView = useInView(storyRef, { once: true, margin: '-80px' })

  const valuesRef = useRef<HTMLDivElement>(null)
  const valuesInView = useInView(valuesRef, { once: true, margin: '-80px' })

  const teamRef = useRef<HTMLDivElement>(null)
  const teamInView = useInView(teamRef, { once: true, margin: '-80px' })

  const awardsRef = useRef<HTMLDivElement>(null)
  const awardsInView = useInView(awardsRef, { once: true, margin: '-80px' })

  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' })

  return (
    <div className="bg-background">
      {/* ────────────── 1. Hero Section ────────────── */}
      <section
        className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
        aria-label="About hero"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#111111]" />

        {/* Gold accent glow - top right */}
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
            Crafting Luxury Bathrooms{' '}
            <span className="text-gold">Since 2018</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            AURAVIX Bath Studio — Where vision meets craftsmanship
          </motion.p>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </motion.div>
      </section>

      {/* ────────────── 2. Our Story ────────────── */}
      <section
        className="py-16 md:py-24"
        aria-label="Our story"
        ref={storyRef}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Our <span className="text-gold">Story</span>
            </h2>
            <div className="mt-4">
              <GoldDivider />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed mb-6">
                We believe every bathroom deserves to be a{' '}
                <span className="text-gold">sanctuary.</span>
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2018, AURAVIX was born from a simple yet powerful vision — to
                transform the way Indian homeowners experience their bathrooms. What started
                as a small studio in Mumbai has grown into a trusted name in premium bathroom
                renovation across the country.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Today, we serve over 10 cities with a team of 50+ passionate designers and
                craftsmen. With more than 500 bathrooms transformed, we&apos;ve earned the trust
                of families who value quality, transparency, and exceptional design. Every
                project we undertake is a testament to our commitment to delivering spaces that
                inspire and rejuvenate.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                At AURAVIX, we don&apos;t just renovate bathrooms — we craft experiences. Our
                focus on quality materials, transparent pricing, and unwavering customer
                satisfaction has made us the preferred choice for homeowners who demand nothing
                but the best.
              </p>
            </motion.div>

            {/* Decorative Element Column */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, x: 40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full max-w-md aspect-square">
                {/* Outer decorative ring */}
                <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
                <div className="absolute inset-4 rounded-full border border-gold/10" />

                {/* Center gradient element */}
                <div
                  className="absolute inset-8 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle at 40% 40%, rgba(212,175,105,0.3) 0%, rgba(212,175,105,0.08) 50%, transparent 70%)',
                  }}
                />

                {/* Floating gold dots */}
                <motion.div
                  className="absolute top-[15%] left-[20%] w-3 h-3 rounded-full bg-gold/60"
                  animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute bottom-[25%] right-[15%] w-2 h-2 rounded-full bg-gold/40"
                  animate={{ y: [0, 6, 0], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                <motion.div
                  className="absolute top-[55%] left-[10%] w-2.5 h-2.5 rounded-full bg-gold/50"
                  animate={{ y: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                    <Users className="size-10 text-gold" />
                  </div>
                </div>

                {/* Corner accent lines */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 h-16 w-[2px] bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 h-16 w-[2px] bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Key Stats Row */}
          <motion.div
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={storyInView ? 'visible' : 'hidden'}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="flex flex-col items-center p-6 rounded-xl border border-border/50 bg-card hover:border-gold/30 transition-all duration-300"
              >
                <span className="text-3xl sm:text-4xl font-bold text-gold">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground mt-1 tracking-wide">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────────── 3. Our Values ────────────── */}
      <section
        className="py-16 md:py-24 bg-muted/30"
        aria-label="Our values"
        ref={valuesRef}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Our <span className="text-gold">Values</span>
            </h2>
            <div className="mt-4">
              <GoldDivider />
            </div>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={cardFade}>
                <Card className="group h-full border-border/50 bg-card hover:border-gold/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5 text-center">
                  <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                      <value.icon className="size-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────────── 4. Team Section ────────────── */}
      <section
        className="py-16 md:py-24"
        aria-label="Our team"
        ref={teamRef}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Meet Our Design{' '}
              <span className="text-gold">Experts</span>
            </h2>
            <div className="mt-4">
              <GoldDivider />
            </div>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              The talented people behind your dream bathrooms
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={teamInView ? 'visible' : 'hidden'}
          >
            {team.map((member) => (
              <motion.div key={member.name} variants={cardFade}>
                <Card className="group h-full border-border/50 bg-card hover:border-gold/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5 text-center">
                  <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center">
                    {/* Gradient Avatar */}
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="mt-1.5 bg-gold/10 text-gold border-gold/20 hover:bg-gold/20"
                    >
                      {member.role}
                    </Badge>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────────── 5. Awards & Recognition ────────────── */}
      <section
        className="py-16 md:py-24 bg-muted/30"
        aria-label="Awards and recognition"
        ref={awardsRef}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={awardsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Recognized for{' '}
              <span className="text-gold">Excellence</span>
            </h2>
            <div className="mt-4">
              <GoldDivider />
            </div>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Our commitment to quality has been acknowledged by industry leaders
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={awardsInView ? 'visible' : 'hidden'}
          >
            {awards.map((award) => (
              <motion.div key={award.title} variants={cardFade}>
                <Card className="group h-full border-border/50 bg-card hover:border-gold/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5 text-center">
                  <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                      <Award className="size-6" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground leading-snug mb-2">
                      {award.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {award.org}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────────── 6. CTA Section ────────────── */}
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        aria-label="Call to action"
        ref={ctaRef}
      >
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#111111]" />

        {/* Gold accent glow */}
        <div
          className="absolute top-[-20%] left-[30%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,105,0.4) 0%, rgba(212,175,105,0.05) 50%, transparent 70%)',
          }}
        />

        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative gold accent */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="block h-[2px] w-8 bg-gold/40" />
            <span className="block h-2 w-2 rounded-full bg-gold" />
            <span className="block h-[2px] w-8 bg-gold/40" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Ready to Start Your{' '}
            <span className="text-gold">Bathroom Journey?</span>
          </h2>

          <p className="mt-4 text-white/60 text-lg max-w-2xl mx-auto">
            Let our experts bring your vision to life — reserve your slot today
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('slot-booking')}
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 h-12 text-base shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
            >
              <Calendar className="size-4" />
              Book a Slot
            </Button>
            <Button
              onClick={() => navigate('packages')}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white font-medium tracking-wide px-8 h-12 text-base transition-all duration-300"
            >
              <Package className="size-4" />
              View Our Packages
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
