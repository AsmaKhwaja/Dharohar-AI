import { useState } from 'react'
import {
  FolderKanban,
  MapPin,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpCircle,
  Search,
  LayoutGrid,
  ListFilter,
  ArrowRight,
  Plus,
  X,
} from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import { DEMO_CASES, HERITAGE_SITES } from '../data/demoData'
import type { ConservationCase, CaseStatus } from '../types'

const STATUS_CONFIG: Record<CaseStatus, { label: string; badgeClass: string; columnBg: string }> = {
  OPEN:           { label: 'Open',           badgeClass: 'text-blue-300 bg-blue-950/80 border-blue-700', columnBg: 'bg-blue-950/20 border-blue-900/30' },
  IN_PROGRESS:    { label: 'In Progress',    badgeClass: 'text-amber-300 bg-amber-950/80 border-amber-700', columnBg: 'bg-amber-950/20 border-amber-900/30' },
  PENDING_REVIEW: { label: 'Pending Review', badgeClass: 'text-purple-300 bg-purple-950/80 border-purple-700', columnBg: 'bg-purple-950/20 border-purple-900/30' },
  RESOLVED:       { label: 'Resolved',       badgeClass: 'text-emerald-300 bg-emerald-950/80 border-emerald-700', columnBg: 'bg-emerald-950/20 border-emerald-900/30' },
  ESCALATED:      { label: 'Escalated',      badgeClass: 'text-rose-300 bg-rose-950/80 border-rose-700', columnBg: 'bg-rose-950/20 border-rose-900/30' },
}

function CaseCard({ c, onAdvance }: { c: ConservationCase; onAdvance: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[c.status]

  return (
    <div className={`panel p-5 border border-slate-800 hover:border-amber-500/30 transition-all ${
      c.riskLevel === 'CRITICAL' ? 'border-rose-500/40 bg-rose-950/10' : ''
    }`}>
      <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-amber-400 font-bold">{c.caseNumber}</span>
              <RiskBadge level={c.riskLevel} size="sm" />
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${status.badgeClass}`}>
                {status.label}
              </span>
              {c.status === 'ESCALATED' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                  <ArrowUpCircle className="w-3 h-3" /> Escalated
                </span>
              )}
            </div>
            <h3 className="font-serif text-base font-bold text-slate-100 leading-snug">{c.title}</h3>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Health Score</p>
              <p className={`text-lg font-bold font-serif ${c.healthScoreAtIncident < 55 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {c.healthScoreAtIncident}
              </p>
            </div>
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {c.siteName}</span>
          <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-slate-500" /> {c.incidentType}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {new Date(c.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-fade-in text-xs text-slate-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-amber-400" /> Assigned Engineer
              </p>
              <p className="font-semibold text-slate-200">{c.assignedTo}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> Last Updated
              </p>
              <p className="font-semibold text-slate-200">{new Date(c.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Case Inspection Notes
            </p>
            <p className="leading-relaxed text-slate-300">{c.notes}</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Priority Level:</span>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i < c.priority ? (c.priority === 1 ? 'bg-rose-500' : 'bg-amber-400') : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-200">P{c.priority} / 5</span>
            </div>

            {c.status !== 'RESOLVED' && (
              <button
                onClick={() => onAdvance(c.id)}
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
              >
                Advance Status <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ConservationCases() {
  const [cases, setCases] = useState<ConservationCase[]>(DEMO_CASES)
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL')
  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newSiteId, setNewSiteId] = useState('ahmedabad-walled-city')
  const [newOfficer, setNewOfficer] = useState('ASI Conservation Officer')

  const handleAdvanceStatus = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const nextStatus: CaseStatus =
            c.status === 'OPEN' ? 'IN_PROGRESS' :
            c.status === 'IN_PROGRESS' ? 'PENDING_REVIEW' :
            c.status === 'PENDING_REVIEW' ? 'RESOLVED' :
            c.status === 'ESCALATED' ? 'IN_PROGRESS' : 'RESOLVED'
          return { ...c, status: nextStatus, updatedAt: new Date().toISOString() }
        }
        return c;
      })
    )
  }

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const site = HERITAGE_SITES.find((s) => s.id === newSiteId)!
    const newC: ConservationCase = {
      id: `case-${Date.now()}`,
      siteId: newSiteId,
      siteName: site.name,
      caseNumber: `ASI-2024-${String(cases.length + 1).padStart(3, '0')}`,
      title: newTitle,
      incidentType: 'Structural deterioration',
      riskLevel: 'HIGH',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: newOfficer,
      priority: 2,
      healthScoreAtIncident: site.healthScore,
      notes: 'Initial inspection logged via Conservation Command Center.',
    }
    setCases((prev) => [newC, ...prev])
    setShowAddModal(false)
    setNewTitle('')
  }

  const filtered = cases.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const counts = Object.fromEntries(
    (['ALL', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'PENDING_REVIEW', 'RESOLVED'] as const).map(
      (s) => [s, s === 'ALL' ? cases.length : cases.filter((c) => c.status === s).length]
    )
  )

  const criticalCount = cases.filter((c) => c.riskLevel === 'CRITICAL').length
  const escalatedCount = cases.filter((c) => c.status === 'ESCALATED').length

  const KANBAN_COLUMNS: CaseStatus[] = ['OPEN', 'IN_PROGRESS', 'PENDING_REVIEW', 'ESCALATED', 'RESOLVED']

  return (
    <div className="p-6 sm:p-8 animate-fade-in space-y-6 min-h-screen">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <FolderKanban className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              ASI & Gujarat Heritage Authority
            </span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">Conservation Cases Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {cases.length} Active Incidents & Structural Preservation Programmes
          </p>
        </div>

        {/* View Switcher & New Case Toggle */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-md">
            <Plus className="w-4 h-4" /> Log New Case
          </button>
          <button
            onClick={() => setViewMode('KANBAN')}
            className={`btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 ${
              viewMode === 'KANBAN' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : ''
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Kanban View
          </button>
          <button
            onClick={() => setViewMode('LIST')}
            className={`btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 ${
              viewMode === 'LIST' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : ''
            }`}
          >
            <ListFilter className="w-4 h-4" /> List View
          </button>
        </div>
      </div>

      {/* Add New Case Modal */}
      {showAddModal && (
        <form onSubmit={handleCreateCase} className="panel p-6 border border-amber-500/30 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-slate-100">Create Conservation Case</h3>
            <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Case Title</label>
              <input
                type="text"
                placeholder="e.g. Teen Darwaza Archway Mortar Stabilization"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-input text-xs"
                required
              />
            </div>
            <div>
              <label className="form-label">Heritage Site</label>
              <select value={newSiteId} onChange={(e) => setNewSiteId(e.target.value)} className="form-select text-xs">
                {HERITAGE_SITES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Assigned Conservation Officer</label>
            <input
              type="text"
              value={newOfficer}
              onChange={(e) => setNewOfficer(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-xs px-5 py-2.5">
              Create Case Record
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-xs px-4 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Critical Alerts Strip */}
      {(criticalCount > 0 || escalatedCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criticalCount > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse-ring flex-shrink-0" />
              <p className="text-xs text-rose-200">
                <strong className="font-bold">{criticalCount} Critical Cases</strong> require immediate intervention.
              </p>
            </div>
          )}
          {escalatedCount > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 flex items-center gap-3">
              <ArrowUpCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-200">
                <strong className="font-bold">{escalatedCount} Cases Escalated</strong> to Chief Heritage Director.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by case #, title, site, or officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'PENDING_REVIEW', 'ESCALATED', 'RESOLVED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                statusFilter === s
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {s === 'ALL' ? `All (${counts.ALL})` : `${STATUS_CONFIG[s]?.label || s} (${counts[s] ?? 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── KANBAN BOARD VIEW ───────────────────────────────────────────── */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((statusKey) => {
            const colCases = filtered.filter((c) => c.status === statusKey)
            const colConfig = STATUS_CONFIG[statusKey]
            return (
              <div key={statusKey} className={`panel p-4 border rounded-2xl space-y-3 ${colConfig.columnBg}`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colConfig.badgeClass}`}>
                    {colConfig.label}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold">{colCases.length}</span>
                </div>

                <div className="space-y-3">
                  {colCases.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 space-y-2 cursor-pointer transition-all shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">{c.caseNumber}</span>
                        <RiskBadge level={c.riskLevel} size="sm" />
                      </div>
                      <p className="text-xs font-semibold text-slate-100 line-clamp-2">{c.title}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" /> {c.siteName}
                      </p>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                        <span>{c.assignedTo.split(' ')[0]}</span>
                        {c.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleAdvanceStatus(c.id)}
                            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                          >
                            Move <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {colCases.length === 0 && (
                    <p className="text-[11px] text-slate-500 italic text-center py-6">No cases in column</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── LIST VIEW ────────────────────────────────────────────────────── */}
      {viewMode === 'LIST' && (
        <div className="space-y-4">
          {filtered.map((c) => (
            <CaseCard key={c.id} c={c} onAdvance={handleAdvanceStatus} />
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 panel border border-slate-800 text-slate-400">
              <FolderKanban className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-semibold">No cases match the selected filter or search terms.</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
