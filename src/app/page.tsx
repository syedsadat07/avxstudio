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
import { AdminSetupPage } from '@/components/admin/AdminSetupPage'
import { AuthPage } from '@/components/auth/AuthPage'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useNavigation } from '@/store/navigation'
import { motion, AnimatePresence } from 'framer-motion'

function HomePage() {
  return (
    <>
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <WhyChooseUs />
      </ErrorBoundary>
      <ErrorBoundary>
        <PackagesPreview />
      </ErrorBoundary>
      <ErrorBoundary>
        <GalleryPreview />
      </ErrorBoundary>
      <ErrorBoundary>
        <Testimonials />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProcessTimeline />
      </ErrorBoundary>
      <ErrorBoundary>
        <CTABanner />
      </ErrorBoundary>
    </>
  )
}

export default function Home() {
  const { currentPage } = useNavigation()

  const renderPage = () => {
    switch (currentPage) {
      case 'lookbook':
        return <ErrorBoundary><LookbookPage /></ErrorBoundary>
      case 'packages':
        return <ErrorBoundary><PackagesPage /></ErrorBoundary>
      case 'calculator':
        return <ErrorBoundary><CalculatorPage /></ErrorBoundary>
      case 'booking':
        return <ErrorBoundary><BookingPage /></ErrorBoundary>
      case 'slot-booking':
        return <ErrorBoundary><SlotBookingPage /></ErrorBoundary>
      case 'blog':
        return <ErrorBoundary><BlogPage /></ErrorBoundary>
      case 'about':
        return <ErrorBoundary><AboutPage /></ErrorBoundary>
      case 'contact':
        return <ErrorBoundary><ContactPage /></ErrorBoundary>
      case 'admin-login':
        return <ErrorBoundary><AdminLoginPage /></ErrorBoundary>
      case 'admin-dashboard':
        return <ErrorBoundary><AdminDashboardPage /></ErrorBoundary>
      case 'admin-setup':
        return <ErrorBoundary><AdminSetupPage /></ErrorBoundary>
      case 'auth':
        return <ErrorBoundary><AuthPage /></ErrorBoundary>
      default:
        return <HomePage />
    }
  }

  const isAdminPage = currentPage === 'admin-login' || currentPage === 'admin-dashboard' || currentPage === 'admin-setup' || currentPage === 'auth'

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
