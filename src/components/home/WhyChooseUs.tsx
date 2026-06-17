'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Award, Palette, Gem, Wrench } from 'lucide-react'
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
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className="group h-full border-border/50 bg-card hover:border-gold/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
                  {/* Icon in gold circle */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
