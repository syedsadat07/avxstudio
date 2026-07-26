'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight, Shield, CheckCircle2, Ban } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminSetupPage() {
  const { navigate } = useNavigation()
  const { setuser } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)
  const [setupAvailable, setSetupAvailable] = useState(false)

  // Check if setup is still available (no admin exists yet)
  useEffect(() => {
    fetch('/api/admin/setup')
      .then((r) => r.json())
      .then((data) => {
        setSetupAvailable(data.setupAvailable)
        setChecking(false)
      })
      .catch(() => {
        setChecking(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      })
      const data = await res.json()

      if (data.success) {
        setuser(data.user)
        navigate('admin-dashboard')
      } else {
        setError(data.error || 'Setup failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="size-10 animate-spin rounded-full border-4 border-gold/20 border-t-gold" />
      </div>
    )
  }

  // Setup locked — admin already exists
  if (!setupAvailable) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-12" aria-label="Admin setup locked">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mx-auto max-w-md w-full px-4 text-center"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/15 mb-6 mx-auto">
            <Ban className="size-10 text-red-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Setup <span className="text-red-400">Locked</span>
          </h1>
          <p className="text-white/60 mb-6">
            An admin account has already been created. For security reasons, no additional admin accounts can be created via this page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('admin-login')} className="bg-gold text-gold-foreground hover:bg-gold/90">
              Go to Admin Login
            </Button>
            <Button onClick={() => navigate('home')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Home
            </Button>
          </div>
        </motion.div>
      </section>
    )
  }

  // Setup available — show the form
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-12" aria-label="Admin setup">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]" />

      {/* Animated gold glow */}
      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,105,0.5) 0%, transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto max-w-md w-full px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo + Heading */}
          <div className="text-center mb-8">
            <button onClick={() => navigate('home')} className="inline-flex items-center gap-2.5 mb-6">
              <span className="flex items-center justify-center w-12 h-12 rounded-lg ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5">
                <img src="/auravix-mark.svg" alt="" className="w-8 h-8 object-contain" />
              </span>
              <div className="flex flex-col leading-none text-left">
                <span className="text-2xl font-bold tracking-[0.2em] text-white">AURAVIX</span>
                <span className="text-[10px] tracking-[0.35em] text-gold font-medium mt-1">BATH STUDIO</span>
              </div>
            </button>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-3">
              <CheckCircle2 className="size-4" />
              One-Time Setup
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Create <span className="text-gold">Admin</span>
            </h1>
            <p className="mt-3 text-sm text-white/50">
              Create the first admin account. After this, setup will be permanently locked.
            </p>
          </div>

          {/* Setup Card */}
          <Card className="border-gold/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white/80">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Admin Name"
                      required
                      className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="admin@example.com"
                        required
                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        required
                        className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Confirm *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        required
                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Warning notice */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200/80 flex items-start gap-2">
                  <Shield className="size-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> This is a one-time setup. After creating the admin account, this page will be permanently locked. Keep your credentials safe.
                  </span>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 shine-on-hover"
                >
                  {loading ? (
                    <>
                      <div className="size-4 mr-2 animate-spin rounded-full border-2 border-gold-foreground/30 border-t-gold-foreground" />
                      Creating admin...
                    </>
                  ) : (
                    <>
                      Create Admin Account
                      <ArrowRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <button onClick={() => navigate('home')} className="text-sm text-white/40 hover:text-gold transition-colors">
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
