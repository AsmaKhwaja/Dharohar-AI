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
} from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import { DEMO_CASES } from '../data/demoData'
import type { ConservationCase, CaseStatus } from '../types'

const STATUS_CONFIG: Record<CaseStatus, { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'text-blue-400 bg-blue-900/20 border-blue-700/30' },
  IN_PROGRESS: { label: 'In Progress', className: 'text-amber-400 bg-amber-900/20 border-amber-700/30' },
  PENDING_REVIEW: { label: 'Pending Review', className: 'text-purple-400 bg-purple-900/20 border-purple-700/30' },
  RESOLVED: { label: 'Resolved', className: 'text-emerald-400 bg-emerald-900/20 border-emerald-700/30' },
  ESCALATED: { label: 'Escalated', className: 'text-red-400 bg-red-900/20 border-red-700/30' },
}

function CaseCard({ c }: { c: ConservationCase }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[c.status]

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 ${
      c.riskLevel === 'CRITICAL' ? 'border-red-900/40' : ''
    }`}>
      <div
        className="p-5 cursor-pointer hover:bg-stone-900/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono text-stone-500">{c.caseNumber}</span>
              <RiskBadge level={c.riskLevel} size="sm" />
              <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border ${status.className}`}>
                {status.label}
              </span>
              {c.status === 'ESCALATED' && (
                <span className="flex items-center gap-1 text-[10px] text-red-400">
                  <ArrowUpCircle className="w-3 h-3" />
                  ESCALATED
                </span>
              )}
            </div>
            <h3 className="font-semibold text-stone-100 text-sm leading-snug">{c.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-stone-500">Health</p>
              <p className={`text-base font-bold font-serif ${c.healthScoreAtIncident < 55 ? 'text-orange-400' : 'text-yellow-400'}`}>
                {c.healthScoreAtIncident}
              </p>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-stone-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-500 flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {c.siteName}
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {c.incidentType}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-stone-800/50 pt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-500 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Assigned To
              </p>
              <p className="text-xs text-stone-300">{c.assignedTo}</p>
            </div>
            <div>
              <p className="text-xs text-stone-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Last Updated
              </p>
              <p className="text-xs text-stone-300">{new Date(c.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-stone-500 mb-1.5 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Case Notes
            </p>
            <p className="text-xs text-stone-400 leading-relaxed bg-stone-900/50 p-3 rounded-lg border border-stone-800/50">
              {c.notes}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-stone-600">Priority level:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < c.priority
                      ? c.priority === 1
                        ? 'bg-red-500'
                        : c.priority <= 2
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                      : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-500">Priority {c.priority}/5</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ConservationCases() {
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL')

  const filtered = statusFilter === 'ALL'
    ? DEMO_CASES
    : DEMO_CASES.filter((c) => c.status === statusFilter)

  const counts = Object.fromEntries(
    (['ALL', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'PENDING_REVIEW', 'RESOLVED'] as const).map(
      (s) => [s, s === 'ALL' ? DEMO_CASES.length : DEMO_CASES.filter((c) => c.status === s).length]
    )
  )

  const criticalCount = DEMO_CASES.filter((c) => c.riskLevel === 'CRITICAL').length
  const escalatedCount = DEMO_CASES.filter((c) => c.status === 'ESCALATED').length

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <FolderKanban className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider font-medium">Active Conservation Programme</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-100">Conservation Cases</h1>
        <p className="text-stone-500 mt-1.5 text-sm">
          {DEMO_CASES.length} active cases across Gujarat heritage sites
        </p>
      </div>

      {/* Alert summary */}
      {(criticalCount > 0 || escalatedCount > 0) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {criticalCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-900/15 border border-red-700/30 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-ring" />
              <p className="text-sm text-red-300">
                <span className="font-bold">{criticalCount}</span> critical risk case{criticalCount !== 1 ? 's' : ''} requiring immediate attention
              </p>
            </div>
          )}
          {escalatedCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-orange-900/15 border border-orange-700/30 rounded-xl">
              <ArrowUpCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <p className="text-sm text-orange-300">
                <span className="font-bold">{escalatedCount}</span> case{escalatedCount !== 1 ? 's' : ''} escalated to senior conservation authority
              </p>
            </div>
          )}
        </div>
      )}

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider mr-1">Filter:</span>
        {(['ALL', 'ESCALATED', 'OPEN', 'IN_PROGRESS', 'PENDING_REVIEW', 'RESOLVED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === s
                ? 'bg-sand-500 text-stone-950'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            {s === 'ALL' ? `All (${counts.ALL})` : `${STATUS_CONFIG[s]?.label || s} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Cases */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <CaseCard key={c.id} c={c} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-stone-600">
            <FolderKanban className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No cases match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
