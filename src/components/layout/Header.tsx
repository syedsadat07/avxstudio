'use client'

import { useState, useEffect } from 'react'
import { Menu, Phone } from 'lucide-react'
import { useNavigation, type PageId } from '@/store/navigation'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'

const navItems: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'packages', label: 'Packages' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'blog', label: 'Blog' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export function Header() {
  const { currentPage, navigate } = useNavigation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigate = (page: PageId) => {
    navigate(page)
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
            aria-label="Go to homepage"
          >
            {/* Gold brand mark icon - always visible against dark/light backgrounds */}
            <span
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0 ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5 group-hover:from-gold/25 group-hover:to-gold/10 transition-all duration-300"
              aria-hidden="true"
            >
              <img
                src="/auravix-mark.svg"
                alt=""
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-foreground">
                AURAVIX
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.35em] text-muted-foreground font-medium mt-0.5">
                BATH STUDIO
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="relative px-4 py-2 text-sm font-medium tracking-wide transition-colors group"
              >
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    currentPage === item.id
                      ? 'text-gold'
                      : 'text-foreground/70 group-hover:text-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {/* Active underline */}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-[2px] bg-gold transition-all duration-300 ${
                    currentPage === item.id
                      ? 'scale-x-100 opacity-100'
                      : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Desktop CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Phone icon - desktop only */}
            <a
              href="tel:+1234567890"
              className="hidden lg:flex items-center justify-center size-9 rounded-full border border-border/60 text-foreground/60 hover:text-gold hover:border-gold/40 transition-colors duration-300"
              aria-label="Call us"
            >
              <Phone className="size-4" />
            </a>

            {/* CTA Button - desktop */}
            <Button
              onClick={() => handleNavigate('calculator')}
              className="hidden lg:inline-flex bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              Book a Slot
            </Button>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:text-gold transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[360px] bg-background border-l border-border/50 p-0"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border/50">
            <SheetTitle className="flex items-center gap-2.5 leading-none">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5">
                <img src="/auravix-mark.svg" alt="" className="w-7 h-7 object-contain" />
              </span>
              <span className="flex flex-col">
                <span className="text-xl font-bold tracking-[0.2em] text-foreground">
                  AURAVIX
                </span>
                <span className="text-[10px] tracking-[0.35em] text-muted-foreground font-medium mt-1">
                  BATH STUDIO
                </span>
              </span>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <SheetClose asChild key={item.id}>
                <button
                  onClick={() => handleNavigate(item.id)}
                  className={`relative flex items-center px-6 py-3.5 text-[15px] font-medium tracking-wide transition-all duration-200 hover:bg-muted/60 ${
                    currentPage === item.id
                      ? 'text-gold bg-gold/5'
                      : 'text-foreground/70'
                  }`}
                >
                  {/* Active indicator bar */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-gold transition-all duration-300 ${
                      currentPage === item.id ? 'h-6 opacity-100' : 'h-0 opacity-0'
                    }`}
                  />
                  {item.label}
                </button>
              </SheetClose>
            ))}
          </nav>

          {/* Mobile CTA */}
          <div className="mt-auto p-6 border-t border-border/50">
            <Button
              onClick={() => handleNavigate('calculator')}
              className="w-full bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide h-12 text-[15px] shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <Phone className="size-4 mr-2" />
              Book a Slot
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3 tracking-wide">
              Pick a date, time and seat in seconds
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
