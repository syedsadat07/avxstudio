'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, User, ArrowRight, BookOpen, Mail } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

// ─── Types ──────────────────────────────────────────────────────────────────

interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  gradient: string
  fullContent: string[]
}

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  'All',
  'Bathroom Ideas',
  'Renovation Tips',
  'Small Bathroom Hacks',
  'Luxury Inspiration',
  'Waterproofing Guides',
] as const

type Category = (typeof CATEGORIES)[number]

const BLOG_POSTS: BlogPost[] = [
  {
    id: 0,
    title: '10 Modern Bathroom Trends That Will Dominate 2025',
    excerpt:
      'From smart fixtures to sustainable materials, discover the bathroom design trends that are reshaping homes across India.',
    category: 'Bathroom Ideas',
    author: 'Priya Mehta',
    date: 'Feb 28, 2025',
    readTime: '9 min read',
    gradient: 'from-amber-100 via-yellow-50 to-orange-50',
    fullContent: [
      'The bathroom of 2025 is no longer just a functional space — it has evolved into a personal sanctuary that blends technology, sustainability, and bold aesthetics. Smart fixtures with motion sensors and voice-controlled temperature settings are becoming standard in premium Indian homes, offering both convenience and water conservation. Touchless faucets, self-cleaning toilets, and LED mirrors with built-in weather displays are leading the charge in this transformation.',
      'Sustainable materials are taking center stage as homeowners become more environmentally conscious. Recycled glass countertops, bamboo vanities, and low-flow shower systems that don\'t compromise on pressure are now must-haves. Designers are also embracing natural stone in its raw, unpolished form, bringing an organic warmth that contrasts beautifully with sleek modern fixtures. The combination creates a spa-like atmosphere right at home.',
      'Color palettes are shifting from the all-white minimalism of previous years toward warmer, earthier tones. Terracotta, sage green, and warm beige are dominating tile selections, while matte black fixtures provide striking contrast. Statement walls with bold patterned tiles, especially Moroccan and Japanese-inspired designs, are being used to create focal points that turn an ordinary bathroom into an extraordinary retreat.',
    ],
  },
  {
    id: 1,
    title: 'Complete Guide to Bathroom Waterproofing',
    excerpt:
      'Protect your investment with proper waterproofing techniques. Learn the essentials for a leak-free bathroom.',
    category: 'Renovation Tips',
    author: 'Rajiv Kapoor',
    date: 'Feb 20, 2025',
    readTime: '8 min read',
    gradient: 'from-stone-200 via-amber-50 to-yellow-50',
    fullContent: [
      'Waterproofing is the single most critical step in bathroom construction or renovation, yet it remains the most overlooked. A poorly waterproofed bathroom can lead to structural damage, mold growth, and costly repairs that far exceed the initial investment in proper waterproofing. In India\'s humid climate, this becomes even more crucial as moisture penetration can affect not just your bathroom but adjacent rooms and even the floors below.',
      'The process begins with surface preparation — ensuring the substrate is clean, level, and free of cracks. A primer is then applied to improve adhesion, followed by a membrane system that typically includes a cementitious or polymer-based coating. Critical areas like shower zones, bathtub perimeters, and pipe penetrations require extra attention with reinforced waterproofing membranes. The shower area should have waterproofing extending at least 1800mm up the walls.',
      'Modern liquid-applied membranes offer superior coverage compared to traditional sheet membranes, as they form a seamless barrier without joints or seams where water can infiltrate. After application, a flood test of 48-72 hours is essential to verify the integrity of the waterproofing layer before tiling begins. Always insist on a warranty from your contractor — a minimum 10-year warranty on waterproofing is the industry standard for quality work.',
    ],
  },
  {
    id: 2,
    title: '5 Space-Saving Ideas for Small Bathrooms',
    excerpt:
      'Maximize every inch with clever storage solutions and smart layouts designed for compact Indian bathrooms.',
    category: 'Small Bathroom Hacks',
    author: 'Ananya Singh',
    date: 'Feb 14, 2025',
    readTime: '5 min read',
    gradient: 'from-orange-100 via-amber-50 to-yellow-100',
    fullContent: [
      'Small bathrooms are a reality in most Indian apartments, but compact doesn\'t have to mean cramped. The key lies in strategic planning and choosing fixtures that serve multiple purposes. Wall-mounted toilets and floating vanities create the illusion of more floor space by revealing the area beneath them, making the room feel significantly larger than its actual dimensions.',
      'Vertical storage is your best friend in a compact bathroom. Floor-to-ceiling cabinets that blend seamlessly with the wall color create ample storage without eating into the visual space. Recessed niches in shower areas replace bulky shelving units, while over-toilet storage racks turn dead space into functional storage. Mirror cabinets with internal shelving provide both a grooming mirror and hidden storage for toiletries.',
      'Strategic use of materials and lighting can dramatically alter the perception of space. Large-format tiles with minimal grout lines create a seamless look that makes walls appear larger. A frameless glass shower partition replaces opaque barriers, allowing light to flow freely. Under-cabinet LED strips and backlit mirrors eliminate shadows and create an airy, open atmosphere that transforms even the smallest bathroom into a welcoming retreat.',
    ],
  },
  {
    id: 3,
    title: 'Creating a Spa-Like Experience at Home',
    excerpt:
      'Transform your daily routine with luxury touches inspired by world-class spas and wellness retreats.',
    category: 'Luxury Inspiration',
    author: 'Vikram Chauhan',
    date: 'Feb 7, 2025',
    readTime: '6 min read',
    gradient: 'from-yellow-100 via-amber-50 to-stone-100',
    fullContent: [
      'The concept of a spa bathroom goes beyond aesthetics — it\'s about creating a multisensory experience that promotes relaxation and well-being. Start with lighting: install dimmable LED fixtures that allow you to transition from bright, energizing morning light to soft, warm evening ambiance. Candles and salt lamps add natural warmth, while a backlit mirror creates a gentle, flattering glow for grooming routines.',
      'Water features are the heart of any spa experience. A rainfall showerhead mounted directly overhead simulates the sensation of standing in a warm monsoon, while body jets provide a therapeutic massage. For those with space, a freestanding soaking tub becomes the centerpiece — imagine sinking into warm water surrounded by flickering candles after a long day. Heated towel racks and underfloor heating ensure that comfort extends beyond the water itself.',
      'The finishing touches make all the difference. Natural materials like teak wood bath mats, river stone shower floors, and bamboo accessories bring the outdoors in. Aromatherapy diffusers with essential oils like eucalyptus and lavender create an immersive sensory experience. Plush Egyptian cotton towels, a built-in sound system with nature sounds, and a small indoor plant complete the transformation from ordinary bathroom to personal wellness retreat.',
    ],
  },
  {
    id: 4,
    title: 'Choosing the Right Tiles for Your Bathroom',
    excerpt:
      'From ceramic to natural stone, find the perfect tile material for durability and style in Indian conditions.',
    category: 'Bathroom Ideas',
    author: 'Neha Agarwal',
    date: 'Jan 30, 2025',
    readTime: '7 min read',
    gradient: 'from-amber-100 via-orange-50 to-yellow-50',
    fullContent: [
      'Selecting bathroom tiles involves balancing aesthetics, durability, maintenance, and budget — especially in India where hard water and humidity present unique challenges. Ceramic tiles remain the most popular choice for their affordability, water resistance, and vast design options. Porcelain tiles, while slightly more expensive, offer superior density and water resistance, making them ideal for shower floors and walls.',
      'Natural stone tiles like marble, granite, and slate bring unmatched elegance but require regular sealing and maintenance. Marble, a favorite in Indian luxury homes, develops a beautiful patina over time but is susceptible to staining from hard water deposits. For a practical yet premium look, consider large-format porcelain tiles that mimic natural stone — you get the visual appeal without the maintenance headaches.',
      'Tile size and layout significantly impact the perceived space in your bathroom. Large-format tiles (600x600mm or larger) with minimal grout lines create a seamless, expansive look perfect for floors and feature walls. For shower floors, smaller mosaic tiles (25x25mm to 50x50mm) provide necessary slip resistance while adding texture and visual interest. Don\'t forget the anti-skid rating — for Indian bathrooms, an R10 or higher slip rating is recommended for floor tiles.',
    ],
  },
  {
    id: 5,
    title: 'How to Budget for Your Bathroom Renovation',
    excerpt:
      'A practical guide to understanding costs, prioritizing spends, and avoiding common budgeting pitfalls.',
    category: 'Renovation Tips',
    author: 'Arjun Desai',
    date: 'Jan 22, 2025',
    readTime: '10 min read',
    gradient: 'from-stone-100 via-amber-50 to-orange-50',
    fullContent: [
      'Budgeting a bathroom renovation in India requires understanding the cost breakdown across different components. As a general rule, allocate roughly 30-35% of your budget to civil work (waterproofing, plumbing, and masonry), 25-30% to tiles and installation, 20-25% to fixtures and fittings, and 15-20% to accessories and finishing touches. Always keep a 10-15% contingency for unexpected issues — older homes often reveal hidden problems once work begins.',
      'The biggest budget variable is the scope of renovation. A cosmetic refresh (new tiles, paint, and fixtures without changing the layout) can start from ₹50,000 for a small bathroom. A mid-range renovation with layout changes and premium fixtures typically falls between ₹1.5-3 lakhs. A luxury transformation with imported fixtures, custom cabinetry, and high-end materials can exceed ₹5 lakhs. The key is to prioritize spending on elements that are difficult or expensive to change later — waterproofing and plumbing should never be compromised.',
      'Smart budgeting means knowing where to save and where to splurge. Invest in quality waterproofing, durable tiles, and reliable plumbing fixtures — these are foundational elements that affect longevity. Save on accessories and decorative elements, which can be upgraded later without major disruption. Consider purchasing fixtures during sales, and explore Indian brands like Jaquar and Hindware that offer excellent quality at competitive prices compared to imported alternatives.',
    ],
  },
  {
    id: 6,
    title: 'Minimalist Bathroom Design Principles',
    excerpt:
      'Embrace the art of less with clean lines, neutral palettes, and purposeful simplicity in bathroom design.',
    category: 'Bathroom Ideas',
    author: 'Priya Mehta',
    date: 'Jan 15, 2025',
    readTime: '4 min read',
    gradient: 'from-yellow-50 via-stone-100 to-amber-50',
    fullContent: [
      'Minimalist bathroom design is rooted in the principle that every element must serve a purpose. This doesn\'t mean cold or sterile — true minimalism creates a sense of calm by eliminating visual clutter and focusing on quality over quantity. Start with a neutral color palette: whites, grays, and warm beiges form the foundation, with a single accent color or material providing visual interest without overwhelming the senses.',
      'Concealed storage is essential for maintaining clean surfaces. Built-in cabinets behind mirror fronts, recessed shelving in shower niches, and vanity drawers with organizers ensure that essentials are accessible but not visible. Wall-mounted fixtures — from taps to toilets — eliminate floor-mounting hardware and create floating silhouettes that enhance the sense of space. Choose fewer, higher-quality fixtures rather than multiple mid-range pieces.',
      'The magic of minimalist design lies in thoughtful details. A single statement piece — perhaps a sculptural freestanding tub, an oversized backlit mirror, or a slab of natural stone as a vanity top — becomes the focal point around which the entire room revolves. Texture replaces ornamentation: matte surfaces, brushed metals, and natural materials provide subtle richness. The result is a bathroom that feels spacious, serene, and effortlessly sophisticated — a true retreat from the chaos of daily life.',
    ],
  },
]

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

// ─── Component ──────────────────────────────────────────────────────────────

export function BlogPage() {
  const { navigate } = useNavigation()
  const { toast } = useToast()

  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  // ── Filter posts ──────────────────────────────────────────────────────

  const featuredPost = BLOG_POSTS[0]
  const gridPosts = BLOG_POSTS.slice(1)

  const filteredGridPosts =
    activeCategory === 'All'
      ? gridPosts
      : gridPosts.filter((post) => post.category === activeCategory)

  const isFeaturedVisible =
    activeCategory === 'All' || featuredPost.category === activeCategory

  // ── Handlers ──────────────────────────────────────────────────────────

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post)
    setDialogOpen(true)
  }

  const handleSubscribe = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setIsSubscribing(true)
    setTimeout(() => {
      toast({
        title: 'Subscribed!',
        description: 'You\'ll receive bathroom inspiration in your inbox.',
      })
      setEmail('')
      setIsSubscribing(false)
    }, 600)
  }

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <section className="py-12 md:py-20 bg-background" aria-label="Blog">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Bathroom Insights <span className="text-gold">&amp; Ideas</span>
          </h1>
          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold/40" />
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="h-px w-12 bg-gold/40" />
          </div>
          <p className="mt-5 text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert tips, design inspiration, and renovation guides
          </p>
        </motion.div>

        {/* ── Category Filter ──────────────────────────────────────────── */}
        <motion.div
          className="mb-10 md:mb-14 flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="focus:outline-none"
            >
              <Badge
                className={`cursor-pointer transition-all duration-200 text-sm px-4 py-1.5 rounded-full border ${
                  activeCategory === cat
                    ? 'bg-gold text-gold-foreground border-gold hover:bg-gold/90'
                    : 'bg-background text-muted-foreground border-border/60 hover:border-gold/40 hover:text-foreground'
                }`}
              >
                {cat}
              </Badge>
            </button>
          ))}
        </motion.div>

        {/* ── Featured Post ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {isFeaturedVisible && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 md:mb-14"
            >
              <Card
                className="overflow-hidden border-border/40 cursor-pointer group hover:shadow-lg transition-shadow duration-300"
                onClick={() => handlePostClick(featuredPost)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Gradient visual area */}
                  <div
                    className={`bg-gradient-to-br ${featuredPost.gradient} min-h-[220px] md:min-h-[360px] relative flex items-end p-6`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="relative z-10">
                      <Badge className="bg-gold/90 text-gold-foreground border-0 text-xs font-semibold mb-3">
                        <BookOpen className="size-3 mr-1" />
                        {featuredPost.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content area */}
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge
                      variant="outline"
                      className="w-fit mb-4 text-xs border-gold/30 text-gold"
                    >
                      Featured
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 group-hover:text-gold transition-colors duration-200">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-5">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1.5">
                        <User className="size-3.5" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {featuredPost.readTime}
                      </span>
                      <span>{featuredPost.date}</span>
                    </div>
                    <Button
                      className="w-fit bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide gap-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePostClick(featuredPost)
                      }}
                    >
                      Read More
                      <ArrowRight className="size-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Blog Grid ────────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14 md:mb-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          key={activeCategory}
        >
          {filteredGridPosts.length > 0 ? (
            filteredGridPosts.map((post, i) => (
              <motion.div
                key={post.id}
                variants={fadeUp}
                custom={i}
              >
                <Card
                  className="overflow-hidden border-border/40 cursor-pointer group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
                  onClick={() => handlePostClick(post)}
                >
                  {/* Gradient visual area */}
                  <div
                    className={`bg-gradient-to-br ${post.gradient} h-44 sm:h-52 relative flex items-end p-4`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                    <Badge className="relative z-10 bg-gold/90 text-gold-foreground border-0 text-xs font-semibold">
                      <BookOpen className="size-3 mr-1" />
                      {post.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-gold transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                      <span className="flex items-center gap-1.5">
                        <User className="size-3" />
                        {post.author}
                      </span>
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16"
              variants={fadeUp}
              custom={0}
            >
              <BookOpen className="size-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No posts found in this category
              </p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                Try selecting a different category
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ── Newsletter Signup ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="overflow-hidden border-border/40">
            <div className="relative bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
              {/* Gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />
              <CardContent className="p-8 md:p-12 text-center">
                <Mail className="size-10 text-gold mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Get Bathroom Inspiration in Your Inbox
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Join 2,000+ homeowners who receive our weekly tips, trend
                  reports, and exclusive renovation offers.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubscribe()
                    }}
                    className="flex-1 h-12 bg-background/80 border-border/60"
                  />
                  <Button
                    onClick={handleSubscribe}
                    disabled={
                      !email.trim() ||
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                      isSubscribing
                    }
                    className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide h-12 px-8 w-full sm:w-auto gap-2"
                  >
                    {isSubscribing ? (
                      <motion.div
                        className="size-4 border-2 border-gold-foreground/30 border-t-gold-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground/60 mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Blog Detail Modal ───────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedPost && (
            <>
              {/* Gradient visual area */}
              <div
                className={`bg-gradient-to-br ${selectedPost.gradient} -mx-6 -mt-6 h-48 sm:h-56 relative flex items-end p-6 mb-0`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                <Badge className="relative z-10 bg-gold/90 text-gold-foreground border-0 text-xs font-semibold">
                  <BookOpen className="size-3 mr-1" />
                  {selectedPost.category}
                </Badge>
              </div>

              <DialogHeader className="mt-2">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                  {selectedPost.title}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <User className="size-3.5" />
                    {selectedPost.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {selectedPost.readTime}
                  </span>
                  <span>{selectedPost.date}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-foreground/85 leading-relaxed text-sm sm:text-base">
                {selectedPost.fullContent.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-border/50 mt-4">
                <Button
                  className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide gap-2 w-full sm:w-auto"
                  onClick={() => {
                    setDialogOpen(false)
                    navigate('slot-booking')
                  }}
                >
                  Book a Slot
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
