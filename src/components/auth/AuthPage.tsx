'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  CheckCircle2,
  Droplet,
  Gem,
  MailCheck,
} from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { useAuth } from '@/store/auth'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Mode = 'login' | 'signup'

export function AuthPage() {
  const { navigate } = useNavigation()
  const { fetchSession } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('') // for success messages (e.g., email confirmation)

  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Clear any stale info when switching modes
  useEffect(() => {
    setError('')
    setInfo('')
  }, [mode])

  // ─── Google OAuth Login ───
  const handleGoogleLogin = async () => {
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const { error: sbError } = await supabaseBrowser.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (sbError) {
        setError(sbError.message || 'Google login failed')
        setLoading(false)
      }
      // If successful, Supabase will redirect to Google → back to the site
      // The auth store will pick up the session on return
    } catch {
      setError('Google login failed. Please try again.')
      setLoading(false)
    }
  }

  // ─── Customer Login via Supabase Auth ───
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const { data, error: sbError } = await supabaseBrowser.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })

      if (sbError) {
        setError(sbError.message || 'Login failed. Please check your credentials.')
        setLoading(false)
        return
      }

      // Success — refresh auth store to pick up Supabase session
      if (data.user) {
        await fetchSession()
        navigate('home')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Customer Signup via Supabase Auth ───
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const { data, error: sbError } = await supabaseBrowser.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: {
            full_name: signupForm.name,
            phone: signupForm.phone,
          },
        },
      })

      if (sbError) {
        setError(sbError.message || 'Signup failed.')
        setLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        setInfo('Account created! Please check your email to confirm your account, then come back to log in.')
        setMode('login')
        setLoginForm({ email: signupForm.email, password: '' })
        setLoading(false)
        return
      }

      // If session is created immediately (email confirmation disabled)
      if (data.session) {
        await fetchSession()
        navigate('home')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Droplet, text: 'Premium bathroom designs' },
    { icon: Gem, text: 'Luxury materials & fittings' },
    { icon: Shield, text: '10-year warranty' },
  ]

  return (
    <section className="min-h-screen flex relative overflow-hidden pt-16" aria-label="Login or Sign up">
      {/* Dark luxury background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]" />

      {/* Animated gold glows */}
      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,105,0.5) 0%, transparent 70%)' }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,105,0.4) 0%, transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, -25, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold"
            style={{
              left: `${15 + i * 8}%`,
              top: `${20 + (i % 5) * 15}%`,
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              boxShadow: '0 0 6px rgba(212,175,105,0.6)',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 15, 0],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 6 + (i % 4),
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side — Branding (hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-col justify-center text-white"
        >
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2.5 mb-8 w-fit"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-lg ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5">
              <img src="/auravix-mark.svg" alt="" className="w-8 h-8 object-contain" />
            </span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-2xl font-bold tracking-[0.2em] text-white">AURAVIX</span>
              <span className="text-[10px] tracking-[0.35em] text-gold font-medium mt-1">BATH STUDIO</span>
            </div>
          </button>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Transform Your Bathroom Into a{' '}
            <span className="text-gradient-gold">Luxury Sanctuary</span>
          </h1>
          <p className="mt-4 text-lg text-white/60 max-w-md">
            Join AURAVIX to book consultations, save your favorite designs, and get personalized quotations.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-4">
            {features.map((f, idx) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.15 }}
                className="flex items-center gap-3"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 ring-1 ring-gold/20">
                  <f.icon className="size-5 text-gold" />
                </span>
                <span className="text-white/80">{f.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-10 flex items-center gap-8">
            {[
              { value: '500+', label: 'Bathrooms' },
              { value: '10-Year', label: 'Warranty' },
              { value: '100+', label: 'Designs' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-gold">{s.value}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right side — Auth form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <button onClick={() => navigate('home')} className="inline-flex items-center gap-2.5">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5">
                <img src="/auravix-mark.svg" alt="" className="w-7 h-7 object-contain" />
              </span>
              <div className="flex flex-col leading-none text-left">
                <span className="text-xl font-bold tracking-[0.2em] text-white">AURAVIX</span>
                <span className="text-[10px] tracking-[0.35em] text-gold font-medium mt-1">BATH STUDIO</span>
              </div>
            </button>
          </div>

          <Card className="border-gold/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Mode toggle — animated pill switch */}
            <div className="px-6 pt-6">
              <div className="relative grid grid-cols-2 bg-white/5 rounded-full p-1 border border-white/10">
                {(['login', 'signup'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(''); setInfo('') }}
                    className={`relative z-10 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300 ${
                      mode === m ? 'text-gold-foreground' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {m === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                ))}
                {/* Animated indicator */}
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gold shadow-lg shadow-gold/30"
                  animate={{ left: mode === 'login' ? 4 : 'calc(50% + 0px)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </div>
            </div>

            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  /* ─── LOGIN FORM ─── */
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >
                    <div className="text-center mb-2">
                      <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                      <p className="text-sm text-white/50 mt-1">Sign in to your account</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white/80">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                        <Input
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          placeholder="you@example.com"
                          required
                          className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white/80">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                      >
                        {error}
                      </motion.div>
                    )}

                    {info && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 flex items-start gap-2"
                      >
                        <MailCheck className="size-4 shrink-0 mt-0.5" />
                        <span>{info}</span>
                      </motion.div>
                    )}

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

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-xs text-white/40">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full h-12 flex items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 disabled:opacity-50"
                    >
                      <svg className="size-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                  </motion.form>
                ) : (
                  /* ─── SIGNUP FORM ─── */
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSignup}
                    className="space-y-4"
                  >
                    <div className="text-center mb-2">
                      <h2 className="text-2xl font-bold text-white">Create Account</h2>
                      <p className="text-sm text-white/50 mt-1">Join AURAVIX today</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white/80">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                        <Input
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          placeholder="John Doe"
                          required
                          className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                          <Input
                            type="email"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            placeholder="you@example.com"
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
                            value={signupForm.phone}
                            onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
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
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">Confirm</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={signupForm.confirmPassword}
                            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:bg-white/10"
                          />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                      >
                        {error}
                      </motion.div>
                    )}

                    {info && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 flex items-start gap-2"
                      >
                        <MailCheck className="size-4 shrink-0 mt-0.5" />
                        <span>{info}</span>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 shine-on-hover"
                    >
                      {loading ? (
                        <>
                          <div className="size-4 mr-2 animate-spin rounded-full border-2 border-gold-foreground/30 border-t-gold-foreground" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-xs text-white/40">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full h-12 flex items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 disabled:opacity-50"
                    >
                      <svg className="size-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign up with Google
                    </button>

                    <p className="text-xs text-white/40 text-center">
                      By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Back to home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('home')}
              className="text-sm text-white/40 hover:text-gold transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="size-3.5" />
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
