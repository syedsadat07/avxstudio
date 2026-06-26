'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '500+', label: 'Bathrooms' },
  { value: '10-Year', label: 'Warranty' },
  { value: '100+', label: 'Designs' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const statVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

// Floating particle config — generated client-side only to avoid hydration mismatch
interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

function useParticles(count: number): Particle[] {
  const [particles, setParticles] = useState<Particle[]>([])
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5,
      }))
    )
  }, [count])
  return particles
}

export function HeroSection() {
  const { navigate } = useNavigation()
  const sectionRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)
  const particles = useParticles(14)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Parallax scroll effect (client-only to avoid hydration mismatch)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: "url('/images/hero-bathroom.png')",
          y: mounted ? bgY : '0%',
        }}
      />
      {/* Dark overlay gradient — softer at top so header is readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#1a1a1a]/75 to-[#0f0f0f]/90" />

      {/* Animated gold accent glow - top right (drifting) */}
      <motion.div
        className="absolute top-[-15%] right-[-8%] w-[650px] h-[650px] rounded-full opacity-25 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,105,0.5) 0%, rgba(212,175,105,0.1) 40%, transparent 70%)',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated gold accent glow - bottom left (drifting opposite) */}
      <motion.div
        className="absolute bottom-[-12%] left-[-6%] w-[450px] h-[450px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,105,0.4) 0%, rgba(212,175,105,0.05) 50%, transparent 70%)',
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -25, 0],
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles (gold dust) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gold"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              boxShadow: '0 0 6px rgba(212,175,105,0.6)',
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, 20, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,105,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,105,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content with parallax */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center"
        style={{ y: mounted ? contentY : '0%', opacity: mounted ? contentOpacity : 1 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge with pulse glow */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-sm px-5 py-2 text-sm text-gold shadow-[0_0_30px_rgba(212,175,105,0.15)]"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="size-3.5" />
            </motion.span>
            Premium Bathroom Renovation
          </motion.span>
        </motion.div>

        {/* Heading with word-by-word reveal */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white max-w-5xl mx-auto"
        >
          Transform Your Bathroom Into a{' '}
          <span className="relative inline-block">
            <span className="text-gold">Luxury Sanctuary</span>
            {/* Animated underline */}
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0.5 }}
            />
          </span>
        </motion.h1>

        {/* Subheading / Tagline */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
        >
          Your trusted partners for high-quality, stress-free bathroom renovations
        </motion.p>

        {/* CTA Button with shimmer + hover glow */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative group"
          >
            {/* Pulsing glow ring */}
            <motion.span
              className="absolute inset-0 rounded-md bg-gold/40 blur-xl"
              animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Button
              onClick={() => navigate('calculator')}
              size="lg"
              className="relative bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 h-12 text-base shadow-[0_4px_30px_rgba(212,175,105,0.4)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(212,175,105,0.6)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Book a Consultation
                <motion.span
                  className="ml-1"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="size-4" />
                </motion.span>
              </span>
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Stats with hover lift */}
        <motion.div
          variants={containerVariants}
          className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative flex flex-col items-center p-4 sm:p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md cursor-default overflow-hidden group"
            >
              {/* Gold glow on hover */}
              <span className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.span
                className="relative text-2xl sm:text-3xl font-bold text-gold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5 + idx * 0.15, type: 'spring', stiffness: 200 }}
              >
                {stat.value}
              </motion.span>
              <span className="relative text-xs sm:text-sm text-white/50 mt-1 tracking-wide">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator at bottom */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-5 h-9 rounded-full border border-white/30 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-gold"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </motion.section>
  )
}
