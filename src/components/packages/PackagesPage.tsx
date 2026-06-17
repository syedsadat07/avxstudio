'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X, Star, Crown, Sparkles, ArrowRight, Phone } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/* ──────────────── Data ──────────────── */

type RenovationType = 'full' | 'partial'

interface PackageFeature {
  text: string
  included: boolean
}

interface PackageData {
  tier: string
  name: string
  description: string
  fullPrice: string
  partialPrice: string
  features: PackageFeature[]
  notIncluded: string[]
  highlighted: boolean
  badge?: string
  cta: string
  icon: React.ReactNode
  everythingIncluded?: boolean
}

const packages: PackageData[] = [
  {
    tier: 'Essential',
    name: 'Basic',
    description: 'Essential renovation for a fresh, functional bathroom',
    fullPrice: '₹45,999',
    partialPrice: '₹32,999',
    features: [
      { text: 'Standard ceramic tiles (30+ options)', included: true },
      { text: 'Basic wall-mounted vanity', included: true },
      { text: 'Single-lever faucet', included: true },
      { text: 'Standard showerhead', included: true },
      { text: 'CP fittings & accessories', included: true },
      { text: 'Exhaust fan', included: true },
      { text: '10-year warranty', included: true },
    ],
    notIncluded: ['Shower enclosure', 'Designer fixtures', 'Smart features'],
    highlighted: false,
    cta: 'Get Started',
    icon: <Star className="size-5" />,
  },
  {
    tier: 'Recommended',
    name: 'Premium',
    description: 'Perfect blend of style and functionality',
    fullPrice: '₹89,999',
    partialPrice: '₹64,999',
    features: [
      { text: 'Premium vitrified tiles (50+ options)', included: true },
      { text: 'Designer vanity with mirror', included: true },
      { text: 'Sensor faucet', included: true },
      { text: 'Rain shower + hand shower', included: true },
      { text: 'Shower enclosure (8mm glass)', included: true },
      { text: 'Premium CP fittings & accessories', included: true },
      { text: 'LED mirror lighting', included: true },
      { text: '10-year warranty', included: true },
      { text: 'Free design consultation', included: true },
    ],
    notIncluded: ['Smart features', 'Bathtub'],
    highlighted: true,
    badge: 'Most Popular',
    cta: 'Most Popular Choice',
    icon: <Crown className="size-5" />,
  },
  {
    tier: 'Exclusive',
    name: 'Luxury',
    description: 'The ultimate bathroom experience with smart features',
    fullPrice: '₹1,59,999',
    partialPrice: '₹1,14,999',
    features: [
      { text: 'Italian marble / large format tiles (80+ options)', included: true },
      { text: 'Custom vanity with backlit mirror', included: true },
      { text: 'Smart touch faucet', included: true },
      { text: 'Rain shower + body jets + hand shower', included: true },
      { text: 'Frameless glass enclosure (10mm)', included: true },
      { text: 'Premium brass fittings & accessories', included: true },
      { text: 'Heated towel rack', included: true },
      { text: 'Smart lighting system', included: true },
      { text: 'Bathtub (if space permits)', included: true },
      { text: '10-year warranty', included: true },
      { text: 'Dedicated interior designer', included: true },
    ],
    notIncluded: [],
    highlighted: false,
    everythingIncluded: true,
    cta: 'Go Luxury',
    icon: <Sparkles className="size-5" />,
  },
]

interface ComparisonRow {
  feature: string
  basic: string | boolean
  premium: string | boolean
  luxury: string | boolean
}

const comparisonData: ComparisonRow[] = [
  { feature: 'Tiles', basic: 'Standard Ceramic', premium: 'Premium Vitrified', luxury: 'Italian Marble / Large Format' },
  { feature: 'Vanity', basic: 'Wall-mounted', premium: 'Designer w/ Mirror', luxury: 'Custom w/ Backlit Mirror' },
  { feature: 'Faucet', basic: 'Single-lever', premium: 'Sensor', luxury: 'Smart Touch' },
  { feature: 'Shower', basic: 'Standard', premium: 'Rain + Hand', luxury: 'Rain + Body Jets + Hand' },
  { feature: 'Enclosure', basic: false, premium: '8mm Glass', luxury: '10mm Frameless' },
  { feature: 'Warranty', basic: '10 Years', premium: '10 Years', luxury: '10 Years' },
  { feature: 'Designer', basic: false, premium: 'Free Consultation', luxury: 'Dedicated Designer' },
  { feature: 'Smart Features', basic: false, premium: false, luxury: true },
  { feature: 'Bathtub', basic: false, premium: false, luxury: 'If Space Permits' },
]

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'Can I customize a package?',
    answer:
      'Absolutely! Every package serves as a starting point. You can upgrade individual components, swap fixtures, or add features to match your preferences. Our design consultants will work with you to create a personalized plan that fits both your style and budget.',
  },
  {
    question: 'What brands do you use?',
    answer:
      'We partner with India\'s most trusted brands including Jaquar, Kohler, Hindware, Cera, and Grohe for fittings, and Kajaria, Somany, and Nitco for tiles. For our Luxury packages, we also offer international premium brands like Villeroy & Boch, Roca, and Toto.',
  },
  {
    question: 'How long does installation take?',
    answer:
      'Basic package installations typically take 7-10 working days. Premium packages require 12-15 working days, while Luxury packages with custom elements may take 18-25 working days. We ensure minimal disruption and maintain a clean workspace throughout the process.',
  },
  {
    question: 'Do you offer EMI options?',
    answer:
      'Yes, we offer flexible EMI options through leading banks and NBFCs. You can opt for 3, 6, 9, or 12-month no-cost EMI plans on select packages. Our team will help you find the best financing option that suits your budget.',
  },
]

/* ──────────────── Animation variants ──────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: custom },
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

/* ──────────────── Helper ──────────────── */

function renderCell(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="size-5 text-gold mx-auto" />
    ) : (
      <X className="size-5 text-muted-foreground/40 mx-auto" />
    )
  }
  return <span className="text-sm text-muted-foreground">{value}</span>
}

/* ──────────────── Component ──────────────── */

export function PackagesPage() {
  const { navigate } = useNavigation()
  const [renovationType, setRenovationType] = useState<RenovationType>('full')

  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  const cardsRef = useRef<HTMLDivElement>(null)
  const cardsInView = useInView(cardsRef, { once: true, margin: '-80px' })

  const tableRef = useRef<HTMLDivElement>(null)
  const tableInView = useInView(tableRef, { once: true, margin: '-80px' })

  const faqRef = useRef<HTMLDivElement>(null)
  const faqInView = useInView(faqRef, { once: true, margin: '-80px' })

  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' })

  const getPrice = (pkg: PackageData) =>
    renovationType === 'full' ? pkg.fullPrice : pkg.partialPrice

  return (
    <div className="pt-20 sm:pt-24">
      {/* ─── Page Header ─── */}
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        aria-label="Packages header"
        ref={headerRef}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-background" />
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,105,0.4) 0%, transparent 60%)',
          }}
        />

        <motion.div
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-4">
            AURAVIX Bath Studio
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Renovation <span className="text-gold">Packages</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Pricing based on requirement
          </p>

          {/* Package Toggle */}
          <div className="mt-10 flex justify-center">
            <Tabs
              value={renovationType}
              onValueChange={(v) => setRenovationType(v as RenovationType)}
            >
              <TabsList className="bg-muted/80 h-12 px-1.5 rounded-xl border border-border/50">
                <TabsTrigger
                  value="full"
                  className="px-6 h-9 rounded-lg text-sm font-medium tracking-wide data-[state=active]:bg-gold data-[state=active]:text-gold-foreground data-[state=active]:shadow-sm"
                >
                  Full Bathroom
                </TabsTrigger>
                <TabsTrigger
                  value="partial"
                  className="px-6 h-9 rounded-lg text-sm font-medium tracking-wide data-[state=active]:bg-gold data-[state=active]:text-gold-foreground data-[state=active]:shadow-sm"
                >
                  Partial Renovation
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <p className="mt-3 text-sm text-muted-foreground/70">
            {renovationType === 'full'
              ? 'Complete bathroom overhaul — tiles, fittings, fixtures & more'
              : 'Focused renovation — select areas updated with premium finishes'}
          </p>
        </motion.div>
      </section>

      {/* ─── Package Cards ─── */}
      <section className="pb-16 md:pb-24" aria-label="Package details" ref={cardsRef}>
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          variants={staggerContainer}
          initial="hidden"
          animate={cardsInView ? 'visible' : 'hidden'}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {packages.map((pkg) => (
              <motion.div key={pkg.name} variants={cardVariant}>
                <Card
                  className={`relative h-full transition-all duration-500 hover:-translate-y-1 overflow-hidden ${
                    pkg.highlighted
                      ? 'border-gold/60 bg-card shadow-2xl shadow-gold/10 lg:scale-105 lg:-my-4'
                      : 'border-border/50 bg-card hover:shadow-lg'
                  }`}
                >
                  {/* Gold shimmer bar at top for highlighted */}
                  {pkg.highlighted && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />
                  )}

                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gold text-gold-foreground font-semibold px-3 py-1 text-xs tracking-wide shadow-md shadow-gold/20">
                        {pkg.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pt-8 pb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className={`flex items-center justify-center size-10 rounded-lg ${
                          pkg.highlighted
                            ? 'bg-gold/10 text-gold'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {pkg.icon}
                      </div>
                      <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                        {pkg.tier}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mt-2">
                      {pkg.name} Package
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {pkg.description}
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span
                        className={`text-4xl font-bold ${
                          pkg.highlighted ? 'text-gold' : 'text-foreground'
                        }`}
                      >
                        {getPrice(pkg)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {renovationType === 'full' ? 'full bathroom' : 'partial renovation'}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-2">
                    {/* Features */}
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-3">
                          <Check className="size-4 text-gold mt-0.5 shrink-0" />
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* What's Not Included */}
                    {pkg.notIncluded.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-border/50">
                        <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/60 mb-3">
                          What&apos;s Not Included
                        </p>
                        <ul className="space-y-2">
                          {pkg.notIncluded.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <X className="size-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                              <span className="text-sm text-muted-foreground/60">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Everything Included badge */}
                    {pkg.everythingIncluded && (
                      <div className="mt-6 pt-5 border-t border-border/50">
                        <Badge className="bg-gold/10 text-gold border-gold/20 font-medium px-4 py-1.5 text-xs tracking-wide">
                          <Sparkles className="size-3.5 mr-1.5" />
                          Everything Included
                        </Badge>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-2 pb-8">
                    <Button
                      onClick={() => navigate('calculator')}
                      variant={pkg.highlighted ? 'default' : 'outline'}
                      className={`w-full font-semibold tracking-wide h-12 text-sm transition-all duration-300 ${
                        pkg.highlighted
                          ? 'bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30'
                          : 'border-border hover:border-gold/40 hover:text-gold'
                      }`}
                    >
                      {pkg.cta}
                      <ArrowRight className="size-4 ml-1.5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Comparison Table ─── */}
      <section
        className="py-16 md:py-24 bg-muted/30"
        aria-label="Package comparison"
        ref={tableRef}
      >
        <motion.div
          className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 40 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Compare <span className="text-gold">Packages</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              See exactly what each package includes at a glance
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#111111] hover:from-[#0a0a0a] hover:via-[#1a1a1a] hover:to-[#111111]">
                  <TableHead className="text-gold-foreground/80 font-semibold text-sm tracking-wide">
                    Feature
                  </TableHead>
                  <TableHead className="text-center text-gold font-semibold text-sm tracking-wide">
                    Basic
                  </TableHead>
                  <TableHead className="text-center text-gold font-semibold text-sm tracking-wide">
                    Premium
                  </TableHead>
                  <TableHead className="text-center text-gold font-semibold text-sm tracking-wide">
                    Luxury
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, idx) => (
                  <TableRow
                    key={row.feature}
                    className={idx % 2 === 0 ? 'bg-muted/20' : 'bg-card'}
                  >
                    <TableCell className="font-medium text-foreground text-sm">
                      {row.feature}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderCell(row.basic)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderCell(row.premium)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderCell(row.luxury)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section
        className="py-16 md:py-24"
        aria-label="Frequently asked questions"
        ref={faqRef}
      >
        <motion.div
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 40 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Everything you need to know about our packages
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, idx) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${idx}`}
                  className="border-border/50"
                >
                  <AccordionTrigger className="text-left text-[15px] font-medium text-foreground hover:text-gold hover:no-underline transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        aria-label="Consultation call to action"
        ref={ctaRef}
      >
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#111111]" />

        {/* Gold accent glows */}
        <div
          className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,105,0.4) 0%, rgba(212,175,105,0.1) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,105,0.3) 0%, rgba(212,175,105,0.05) 50%, transparent 70%)',
          }}
        />

        {/* Decorative floating orb */}
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

        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
          variants={fadeInUp}
          custom={0}
          initial="hidden"
          animate={ctaInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Not sure which package is{' '}
            <span className="text-gold">right for you?</span>
          </h2>

          <p className="mt-5 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Our design experts will help you with pricing tailored to your space, style, and budget.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('slot-booking')}
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 h-12 text-base shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
            >
              <Phone className="size-4 mr-2" />
              Book a Slot
            </Button>
            <Button
              onClick={() => navigate('calculator')}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white font-medium tracking-wide px-8 h-12 text-base transition-all duration-300"
            >
              Calculate Your Cost
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
