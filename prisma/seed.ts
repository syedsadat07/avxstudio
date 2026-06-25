import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Admin & Customer Users ───
  const adminPassword = await bcrypt.hash('admin123', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)

  await db.user.upsert({
    where: { email: 'admin@auravix.com' },
    update: {},
    create: {
      email: 'admin@auravix.com',
      name: 'AURAVIX Admin',
      phone: '+919876543210',
      password: adminPassword,
      role: 'admin',
    },
  })

  await db.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Demo Customer',
      phone: '+919876540000',
      password: customerPassword,
      role: 'customer',
    },
  })

  console.log('  ✓ Created admin user (admin@auravix.com / admin123)')
  console.log('  ✓ Created customer user (customer@example.com / customer123)')

  // ─── Testimonials ───
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      review: 'AURAVIX transformed our cramped bathroom into a spa-like retreat. The attention to detail and quality of materials is exceptional. Highly recommend!',
      featured: true,
    },
    {
      name: 'Rajesh Kumar',
      location: 'Delhi, NCR',
      rating: 5,
      review: 'From design to execution, the team was professional and punctual. Our master bathroom looks like a 5-star hotel. Worth every rupee.',
      featured: true,
    },
    {
      name: 'Anita Desai',
      location: 'Pune, Maharashtra',
      rating: 5,
      review: 'The 10-year warranty gave us peace of mind. The designer understood our vision perfectly and delivered beyond expectations.',
      featured: true,
    },
    {
      name: 'Vikram Singh',
      location: 'Bangalore, Karnataka',
      rating: 4,
      review: 'Great craftsmanship and transparent pricing. The project was completed 2 days ahead of schedule. Will use them again for our second bathroom.',
      featured: false,
    },
    {
      name: 'Meera Iyer',
      location: 'Chennai, Tamil Nadu',
      rating: 5,
      review: 'The smart bathroom features they installed are life-changing. Voice-controlled lighting and automated shower settings. Truly premium service.',
      featured: true,
    },
    {
      name: 'Arjun Patel',
      location: 'Ahmedabad, Gujarat',
      rating: 5,
      review: 'Excellent work on our compact bathroom. They maximized every inch of space. The Italian marble finish is stunning.',
      featured: false,
    },
  ]

  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }
  console.log(`  ✓ Created ${testimonials.length} testimonials`)

  // ─── Packages ───
  const packages = [
    {
      name: 'Essential Refresh',
      tier: 'basic',
      price: 45000,
      description: 'Perfect for a quick, quality bathroom update with essential fixtures and modern finishes.',
      features: JSON.stringify([
        'Premium ceramic tiles',
        'Wall-mounted vanity',
        'Standard shower system',
        'Chrome fixtures',
        '1-year warranty',
        'Free design consultation',
      ]),
      popular: false,
    },
    {
      name: 'Premium Renovation',
      tier: 'premium',
      price: 110000,
      description: 'Our most popular package featuring premium materials, designer fixtures, and smart features.',
      features: JSON.stringify([
        'Vitrified premium tiles',
        'Designer floor-standing vanity',
        'Rain shower system',
        'LED mirror with defogger',
        'Smart lighting',
        '5-year warranty',
        'Free design consultation',
        'Dedicated project manager',
      ]),
      popular: true,
    },
    {
      name: 'Luxury Sanctuary',
      tier: 'luxury',
      price: 220000,
      description: 'The ultimate bathroom experience with Italian marble, smart automation, and bespoke design.',
      features: JSON.stringify([
        'Italian marble flooring',
        'Custom designer vanity',
        'Shower panel with body jets',
        'Freestanding bathtub',
        'Smart bathroom automation',
        'Heated towel rack',
        '10-year warranty',
        'Dedicated designer',
        'Priority support',
      ]),
      popular: false,
    },
  ]

  for (const p of packages) {
    await db.package.create({ data: p })
  }
  console.log(`  ✓ Created ${packages.length} packages`)

  // ─── Designs (Lookbook) ───
  const designs = [
    {
      title: 'Modern Minimalist',
      category: 'modern',
      style: 'Minimal',
      imageUrl: '/images/bathroom-minimal.png',
      description: 'Clean lines, neutral palette, and functional elegance. A minimalist bathroom that feels open and serene.',
      budget: '₹50K-₹1L',
      size: 'Medium (40-80 sq ft)',
      featured: true,
    },
    {
      title: 'Luxury Marble',
      category: 'luxury',
      style: 'Luxury',
      imageUrl: '/images/bathroom-luxury.png',
      description: 'Italian marble, gold accents, and a freestanding tub. The epitome of bathroom luxury.',
      budget: '₹3L+',
      size: 'Large (80-120 sq ft)',
      featured: true,
    },
    {
      title: 'Compact Smart',
      category: 'modern',
      style: 'Compact',
      imageUrl: '/images/bathroom-compact.png',
      description: 'Space-saving design with smart storage solutions. Perfect for small urban bathrooms.',
      budget: '₹50K-₹1L',
      size: 'Small (< 40 sq ft)',
      featured: true,
    },
    {
      title: 'Natural Zen',
      category: 'natural',
      style: 'Natural',
      imageUrl: '/images/bathroom-natural.png',
      description: 'Natural stone, wood textures, and plants. Create a spa-like zen retreat at home.',
      budget: '₹1L-₹2L',
      size: 'Medium (40-80 sq ft)',
      featured: true,
    },
    {
      title: 'Contemporary Chic',
      category: 'modern',
      style: 'Modern',
      imageUrl: '/images/bathroom-modern.png',
      description: 'Bold geometric patterns, matte black fixtures, and statement lighting for a modern look.',
      budget: '₹2L-₹3L',
      size: 'Medium (40-80 sq ft)',
      featured: true,
    },
    {
      title: 'Spa Retreat',
      category: 'luxury',
      style: 'Luxury',
      imageUrl: '/images/hero-bathroom.png',
      description: 'Transform your bathroom into a personal spa with a soaking tub, rain shower, and ambient lighting.',
      budget: '₹3L+',
      size: 'Large (80-120 sq ft)',
      featured: true,
    },
  ]

  for (const d of designs) {
    await db.design.create({ data: d })
  }
  console.log(`  ✓ Created ${designs.length} designs`)

  // ─── Blog Posts ───
  const blogPosts = [
    {
      title: '10 Bathroom Design Trends for 2025',
      slug: 'bathroom-design-trends-2025',
      excerpt: 'Discover the hottest bathroom design trends that are shaping homes this year, from smart tech to natural materials.',
      content: 'The bathroom has evolved from a purely functional space to a personal sanctuary. In 2025, we are seeing a blend of technology, sustainability, and luxury. Smart mirrors with built-in displays, voice-controlled lighting, and automated climate control are becoming standard in premium renovations. Natural materials like stone, wood, and plants bring warmth and serenity. Bold geometric tiles and matte black fixtures add drama. Freestanding tubs remain popular, now paired with curbless walk-in showers. The key is creating a space that feels both luxurious and deeply personal.',
      category: 'Design Trends',
      imageUrl: '/images/bathroom-modern.png',
      published: true,
    },
    {
      title: 'How to Choose the Right Bathroom Tiles',
      slug: 'choosing-right-bathroom-tiles',
      excerpt: 'A complete guide to selecting bathroom tiles that balance aesthetics, durability, and budget.',
      content: 'Choosing bathroom tiles involves balancing aesthetics, durability, maintenance, and budget. Ceramic tiles are affordable and versatile, ideal for walls. Vitrified tiles offer better water resistance and are great for floors. Porcelain is durable and perfect for high-traffic bathrooms. Italian marble adds unmatched luxury but requires regular maintenance. Consider slip resistance for floor tiles (R11 rating or higher). For small bathrooms, use large-format tiles to create an illusion of space. Light colors and gloss finishes reflect light, making the room feel brighter. Always order 10% extra for cuts and future repairs.',
      category: 'Materials Guide',
      imageUrl: '/images/bathroom-luxury.png',
      published: true,
    },
    {
      title: 'Small Bathroom? Big Ideas for Compact Spaces',
      slug: 'small-bathroom-big-ideas',
      excerpt: 'Maximize every inch of your small bathroom with these clever design strategies and space-saving solutions.',
      content: 'Small bathrooms can feel spacious with the right design. Use wall-mounted fixtures to free up floor space. A frameless glass shower enclosure eliminates visual barriers. Recessed shelving in shower walls provides storage without protruding. Large-format tiles with minimal grout lines create seamless surfaces. Light, reflective colors make the space feel larger. A backlit mirror adds depth and ambient lighting. Pocket doors save swing space. Floating vanities with drawers maximize storage. Vertical stripes draw the eye upward, creating height. Even a 35 sq ft bathroom can feel luxurious with thoughtful design.',
      category: 'Design Tips',
      imageUrl: '/images/bathroom-compact.png',
      published: true,
    },
    {
      title: 'The True Cost of Bathroom Renovation in India',
      slug: 'bathroom-renovation-cost-india',
      excerpt: 'Break down the real costs of bathroom renovation in India, from materials to labor, with tips to save.',
      content: 'Bathroom renovation costs in India vary widely based on size, materials, and scope. A basic refresh starts at ₹35,000-₹50,000 for a small bathroom, including ceramic tiles, standard fixtures, and essential fittings. A premium renovation ranges from ₹75,000-₹1,50,000, featuring vitrified tiles, designer vanity, rain shower, and LED mirrors. Luxury renovations start at ₹2,00,000 and can exceed ₹5,00,000 with Italian marble, smart automation, and bespoke design. Labor typically adds 15% to material costs. Save money by keeping plumbing and electrical layouts unchanged, choosing Indian-made premium tiles over imported ones, and selecting standard sizes for fixtures. Always get 3 quotes and verify the contractor portfolio.',
      category: 'Cost Guide',
      imageUrl: '/images/bathroom-natural.png',
      published: true,
    },
    {
      title: 'Smart Bathroom Technology: What\'s Worth It?',
      slug: 'smart-bathroom-technology',
      excerpt: 'From smart mirrors to automated showers, here\'s which bathroom tech upgrades are actually worth the investment.',
      content: 'Smart bathroom technology can elevate your daily routine, but not all upgrades are worth the cost. Smart mirrors with LED lighting and defoggers are a worthwhile investment (₹3,500-₹8,000), improving daily usability. Motion-sensor faucets save water and add hygiene (₹5,000-₹15,000). Smart shower systems with temperature control and presets are luxurious but pricey (₹15,000-₹40,000). Heated towel racks are a comfort upgrade (₹5,000-₹12,000). Voice-controlled lighting is affordable if you already have a smart home setup. Smart toilets with bidet functions are popular in luxury renovations (₹25,000-₹80,000). Skip gimmicky Bluetooth speakers in mirrors — they rarely sound good. Focus on upgrades that improve daily comfort and water efficiency.',
      category: 'Smart Tech',
      imageUrl: '/images/bathroom-minimal.png',
      published: true,
    },
    {
      title: 'Bathroom Renovation Timeline: What to Expect',
      slug: 'bathroom-renovation-timeline',
      excerpt: 'A realistic week-by-week breakdown of a bathroom renovation project from demolition to handover.',
      content: 'A typical bathroom renovation takes 15-24 working days depending on size and scope. Week 1: Demolition (2-3 days) — remove old fixtures, tiles, and fittings; inspect plumbing and electrical. Week 2: Plumbing and electrical rough-in (3-4 days) — relocate pipes, install new electrical lines, waterproofing. Week 3: Tiling (5-7 days) — floor and wall tiles, grouting, curing. Week 4: Fixtures and finishing (3-5 days) — install vanity, shower, toilet, mirror, accessories, paint, final cleaning. Delays happen due to material delivery, hidden water damage, or design changes. Plan to be without your bathroom for 2-3 weeks. A good contractor provides a detailed timeline with milestones and daily updates. Always have a contingency plan for using another bathroom during the renovation.',
      category: 'Project Guide',
      imageUrl: '/images/showroom.png',
      published: true,
    },
  ]

  for (const post of blogPosts) {
    await db.blogPost.create({ data: post })
  }
  console.log(`  ✓ Created ${blogPosts.length} blog posts`)

  // ─── Sample Renovation Projects ───
  const projects = [
    {
      status: 'completed',
      packageTier: 'luxury',
      totalCost: 245000,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-28'),
    },
    {
      status: 'in-progress',
      packageTier: 'premium',
      totalCost: 115000,
      startDate: new Date('2025-01-15'),
    },
    {
      status: 'completed',
      packageTier: 'premium',
      totalCost: 98000,
      startDate: new Date('2024-09-10'),
      endDate: new Date('2024-10-02'),
    },
    {
      status: 'completed',
      packageTier: 'basic',
      totalCost: 52000,
      startDate: new Date('2024-12-05'),
      endDate: new Date('2024-12-20'),
    },
  ]

  for (const p of projects) {
    await db.renovationProject.create({ data: p })
  }
  console.log(`  ✓ Created ${projects.length} renovation projects`)

  console.log('\n✅ Database seeded successfully!')
  console.log('   - 6 testimonials')
  console.log('   - 3 packages')
  console.log('   - 6 designs')
  console.log('   - 6 blog posts')
  console.log('   - 4 renovation projects')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
