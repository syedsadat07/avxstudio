'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, Eye, EyeOff, Shield, User, Sparkles } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminLoginPage() {
  const { navigate } = useNavigation()
  const { setuser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Pre-fill demo credentials on mount for convenience
    setEmail('admin@auravix.com')
    setPassword('admin123')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        setuser(data.user)
        if (data.user.role === 'admin') {
          navigate('admin-dashboard')
        } else {
          setError('This account is a customer account. Admin access required.')
        }
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillAdmin = () => {
    setEmail('admin@auravix.com')
    setPassword('admin123')
  }

  const fillCustomer = () => {
    setEmail('customer@example.com')
    setPassword('customer123')
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-12" aria-label="Admin login">
      {/* Dark luxury background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]" />

      {/* Animated gold glow */}
      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,105,0.5) 0%, transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,105,0.4) 0%, transparent 70%)' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto max-w-md w-full px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-2.5 mb-6"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-lg ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5">
                <img src="/auravix-mark.svg" alt="" className="w-8 h-8 object-contain" />
              </span>
              <div className="flex flex-col leading-none text-left">
                <span className="text-2xl font-bold tracking-[0.2em] text-white">AURAVIX</span>
                <span className="text-[10px] tracking-[0.35em] text-gold font-medium mt-1">BATH STUDIO</span>
              </div>
            </button>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-3">
              <Shield className="size-4" />
              Secure Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Admin <span className="text-gold">Login</span>
            </h1>
            <p className="mt-3 text-sm text-white/50">
              Sign in to manage quotations, bookings, and leads
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-gold/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-white/80">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@auravix.com"
                      required
                      className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white/80">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 shine-on-hover"
                >
                  {loading ? (
                    <>
                      <div className="size-4 mr-2 animate-spin rounded-full border-2 border-gold-foreground/30 border-t-gold-foreground" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3 text-xs text-white/40">
                  <Sparkles className="size-3 text-gold" />
                  Demo Credentials
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={fillAdmin}
                    className="text-left rounded-lg border border-gold/20 bg-gold/5 px-3 py-2.5 hover:bg-gold/10 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gold">
                      <Shield className="size-3" /> Admin
                    </div>
                    <div className="text-[10px] text-white/40 mt-1 group-hover:text-white/60 transition-colors">
                      admin@auravix.com
                    </div>
                  </button>
                  <button
                    onClick={fillCustomer}
                    className="text-left rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                      <User className="size-3" /> Customer
                    </div>
                    <div className="text-[10px] text-white/40 mt-1 group-hover:text-white/60 transition-colors">
                      customer@example.com
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('home')}
              className="text-sm text-white/40 hover:text-gold transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
