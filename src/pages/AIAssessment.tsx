
import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BrainCircuit,
  Upload,
  X,
  ImageIcon,
  ChevronDown,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react'
import type { IncidentForm, AIAssessmentResult, AgentStep } from '../types'
import { HERITAGE_SITES, INCIDENT_TYPES, VISITOR_PRESSURE_LEVELS, ENVIRONMENTAL_CONDITIONS, DEMO_INCIDENT } from '../data/demoData'
import { runHeritageAssessment, IS_DEMO_MODE } from '../services/graniteService'
import AssessmentResult from '../components/AssessmentResult'
import AgentWorkflow from '../components/AgentWorkflow'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'

const ENV_LABELS: Record<string, string> = {
  DRY: 'Dry',
  HUMID: 'Humid',
  WET: 'Wet / Raining',
  EXTREME_HEAT: 'Extreme Heat (>40°C)',
  POST_MONSOON: 'Post-Monsoon',
}

const EMPTY_FORM: IncidentForm = {
  siteId: '',
  incidentType: '',
  observedCondition: '',
  visitorPressure: '',
  environmentalCondition: '',
  lastInspectionMonths: undefined,
  evidenceImage: null,
}

export default function AIAssessment() {
  const location = useLocation()
  const initialSiteId = (location.state as { siteId?: string } | null)?.siteId || ''

  const [form, setForm] = useState<IncidentForm>({ ...EMPTY_FORM, siteId: initialSiteId })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AIAssessmentResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const setField = <K extends keyof IncidentForm>(key: K, value: IncidentForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setField('evidenceImage', file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setField('evidenceImage', null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = (): string | null => {
    if (!form.siteId) return 'Please select a heritage site.'
    if (!form.incidentType) return 'Please select an incident type.'
    if (!form.observedCondition.trim() || form.observedCondition.trim().length < 10)
      return 'Please describe the observed condition (at least 10 characters).'
    if (!form.visitorPressure) return 'Please select the current visitor pressure.'
    if (!form.environmentalCondition) return 'Please select the environmental condition.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setError(null)
    setLoading(true)
    setResult(null)
    setAgentSteps([])

    try {
      const res = await runHeritageAssessment(form, (steps) => setAgentSteps([...steps]))
      setResult(res)
      setTimeout(() => {
        document.getElementById('assessment-result')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (e) {
      setError((e as Error).message || 'Assessment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadDemo = () => {
    setForm({
      ...EMPTY_FORM,
      siteId: DEMO_INCIDENT.siteId,
      incidentType: DEMO_INCIDENT.incidentType,
      observedCondition: DEMO_INCIDENT.observedCondition,
      visitorPressure: DEMO_INCIDENT.visitorPressure,
      environmentalCondition: DEMO_INCIDENT.environmentalCondition,
      lastInspectionMonths: DEMO_INCIDENT.lastInspectionMonths,
    })
    setResult(null)
    setError(null)
    setAgentSteps([])
  }

  const handleReset = () => {
    setForm(EMPTY_FORM)
    setResult(null)
    setError(null)
    setImagePreview(null)
    setAgentSteps([])
  }

  const selectedSite = HERITAGE_SITES.find((s) => s.id === form.siteId)

  return (
    <div className="p-7 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="w-3.5 h-3.5" style={{ color: '#c9952a' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4a4540' }}>
              Heritage Guardian Orchestrator · IBM Granite AI
            </span>
            {IS_DEMO_MODE && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
                Demo AI Mode
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: '#f0ead8' }}>AI Heritage Assessment</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4540' }}>
            Submit an incident report to run the Heritage Guardian Orchestrator pipeline.
          </p>
        </div>
        <button onClick={handleLoadDemo} className="btn-secondary text-sm px-4 py-2 flex-shrink-0">
          <Zap className="w-4 h-4" /> Load Demo Incident
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-7">
        {/* ── Form ── */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} noValidate>
            <div className="panel p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" style={{ color: '#c9952a' }} />
                <h2 className="font-semibold" style={{ color: '#f0ead8' }}>Incident Report</h2>
              </div>

              {/* Site */}
              <div>
                <label className="form-label">Heritage Site <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select value={form.siteId} onChange={(e) => setField('siteId', e.target.value)} className="form-input appearance-none pr-10">
                    <option value="">Select a heritage site...</option>
                    {HERITAGE_SITES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} — Health: {s.healthScore}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                </div>
                {selectedSite && (
                  <p className="text-[11px] mt-1 px-1" style={{ color: '#5a5550' }}>
                    {selectedSite.location} · {selectedSite.heritageType} · Sensitivity: {selectedSite.visitorPressure} visitor pressure
                  </p>
                )}
              </div>

              {/* Incident Type */}
              <div>
                <label className="form-label">Incident Type <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select value={form.incidentType} onChange={(e) => setField('incidentType', e.target.value as IncidentForm['incidentType'])} className="form-input appearance-none pr-10">
                    <option value="">Select incident type...</option>
                    {INCIDENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="form-label">Observed Condition <span className="text-red-400">*</span></label>
                <textarea
                  value={form.observedCondition}
                  onChange={(e) => setField('observedCondition', e.target.value)}
                  className="form-input resize-none"
                  rows={4}
                  placeholder="Describe what you observed: cracks, staining, spalling, vegetation, structural changes..."
                />
                <p className="text-[10px] mt-1 px-1" style={{ color: '#3a3530' }}>
                  {form.observedCondition.length} chars — minimum 10 required
                </p>
              </div>

              {/* Visitor Pressure */}
              <div>
                <label className="form-label">Visitor Pressure <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {VISITOR_PRESSURE_LEVELS.map((level) => {
                    const activeColors: Record<string, string> = { EXTREME: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', LOW: '#22c55e' }
                    const isActive = form.visitorPressure === level
                    return (
                      <button key={level} type="button" onClick={() => setField('visitorPressure', level)}
                        className="py-2 rounded-xl text-xs font-bold transition-all border"
                        style={{
                          background: isActive ? `${activeColors[level]}20` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isActive ? activeColors[level] + '60' : 'rgba(255,255,255,0.07)'}`,
                          color: isActive ? activeColors[level] : '#4a4540',
                        }}>
                        {level}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Environmental Condition */}
              <div>
                <label className="form-label">Environmental Condition <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {ENVIRONMENTAL_CONDITIONS.map((cond) => {
                    const isActive = form.environmentalCondition === cond
                    return (
                      <button key={cond} type="button" onClick={() => setField('environmentalCondition', cond)}
                        className="py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all"
                        style={{
                          background: isActive ? 'rgba(201,149,42,0.1)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isActive ? 'rgba(201,149,42,0.4)' : 'rgba(255,255,255,0.07)'}`,
                          color: isActive ? '#c9952a' : '#4a4540',
                        }}>
                        {ENV_LABELS[cond]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Months since inspection */}
              <div>
                <label className="form-label">Months Since Last Inspection (optional)</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={form.lastInspectionMonths ?? ''}
                  onChange={(e) => setField('lastInspectionMonths', e.target.value ? Number(e.target.value) : undefined)}
                  className="form-input"
                  placeholder="e.g. 8"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="form-label">Evidence Image (optional — assessment works without it)</label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <img src={imagePreview} alt="Evidence" className="w-full h-36 object-cover" />
                    <button type="button" onClick={removeImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(10,12,20,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <X className="w-4 h-4" style={{ color: '#c8c0b4' }} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 p-5 rounded-xl cursor-pointer transition-all"
                    style={{ border: '2px dashed rgba(255,255,255,0.07)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(201,149,42,0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <ImageIcon className="w-4 h-4" style={{ color: '#4a4540' }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold" style={{ color: '#4a4540' }}>Click to upload evidence image</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#3a3530' }}>PNG, JPG up to 10MB · optional</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />Analysing...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" />Run AI Assessment</>
                  )}
                </button>
                {result && <button type="button" onClick={handleReset} className="btn-secondary px-4">Reset</button>}
              </div>
            </div>
          </form>

          {/* Info box */}
          <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Upload className="w-3.5 h-3.5 text-muted" />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4a4540' }}>Multi-Agent Pipeline</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: '#3a3530' }}>
              Assessments run through the Heritage Guardian Orchestrator: Condition Analyst → Heritage Risk Analyst → Conservation Advisor → Granite Synthesis.
              {IS_DEMO_MODE ? ' Running in Demo AI Mode — deterministic results without IBM credentials.' : ' Connected to IBM Granite LLM.'}
            </p>
          </div>
        </div>

        {/* ── Result Panel ── */}
        <div id="assessment-result" className="xl:col-span-3">
          {!result && !loading && agentSteps.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 xl:h-full panel rounded-xl text-center p-12">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(201,149,42,0.08)', border: '1px solid rgba(201,149,42,0.15)' }}>
                <BrainCircuit className="w-8 h-8" style={{ color: '#c9952a', opacity: 0.5 }} />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: '#4a4540' }}>Ready for Assessment</h3>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#3a3530' }}>
                Fill in the incident report and click "Run AI Assessment" to launch the Heritage Guardian Orchestrator pipeline.
              </p>
              <button onClick={handleLoadDemo} className="btn-secondary mt-6 text-sm px-5 py-2">
                <Zap className="w-4 h-4" /> Load Demo Incident
              </button>
            </div>
          )}

          {loading && agentSteps.length > 0 && (
            <div className="panel p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <LoadingSpinner size="sm" />
                <p className="text-sm font-semibold" style={{ color: '#f0ead8' }}>Heritage Guardian Orchestrator Running...</p>
              </div>
              <AgentWorkflow steps={agentSteps} />
            </div>
          )}

          {loading && agentSteps.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 xl:h-full panel rounded-xl text-center p-12">
              <LoadingSpinner message="Initialising Heritage Guardian Orchestrator..." size="lg" />
            </div>
          )}

          {result && <AssessmentResult result={result} />}
        </div>
      </div>
    </div>
  )
}
