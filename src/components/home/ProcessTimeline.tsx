'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  MessageSquare,
  MapPin,
  Palette,
  Calculator,
  Hammer,
  CheckCircle,
} from 'lucide-react'

interface ProcessStep {
  number: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const steps: ProcessStep[] = [
  {
    number: 1,
    title: 'Consultation',
    description: 'Free design consultation to understand your vision',
    icon: MessageSquare,
  },
  {
    number: 2,
    title: 'Site Visit',
    description: 'Our experts visit to assess and measure your space',
    icon: MapPin,
  },
  {
    number: 3,
    title: 'Design',
    description: 'Custom 3D designs tailored to your preferences',
    icon: Palette,
  },
  {
    number: 4,
    title: 'Quotation',
    description: 'Transparent, fixed pricing with no hidden costs',
    icon: Calculator,
  },
  {
    number: 5,
    title: 'Execution',
    description: 'Professional installation by skilled craftsmen',
    icon: Hammer,
  },
  {
    number: 6,
    title: 'Delivery',
    description: 'Final walkthrough and handover of your dream bathroom',
    icon: CheckCircle,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="py-16 md:py-24 bg-background"
      aria-label="Renovation process timeline"
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
            Our Renovation <span className="text-gold">Process</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            A seamless journey from concept to completion
          </p>
        </motion.div>

        {/* Timeline - Desktop Horizontal */}
        <motion.div
          className="hidden lg:flex items-start justify-between relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Connecting dotted line */}
          <div className="absolute top-10 left-[5%] right-[5%] h-[2px] border-t-2 border-dashed border-gold/30" />

          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={stepVariants}
              className="relative flex flex-col items-center text-center w-[140px] xl:w-[160px]"
            >
              {/* Step circle with icon */}
              <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gold text-gold-foreground shadow-lg shadow-gold/20 mb-4 transition-transform duration-300 hover:scale-110">
                <step.icon className="size-7" />
              </div>

              <h3 className="font-semibold text-foreground text-base mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[140px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline - Mobile/Tablet Vertical */}
        <motion.div
          className="lg:hidden space-y-0 relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Vertical dotted line */}
          <div className="absolute left-10 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-gold/30" />

          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={stepVariants}
              className="relative flex items-start gap-6 pl-0 pb-8 last:pb-0"
            >
              {/* Step circle */}
              <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gold text-gold-foreground shadow-lg shadow-gold/20 shrink-0">
                <step.icon className="size-7" />
              </div>

              {/* Content */}
              <div className="pt-3">
                <h3 className="font-semibold text-foreground text-base mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
