'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Button } from '@/components/ui/button'

interface Design {
  name: string
  style: string
  image: string | null
  gradient: string
  aspectRatio: string
}

const designs: Design[] = [
  {
    name: 'Zen Minimal',
    style: 'Modern',
    image: '/images/bathroom-minimal.png',
    gradient: 'linear-gradient(135deg, #d4c5a9 0%, #e8dcc8 50%, #c9b896 100%)',
    aspectRatio: 'aspect-[4/5]',
  },
  {
    name: 'Royal Marble',
    style: 'Luxury',
    image: '/images/bathroom-luxury.png',
    gradient: 'linear-gradient(135deg, #f5f0eb 0%, #e8ddd0 50%, #d9cfc3 100%)',
    aspectRatio: 'aspect-[3/4]',
  },
  {
    name: 'Nordic Spa',
    style: 'Minimal',
    image: null,
    gradient: 'linear-gradient(135deg, #b8c4cc 0%, #cdd5da 50%, #a8b5bf 100%)',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    name: 'Tropical Oasis',
    style: 'Natural',
    image: '/images/bathroom-natural.png',
    gradient: 'linear-gradient(135deg, #8fa87e 0%, #b5c4a0 50%, #d4c5a9 100%)',
    aspectRatio: 'aspect-[3/4]',
  },
  {
    name: 'Urban Chic',
    style: 'Modern',
    image: '/images/bathroom-modern.png',
    gradient: 'linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 50%, #2d2d2d 100%)',
    aspectRatio: 'aspect-[4/5]',
  },
  {
    name: 'Space Saver',
    style: 'Compact',
    image: '/images/bathroom-compact.png',
    gradient: 'linear-gradient(135deg, #a8c4d4 0%, #c4d8e4 50%, #89afc4 100%)',
    aspectRatio: 'aspect-[4/3]',
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

export function GalleryPreview() {
  const { navigate } = useNavigation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="py-16 md:py-24 bg-background"
      aria-label="Design inspiration gallery"
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
            Design <span className="text-gold">Inspiration</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collection of bathroom designs
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          className="masonry-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {designs.map((design) => (
            <motion.div key={design.name} variants={cardVariants} className="masonry-item">
              <div
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => navigate('lookbook')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('lookbook') } }}
                aria-label={`View ${design.name} design in lookbook`}
              >
                {/* Background - image or gradient */}
                {design.image ? (
                  <img
                    src={design.image}
                    alt={design.name}
                    className={`${design.aspectRatio} w-full rounded-xl object-cover transition-transform duration-700 group-hover:scale-110`}
                  />
                ) : (
                  <div
                    className={`${design.aspectRatio} w-full rounded-xl transition-transform duration-700 group-hover:scale-110`}
                    style={{ background: design.gradient }}
                  />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center rounded-xl">
                  <Eye className="size-6 text-gold mb-3" />
                  <span className="text-white font-semibold text-lg tracking-wide">
                    View Details
                  </span>
                </div>

                {/* Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/80 to-transparent rounded-b-xl">
                  <h3 className="text-white font-semibold text-base">
                    {design.name}
                  </h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-medium tracking-wide">
                    {design.style}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Explore All Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            onClick={() => navigate('lookbook')}
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 shadow-md shadow-gold/20 transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
          >
            Explore All Designs
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
