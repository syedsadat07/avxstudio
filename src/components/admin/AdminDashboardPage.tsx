'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  LogOut,
  Plus,
  Trash2,
  TrendingUp,
  Mail,
  Phone,
  Clock,
  Shield,
  X,
  CheckCircle2,
  Edit3,
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

interface Quotation {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  bathroomSize: string
  packageTier: string
  estimatedCost: number
  timeline: string | null
  status: string
  notes: string | null
  createdByName: string | null
  createdAt: string
}

interface Stats {
  bookings: number
  leads: number
  quotations: number
  adminQuotations: number
  messages: number
}

interface RecentBooking {
  id: string
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  status: string
  createdAt: string
}

interface RecentLead {
  id: string
  name: string
  email: string
  phone: string | null
  city: string | null
  source: string
  status: string
  message: string | null
  createdAt: string
}

type Tab = 'overview' | 'quotations' | 'bookings' | 'leads'

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AdminDashboardPage() {
  const { navigate } = useNavigation()
  const { user, logout, fetchSession, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [bookings, setBookings] = useState<RecentBooking[]>([])
  const [leads, setLeads] = useState<RecentLead[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  // Auth guard
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
      const [statsRes, quotRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/quotations'),
      ])
      const statsData = await statsRes.json()
      const quotData = await quotRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
        setBookings(statsData.recentBookings || [])
        setLeads(statsData.recentLeads || [])
      }
      if (quotData.success) {
        setQuotations(quotData.quotations || [])
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

  const handleDeleteQuotation = async (id: string) => {
    if (!confirm('Delete this quotation?')) return
    try {
      await fetch(`/api/admin/quotations?id=${id}`, { method: 'DELETE' })
      setQuotations((prev) => prev.filter((q) => q.id !== id))
    } catch {
      // ignore
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/quotations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))
    } catch {
      // ignore
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="size-10 animate-spin rounded-full border-4 border-gold/20 border-t-gold" />
      </div>
    )
  }

  if (user.role !== 'admin') {
    return null
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'leads', label: 'Leads', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-muted/30 pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-lg ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5">
              <Shield className="size-6 text-gold" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, <span className="text-gold font-medium">{user.name}</span>
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

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-gold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatCard label="Bookings" value={stats?.bookings ?? 0} icon={Calendar} color="gold" />
                  <StatCard label="Leads" value={stats?.leads ?? 0} icon={Users} color="blue" />
                  <StatCard label="Admin Quotations" value={stats?.adminQuotations ?? 0} icon={FileText} color="green" />
                  <StatCard label="Customer Quotations" value={stats?.quotations ?? 0} icon={TrendingUp} color="purple" />
                  <StatCard label="Messages" value={stats?.messages ?? 0} icon={Mail} color="amber" />
                </div>

                {/* Quick action */}
                <Card className="border-gold/30 bg-card overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
                  <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Create Admin Quotation</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate a custom quotation for a customer with admin-level pricing and notes
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg shadow-gold/20"
                    >
                      <Plus className="size-4 mr-1" />
                      New Quotation
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                        <Calendar className="size-4 text-gold" />
                        Recent Bookings
                      </h3>
                      {dataLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                          ))}
                        </div>
                      ) : bookings.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center">No bookings yet</p>
                      ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {bookings.map((b) => (
                            <div key={b.id} className="rounded-lg border border-border/50 p-3 hover:border-gold/30 transition-colors">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-foreground">{b.name}</span>
                                <Badge variant="outline" className="text-[10px] capitalize">{b.status}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                                <span className="flex items-center gap-1"><Mail className="size-3" />{b.email}</span>
                                <span className="flex items-center gap-1"><Clock className="size-3" />{b.preferredDate} {b.preferredTime}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                        <Users className="size-4 text-gold" />
                        Recent Leads
                      </h3>
                      {dataLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                          ))}
                        </div>
                      ) : leads.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center">No leads yet</p>
                      ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {leads.map((l) => (
                            <div key={l.id} className="rounded-lg border border-border/50 p-3 hover:border-gold/30 transition-colors">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-foreground">{l.name}</span>
                                <Badge variant="outline" className="text-[10px] capitalize">{l.status}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                                <span className="flex items-center gap-1"><Mail className="size-3" />{l.email}</span>
                                {l.phone && <span className="flex items-center gap-1"><Phone className="size-3" />{l.phone}</span>}
                              </div>
                              {l.message && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{l.message}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'quotations' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground">All Quotations</h2>
                  <Button onClick={() => setShowCreateModal(true)} className="bg-gold text-gold-foreground hover:bg-gold/90">
                    <Plus className="size-4 mr-1" />
                    New Quotation
                  </Button>
                </div>
                {dataLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : quotations.length === 0 ? (
                  <Card className="border-dashed border-border">
                    <CardContent className="p-12 text-center">
                      <FileText className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No quotations yet. Create your first one!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {quotations.map((q, idx) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="border-border/50 hover:border-gold/30 transition-colors">
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-foreground">{q.customerName}</span>
                                  <Badge variant="outline" className={`text-[10px] capitalize ${
                                    q.status === 'accepted' ? 'border-green-500/40 text-green-600 bg-green-500/5' :
                                    q.status === 'rejected' ? 'border-red-500/40 text-red-600 bg-red-500/5' :
                                    q.status === 'sent' ? 'border-blue-500/40 text-blue-600 bg-blue-500/5' :
                                    'border-border text-muted-foreground'
                                  }`}>
                                    {q.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                                  <span className="flex items-center gap-1"><Mail className="size-3" />{q.customerEmail}</span>
                                  {q.customerPhone && <span className="flex items-center gap-1"><Phone className="size-3" />{q.customerPhone}</span>}
                                  <span>Bathroom: {q.bathroomSize}</span>
                                  <span>Package: {q.packageTier}</span>
                                </div>
                                {q.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">📝 {q.notes}</p>}
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-lg font-bold text-gold">{formatINR(q.estimatedCost)}</div>
                                  <div className="text-[10px] text-muted-foreground">{formatDate(q.createdAt)}</div>
                                </div>
                                <Select value={q.status} onValueChange={(v) => handleStatusChange(q.id, v)}>
                                  <SelectTrigger className="w-[110px] h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  onClick={() => handleDeleteQuotation(q.id)}
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">All Bookings</h2>
                {dataLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <Card className="border-dashed border-border">
                    <CardContent className="p-12 text-center">
                      <Calendar className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No bookings yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <Card key={b.id} className="border-border/50">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-foreground">{b.name}</span>
                                <Badge variant="outline" className="text-[10px] capitalize">{b.status}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="flex items-center gap-1"><Mail className="size-3" />{b.email}</span>
                                <span className="flex items-center gap-1"><Phone className="size-3" />{b.phone}</span>
                                <span className="flex items-center gap-1"><Clock className="size-3" />{b.preferredDate} {b.preferredTime}</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'leads' && (
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">All Leads</h2>
                {dataLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : leads.length === 0 ? (
                  <Card className="border-dashed border-border">
                    <CardContent className="p-12 text-center">
                      <Users className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No leads yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {leads.map((l) => (
                      <Card key={l.id} className="border-border/50">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-foreground">{l.name}</span>
                                <Badge variant="outline" className="text-[10px] capitalize">{l.status}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="flex items-center gap-1"><Mail className="size-3" />{l.email}</span>
                                {l.phone && <span className="flex items-center gap-1"><Phone className="size-3" />{l.phone}</span>}
                                {l.city && <span>{l.city}</span>}
                                <span className="capitalize">Source: {l.source}</span>
                              </div>
                              {l.message && <p className="text-xs text-muted-foreground mt-1">{l.message}</p>}
                            </div>
                            <div className="text-xs text-muted-foreground">{formatDate(l.createdAt)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create Quotation Modal */}
      <CreateQuotationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false)
          loadData()
          setActiveTab('quotations')
        }}
        adminName={user.name}
      />
    </div>
  )
}

// ─── Stat Card sub-component ────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Calendar; color: string }) {
  const colorMap: Record<string, string> = {
    gold: 'text-gold bg-gold/10',
    blue: 'text-blue-600 bg-blue-500/10',
    green: 'text-green-600 bg-green-500/10',
    purple: 'text-purple-600 bg-purple-500/10',
    amber: 'text-amber-600 bg-amber-500/10',
  }
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="border-border/50 hover:border-gold/30 transition-colors">
        <CardContent className="p-4 sm:p-5">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colorMap[color]} mb-3`}>
            <Icon className="size-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Create Quotation Modal ─────────────────────────────────────────────────

function CreateQuotationModal({
  open,
  onClose,
  onSuccess,
  adminName,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  adminName: string
}) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bathroomSize: 'Medium (40-80 sq ft)',
    packageTier: 'Premium',
    estimatedCost: '',
    timeline: '15-20 working days',
    status: 'draft',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.customerName || !form.customerEmail || !form.estimatedCost) {
      setError('Name, email, and estimated cost are required')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, createdByName: adminName }),
      })
      const data = await res.json()
      if (data.success) {
        onSuccess()
        // Reset form
        setForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          bathroomSize: 'Medium (40-80 sq ft)',
          packageTier: 'Premium',
          estimatedCost: '',
          timeline: '15-20 working days',
          status: 'draft',
          notes: '',
        })
      } else {
        setError(data.error || 'Failed to create quotation')
      }
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl shadow-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 bg-gold rounded-full" />
                <h2 className="text-lg font-bold text-foreground">Create Admin Quotation</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Customer info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer Name *</Label>
                  <Input
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer Email *</Label>
                  <Input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer Phone</Label>
                  <Input
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Estimated Cost (₹) *</Label>
                  <Input
                    type="number"
                    value={form.estimatedCost}
                    onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
                    placeholder="110000"
                    required
                  />
                </div>
              </div>

              {/* Project details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Bathroom Size</Label>
                  <Select value={form.bathroomSize} onValueChange={(v) => setForm({ ...form, bathroomSize: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small (< 40 sq ft)">Small (&lt; 40 sq ft)</SelectItem>
                      <SelectItem value="Medium (40-80 sq ft)">Medium (40-80 sq ft)</SelectItem>
                      <SelectItem value="Large (80-120 sq ft)">Large (80-120 sq ft)</SelectItem>
                      <SelectItem value="Extra Large (120+ sq ft)">Extra Large (120+ sq ft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Package Tier</Label>
                  <Select value={form.packageTier} onValueChange={(v) => setForm({ ...form, packageTier: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Essential">Essential</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Timeline</Label>
                  <Input
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    placeholder="15-20 working days"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Admin Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Special requirements, customizations, pricing rationale..."
                  rows={3}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-gold text-gold-foreground hover:bg-gold/90">
                  {submitting ? (
                    <>
                      <div className="size-4 mr-2 animate-spin rounded-full border-2 border-gold-foreground/30 border-t-gold-foreground" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4 mr-1" />
                      Create Quotation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
