'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Award, Palette, Gem, Wrench, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Shield,
    title: 'Fixed Pricing',
    description:
      'No hidden costs. Transparent pricing with detailed breakdowns upfront',
  },
  {
    icon: Award,
    title: '10-Year Warranty',
    description:
      'Comprehensive warranty on all materials and fittings',
  },
  {
    icon: Palette,
    title: 'Expert Designers',
    description:
      'Work with certified interior designers for your dream bathroom',
  },
  {
    icon: Gem,
    title: 'Branded Fittings',
    description:
      'Premium fixtures from Kohler, Grohe, Jaquar, and more',
  },
  {
    icon: Wrench,
    title: 'End-to-End Service',
    description:
      'From design to delivery, we handle everything for you',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description:
      'Guaranteed project completion within the committed timeline',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="py-16 md:py-24 bg-background"
      aria-label="Why choose us"
      ref={ref}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Why Choose{' '}
            <span className="text-gold">AURAVIX</span>
          </h2>
          {/* Gold underline accent */}
          <div className="mt-4 mx-auto flex items-center justify-center gap-2">
            <span className="block h-[2px] w-8 bg-gold/30" />
            <span className="block h-[3px] w-16 bg-gold rounded-full" />
            <span className="block h-[2px] w-8 bg-gold/30" />
          </div>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            We combine expertise, quality, and reliability to deliver bathrooms that exceed expectations
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, idx) => (
            <motion.div key={feature.title} variants={cardVariants} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <Card className="group relative h-full border-border/50 bg-card hover:border-gold/40 transition-all duration-500 hover:shadow-xl hover:shadow-gold/10 overflow-hidden">
                {/* Gold gradient top accent on hover */}
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
                  {/* Icon in gold circle with glow + rotation on hover */}
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold/15 to-gold/5 text-gold mb-5 group-hover:from-gold/25 group-hover:to-gold/10 group-hover:shadow-[0_0_25px_rgba(212,175,105,0.3)] transition-all duration-500 ring-1 ring-gold/20"
                  >
                    <feature.icon className="size-6" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-gold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  {/* Number badge */}
                  <span className="absolute top-4 right-4 text-5xl font-bold text-gold/5 group-hover:text-gold/10 transition-colors duration-500">
                    0{idx + 1}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
