'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

// ─── Types ──────────────────────────────────────────────────────────────────

type Style = 'Modern' | 'Minimal' | 'Luxury' | 'Compact' | 'Natural'
type Size = 'Small' | 'Medium' | 'Large'
type BudgetRange = 'Under ₹50K' | '₹50K-₹1L' | '₹1L-₹2L' | '₹2L+'

interface Design {
  id: number
  title: string
  style: Style
  budget: string
  size: Size
  description: string
  gradientColors: string
  cardHeight: string
  image?: string
}

// ─── Design Data ────────────────────────────────────────────────────────────

const designs: Design[] = [
  {
    id: 1,
    title: 'Zen Minimal',
    style: 'Minimal',
    budget: '₹45K-₹60K',
    size: 'Small',
    description:
      'A serene minimalist retreat that embraces clean lines and natural materials. Warm wood accents paired with matte white surfaces create a calming sanctuary for daily rituals.',
    gradientColors: 'linear-gradient(160deg, #d4c5a9 0%, #e8dcc8 40%, #c9b896 100%)',
    cardHeight: 'h-80',
    image: '/images/bathroom-minimal.png',
  },
  {
    id: 2,
    title: 'Royal Marble',
    style: 'Luxury',
    budget: '₹1.5L-₹2L',
    size: 'Large',
    description:
      'Opulent marble surfaces with gold-trimmed fixtures create an atmosphere of timeless elegance. A freestanding soaking tub serves as the centerpiece of this grand retreat.',
    gradientColors: 'linear-gradient(145deg, #f5f0eb 0%, #e8ddd0 50%, #d9cfc3 100%)',
    cardHeight: 'h-96',
    image: '/images/bathroom-luxury.png',
  },
  {
    id: 3,
    title: 'Nordic Spa',
    style: 'Minimal',
    budget: '₹60K-₹80K',
    size: 'Medium',
    description:
      'Inspired by Scandinavian spa traditions, this design features light oak, soft whites, and organic shapes. A rainfall shower and built-in bench invite slow, mindful moments.',
    gradientColors: 'linear-gradient(170deg, #b8c4cc 0%, #d5dce0 45%, #a8b5bf 100%)',
    cardHeight: 'h-72',
  },
  {
    id: 4,
    title: 'Tropical Oasis',
    style: 'Natural',
    budget: '₹50K-₹70K',
    size: 'Medium',
    description:
      'Lush green accents and natural stone textures bring the tropics indoors. Bamboo shelving and a pebble-floor shower create an immersive nature experience.',
    gradientColors: 'linear-gradient(155deg, #8fa87e 0%, #b5c4a0 45%, #d4c5a9 100%)',
    cardHeight: 'h-80',
    image: '/images/bathroom-natural.png',
  },
  {
    id: 5,
    title: 'Urban Chic',
    style: 'Modern',
    budget: '₹70K-₹90K',
    size: 'Small',
    description:
      'Bold matte black fixtures against warm concrete surfaces define this metropolitan statement. Geometric tiles and brass accents add an artistic edge.',
    gradientColors: 'linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 50%, #2d2d2d 100%)',
    cardHeight: 'h-64',
    image: '/images/bathroom-modern.png',
  },
  {
    id: 6,
    title: 'Coastal Breeze',
    style: 'Natural',
    budget: '₹55K-₹75K',
    size: 'Medium',
    description:
      'Soft sea-glass greens and driftwood textures evoke a calming seaside escape. Open shelving and a frameless glass shower enhance the airy, open feel.',
    gradientColors: 'linear-gradient(140deg, #a8c4d4 0%, #c4d8e4 50%, #89afc4 100%)',
    cardHeight: 'h-80',
  },
  {
    id: 7,
    title: 'Midnight Gold',
    style: 'Luxury',
    budget: '₹2L+',
    size: 'Large',
    description:
      'Deep charcoal surfaces meet warm gold fixtures in this dramatic, high-contrast masterpiece. A backlit mirror wall and freestanding tub create unparalleled drama.',
    gradientColors: 'linear-gradient(150deg, #1a1a1a 0%, #2c2520 50%, #1a1714 100%)',
    cardHeight: 'h-96',
  },
  {
    id: 8,
    title: 'Sage Harmony',
    style: 'Natural',
    budget: '₹45K-₹65K',
    size: 'Small',
    description:
      'Muted sage green tiles paired with warm terracotta accents create a grounded, earthy atmosphere. Live plants and woven baskets add organic warmth.',
    gradientColors: 'linear-gradient(165deg, #8fa887 0%, #c4ccb0 50%, #a3b495 100%)',
    cardHeight: 'h-72',
  },
  {
    id: 9,
    title: 'Concrete Edge',
    style: 'Modern',
    budget: '₹60K-₹85K',
    size: 'Medium',
    description:
      'Raw concrete meets polished chrome in this industrial-modern fusion. Floating vanity and LED strip lighting create a gallery-like sophistication.',
    gradientColors: 'linear-gradient(130deg, #6b6b6b 0%, #8a8a8a 45%, #555555 100%)',
    cardHeight: 'h-80',
  },
  {
    id: 10,
    title: 'Pearl White',
    style: 'Minimal',
    budget: '₹80K-₹1L',
    size: 'Medium',
    description:
      'An all-white palette with subtle pearl-sheen tiles creates a pristine, almost ethereal space. Minimal hardware and a wall-mounted toilet reinforce the clean aesthetic.',
    gradientColors: 'linear-gradient(160deg, #f0ece6 0%, #faf7f2 45%, #e5dfd6 100%)',
    cardHeight: 'h-64',
  },
  {
    id: 11,
    title: 'Art Deco Glam',
    style: 'Luxury',
    budget: '₹1.2L-₹1.8L',
    size: 'Large',
    description:
      'Geometric fan patterns in black and gold channel the roaring twenties. A clawfoot tub with gold feet and a crystal chandelier make every day feel extraordinary.',
    gradientColors: 'linear-gradient(145deg, #2a2520 0%, #3d3428 45%, #1a1714 100%)',
    cardHeight: 'h-96',
  },
  {
    id: 12,
    title: 'Space Saver',
    style: 'Compact',
    budget: '₹30K-₹45K',
    size: 'Small',
    description:
      'Clever storage solutions and space-efficient fixtures maximize every inch. A corner shower, recessed shelving, and a compact vanity deliver full functionality in minimal space.',
    gradientColors: 'linear-gradient(155deg, #c9c4b8 0%, #ddd8ce 50%, #b8b2a4 100%)',
    cardHeight: 'h-72',
    image: '/images/bathroom-compact.png',
  },
]

// ─── Filter options ─────────────────────────────────────────────────────────

const styleFilters: Array<'All' | Style> = ['All', 'Modern', 'Minimal', 'Luxury', 'Compact', 'Natural']
const budgetFilters: Array<'All' | BudgetRange> = ['All', 'Under ₹50K', '₹50K-₹1L', '₹1L-₹2L', '₹2L+']
const sizeFilters: Array<'All' | Size> = ['All', 'Small', 'Medium', 'Large']

// ─── Helper: budget bucket ──────────────────────────────────────────────────

function getBudgetRange(budget: string): BudgetRange | null {
  const numStr = budget.replace(/[^\d.]/g, '')
  const num = parseFloat(numStr)
  // budget strings like "₹45K-₹60K" → extract the upper bound
  const parts = budget.match(/₹?([\d.]+)(L|K)/g)
  if (!parts) return null
  // Take the highest value
  let maxVal = 0
  for (const p of parts) {
    const match = p.match(/₹?([\d.]+)(L|K)/)
    if (match) {
      const v = parseFloat(match[1])
      const unit = match[2]
      maxVal = Math.max(maxVal, unit === 'L' ? v * 100 : v)
    }
  }
  if (maxVal < 50) return 'Under ₹50K'
  if (maxVal <= 100) return '₹50K-₹1L'
  if (maxVal <= 200) return '₹1L-₹2L'
  return '₹2L+'
}

// ─── Animation variants ─────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

// ─── Component ──────────────────────────────────────────────────────────────

export function LookbookPage() {
  const { navigate } = useNavigation()

  // Filter state
  const [activeStyle, setActiveStyle] = useState<'All' | Style>('All')
  const [activeBudget, setActiveBudget] = useState<'All' | BudgetRange>('All')
  const [activeSize, setActiveSize] = useState<'All' | Size>('All')

  // Modal state
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Saved designs (hearts)
  const [savedDesigns, setSavedDesigns] = useState<Set<number>>(new Set())

  // ── Filtering logic ──────────────────────────────────────────────────────

  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      if (activeStyle !== 'All' && d.style !== activeStyle) return false
      if (activeBudget !== 'All' && getBudgetRange(d.budget) !== activeBudget) return false
      if (activeSize !== 'All' && d.size !== activeSize) return false
      return true
    })
  }, [activeStyle, activeBudget, activeSize])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const openDesign = (design: Design) => {
    setSelectedDesign(design)
    setModalOpen(true)
  }

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setSavedDesigns((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const hasActiveFilters = activeStyle !== 'All' || activeBudget !== 'All' || activeSize !== 'All'

  const clearFilters = () => {
    setActiveStyle('All')
    setActiveBudget('All')
    setActiveSize('All')
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <section className="py-12 md:py-20 bg-background" aria-label="Design Lookbook">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Design <span className="text-gold">Lookbook</span>
          </h1>
          {/* Decorative gold accent line */}
          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold/40" />
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="h-px w-12 bg-gold/40" />
          </div>
          <p className="mt-5 text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collection of bathroom designs
          </p>
        </motion.div>

        {/* ── Filter Bar ──────────────────────────────────────────────────── */}
        <motion.div
          className="mb-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Filter row: Style */}
          <FilterRow
            label={<SlidersHorizontal className="size-4 shrink-0" />}
            options={styleFilters}
            active={activeStyle}
            onSelect={setActiveStyle}
          />

          {/* Filter row: Budget */}
          <FilterRow
            label="Budget"
            options={budgetFilters}
            active={activeBudget}
            onSelect={setActiveBudget}
          />

          {/* Filter row: Size */}
          <FilterRow
            label="Size"
            options={sizeFilters}
            active={activeSize}
            onSelect={setActiveSize}
          />

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold transition-colors"
              >
                <X className="size-3.5" />
                Clear all filters
              </button>
              <span className="text-xs text-muted-foreground">
                — showing {filteredDesigns.length} of {designs.length} designs
              </span>
            </div>
          )}
        </motion.div>

        {/* ── Masonry Gallery Grid ────────────────────────────────────────── */}
        {filteredDesigns.length > 0 ? (
          <motion.div
            className="masonry-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${activeStyle}-${activeBudget}-${activeSize}`}
          >
            {filteredDesigns.map((design) => (
              <motion.div
                key={design.id}
                variants={cardVariants}
                className="masonry-item"
              >
                <div
                  className="group relative overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => openDesign(design)}
                >
                  {/* Background - image or gradient */}
                  {design.image ? (
                    <img
                      src={design.image}
                      alt={design.title}
                      className={`${design.cardHeight} w-full rounded-xl object-cover relative`}
                    />
                  ) : (
                    <div
                      className={`${design.cardHeight} w-full rounded-xl relative`}
                      style={{ background: design.gradientColors }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-3 rounded-xl">
                    {/* Heart / Save */}
                    <button
                      onClick={(e) => toggleSave(e, design.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                      aria-label={savedDesigns.has(design.id) ? 'Unsave design' : 'Save design'}
                    >
                      <Heart
                        className={`size-5 transition-colors ${
                          savedDesigns.has(design.id)
                            ? 'fill-gold text-gold'
                            : 'text-white'
                        }`}
                      />
                    </button>

                    <span className="text-white font-semibold text-base tracking-wide flex items-center gap-2">
                      View Details
                      <ArrowRight className="size-4" />
                    </span>
                  </div>

                  {/* Bottom info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent rounded-b-xl">
                    <h3 className="text-white font-semibold text-base">
                      {design.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px] px-2 py-0">
                        {design.style}
                      </Badge>
                      <span className="text-white/70 text-xs">{design.budget}</span>
                      <span className="text-white/40 text-xs">·</span>
                      <span className="text-white/70 text-xs">{design.size}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="size-10 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No designs found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your filters to discover more designs
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* ── Design Detail Modal ──────────────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          {selectedDesign && (
            <>
              {/* Preview - image or gradient */}
              {selectedDesign.image ? (
                <img
                  src={selectedDesign.image}
                  alt={selectedDesign.title}
                  className="w-full h-56 sm:h-64 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="w-full h-56 sm:h-64 rounded-lg relative overflow-hidden"
                  style={{ background: selectedDesign.gradientColors }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                </div>
              )}

              <DialogHeader className="mt-2">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {selectedDesign.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Details about the {selectedDesign.title} bathroom design
                </DialogDescription>
              </DialogHeader>

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge className="bg-gold/15 text-gold border-gold/30">
                  {selectedDesign.style}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {selectedDesign.budget}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {selectedDesign.size}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {selectedDesign.description}
              </p>

              {/* Action buttons */}
              <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                <Button
                  onClick={() => {
                    setModalOpen(false)
                    navigate('calculator')
                  }}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Get Quote
                </Button>
                <Button
                  onClick={() => {
                    setModalOpen(false)
                    navigate('calculator')
                  }}
                  className="w-full sm:w-auto bg-gold text-gold-foreground hover:bg-gold/90 font-semibold"
                >
                  Book Similar Design
                  <ArrowRight className="size-4 ml-1" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

// ─── FilterRow sub-component ────────────────────────────────────────────────

function FilterRow<T extends string>({
  label,
  options,
  active,
  onSelect,
}: {
  label: React.ReactNode
  options: T[]
  active: T
  onSelect: (val: T) => void
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <span className="shrink-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {options.map((option) => (
          <Badge
            key={option}
            variant="outline"
            className={`cursor-pointer whitespace-nowrap transition-all duration-200 px-3 py-1 text-xs font-medium select-none
              ${
                active === option
                  ? 'bg-gold text-gold-foreground border-gold hover:bg-gold/90'
                  : 'hover:bg-muted/60'
              }
            `}
            onClick={() => onSelect(option)}
          >
            {option}
          </Badge>
        ))}
      </div>
    </div>
  )
}
