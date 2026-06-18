'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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
import { useNavigation } from '@/store/navigation'

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
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}
