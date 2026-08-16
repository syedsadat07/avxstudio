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
  Edit3,
  X,
  CheckCircle2,
  Package,
  FileText,
  Lock,
  Search,
  Save,
  Download,
  Copy,
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

type Tab = 'overview' | 'bookings' | 'materials' | 'quotations'

interface Material {
  id: string
  name: string
  category: string
  brand: string | null
  unit: string
  price: number
  description: string | null
  active: boolean
}

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

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return s
  }
}

const CATEGORIES = ['tiles', 'vanity', 'shower', 'faucet', 'accessories', 'sanitary', 'lighting', 'other']
const UNITS = ['piece', 'sqft', 'set', 'meter', 'pair']

export function AdminDashboardPage() {
  const { navigate } = useNavigation()
  const { user, logout, fetchSession, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [quotations, setQuotations] = useState<Record<string, unknown>[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => { fetchSession() }, [fetchSession])

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) navigate('admin-login')
  }, [user, loading, navigate])

  const loadData = useCallback(async () => {
    setDataLoading(true)
    try {
      const [statsRes, matRes, quotRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/materials'),
        fetch('/api/admin/generate-quotation'),
      ])
      const statsData = await statsRes.json()
      const matData = await matRes.json()
      const quotData = await quotRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
        setBookings(statsData.recentBookings || [])
      }
      if (matData.success) setMaterials(matData.materials || [])
      if (quotData.success) setQuotations(quotData.quotations || [])
    } catch { /* ignore */ }
    finally { setDataLoading(false) }
  }, [])

  useEffect(() => {
    if (user && user.role === 'admin') loadData()
  }, [user, loadData])

  const handleLogout = async () => { await logout(); navigate('home') }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="size-10 animate-spin rounded-full border-4 border-gold/20 border-t-gold" />
      </div>
    )
  }
  if (user.role !== 'admin') return null

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'quotations', label: 'Quotations', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-xl ring-1 ring-gold/30 bg-gradient-to-br from-gold/15 to-gold/5">
              <LayoutDashboard className="size-6 text-gold" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Welcome, <span className="text-gold font-medium">{user.name}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('home')} variant="outline" size="sm" className="border-border hover:border-gold/40 hover:text-gold">View Site</Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-red-500/30 text-red-600 hover:bg-red-500/10"><LogOut className="size-4 mr-1" />Logout</Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-gold' : 'text-muted-foreground hover:text-foreground'}`}>
              <tab.icon className="size-4" />{tab.label}
              {activeTab === tab.id && <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Bookings" value={stats?.bookings ?? 0} icon={Calendar} />
                  <StatCard label="Total Leads" value={stats?.leads ?? 0} icon={Users} />
                  <StatCard label="Materials" value={materials.length} icon={Package} />
                  <StatCard label="Quotations" value={quotations.length} icon={FileText} />
                </div>
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Calendar className="size-5 text-gold" />Recent Bookings</h2>
                    {dataLoading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div> :
                     bookings.length === 0 ? <p className="text-muted-foreground py-8 text-center">No bookings yet</p> :
                     <div className="space-y-3 max-h-96 overflow-y-auto">
                       {bookings.slice(0, 5).map((b, i) => (
                         <div key={i} className="rounded-lg border border-border/50 p-3 hover:border-gold/30 transition-colors">
                           <div className="flex items-center justify-between gap-2">
                             <span className="text-sm font-semibold text-foreground">{b.name}</span>
                             <Badge variant="outline" className="text-[10px] capitalize">{b.status}</Badge>
                           </div>
                           <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                             <span>{b.email}</span><span>{b.phone}</span>
                             <span>{b.preferredDate} {b.preferredTime}</span>
                           </div>
                         </div>
                       ))}
                     </div>}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'bookings' && (
              <Card className="border-border/50 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Calendar className="size-5 text-gold" />All Bookings</h2>
                  {dataLoading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />)}</div> :
                   bookings.length === 0 ? <div className="text-center py-12"><Calendar className="size-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No bookings yet</p></div> :
                   <div className="space-y-3 max-h-[600px] overflow-y-auto">
                     {bookings.map((b, i) => (
                       <div key={i} className="rounded-xl border border-border/50 p-4 hover:border-gold/30 transition-colors">
                         <div className="flex items-start justify-between gap-3">
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                               <span className="font-semibold text-foreground">{b.name}</span>
                               <Badge variant="outline" className={`text-[10px] capitalize ${b.status === 'confirmed' ? 'border-green-500/40 text-green-600' : 'border-amber-500/40 text-amber-600'}`}>{b.status}</Badge>
                             </div>
                             <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                               <span>{b.email}</span><span>{b.phone}</span>
                               <span>{b.preferredDate} {b.preferredTime}</span>
                               {b.address && <span>{b.address}</span>}
                             </div>
                             {b.budgetRange && <div className="text-xs text-gold mt-1">Budget: {b.budgetRange}</div>}
                           </div>
                           <div className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(b.createdAt)}</div>
                         </div>
                       </div>
                     ))}
                   </div>}
                </CardContent>
              </Card>
            )}

            {activeTab === 'materials' && <MaterialsManager materials={materials} setMaterials={setMaterials} />}
            {activeTab === 'quotations' && <QuotationBuilder materials={materials} quotations={quotations} setQuotations={setQuotations} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── StatCard ───
function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Calendar }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <Card className="border-border/50 hover:border-gold/30 transition-colors">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 text-gold mb-3"><Icon className="size-5" /></div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Materials Manager ───
function MaterialsManager({ materials, setMaterials }: { materials: Material[]; setMaterials: (m: Material[]) => void }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Material | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [form, setForm] = useState({ name: '', category: 'tiles', brand: '', unit: 'piece', price: '', description: '' })

  const filtered = materials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || (m.brand?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchCat = filterCat === 'all' || m.category === filterCat
    return matchSearch && matchCat
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        const res = await fetch('/api/admin/materials', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...form, price: parseFloat(form.price) }) })
        const data = await res.json()
        if (data.success) setMaterials(materials.map(m => m.id === editing.id ? data.material : m))
      } else {
        const res = await fetch('/api/admin/materials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: parseFloat(form.price) }) })
        const data = await res.json()
        if (data.success) setMaterials([...materials, data.material])
      }
      setShowForm(false); setEditing(null)
      setForm({ name: '', category: 'tiles', brand: '', unit: 'piece', price: '', description: '' })
    } catch { /* ignore */ }
  }

  const handleEdit = (m: Material) => {
    setEditing(m)
    setForm({ name: m.name, category: m.category, brand: m.brand || '', unit: m.unit, price: String(m.price), description: m.description || '' })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material?')) return
    await fetch(`/api/admin/materials?id=${id}`, { method: 'DELETE' })
    setMaterials(materials.filter(m => m.id !== id))
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Package className="size-5 text-gold" />Materials ({materials.length})</h2>
          <Button onClick={() => { setEditing(null); setForm({ name: '', category: 'tiles', brand: '', unit: 'piece', price: '', description: '' }); setShowForm(true) }} className="bg-gold text-gold-foreground hover:bg-gold/90"><Plus className="size-4 mr-1" />Add Material</Button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Materials List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12"><Package className="size-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No materials found. Add your first material!</p></div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filtered.map(m => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 p-3 hover:border-gold/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">{m.category}</Badge>
                    {m.brand && <span className="text-xs text-muted-foreground">{m.brand}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formatINR(m.price)} / {m.unit}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button onClick={() => handleEdit(m)} variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-gold"><Edit3 className="size-4" /></Button>
                  <Button onClick={() => handleDelete(m.id)} variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-red-600"><Trash2 className="size-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="bg-card rounded-xl shadow-2xl border border-border max-w-lg w-full overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-bold text-foreground">{editing ? 'Edit Material' : 'Add New Material'}</h3>
                  <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                    <div className="space-y-1"><Label className="text-xs">Category *</Label><Select value={form.category} onValueChange={v => setForm({...form, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label className="text-xs">Brand</Label><Input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} /></div>
                    <div className="space-y-1"><Label className="text-xs">Unit</Label><Select value={form.unit} onValueChange={v => setForm({...form, unit: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label className="text-xs">Price (₹) *</Label><Input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
                  </div>
                  <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} /></div>
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                    <Button type="submit" className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"><Save className="size-4 mr-1" />{editing ? 'Update' : 'Add'} Material</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// ─── Quotation Builder ───
function QuotationBuilder({ materials, quotations, setQuotations }: { materials: Material[]; quotations: Record<string, unknown>[]; setQuotations: (q: Record<string, unknown>[]) => void }) {
  const [showBuilder, setShowBuilder] = useState(false)
  const [showQuotationPassword, setShowQuotationPassword] = useState(false)
  const [quotationPassword, setQuotationPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '', bathroomArea: '' })
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState('')
  const [generatedQuote, setGeneratedQuote] = useState<Record<string, unknown> | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const filteredMats = materials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || m.category === filterCat
    return matchSearch && matchCat
  })

  const selectedList = materials.filter(m => selectedMaterials[m.id] > 0)
  const subtotal = selectedList.reduce((sum, m) => sum + m.price * (selectedMaterials[m.id] || 0), 0)
  const gst = subtotal * 0.18
  const total = subtotal + gst

  const toggleMaterial = (id: string) => {
    setSelectedMaterials(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = 1
      return next
    })
  }

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { setSelectedMaterials(prev => { const n = { ...prev }; delete n[id]; return n }); return }
    setSelectedMaterials(prev => ({ ...prev, [id]: qty }))
  }

  const handleGenerate = async () => {
    setPasswordError('')
    if (!quotationPassword) { setPasswordError('Please enter the quotation password'); return }
    if (selectedList.length === 0) { setPasswordError('Select at least one material'); return }
    if (!customer.name || !customer.email) { setPasswordError('Customer name and email are required'); return }

    try {
      const matData = selectedList.map(m => ({ id: m.id, name: m.name, category: m.category, brand: m.brand, unit: m.unit, price: m.price, quantity: selectedMaterials[m.id] }))
      const res = await fetch('/api/admin/generate-quotation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...customer, materials: matData, quotationPassword, notes, gstRate: 18 }),
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedQuote(data.quotation)
        setQuotations([data.quotation, ...quotations])
        setShowQuotationPassword(false)
        setShowBuilder(false)
        // Reset
        setSelectedMaterials({}); setCustomer({ name: '', email: '', phone: '', address: '', bathroomArea: '' }); setNotes(''); setQuotationPassword('')
      } else {
        setPasswordError(data.error || 'Failed to generate quotation')
      }
    } catch { setPasswordError('Network error. Please try again.') }
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><FileText className="size-5 text-gold" />Generated Quotations ({quotations.length})</h2>
            <Button onClick={() => setShowBuilder(true)} className="bg-gold text-gold-foreground hover:bg-gold/90"><Plus className="size-4 mr-1" />New Quotation</Button>
          </div>

          {quotations.length === 0 ? (
            <div className="text-center py-12"><FileText className="size-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No quotations generated yet</p></div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {quotations.map((q, i) => (
                <div key={i} className="rounded-lg border border-border/50 p-3 hover:border-gold/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-gold">{q.quoteNumber as string}</span>
                        <Badge variant="outline" className="text-[10px] capitalize">{q.status as string}</Badge>
                      </div>
                      <div className="text-sm font-medium text-foreground">{q.customerName as string}</div>
                      <div className="text-xs text-muted-foreground">{q.customerEmail as string}</div>
                      <div className="text-sm font-bold text-gold mt-1">{formatINR(q.totalAmount as number)}</div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(q.createdAt as string)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quotation Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowBuilder(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="bg-card rounded-xl shadow-2xl border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
                <h3 className="font-bold text-foreground flex items-center gap-2"><FileText className="size-5 text-gold" />Quotation Builder</h3>
                <button onClick={() => setShowBuilder(false)} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
              </div>

              <div className="p-4 space-y-4">
                {/* Customer Details */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Customer Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Name *" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
                    <Input placeholder="Email *" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} />
                    <Input placeholder="Phone" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
                    <Input placeholder="Bathroom Area (e.g. 60 sqft)" value={customer.bathroomArea} onChange={e => setCustomer({...customer, bathroomArea: e.target.value})} />
                    <Input placeholder="Address" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} className="col-span-2" />
                  </div>
                </div>

                {/* Material Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Select Materials</h4>
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
                    </div>
                    <Select value={filterCat} onValueChange={setFilterCat}>
                      <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">All</SelectItem>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                    {filteredMats.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No materials found. Add materials first.</p> :
                    filteredMats.map(m => (
                      <div key={m.id} className={`flex items-center gap-2 p-2 border-b border-border/30 last:border-0 cursor-pointer hover:bg-muted/50 ${selectedMaterials[m.id] ? 'bg-gold/5' : ''}`} onClick={() => toggleMaterial(m.id)}>
                        <input type="checkbox" checked={!!selectedMaterials[m.id]} onChange={() => {}} className="accent-gold" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground">{m.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{formatINR(m.price)}/{m.unit}</span>
                        </div>
                        {selectedMaterials[m.id] && (
                          <input type="number" min="1" value={selectedMaterials[m.id]} onClick={e => e.stopPropagation()} onChange={e => updateQty(m.id, parseInt(e.target.value) || 0)} className="w-16 h-8 text-sm border border-border rounded px-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Materials Summary */}
                {selectedList.length > 0 && (
                  <div className="rounded-lg border border-gold/20 bg-gold/5 p-3">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Summary</h4>
                    <div className="space-y-1">
                      {selectedList.map(m => (
                        <div key={m.id} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{m.name} × {selectedMaterials[m.id]}</span>
                          <span className="text-foreground">{formatINR(m.price * selectedMaterials[m.id])}</span>
                        </div>
                      ))}
                      <div className="border-t border-gold/20 pt-1 mt-1">
                        <div className="flex justify-between text-xs"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatINR(subtotal)}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">{formatINR(gst)}</span></div>
                        <div className="flex justify-between text-sm font-bold mt-1"><span className="text-foreground">Total</span><span className="text-gold">{formatINR(total)}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <Textarea placeholder="Notes (optional)..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />

                {/* Quotation Password */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <Label className="text-xs font-medium flex items-center gap-1 mb-2"><Lock className="size-3" />Quotation Password (required)</Label>
                  <Input type="password" placeholder="Enter quotation password" value={quotationPassword} onChange={e => setQuotationPassword(e.target.value)} className="h-9" />
                  <p className="text-[10px] text-muted-foreground mt-1">This is a separate password required to generate quotations. Default: auravix-quote-2025</p>
                </div>

                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowBuilder(false)} className="flex-1">Cancel</Button>
                  <Button onClick={handleGenerate} className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"><FileText className="size-4 mr-1" />Generate Quotation</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Quotation Display */}
      <AnimatePresence>
        {generatedQuote && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setGeneratedQuote(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="bg-card rounded-xl shadow-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-6 text-center relative">
                <button onClick={() => setGeneratedQuote(null)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X className="size-5" /></button>
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gold/15 mb-3 mx-auto"><CheckCircle2 className="size-7 text-gold" /></div>
                <h2 className="text-xl font-bold text-white">Quotation Generated!</h2>
                <p className="text-gold font-mono text-lg mt-1">{generatedQuote.quoteNumber as string}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium text-foreground">{generatedQuote.customerName as string}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground">{generatedQuote.customerEmail as string}</span></div>
                  <div><span className="text-muted-foreground">Subtotal:</span> <span className="font-medium text-foreground">{formatINR(generatedQuote.subtotal as number)}</span></div>
                  <div><span className="text-muted-foreground">GST (18%):</span> <span className="font-medium text-foreground">{formatINR(generatedQuote.gstAmount as number)}</span></div>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-base font-bold text-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-gold">{formatINR(generatedQuote.totalAmount as number)}</span>
                </div>
                <Button onClick={() => window.print()} className="w-full bg-gold text-gold-foreground hover:bg-gold/90"><Download className="size-4 mr-1" />Print / Save as PDF</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
