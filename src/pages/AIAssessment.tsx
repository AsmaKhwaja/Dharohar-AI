import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BrainCircuit,
  X,
  ImageIcon,
  ChevronDown,
  AlertCircle,
  Zap,
  Crosshair,
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

const DAMAGE_HOTSPOTS = [
  {
    title: 'Archway Shear Crack',
    siteId: 'teen-darwaza',
    incidentType: 'Structural deterioration' as const,
    condition: 'Vertical 6mm shear crack along central limestone arch pillar. Mortar disintegration and lateral load displacement.',
    visitorPressure: 'HIGH' as const,
    env: 'POST_MONSOON' as const,
    months: 8,
  },
  {
    title: 'Kund Sandstone Moisture',
    siteId: 'sun-temple-modhera',
    incidentType: 'Surface damage' as const,
    condition: 'Black algae biofilm and sub-florescence salt crystal crust along lower stepwell masonry. Sandstone softening detected.',
    visitorPressure: 'MODERATE' as const,
    env: 'WET' as const,
    months: 4,
  },
  {
    title: 'Eastern Rampart Seepage',
    siteId: 'bhadra-fort',
    incidentType: 'Water/moisture damage' as const,
    condition: 'Severe moisture trapped behind stone masonry facade causing structural wall bulging and mortar leeching.',
    visitorPressure: 'EXTREME' as const,
    env: 'HUMID' as const,
    months: 12,
  },
  {
    title: 'Pol Facade Wood Decay',
    siteId: 'pol-heritage-zone',
    incidentType: 'Structural deterioration' as const,
    condition: 'Termite infestation and moisture rot along 18th-century carved wooden brackets and shoring supports.',
    visitorPressure: 'HIGH' as const,
    env: 'HUMID' as const,
    months: 15,
  },
]

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
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
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

  const handleHotspotSelect = (idx: number) => {
    const h = DAMAGE_HOTSPOTS[idx]
    setActiveHotspot(idx)
    setForm({
      siteId: h.siteId,
      incidentType: h.incidentType,
      observedCondition: h.condition,
      visitorPressure: h.visitorPressure,
      environmentalCondition: h.env,
      lastInspectionMonths: h.months,
      evidenceImage: null,
    })
    setResult(null)
    setError(null)
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
    setActiveHotspot(null)
  }

  const selectedSite = HERITAGE_SITES.find((s) => s.id === form.siteId)

  return (
    <div className="p-6 sm:p-8 animate-fade-in space-y-8 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Heritage Guardian Orchestrator · IBM Granite AI
            </span>
            {IS_DEMO_MODE && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                Demo AI Mode
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">AI Incident Risk Assessment</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Submit an incident report or click an interactive damage hotspot to launch IBM Granite reasoning.
          </p>
        </div>

        <button onClick={handleLoadDemo} className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5 self-start sm:self-auto">
          <Zap className="w-4 h-4 text-amber-400" /> Load Demo Scenario
        </button>
      </div>

      {/* Interactive Damage Hotspot Blueprint Selector Widget */}
      <div className="panel p-5 border border-amber-500/20 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-amber-400" /> Interactive Structural Damage Hotspot Inspector:
          </span>
          <span className="text-[10px] text-amber-400 font-mono">Click any hotspot to auto-fill inspection details</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DAMAGE_HOTSPOTS.map((h, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleHotspotSelect(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeHotspot === idx
                  ? 'bg-amber-500/20 border-amber-500/50 shadow-md text-amber-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-100">{h.title}</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">{h.siteId.replace(/-/g, ' ')}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Incident Form Column */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} noValidate>
            <div className="panel p-6 space-y-5 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h2 className="font-serif text-lg font-bold text-slate-100">Incident Form</h2>
              </div>

              {/* Site Selection */}
              <div>
                <label className="form-label">Heritage Site <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <select
                    value={form.siteId}
                    onChange={(e) => setField('siteId', e.target.value)}
                    className="form-select text-xs pr-10"
                  >
                    <option value="">Select site...</option>
                    {HERITAGE_SITES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} (Health Score: {s.healthScore})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                {selectedSite && (
                  <p className="text-[11px] mt-1.5 text-slate-400">
                    Location: {selectedSite.location} · Category: {selectedSite.heritageType}
                  </p>
                )}
              </div>

              {/* Incident Type */}
              <div>
                <label className="form-label">Incident Classification <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <select
                    value={form.incidentType}
                    onChange={(e) => setField('incidentType', e.target.value as IncidentForm['incidentType'])}
                    className="form-select text-xs pr-10"
                  >
                    <option value="">Select type...</option>
                    {INCIDENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Observed Condition */}
              <div>
                <label className="form-label">Observed Structural Condition <span className="text-rose-400">*</span></label>
                <textarea
                  value={form.observedCondition}
                  onChange={(e) => setField('observedCondition', e.target.value)}
                  className="form-input text-xs resize-none"
                  rows={4}
                  placeholder="Describe observed physical anomalies (e.g. 5mm vertical crack on stone pillar, moisture seepage)..."
                />
                <p className="text-[10px] mt-1 text-slate-500">
                  {form.observedCondition.length} chars (minimum 10 required)
                </p>
              </div>

              {/* Visitor Strain */}
              <div>
                <label className="form-label">Visitor Strain Level <span className="text-rose-400">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {VISITOR_PRESSURE_LEVELS.map((level) => {
                    const isActive = form.visitorPressure === level
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setField('visitorPressure', level)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {level}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Environmental Condition */}
              <div>
                <label className="form-label">Environmental Condition <span className="text-rose-400">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {ENVIRONMENTAL_CONDITIONS.map((cond) => {
                    const isActive = form.environmentalCondition === cond
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setField('environmentalCondition', cond)}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
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
                  className="form-input text-xs"
                  placeholder="e.g. 6"
                />
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="form-label">Evidence Image (optional)</label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-800">
                    <img src={imagePreview} alt="Evidence" className="w-full h-36 object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors bg-slate-950/40">
                    <ImageIcon className="w-5 h-5 text-slate-500" />
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-300">Click to attach evidence photo</p>
                      <p className="text-[10px] text-slate-500">PNG, JPG up to 10MB</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3 text-xs sm:text-sm">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Analysing Pipeline...</>
                  ) : (
                    <><BrainCircuit className="w-4 h-4" /> Run AI Assessment</>
                  )}
                </button>
                {result && (
                  <button type="button" onClick={handleReset} className="btn-secondary px-4 py-3 text-xs">
                    Reset
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Assessment Output Column */}
        <div id="assessment-result" className="xl:col-span-3">
          {!result && !loading && agentSteps.length === 0 && (
            <div className="panel p-12 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                <BrainCircuit className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-100 mb-2">Ready for Incident Assessment</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
                Fill in the incident report parameters or select a damage hotspot above to run the 4-stage IBM Granite multi-agent pipeline.
              </p>
              <button onClick={handleLoadDemo} className="btn-secondary text-xs px-5 py-2.5">
                <Zap className="w-4 h-4 text-amber-400" /> Load Demo Scenario
              </button>
            </div>
          )}

          {loading && agentSteps.length > 0 && (
            <div className="panel p-6 space-y-4 border border-amber-500/30">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <LoadingSpinner size="sm" />
                <div>
                  <p className="font-semibold text-slate-100 text-sm">Heritage Guardian Orchestrator Executing</p>
                  <p className="text-xs text-amber-400">IBM Granite Multi-Agent Pipeline</p>
                </div>
              </div>
              <AgentWorkflow steps={agentSteps} />
            </div>
          )}

          {loading && agentSteps.length === 0 && (
            <div className="panel p-12 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[500px]">
              <LoadingSpinner message="Initialising IBM Granite Multi-Agent Pipeline..." size="lg" />
            </div>
          )}

          {result && <AssessmentResult result={result} />}
        </div>
      </div>

    </div>
  )
}
