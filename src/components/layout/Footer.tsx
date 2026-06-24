'use client'

import { Instagram, Facebook, Twitter, Pin, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useNavigation, type PageId } from '@/store/navigation'
import { toast } from '@/hooks/use-toast'

const quickLinks: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'packages', label: 'Packages' },
  { id: 'calculator', label: 'Calculator' },
]

const services = [
  'Bathroom Renovation',
  'Modular Bathrooms',
  'Luxury Packages',
  'Consultation',
  'Smart Bathrooms',
]

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Pin, href: '#', label: 'Pinterest' },
]

export function Footer() {
  const { navigate } = useNavigation()

  return (
    <footer className="bg-primary text-primary-foreground" role="contentinfo">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <button
              onClick={() => navigate('home')}
              className="group flex flex-col leading-none transition-opacity hover:opacity-80 mb-5"
              aria-label="Go to homepage"
            >
              <span className="text-2xl font-bold tracking-[0.2em] text-gold">
                AURAVIX
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.35em] text-primary-foreground/60 font-medium mt-1">
                BATH STUDIO
              </span>
            </button>

            {/* Description */}
            <p className="text-sm leading-relaxed text-primary-foreground/60 max-w-xs mb-6">
              Transforming bathrooms into luxury sanctuaries. Premium renovation services with expert craftsmanship.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex items-center justify-center size-9 rounded-full border border-primary-foreground/15 text-primary-foreground/50 hover:text-gold hover:border-gold/50 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-gold mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3" role="list">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => navigate(link.id)}
                    className="text-sm text-primary-foreground/60 hover:text-gold transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-gold mb-5">
              Services
            </h3>
            <ul className="space-y-3" role="list">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-sm text-primary-foreground/60">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-gold mb-5">
              Contact
            </h3>
            <ul className="space-y-4" role="list">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-gold mt-0.5 shrink-0" />
                <span className="text-sm text-primary-foreground/60 leading-relaxed">
                  123 Design District, Mumbai, India
                </span>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-start gap-3 group"
                >
                  <Phone className="size-4 text-gold mt-0.5 shrink-0" />
                  <span className="text-sm text-primary-foreground/60 group-hover:text-gold transition-colors duration-300">
                    +91 98765 43210
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@auravix.com"
                  className="flex items-start gap-3 group"
                >
                  <Mail className="size-4 text-gold mt-0.5 shrink-0" />
                  <span className="text-sm text-primary-foreground/60 group-hover:text-gold transition-colors duration-300">
                    hello@auravix.com
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="size-4 text-gold mt-0.5 shrink-0" />
                <span className="text-sm text-primary-foreground/60">
                  Mon-Sat: 9AM - 7PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-primary-foreground/40 tracking-wide">
              © 2025 AURAVIX Bath Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => toast({ title: 'Privacy Policy', description: 'This page is being prepared. Please contact us for any questions.' })}
                className="text-xs text-primary-foreground/40 hover:text-gold transition-colors duration-300 tracking-wide"
              >
                Privacy Policy
              </button>
              <span className="text-primary-foreground/20">|</span>
              <button
                onClick={() => toast({ title: 'Terms of Service', description: 'This page is being prepared. Please contact us for any questions.' })}
                className="text-xs text-primary-foreground/40 hover:text-gold transition-colors duration-300 tracking-wide"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
