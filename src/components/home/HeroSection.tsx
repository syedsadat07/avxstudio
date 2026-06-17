'use client'

import { motion } from 'framer-motion'
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
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export function HeroSection() {
  const { navigate } = useNavigation()

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bathroom.png')" }}
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/90 via-[#1a1a1a]/85 to-[#111111]/90" />

      {/* Gold accent glow - top right */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,105,0.4) 0%, rgba(212,175,105,0.1) 40%, transparent 70%)',
        }}
      />

      {/* Gold accent glow - bottom left */}
      <div
        className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,105,0.3) 0%, rgba(212,175,105,0.05) 50%, transparent 70%)',
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

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            <Sparkles className="size-3.5" />
            Premium Bathroom Renovation
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white max-w-5xl mx-auto"
        >
          Transform Your Bathroom Into a{' '}
          <span className="text-gold">Luxury Sanctuary</span>
        </motion.h1>

        {/* Subheading / Tagline */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
        >
          Your trusted partners for high-quality, stress-free bathroom renovations
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() => navigate('slot-booking')}
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 h-12 text-base shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
          >
            Book a Slot
            <ArrowRight className="size-4 ml-1" />
          </Button>
          <Button
            onClick={() => navigate('lookbook')}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white font-medium tracking-wide px-8 h-12 text-base transition-all duration-300"
          >
            Explore Designs
          </Button>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          variants={containerVariants}
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              className="flex flex-col items-center p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <span className="text-2xl sm:text-3xl font-bold text-gold">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-white/50 mt-1 tracking-wide">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
