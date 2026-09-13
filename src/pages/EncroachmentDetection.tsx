import { useState } from 'react'
import {
  AlertOctagon,
  MapPin,
  Radio,
  X,
  Zap,
  Scale,
  ArrowRight,
} from 'lucide-react'
import { DEMO_ENCROACHMENT_RECORDS, HERITAGE_SITES } from '../data/demoData'
import { runEncroachmentAgent, type EncroachmentProgressCallback } from '../services/encroachmentAgent'
import type { EncroachmentRecord, EncroachmentAssessment, AgentStep } from '../types'
import AgentWorkflow from '../components/AgentWorkflow'

const SEV_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  CRITICAL:    { text: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  SIGNIFICANT: { text: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  MODERATE:    { text: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  MINOR:       { text: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
}

const STATUS_COLOR: Record<string, { text: string; bg: string }> = {
  NEW:           { text: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  UNDER_REVIEW:  { text: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  ESCALATED:     { text: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  ACTION_TAKEN:  { text: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  RESOLVED:      { text: '#10b981', bg: 'rgba(16,185,129,0.15)' },
}

function SeverityBadge({ level }: { level: string }) {
  const c = SEV_COLOR[level] || SEV_COLOR.MINOR
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
      style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}
    >
      {level}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLOR[status] || { text: '#94a3b8', bg: 'rgba(255,255,255,0.06)' }
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
      style={{ color: c.text, background: c.bg }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

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

export default function EncroachmentDetection() {
  const [records, setRecords] = useState<EncroachmentRecord[]>(DEMO_ENCROACHMENT_RECORDS)
  const [selectedRecord, setSelectedRecord] = useState<EncroachmentRecord | null>(null)
  const [assessment, setAssessment] = useState<EncroachmentAssessment | null>(null)
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL')
  const [simulatedDistance, setSimulatedDistance] = useState<number>(65) // 65m default

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

  function handleStatusAdvance(recordId: string, e: React.MouseEvent) {
    e.stopPropagation()
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const nextStatus: EncroachmentRecord['status'] =
            r.status === 'NEW' ? 'UNDER_REVIEW' :
            r.status === 'UNDER_REVIEW' ? 'ESCALATED' :
            r.status === 'ESCALATED' ? 'ACTION_TAKEN' :
            r.status === 'ACTION_TAKEN' ? 'RESOLVED' : 'RESOLVED'
          return { ...r, status: nextStatus }
        }
        return r
      })
    )
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
      regulatoryReference: 'AMASR Act 1958 Section 20A',
    }
    setRecords((prev) => [newRecord, ...prev])
    setShowForm(false)
    setForm({
      siteId: 'ahmedabad-walled-city',
      type: '', severity: '', location: '', description: '',
      bufferZoneViolation: false, reportedBy: '',
    })
    handleAnalyse(newRecord)
  }

  const isProhibitedZone = simulatedDistance <= 100
  const isRegulatedZone = simulatedDistance > 100 && simulatedDistance <= 300

  return (
    <div className="p-6 sm:p-8 animate-fade-in space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Encroachment Detection · IBM Granite Spatial Agent
            </span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">Buffer Zone Encroachment Radar</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitoring 100m Prohibited & 200m Regulated Zones under AMASR Act 1958
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs sm:text-sm px-4 py-2.5 shadow-lg">
            <AlertOctagon className="w-4 h-4" /> Log Encroachment Violation
          </button>
        </div>
      </div>

      {/* Interactive Distance Radius Simulator Widget */}
      <div className="panel p-6 border border-amber-500/20 space-y-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-100">Interactive Buffer Distance Calculator</h2>
              <p className="text-xs text-slate-400">Slide distance from monument wall to test legal status</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Distance:</span>
            <span className="font-extrabold text-amber-400 text-base">{simulatedDistance} Meters</span>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={10}
            max={350}
            value={simulatedDistance}
            onChange={(e) => setSimulatedDistance(Number(e.target.value))}
            className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0m (Monument Wall)</span>
            <span className="text-rose-400 font-bold">100m (Prohibited Limit)</span>
            <span className="text-amber-400 font-bold">300m (Regulated Limit)</span>
            <span>350m+ (Clear)</span>
          </div>
        </div>

        {/* Dynamic Zone Output Card */}
        <div className={`p-4 rounded-xl border transition-all text-xs space-y-2 ${
          isProhibitedZone
            ? 'bg-rose-950/40 border-rose-800 text-rose-200'
            : isRegulatedZone
            ? 'bg-amber-950/40 border-amber-800 text-amber-200'
            : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              {isProhibitedZone ? '100m Prohibited Buffer Zone (Section 20A)' : isRegulatedZone ? '200m Regulated Buffer Zone (Section 20B)' : 'Clear Zone (>300m)'}
            </span>
            <span className="font-bold px-2 py-0.5 rounded bg-slate-950 border border-current text-[10px]">
              {isProhibitedZone ? 'ILLEGAL — DEMOLITION MANDATORY' : isRegulatedZone ? 'NMA PERMIT MANDATORY' : 'PERMITTED'}
            </span>
          </div>
          <p className="leading-relaxed">
            {isProhibitedZone
              ? 'Structure is located within 100 meters of the protected monument perimeter. Absolutely no new construction or alteration permitted. Immediate stop-work order and demolition notice required.'
              : isRegulatedZone
              ? 'Structure falls in the 100m-300m regulated boundary. Construction requires prior permission from the National Monuments Authority (NMA).'
              : 'Structure is beyond the 300m regulatory buffer zone. Normal municipal bylaws apply.'}
          </p>
        </div>
      </div>

      {/* New Encroachment Report Form Modal */}
      {showForm && (
        <form onSubmit={handleSubmitNew} className="panel p-6 border border-amber-500/30 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-slate-100">Log New Encroachment Violation</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && <p className="text-xs text-rose-400 font-semibold">{formError}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Heritage Site</label>
              <select value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })} className="form-select text-xs">
                {HERITAGE_SITES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Violation Classification</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="form-select text-xs">
                <option value="">Select type...</option>
                {ENCROACHMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Severity Level</label>
              <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="form-select text-xs">
                <option value="">Select severity...</option>
                <option value="CRITICAL">CRITICAL (High Threat)</option>
                <option value="SIGNIFICANT">SIGNIFICANT</option>
                <option value="MODERATE">MODERATE</option>
                <option value="MINOR">MINOR</option>
              </select>
            </div>

            <div>
              <label className="form-label">Exact Location / Survey No.</label>
              <input
                type="text"
                placeholder="e.g. 85m East of Teen Darwaza Archway"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Violation Summary</label>
            <textarea
              placeholder="Describe physical encroachment, structure height, materials, and active work..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="form-input text-xs resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bufferZoneViolation"
              checked={form.bufferZoneViolation}
              onChange={(e) => setForm({ ...form, bufferZoneViolation: e.target.checked })}
              className="rounded text-amber-500 border-slate-700 bg-slate-900"
            />
            <label htmlFor="bufferZoneViolation" className="text-xs text-slate-300 font-semibold cursor-pointer">
              Intrudes directly within 100m Prohibited Buffer Zone
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-xs px-5 py-2.5">
              Submit & Run AI Regulatory Audit
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-xs px-4 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Violations List & Analysis View */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Violations Directory */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Encroachment Records</p>
            <div className="flex items-center gap-1 text-xs">
              {(['ALL', 'CRITICAL', 'SIGNIFICANT'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterSeverity(lvl)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                    filterSeverity === lvl ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredRecords.map((r) => (
              <div
                key={r.id}
                onClick={() => handleAnalyse(r)}
                className={`panel p-4 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-2.5 ${
                  selectedRecord?.id === r.id ? 'border-amber-500/50 bg-amber-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold">{r.caseNumber}</span>
                  <SeverityBadge level={r.severity} />
                </div>
                <h4 className="font-serif text-sm font-bold text-slate-100">{r.type}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {r.siteName} — {r.location}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <StatusBadge status={r.status} />
                  
                  {/* Interactive Status Advance Button */}
                  <button
                    onClick={(e) => handleStatusAdvance(r.id, e)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                  >
                    Advance <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Regulatory Assessment View */}
        <div className="xl:col-span-3">
          {!selectedRecord && !loading && (
            <div className="panel p-12 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[450px]">
              <AlertOctagon className="w-10 h-10 text-amber-400/50 mb-3" />
              <p className="text-sm font-semibold text-slate-200">Select an encroachment record to run IBM Granite legal audit.</p>
            </div>
          )}

          {loading && (
            <div className="panel p-6 space-y-4 border border-amber-500/30">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <Zap className="w-5 h-5 text-amber-400 animate-spin" />
                <p className="text-sm font-semibold text-slate-100">Running IBM Granite Legal & Spatial Agent...</p>
              </div>
              <AgentWorkflow steps={agentSteps} />
            </div>
          )}

          {assessment && selectedRecord && !loading && (
            <div className="panel p-6 border border-amber-500/30 space-y-5 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{selectedRecord.caseNumber}</span>
                  <h3 className="font-serif text-xl font-bold text-slate-100">{selectedRecord.type}</h3>
                  <p className="text-xs text-slate-400">{selectedRecord.siteName} — {selectedRecord.location}</p>
                </div>
                <SeverityBadge level={assessment.threatLevel} />
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800">
                  <p className="font-bold text-rose-300 uppercase tracking-wider mb-1">Immediate Structural & Heritage Risk</p>
                  <p className="leading-relaxed text-slate-200">{assessment.immediateRisk}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="font-bold text-amber-400 uppercase tracking-wider mb-2">Legal AMASR Act Violations</p>
                  {assessment.legalViolations.map((v, i) => (
                    <p key={i} className="text-slate-300 mb-1">• {v}</p>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-slate-200 uppercase tracking-wider">Enforcement Action Plan</p>
                  {assessment.recommendedActions.map((act, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-100">{act.action}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">Authority: {act.authority} · Timeframe: {act.timeframe}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {act.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
