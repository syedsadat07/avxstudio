'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Plus,
  Trash2,
  Mail,
  Phone,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  TrendingUp,
  FileText,
} from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  status: string
  createdAt: string
  address?: string
  budgetRange?: string
}

interface Stats {
  bookings: number
  leads: number
  quotations: number
  adminQuotations: number
  messages: number
}

type Tab = 'bookings' | 'overview'

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return s
  }
}

export function AdminDashboardPage() {
  const { navigate } = useNavigation()
  const { user, logout, fetchSession, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('admin-login')
    }
  }, [user, loading, navigate])

  const loadData = useCallback(async () => {
    setDataLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setBookings(data.recentBookings || [])
      }
    } catch {
      // ignore
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData()
    }
  }, [user, loadData])

  const handleLogout = async () => {
    await logout()
    navigate('home')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="size-10 animate-spin rounded-full border-4 border-gold/20 border-t-gold" />
      </div>
    )
  }

  if (user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pt-20 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-xl ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5">
              <LayoutDashboard className="size-6 text-gold" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, <span className="text-gold font-medium">{user.name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('home')} variant="outline" size="sm" className="border-border hover:border-gold/40 hover:text-gold">
              View Site
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700">
              <LogOut className="size-4 mr-1" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Bookings" value={stats?.bookings ?? 0} icon={Calendar} />
          <StatCard label="Total Leads" value={stats?.leads ?? 0} icon={Users} />
          <StatCard label="Quotations" value={stats?.adminQuotations ?? 0} icon={FileText} />
          <StatCard label="Messages" value={stats?.messages ?? 0} icon={Mail} />
        </div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border/50 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Calendar className="size-5 text-gold" />
                  All Bookings
                </h2>
                <Badge variant="outline" className="text-gold border-gold/30">
                  {bookings.length} total
                </Badge>
              </div>

              {dataLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No bookings yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    When customers book a consultation, they&apos;ll appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {bookings.map((b, idx) => (
                    <motion.div
                      key={b.id + idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="rounded-xl border border-border/50 p-4 hover:border-gold/30 transition-colors bg-card"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">{b.name}</span>
                            <Badge variant="outline" className={`text-[10px] capitalize ${
                              b.status === 'confirmed' ? 'border-green-500/40 text-green-600 bg-green-500/5' :
                              b.status === 'pending' ? 'border-amber-500/40 text-amber-600 bg-amber-500/5' :
                              'border-border text-muted-foreground'
                            }`}>
                              {b.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="flex items-center gap-1"><Mail className="size-3" />{b.email}</span>
                            <span className="flex items-center gap-1"><Phone className="size-3" />{b.phone}</span>
                          </div>
                          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <span className="flex items-center gap-1"><Calendar className="size-3" />{b.preferredDate}</span>
                            <span className="flex items-center gap-1"><Clock className="size-3" />{b.preferredTime}</span>
                            {b.address && <span className="flex items-center gap-1"><MapPin className="size-3" />{b.address}</span>}
                          </div>
                          {b.budgetRange && (
                            <div className="text-xs text-gold mt-1 flex items-center gap-1">
                              <TrendingUp className="size-3" />Budget: {b.budgetRange}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(b.createdAt)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Calendar }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="border-border/50 hover:border-gold/30 transition-colors">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 text-gold mb-3">
            <Icon className="size-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
