'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { HeroSection } from '@/components/home/HeroSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { PackagesPreview } from '@/components/home/PackagesPreview'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { Testimonials } from '@/components/home/Testimonials'
import { ProcessTimeline } from '@/components/home/ProcessTimeline'
import { CTABanner } from '@/components/home/CTABanner'
import { PackagesPage } from '@/components/packages/PackagesPage'
import { CalculatorPage } from '@/components/calculator/CalculatorPage'
import { LookbookPage } from '@/components/lookbook/LookbookPage'
import { BookingPage } from '@/components/booking/BookingPage'
import { SlotBookingPage } from '@/components/booking/SlotBookingPage'
import { BlogPage } from '@/components/blog/BlogPage'
import { AboutPage } from '@/components/about/AboutPage'
import { ContactPage } from '@/components/contact/ContactPage'
import { AdminLoginPage } from '@/components/admin/AdminLoginPage'
import { AdminDashboardPage } from '@/components/admin/AdminDashboardPage'
import { useNavigation } from '@/store/navigation'
import { motion, AnimatePresence } from 'framer-motion'

function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <PackagesPreview />
      <GalleryPreview />
      <Testimonials />
      <ProcessTimeline />
      <CTABanner />
    </>
  )
}

export default function Home() {
  const { currentPage } = useNavigation()

  const renderPage = () => {
    switch (currentPage) {
      case 'lookbook':
        return <LookbookPage />
      case 'packages':
        return <PackagesPage />
      case 'calculator':
        return <CalculatorPage />
      case 'booking':
        return <BookingPage />
      case 'slot-booking':
        return <SlotBookingPage />
      case 'blog':
        return <BlogPage />
      case 'about':
        return <AboutPage />
      case 'contact':
        return <ContactPage />
      case 'admin-login':
        return <AdminLoginPage />
      case 'admin-dashboard':
        return <AdminDashboardPage />
      default:
        return <HomePage />
    }
  }

  // Admin pages have their own full-screen layout (no header/footer)
  const isAdminPage = currentPage === 'admin-login' || currentPage === 'admin-dashboard'

  if (isAdminPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <ScrollProgress />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
