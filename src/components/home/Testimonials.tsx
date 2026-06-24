'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Testimonial {
  quote: string
  name: string
  location: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    quote:
      'AURAVIX transformed our old bathroom into a spa-like retreat. The attention to detail was incredible!',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
  },
  {
    quote:
      'From design to execution, everything was seamless. They delivered on time and within budget.',
    name: 'Rajesh Patel',
    location: 'Delhi',
    rating: 5,
  },
  {
    quote:
      'The luxury package was worth every penny. Our bathroom looks like a five-star hotel now!',
    name: 'Anita Desai',
    location: 'Bangalore',
    rating: 4,
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

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="py-16 md:py-24 bg-muted/30"
      aria-label="Client testimonials"
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
            What Our Clients <span className="text-gold">Say</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from homeowners who trusted AURAVIX
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Card className="group relative h-full border-border/50 bg-card hover:shadow-xl hover:shadow-gold/10 transition-all duration-500 overflow-hidden">
                {/* Gold left accent bar */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-gold via-gold/60 to-transparent group-hover:via-gold transition-all duration-500" />

                {/* Large faded quote in background */}
                <Quote className="absolute top-4 right-4 size-20 text-gold/5 group-hover:text-gold/10 transition-colors duration-500 rotate-180" />

                <CardContent className="pt-6 pb-6 px-6 relative">
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.3 + idx * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <Quote className="size-8 text-gold/40 mb-4" />
                  </motion.div>

                  {/* Quote Text */}
                  <p className="text-foreground/80 leading-relaxed mb-6 text-[15px] italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 0.5 + idx * 0.15 + i * 0.08, type: 'spring', stiffness: 300 }}
                      >
                        <Star
                          className={`size-4 ${
                            i < testimonial.rating
                              ? 'text-gold fill-gold'
                              : 'text-border'
                          }`}
                        />
                      </motion.span>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                    {/* Avatar circle with initials */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 text-gold font-bold text-sm ring-1 ring-gold/20">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
