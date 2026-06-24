'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Package {
  tier: string
  name: string
  price: string
  features: string[]
  highlighted: boolean
  badge?: string
}

const packages: Package[] = [
  {
    tier: 'Essential',
    name: 'Basic',
    price: '₹45,999',
    features: [
      'Essential fittings',
      'Standard tiles',
      'Basic vanity',
      '10-year warranty',
    ],
    highlighted: false,
  },
  {
    tier: 'Recommended',
    name: 'Premium',
    price: '₹89,999',
    features: [
      'All Basic features',
      'Premium tiles',
      'Designer vanity',
      'Shower enclosure',
      '10-year warranty',
      'Free consultation',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    tier: 'Exclusive',
    name: 'Luxury',
    price: '₹1,59,999',
    features: [
      'All Premium features',
      'Italian marble',
      'Smart fixtures',
      'Bathtub included',
      'Heated floors',
      '10-year warranty',
      'Dedicated designer',
    ],
    highlighted: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function PackagesPreview() {
  const { navigate } = useNavigation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="py-16 md:py-24 bg-muted/30"
      aria-label="Renovation packages"
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
            Renovation <span className="text-gold">Packages</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Pricing based on requirement
          </p>
        </motion.div>

        {/* Package Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.name}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={pkg.highlighted ? 'md:-mt-4' : ''}
            >
              <Card
                className={`group relative h-full transition-all duration-500 overflow-hidden ${
                  pkg.highlighted
                    ? 'border-gold/50 bg-card shadow-xl shadow-gold/15 md:scale-105'
                    : 'border-border/50 bg-card hover:shadow-xl hover:shadow-gold/5 hover:border-gold/30'
                }`}
              >
                {/* Gold gradient top bar */}
                <div className={`h-1 ${pkg.highlighted ? 'bg-gradient-to-r from-gold via-yellow-400 to-gold' : 'bg-gradient-to-r from-transparent via-gold/40 to-transparent group-hover:via-gold transition-all duration-500'}`} />

                {/* Most Popular Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gold text-gold-foreground font-semibold px-4 py-1 text-xs tracking-wide shadow-md shadow-gold/30">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}

                {/* Subtle radial glow on highlighted card */}
                {pkg.highlighted && (
                  <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212,175,105,0.15) 0%, transparent 60%)' }} />
                )}

                <CardHeader className="pt-8 pb-2 text-center relative">
                  <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                    {pkg.tier}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-1 transition-colors duration-300 group-hover:text-gold">
                    {pkg.name}
                  </h3>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gradient-gold">
                      {pkg.price}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-2 relative">
                  <ul className="space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 group/item">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold/10 shrink-0 mt-0.5">
                          <Check className="size-3 text-gold" />
                        </span>
                        <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-2 pb-8 relative">
                  <Button
                    onClick={() => navigate('calculator')}
                    variant={pkg.highlighted ? 'default' : 'outline'}
                    className={`w-full font-semibold tracking-wide transition-all duration-300 shine-on-hover ${
                      pkg.highlighted
                        ? 'bg-gold text-gold-foreground hover:bg-gold/90 shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30'
                        : 'border-border hover:border-gold/40 hover:text-gold'
                    }`}
                  >
                    Get Quote
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('packages')}
            className="text-gold hover:text-gold/80 font-medium tracking-wide group"
          >
            View All Packages
            <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
