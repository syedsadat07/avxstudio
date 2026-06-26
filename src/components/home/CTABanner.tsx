'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Button } from '@/components/ui/button'

export function CTABanner() {
  const { navigate } = useNavigation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      aria-label="Call to action"
      ref={ref}
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#111111]" />

      {/* Gold accent glow - left */}
      <div
        className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,105,0.4) 0%, rgba(212,175,105,0.1) 40%, transparent 70%)',
        }}
      />

      {/* Gold accent glow - right */}
      <div
        className="absolute bottom-[-20%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,105,0.3) 0%, rgba(212,175,105,0.05) 50%, transparent 70%)',
        }}
      />

      {/* Decorative gold orb */}
      <motion.div
        className="absolute bottom-[10%] left-[5%] w-16 h-16 rounded-full hidden lg:block"
        style={{
          background:
            'linear-gradient(135deg, rgba(212,175,105,0.5), rgba(212,175,105,0.1))',
          filter: 'blur(1px)',
        }}
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Ready to Transform Your{' '}
          <span className="text-gold">Bathroom?</span>
        </h2>

        <p className="mt-5 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Reserve your preferred date, time and slot in seconds — get a personalized design quote within 24 hours.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate('calculator')}
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 h-12 text-base shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
          >
            Book a Consultation
            <ArrowRight className="size-4 ml-1" />
          </Button>
          <Button
            onClick={() => navigate('calculator')}
            variant="outline"
            size="lg"
            className="border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60 font-medium tracking-wide px-8 h-12 text-base transition-all duration-300"
          >
            Get Instant Quote
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
