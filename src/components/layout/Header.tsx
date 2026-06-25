'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Phone, LogIn, UserCircle, LogOut, LayoutDashboard, ChevronDown, Shield, Mail } from 'lucide-react'
import { useNavigation, type PageId } from '@/store/navigation'
import { useAuth } from '@/store/auth'
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

// Pages that have a dark hero at the top (header needs light text)
const DARK_HERO_PAGES: PageId[] = ['home']

export function Header() {
  const { currentPage, navigate } = useNavigation()
  const { user, fetchSession, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    fetchSession()
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchSession])

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigate = (page: PageId) => {
    navigate(page)
    setMobileOpen(false)
    setProfileOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
    setMobileOpen(false)
    navigate('home')
  }

  // Use light (white) text when over the dark hero (home page, not scrolled)
  // Default to overDarkHero=false on server (light bg) to match initial client render
  const overDarkHero = mounted ? (DARK_HERO_PAGES.includes(currentPage) && !scrolled) : false

  // Text color classes based on context
  const logoTextClass = overDarkHero ? 'text-white' : 'text-foreground'
  const subTextClass = overDarkHero ? 'text-white/60' : 'text-muted-foreground'
  const navItemClass = (active: boolean) =>
    active
      ? 'text-gold'
      : overDarkHero
        ? 'text-white/80 group-hover:text-white'
        : 'text-foreground/70 group-hover:text-foreground'
  const phoneIconClass = overDarkHero
    ? 'border-white/30 text-white/70 hover:text-gold hover:border-gold/40'
    : 'border-border/60 text-foreground/60 hover:text-gold hover:border-gold/40'

  return (
    <motion.header
      initial={mounted ? { y: -100, opacity: 0 } : false}
      animate={mounted ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border-b border-border/50'
          : overDarkHero
            ? 'bg-gradient-to-b from-black/50 via-black/20 to-transparent backdrop-blur-[2px]'
            : 'bg-background/85 backdrop-blur-md border-b border-border/30'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="group flex items-center gap-2.5 transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
            aria-label="Go to homepage"
          >
            {/* Gold brand mark icon - always visible with glow on dark */}
            <motion.span
              whileHover={{ rotate: 5, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0 ring-1 transition-all duration-300 ${
                overDarkHero
                  ? 'ring-gold/40 bg-gradient-to-br from-gold/25 to-gold/10 shadow-[0_0_20px_rgba(212,175,105,0.25)]'
                  : 'ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5'
              } group-hover:shadow-[0_0_25px_rgba(212,175,105,0.4)]`}
              aria-hidden="true"
            >
              <img
                src="/auravix-mark.svg"
                alt=""
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
            </motion.span>
            <div className="flex flex-col leading-none">
              <span className={`text-xl sm:text-2xl font-bold tracking-[0.2em] transition-colors duration-500 ${logoTextClass}`}>
                AURAVIX
              </span>
              <span className={`text-[10px] sm:text-xs tracking-[0.35em] font-medium mt-0.5 transition-colors duration-500 ${subTextClass}`}>
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
                  className={`relative z-10 transition-colors duration-300 ${navItemClass(currentPage === item.id)}`}
                >
                  {item.label}
                </span>
                {/* Active underline with slide animation */}
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone icon - desktop only */}
            <motion.a
              href="tel:+919876543210"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`hidden lg:flex items-center justify-center size-9 rounded-full border transition-all duration-300 ${phoneIconClass}`}
              aria-label="Call us"
            >
              <Phone className="size-4" />
            </motion.a>

            {/* Login / Profile dropdown - desktop */}
            {mounted && user ? (
              <div className="relative hidden lg:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className={`flex items-center gap-1.5 px-3 h-9 rounded-full border text-sm font-medium transition-all duration-300 ${
                    overDarkHero
                      ? 'border-white/20 text-white hover:border-gold/40 hover:text-gold hover:bg-gold/10'
                      : 'border-border text-foreground/70 hover:border-gold/40 hover:text-gold hover:bg-gold/5'
                  } ${profileOpen ? 'border-gold/50 text-gold bg-gold/5' : ''}`}
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className="flex items-center justify-center size-6 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 text-gold text-xs font-bold ring-1 ring-gold/20">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[80px] truncate">{user.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className={`size-3.5 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="p-4 bg-gradient-to-br from-gold/10 to-transparent border-b border-border">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 text-gold font-bold ring-1 ring-gold/20">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                            <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              <Mail className="size-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                        {/* Role badge */}
                        <div className="mt-3 flex items-center gap-1.5">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-gold/15 text-gold ring-1 ring-gold/30">
                              <Shield className="size-3" /> Administrator
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20">
                              <UserCircle className="size-3" /> Customer
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        {user.role === 'admin' && (
                          <button
                            onClick={() => handleNavigate('admin-dashboard')}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-gold/10 hover:text-gold transition-colors text-left"
                          >
                            <LayoutDashboard className="size-4 text-gold" />
                            Admin Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => handleNavigate('home')}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-gold/10 hover:text-gold transition-colors text-left"
                        >
                          <UserCircle className="size-4 text-gold" />
                          My Account
                        </button>
                        {/* Logout button */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-500/10 transition-colors text-left border-t border-border mt-1 pt-3"
                        >
                          <LogOut className="size-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavigate('auth')}
                className={`hidden lg:flex items-center gap-1.5 px-4 h-9 rounded-full border text-sm font-medium transition-all duration-300 ${
                  overDarkHero
                    ? 'border-white/20 text-white hover:border-gold/40 hover:text-gold hover:bg-gold/10'
                    : 'border-border text-foreground/70 hover:border-gold/40 hover:text-gold hover:bg-gold/5'
                }`}
                aria-label="Login or Sign up"
              >
                <LogIn className="size-4" />
                Login
              </motion.button>
            )}

            {/* CTA Button - desktop with glow pulse */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="hidden lg:block"
            >
              <Button
                onClick={() => handleNavigate('calculator')}
                className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-6 shadow-[0_4px_20px_rgba(212,175,105,0.35)] transition-all duration-300 hover:shadow-[0_6px_30px_rgba(212,175,105,0.5)] relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">Book a Slot</span>
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </motion.div>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden transition-colors ${overDarkHero ? 'text-white hover:text-gold hover:bg-white/10' : 'text-foreground hover:text-gold'}`}
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
            <AnimatePresence>
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <SheetClose asChild>
                    <button
                      onClick={() => handleNavigate(item.id)}
                      className={`relative flex items-center w-full px-6 py-3.5 text-[15px] font-medium tracking-wide transition-all duration-200 hover:bg-muted/60 ${
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
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>

          {/* Mobile CTA */}
          <div className="mt-auto p-6 border-t border-border/50 space-y-3">
            {/* Logged in — profile + logout */}
            {mounted && user ? (
              <>
                {/* User info card */}
                <div className="rounded-lg border border-gold/20 bg-gold/5 p-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center size-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 text-gold font-bold ring-1 ring-gold/20">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    {user.role === 'admin' && (
                      <span className="text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-gold/15 text-gold ring-1 ring-gold/30">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Button
                    onClick={() => handleNavigate('admin-dashboard')}
                    variant="outline"
                    className="w-full h-11 font-medium tracking-wide border-gold/30 text-gold hover:bg-gold/10"
                  >
                    <LayoutDashboard className="size-4 mr-2" />
                    Admin Dashboard
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full h-11 font-medium tracking-wide border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700"
                >
                  <LogOut className="size-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              /* Logged out — login button */
              <Button
                onClick={() => handleNavigate('auth')}
                variant="outline"
                className="w-full h-11 font-medium tracking-wide border-border hover:border-gold/40 hover:text-gold"
              >
                <LogIn className="size-4 mr-2" />
                Login / Sign Up
              </Button>
            )}
            <Button
              onClick={() => handleNavigate('calculator')}
              className="w-full bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide h-12 text-[15px] shadow-[0_4px_20px_rgba(212,175,105,0.3)] transition-all duration-300 hover:shadow-[0_6px_30px_rgba(212,175,105,0.5)]"
            >
              <Phone className="size-4 mr-2" />
              Book a Slot
            </Button>
            <p className="text-xs text-muted-foreground text-center tracking-wide">
              Pick a date & time for your design consultation
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  )
}
