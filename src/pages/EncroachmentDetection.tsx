import { useState } from 'react'
import {
  AlertOctagon,
  MapPin,
  Clock,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Scale,
  Shield,
  Eye,
  Building2,
  Zap,
} from 'lucide-react'
import { DEMO_ENCROACHMENT_RECORDS, HERITAGE_SITES } from '../data/demoData'
import { runEncroachmentAgent, type EncroachmentProgressCallback } from '../services/encroachmentAgent'
import type { EncroachmentRecord, EncroachmentAssessment, AgentStep } from '../types'
import AgentWorkflow from '../components/AgentWorkflow'
import { IS_DEMO_MODE } from '../services/graniteService'

// ─── colour helpers ────────────────────────────────────────────────────────────

const SEV_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  CRITICAL:    { text: '#ef4444', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.25)' },
  SIGNIFICANT: { text: '#f97316', bg: 'rgba(249,115,22,0.08)',   border: 'rgba(249,115,22,0.25)' },
  MODERATE:    { text: '#eab308', bg: 'rgba(234,179,8,0.08)',    border: 'rgba(234,179,8,0.25)' },
  MINOR:       { text: '#22c55e', bg: 'rgba(34,197,94,0.08)',    border: 'rgba(34,197,94,0.25)' },
}

const STATUS_COLOR: Record<string, { text: string; bg: string }> = {
  NEW:           { text: '#60a5fa', bg: 'rgba(59,130,246,0.12)' },
  UNDER_REVIEW:  { text: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  ESCALATED:     { text: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  ACTION_TAKEN:  { text: '#fb923c', bg: 'rgba(249,115,22,0.12)' },
  RESOLVED:      { text: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
}

function SeverityBadge({ level }: { level: string }) {
  const c = SEV_COLOR[level] || SEV_COLOR.MINOR
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
      style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}
    >
      {level}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLOR[status] || { text: '#9a9080', bg: 'rgba(255,255,255,0.06)' }
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ color: c.text, background: c.bg }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

// ─── New Report Form ───────────────────────────────────────────────────────────

const ENCROACHMENT_TYPES = [
  'Unauthorized construction',
  'Commercial encroachment',
  'Residential encroachment',
  'Signage/advertising violation',
  'Illegal demolition',
  'Infrastructure intrusion',
] as const

interface NewReportForm {
  siteId: string
  type: string
  severity: string
  location: string
  description: string
  bufferZoneViolation: boolean
  reportedBy: string
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function EncroachmentDetection() {
  const [records, setRecords] = useState<EncroachmentRecord[]>(DEMO_ENCROACHMENT_RECORDS)
  const [selectedRecord, setSelectedRecord] = useState<EncroachmentRecord | null>(null)
  const [assessment, setAssessment] = useState<EncroachmentAssessment | null>(null)
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL')

  const [form, setForm] = useState<NewReportForm>({
    siteId: 'ahmedabad-walled-city',
    type: '',
    severity: '',
    location: '',
    description: '',
    bufferZoneViolation: false,
    reportedBy: '',
  })
  const [formError, setFormError] = useState('')

  const filteredRecords = filterSeverity === 'ALL'
    ? records
    : records.filter((r) => r.severity === filterSeverity)

  async function handleAnalyse(record: EncroachmentRecord) {
    setSelectedRecord(record)
    setAssessment(null)
    setAgentSteps([])
    setLoading(true)

    const onProgress: EncroachmentProgressCallback = (steps) => setAgentSteps([...steps])

    try {
      const result = await runEncroachmentAgent(record, onProgress)
      setAssessment(result)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmitNew(e: React.FormEvent) {
    e.preventDefault()
    if (!form.type || !form.severity || !form.location.trim() || !form.description.trim()) {
      setFormError('Please complete all required fields.')
      return
    }
    setFormError('')

    const site = HERITAGE_SITES.find((s) => s.id === form.siteId)!
    const newRecord: EncroachmentRecord = {
      id: `enc-${Date.now()}`,
      siteId: form.siteId,
      siteName: site.name,
      caseNumber: `ENC-2024-${String(records.length + 1).padStart(3, '0')}`,
      type: form.type as EncroachmentRecord['type'],
      severity: form.severity as EncroachmentRecord['severity'],
      location: form.location,
      description: form.description,
      detectedAt: new Date().toISOString(),
      reportedBy: form.reportedBy || 'Field Inspector',
      status: 'NEW',
      bufferZoneViolation: form.bufferZoneViolation,
      estimatedImpact: 'Under assessment — run AI agent for full evaluation',
      regulatoryReference: 'To be determined by legal analyst',
    }
    setRecords((prev) => [newRecord, ...prev])
    setShowForm(false)
    setForm({
      siteId: 'ahmedabad-walled-city',
      type: '', severity: '', location: '', description: '',
      bufferZoneViolation: false, reportedBy: '',
    })
    // Auto-trigger analysis
    handleAnalyse(newRecord)
  }

  const criticalCount = records.filter((r) => r.severity === 'CRITICAL').length
  const bufferViolations = records.filter((r) => r.bufferZoneViolation).length

  return (
    <div className="p-7 animate-fade-in" style={{ minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6a4020' }}>
              Encroachment Detection · AI Agent
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: '#f0ead8' }}>Encroachment Detection</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4540' }}>
            Buffer zone monitoring · Regulatory compliance · Enforcement planning
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Demo/Live badge */}
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={IS_DEMO_MODE
              ? { color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }
              : { color: '#4ade80', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }
            }
          >
            <Cpu className="w-3 h-3" />
            {IS_DEMO_MODE ? 'Demo AI Mode' : 'IBM Granite Live'}
          </span>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4 py-2">
            <AlertOctagon className="w-4 h-4" /> Report Encroachment
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Incidents', value: records.length, color: '#c9952a', icon: AlertOctagon },
          { label: 'Critical Severity', value: criticalCount, color: '#ef4444', icon: AlertTriangle },
          { label: 'Buffer Violations', value: bufferViolations, color: '#f97316', icon: Shield },
          { label: 'Sites Affected', value: new Set(records.map(r => r.siteId)).size, color: '#60a5fa', icon: MapPin },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</span>
            </div>
            <p className="text-2xl font-bold font-serif" style={{ color: '#f0ead8' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* New Report Form */}
      {showForm && (
        <div className="panel p-5 mb-6" style={{ border: '1px solid rgba(201,149,42,0.25)' }}>
          <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#f0ead8' }}>
            Report New Encroachment
          </h3>
          <form onSubmit={handleSubmitNew} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Heritage Site *</label>
              <select
                className="form-select"
                value={form.siteId}
                onChange={(e) => setForm((p) => ({ ...p, siteId: e.target.value }))}
              >
                {HERITAGE_SITES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Encroachment Type *</label>
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              >
                <option value="">Select type…</option>
                {ENCROACHMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Severity *</label>
              <select
                className="form-select"
                value={form.severity}
                onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))}
              >
                <option value="">Select severity…</option>
                {['MINOR', 'MODERATE', 'SIGNIFICANT', 'CRITICAL'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Location *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. North archway, Pol Zone sector 3"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Description *</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Describe the encroachment in detail — what was observed, extent, materials involved…"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Reported By</label>
              <input
                type="text"
                className="form-input"
                placeholder="Name / organization"
                value={form.reportedBy}
                onChange={(e) => setForm((p) => ({ ...p, reportedBy: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  checked={form.bufferZoneViolation}
                  onChange={(e) => setForm((p) => ({ ...p, bufferZoneViolation: e.target.checked }))}
                />
                <span className="text-sm" style={{ color: '#c8c0b4' }}>Buffer zone violation</span>
              </label>
            </div>
            {formError && <p className="md:col-span-2 text-xs text-red-400">{formError}</p>}
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary text-sm px-5 py-2">
                <Zap className="w-4 h-4" /> Submit & Analyse
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost text-sm px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Records list — col 1-2 */}
        <div className="xl:col-span-2">
          <div className="panel p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Incidents ({filteredRecords.length})</p>
              <select
                className="text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#6a6060', border: '1px solid rgba(255,255,255,0.08)' }}
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="ALL">All Severity</option>
                <option value="CRITICAL">Critical</option>
                <option value="SIGNIFICANT">Significant</option>
                <option value="MODERATE">Moderate</option>
                <option value="MINOR">Minor</option>
              </select>
            </div>
            <div className="space-y-2">
              {filteredRecords.map((record) => {
                const c = SEV_COLOR[record.severity]
                const isSelected = selectedRecord?.id === record.id
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className="p-3.5 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: isSelected ? c.bg : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? c.border : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-0.5">{record.caseNumber}</p>
                        <p className="text-xs font-semibold" style={{ color: '#e8e4dc' }}>{record.type}</p>
                      </div>
                      <SeverityBadge level={record.severity} />
                    </div>
                    <p className="text-[10px] text-muted flex items-center gap-1 mb-1.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {record.siteName}
                    </p>
                    <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: '#4a4540' }}>
                      {record.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={record.status} />
                      {record.bufferZoneViolation && (
                        <span className="text-[9px] font-bold text-orange-400 flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> Buffer Violation
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAnalyse(record) }}
                      className="mt-2 w-full btn-primary text-[10px] py-1.5 justify-center"
                      style={{ fontSize: '10px' }}
                    >
                      <Cpu className="w-3 h-3" /> Run AI Assessment
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Assessment panel — col 3-5 */}
        <div className="xl:col-span-3 space-y-4">

          {/* Agent workflow */}
          {(loading || agentSteps.length > 0) && (
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-blue-400" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">AI Agent Pipeline</p>
              </div>
              <AgentWorkflow steps={agentSteps} />
            </div>
          )}

          {/* No record selected */}
          {!selectedRecord && !loading && (
            <div className="panel p-8 text-center">
              <AlertOctagon className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: '#c9952a' }} />
              <p className="font-serif text-base font-semibold mb-1" style={{ color: '#6a6060' }}>
                Select an incident
              </p>
              <p className="text-sm text-muted">Choose an encroachment record and run the AI agent for a full assessment and enforcement action plan.</p>
            </div>
          )}

          {/* Assessment result */}
          {assessment && selectedRecord && !loading && (
            <>
              {/* Threat level + summary */}
              <div
                className="panel p-5"
                style={{ border: `1px solid ${SEV_COLOR[assessment.threatLevel]?.border || 'rgba(255,255,255,0.06)'}` }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1">
                      Encroachment AI Assessment · {selectedRecord.caseNumber}
                    </p>
                    <h2 className="font-serif text-xl font-bold" style={{ color: '#f0ead8' }}>
                      {selectedRecord.type}
                    </h2>
                    <p className="text-xs text-muted mt-0.5">{selectedRecord.siteName} · {selectedRecord.location}</p>
                  </div>
                  <SeverityBadge level={assessment.threatLevel} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Immediate Risk</p>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#b8b0a4' }}>{assessment.immediateRisk}</p>
                  </div>
                  <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Heritage Impact</p>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#b8b0a4' }}>{assessment.heritageImpact}</p>
                  </div>
                </div>

                {/* Legal violations */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Scale className="w-3.5 h-3.5 text-blue-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Regulatory Violations</p>
                  </div>
                  <div className="space-y-1.5">
                    {assessment.legalViolations.map((v, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-lg"
                        style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}
                      >
                        <span className="text-red-400 text-[10px] font-bold mt-0.5 flex-shrink-0">§</span>
                        <p className="text-xs" style={{ color: '#a87070' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="panel p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Enforcement Action Plan</p>
                </div>
                <div className="space-y-3">
                  {assessment.recommendedActions.map((action, i) => {
                    const pColor = action.priority === 'P1' ? '#ef4444' : action.priority === 'P2' ? '#f97316' : '#eab308'
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                            style={{ color: pColor, background: `${pColor}18`, border: `1px solid ${pColor}40` }}
                          >
                            {action.priority}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1" style={{ color: '#e8e4dc' }}>{action.action}</p>
                            <div className="flex items-center gap-4 text-[10px] text-muted">
                              <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {action.authority}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {action.timeframe}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Precedent notes */}
              <div
                className="panel p-4"
                style={{ background: 'rgba(201,149,42,0.04)', border: '1px solid rgba(201,149,42,0.15)' }}
              >
                <div className="flex items-start gap-2">
                  <Eye className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#c9952a' }}>Precedent & Context</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#8a8070' }}>{assessment.precedentNotes}</p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] leading-relaxed" style={{ color: '#3a3530' }}>
                  <span className="font-bold">AI-assisted assessment.</span>{' '}
                  This analysis identifies regulatory violations and recommends enforcement action based on reported information.
                  All legal proceedings must be initiated by authorized heritage authorities with independent legal verification.
                  AI-generated assessments do not constitute formal legal notices.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
