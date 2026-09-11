
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
} from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import ScoreChangePanel from '../components/ScoreChangePanel'
import WhatIfSimulator from '../components/WhatIfSimulator'
import { HERITAGE_SITES, DEMO_SCORE_CHANGE } from '../data/demoData'
import type { HeritageSite, RiskLevel, ScoreChangeAnalysis } from '../types'

const CONSERVATION_STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  STABLE:       { color: '#4ade80', bg: 'rgba(34,197,94,0.1)' },
  MONITORING:   { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
  INTERVENTION: { color: '#fb923c', bg: 'rgba(249,115,22,0.1)' },
  EMERGENCY:    { color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
}

const RISK_HEX: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', LOW: '#22c55e',
}

const VISITOR_PRESSURE_COLOR: Record<string, string> = {
  LOW: '#4ade80', MODERATE: '#eab308', HIGH: '#f97316', EXTREME: '#ef4444',
}

function SiteCard({ site }: { site: HeritageSite }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [showScoreChange, setShowScoreChange] = useState(false)
  const [showSimulator, setShowSimulator] = useState(false)

  // Build score change analysis for this site
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
              factor: 'Visitor Pressure',
              impact: site.riskLevel,
              explanation: `${site.visitorPressure} visitor pressure recorded at this site. Increased footfall on historic fabric accelerates surface wear and structural stress.`,
            },
            {
              factor: 'Conservation Status',
              impact: site.conservationStatus === 'EMERGENCY' ? 'CRITICAL' : site.conservationStatus === 'INTERVENTION' ? 'HIGH' : 'MODERATE',
              explanation: `Site is currently in ${site.conservationStatus} conservation status. Ongoing monitoring and intervention work is required.`,
            },
            {
              factor: 'Inspection Recency',
              impact: site.monthsSinceInspection > 6 ? 'MODERATE' : 'LOW',
              explanation: `Last professional inspection was ${site.monthsSinceInspection} months ago. ${site.monthsSinceInspection > 6 ? 'Inspection is overdue.' : 'Inspection is within acceptable interval.'}`,
            },
          ],
          nextActions: [
            { priority: 'P1', action: 'Schedule professional heritage condition survey', reason: 'Verify AI-assessed risk with on-site expert inspection', urgency: site.riskLevel === 'CRITICAL' ? 'Within 72 hours' : 'Within 7 days', timeframe: site.riskLevel === 'CRITICAL' ? '72 hours' : '7 days', stakeholder: 'ASI Conservation Division', reviewTimeline: '7 days', justification: 'Professional verification required' },
            { priority: 'P2', action: 'Review visitor management at sensitive zones', reason: 'Visitor pressure is a primary risk driver', urgency: 'Within 2 weeks', timeframe: '2 weeks', stakeholder: 'Site Management', reviewTimeline: 'Monthly', justification: 'Reduce mechanical loading on historic fabric' },
            { priority: 'P3', action: 'Commission conservation management plan update', reason: 'Systematic planning ensures consistent methodology', urgency: 'Within 3 months', timeframe: '3 months', stakeholder: 'Heritage Authority', reviewTimeline: 'Annual', justification: 'Long-term conservation strategy' },
          ],
          generatedAt: new Date().toISOString(),
          demoMode: true,
        }

  const hasDelta = site.healthScore !== site.previousHealthScore
  const delta = site.healthScore - site.previousHealthScore

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: 'rgba(16,20,32,0.8)', border: `1px solid ${site.riskLevel === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}` }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(201,149,42,0.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = site.riskLevel === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)')}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,149,42,0.08)', border: '1px solid rgba(201,149,42,0.15)' }}>
              <Building2 className="w-4 h-4" style={{ color: '#c9952a' }} />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold" style={{ color: '#f0ead8' }}>{site.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs" style={{ color: '#4a4540' }}>
                <MapPin className="w-3 h-3" />
                <span>{site.location}</span>
              </div>
            </div>
          </div>
          <RiskBadge level={site.riskLevel} />
        </div>

        {/* Heritage type + alerts */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ background: 'rgba(201,149,42,0.06)', border: '1px solid rgba(201,149,42,0.15)', color: '#6a5a30' }}>
            {site.heritageType}
          </span>
          {site.activeAlerts > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
              <AlertTriangle className="w-3 h-3" />{site.activeAlerts} alert{site.activeAlerts !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Health score */}
        <div className="mb-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4a4540' }}>Heritage Health</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif" style={{ color: RISK_HEX[site.riskLevel] }}>{site.healthScore}</span>
              {hasDelta && (
                <div className="flex items-center gap-1" style={{ color: delta < 0 ? '#f87171' : '#4ade80' }}>
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{delta}</span>
                </div>
              )}
            </div>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${site.healthScore}%`, background: RISK_HEX[site.riskLevel] }} />
          </div>
          {hasDelta && (
            <p className="text-[10px] mt-1" style={{ color: '#4a4540' }}>
              Was {site.previousHealthScore} · Now {site.healthScore} · {delta < 0 ? 'Declined' : 'Improved'} by {Math.abs(delta)} points
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="flex items-center gap-2" style={{ color: '#4a4540' }}>
            <Users className="w-3.5 h-3.5" />
            <span>Visitors: <span className="font-semibold" style={{ color: VISITOR_PRESSURE_COLOR[site.visitorPressure] }}>{site.visitorPressure}</span></span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#4a4540' }}>
            <Clock className="w-3.5 h-3.5" />
            <span>Inspected {site.lastInspection}</span>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <span style={{ color: '#3a3530' }}>Status:</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                background: CONSERVATION_STATUS_STYLE[site.conservationStatus]?.bg,
                color: CONSERVATION_STATUS_STYLE[site.conservationStatus]?.color,
                border: `1px solid ${CONSERVATION_STATUS_STYLE[site.conservationStatus]?.color}40`,
              }}>
              {site.conservationStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-white/5 pt-4 animate-fade-in">
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#5a5550' }}>{site.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: '#4a4540' }}>
            <div><span style={{ color: '#3a3530' }}>Est.:</span> {site.established}</div>
            <div><span style={{ color: '#3a3530' }}>Coords:</span> {site.coordinates}</div>
          </div>
        </div>
      )}

      {/* Score Change */}
      {showScoreChange && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-fade-in">
          <ScoreChangePanel
            analysis={scoreChange}
            onRunAssessment={() => navigate('/assessment', { state: { siteId: site.id } })}
          />
        </div>
      )}

      {/* What-If Simulator */}
      {showSimulator && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-fade-in">
          <WhatIfSimulator siteId={site.id} siteName={site.name} />
        </div>
      )}

      {/* Footer actions */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium transition-colors" style={{ color: '#4a4540' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#c8c0b4')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#4a4540')}>
            {expanded ? 'Less' : 'Details'}
          </button>
          {hasDelta && (
            <button
              onClick={() => { setShowScoreChange(!showScoreChange); setShowSimulator(false) }}
              className="flex items-center gap-1 text-xs font-semibold transition-all px-2 py-1 rounded-lg"
              style={{
                background: showScoreChange ? 'rgba(201,149,42,0.1)' : 'transparent',
                color: showScoreChange ? '#c9952a' : '#6a6050',
              }}>
              <HelpCircle className="w-3 h-3" />
              Why score changed?
            </button>
          )}
          <button
            onClick={() => { setShowSimulator(!showSimulator); setShowScoreChange(false) }}
            className="flex items-center gap-1 text-xs font-semibold transition-all px-2 py-1 rounded-lg"
            style={{
              background: showSimulator ? 'rgba(59,130,246,0.1)' : 'transparent',
              color: showSimulator ? '#60a5fa' : '#4a5060',
            }}>
            <Users className="w-3 h-3" />
            What-If
          </button>
        </div>
        <button onClick={() => navigate('/assessment', { state: { siteId: site.id } })}
          className="text-xs font-semibold flex items-center gap-1 transition-colors btn-ghost">
          Assess <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function HeritageSites() {
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'ALL'>('ALL')

  const filtered = filterRisk === 'ALL'
    ? HERITAGE_SITES
    : HERITAGE_SITES.filter((s) => s.riskLevel === filterRisk)

  const riskCounts = {
    CRITICAL: HERITAGE_SITES.filter((s) => s.riskLevel === 'CRITICAL').length,
    HIGH:     HERITAGE_SITES.filter((s) => s.riskLevel === 'HIGH').length,
    MODERATE: HERITAGE_SITES.filter((s) => s.riskLevel === 'MODERATE').length,
    LOW:      HERITAGE_SITES.filter((s) => s.riskLevel === 'LOW').length,
  }

  return (
    <div className="p-7 animate-fade-in">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2">
          <Landmark className="w-3.5 h-3.5" style={{ color: '#c9952a' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4a4540' }}>Gujarat Heritage Network</span>
        </div>
        <h1 className="font-serif text-3xl font-bold" style={{ color: '#f0ead8' }}>Heritage Sites</h1>
        <p className="text-sm mt-1" style={{ color: '#4a4540' }}>
          {HERITAGE_SITES.length} sites monitored · Click "Why score changed?" or "What-If" on any site card
        </p>
      </div>

      {/* Risk Filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4a4540' }}>Filter:</span>
        {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((level) => (
          <button key={level} onClick={() => setFilterRisk(level)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: filterRisk === level ? 'linear-gradient(135deg, #c9952a 0%, #e8b84b 100%)' : 'rgba(255,255,255,0.03)',
              color: filterRisk === level ? '#0c0e14' : '#4a4540',
              border: `1px solid ${filterRisk === level ? 'rgba(201,149,42,0.5)' : 'rgba(255,255,255,0.07)'}`,
            }}>
            {level === 'ALL' ? `All (${HERITAGE_SITES.length})` : `${level} (${riskCounts[level]})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((site) => <SiteCard key={site.id} site={site} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: '#3a3530' }}>
          <Landmark className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No sites match the selected filter.</p>
        </div>
      )}
    </div>
  )
}
