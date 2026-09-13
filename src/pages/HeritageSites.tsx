import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Landmark,
  MapPin,
  Clock,
  AlertTriangle,
  Users,
  ChevronRight,
  HelpCircle,
  TrendingDown,
  Building2,
  Search,
  SlidersHorizontal,
  Zap,
  Video,
  Eye,
} from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import ScoreChangePanel from '../components/ScoreChangePanel'
import WhatIfSimulator from '../components/WhatIfSimulator'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import DroneSensorModal from '../components/DroneSensorModal'
import { HERITAGE_SITES, DEMO_SCORE_CHANGE } from '../data/demoData'
import type { HeritageSite, RiskLevel, ScoreChangeAnalysis } from '../types'

const RISK_HEX: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#f59e0b', LOW: '#10b981',
}

function SiteCard({ site }: { site: HeritageSite }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [showScoreChange, setShowScoreChange] = useState(false)
  const [showSimulator, setShowSimulator] = useState(false)
  const [showSlider, setShowSlider] = useState(false)
  const [showDrone, setShowDrone] = useState(false)

  const scoreChange: ScoreChangeAnalysis =
    site.id === 'ahmedabad-walled-city'
      ? DEMO_SCORE_CHANGE
      : {
          siteId: site.id,
          siteName: site.name,
          previousScore: site.previousHealthScore,
          currentScore: site.healthScore,
          delta: site.healthScore - site.previousHealthScore,
          primaryReasons: [
            {
              factor: 'Visitor Strain',
              impact: site.riskLevel,
              explanation: `${site.visitorPressure} visitor pressure recorded at this site. Heavy footfall accelerates masonry deterioration.`,
            },
            {
              factor: 'Conservation Status',
              impact: site.conservationStatus === 'EMERGENCY' ? 'CRITICAL' : site.conservationStatus === 'INTERVENTION' ? 'HIGH' : 'MODERATE',
              explanation: `Site is under ${site.conservationStatus} conservation watch. Immediate preventive shoring & restoration required.`,
            },
            {
              factor: 'Inspection Interval',
              impact: site.monthsSinceInspection > 6 ? 'MODERATE' : 'LOW',
              explanation: `Last expert survey was performed ${site.monthsSinceInspection} months ago.`,
            },
          ],
          nextActions: [
            { priority: 'P1', action: 'Schedule on-site expert heritage structural survey', reason: 'Verify AI risk calculations with structural engineers', urgency: site.riskLevel === 'CRITICAL' ? 'Within 72 hours' : 'Within 7 days', timeframe: site.riskLevel === 'CRITICAL' ? '72 hours' : '7 days', stakeholder: 'ASI Conservation Division', reviewTimeline: '7 days', justification: 'Professional verification required' },
            { priority: 'P2', action: 'Implement visitor routing restrictions at high-stress zones', reason: 'Reduce physical friction on historic fabric', urgency: 'Within 2 weeks', timeframe: '2 weeks', stakeholder: 'Site Management', reviewTimeline: 'Monthly', justification: 'Prevent structural micro-fractures' },
          ],
          generatedAt: new Date().toISOString(),
          demoMode: true,
        }

  const hasDelta = site.healthScore !== site.previousHealthScore
  const delta = site.healthScore - site.previousHealthScore

  return (
    <div className="panel p-5 border border-slate-800 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4">
      <DroneSensorModal
        isOpen={showDrone}
        siteName={site.name}
        location={site.location}
        onClose={() => setShowDrone(false)}
      />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-slate-100">{site.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{site.location}</span>
              </div>
            </div>
          </div>
          <RiskBadge level={site.riskLevel} />
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
            {site.heritageType}
          </span>
          {site.activeAlerts > 0 && (
            <span className="flex items-center gap-1 font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
              <AlertTriangle className="w-3 h-3" /> {site.activeAlerts} Alerts
            </span>
          )}
        </div>

        {/* Health Score Progress */}
        <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Heritage Health Score</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-serif" style={{ color: RISK_HEX[site.riskLevel] }}>{site.healthScore}</span>
              {hasDelta && (
                <span className={`text-xs font-bold flex items-center gap-0.5 ${delta < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  <TrendingDown className="w-3 h-3" /> {delta}
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${site.healthScore}%`, background: RISK_HEX[site.riskLevel] }} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Strain: <strong className="text-slate-200">{site.visitorPressure}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Last Survey: <strong className="text-slate-200">{site.lastInspection}</strong></span>
          </div>
        </div>

        {expanded && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 animate-fade-in">
            <p className="leading-relaxed text-slate-300">{site.description}</p>
            <div className="grid grid-cols-2 gap-2 text-slate-400 pt-2 border-t border-slate-900">
              <div>Established: <span className="text-slate-200">{site.established}</span></div>
              <div>Coordinates: <span className="text-slate-200">{site.coordinates}</span></div>
            </div>
          </div>
        )}

        {/* Interactive Before After Comparison Slider Drawer */}
        {showSlider && (
          <BeforeAfterSlider
            title="Structural Erosion Comparison"
            siteName={site.name}
            onClose={() => setShowSlider(false)}
          />
        )}

        {/* Score Change Panel Modal/Drawer */}
        {showScoreChange && (
          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 animate-fade-in">
            <ScoreChangePanel
              analysis={scoreChange}
              onRunAssessment={() => navigate('/assessment', { state: { siteId: site.id } })}
            />
          </div>
        )}

        {/* What-If Simulator Panel */}
        {showSimulator && (
          <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 animate-fade-in">
            <WhatIfSimulator siteId={site.id} siteName={site.name} />
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-white font-medium">
            {expanded ? 'Hide Details' : 'Details'}
          </button>

          <button
            onClick={() => setShowDrone(true)}
            className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 font-semibold flex items-center gap-1 transition-all"
            title="Live Multi-Spectral Drone Feed"
          >
            <Video className="w-3.5 h-3.5 text-rose-400" /> Drone Feed
          </button>

          <button
            onClick={() => { setShowSlider(!showSlider); setShowScoreChange(false); setShowSimulator(false) }}
            className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              showSlider ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-amber-400'
            }`}
            title="Interactive Visual Comparison Slider"
          >
            <Eye className="w-3.5 h-3.5" /> 1985 vs Now
          </button>

          {hasDelta && (
            <button
              onClick={() => { setShowScoreChange(!showScoreChange); setShowSimulator(false); setShowSlider(false) }}
              className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                showScoreChange ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Score Analysis
            </button>
          )}

          <button
            onClick={() => { setShowSimulator(!showSimulator); setShowScoreChange(false); setShowSlider(false) }}
            className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              showSimulator ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-blue-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> What-If
          </button>
        </div>

        <button
          onClick={() => navigate('/assessment', { state: { siteId: site.id } })}
          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 ml-auto"
        >
          <Zap className="w-3 h-3" /> Assess <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

export default function HeritageSites() {
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = HERITAGE_SITES.filter((s) => {
    const matchesRisk = filterRisk === 'ALL' || s.riskLevel === filterRisk
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRisk && matchesSearch
  })

  const riskCounts = {
    CRITICAL: HERITAGE_SITES.filter((s) => s.riskLevel === 'CRITICAL').length,
    HIGH:     HERITAGE_SITES.filter((s) => s.riskLevel === 'HIGH').length,
    MODERATE: HERITAGE_SITES.filter((s) => s.riskLevel === 'MODERATE').length,
    LOW:      HERITAGE_SITES.filter((s) => s.riskLevel === 'LOW').length,
  }

  return (
    <div className="p-6 sm:p-8 animate-fade-in space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Gujarat Heritage Network</span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">Heritage Sites Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {HERITAGE_SITES.length} Monitored UNESCO & State Monuments · Run What-If Simulations & Score Analyses
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search site name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Risk:
          </span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filterRisk === level
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {level === 'ALL' ? `All (${HERITAGE_SITES.length})` : `${level} (${riskCounts[level]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 panel border border-slate-800 text-slate-400">
          <Landmark className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-semibold">No heritage sites match your current search/filter criteria.</p>
        </div>
      )}
    </div>
  )
}
