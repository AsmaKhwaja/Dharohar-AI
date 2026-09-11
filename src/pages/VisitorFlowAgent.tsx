import { useState } from 'react'
import {
  Users,
  MapPin,
  Activity,
  Cpu,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'
import { HERITAGE_SITES } from '../data/demoData'
import { runVisitorFlowAgent, type VisitorFlowProgressCallback } from '../services/visitorFlowAgent'
import type { VisitorFlowSnapshot, VisitorZone, AgentStep } from '../types'
import AgentWorkflow from '../components/AgentWorkflow'
import RiskBadge from '../components/RiskBadge'
import { IS_DEMO_MODE } from '../services/graniteService'

// ─── colour helpers ────────────────────────────────────────────────────────────

const PRESSURE_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  EXTREME:  { text: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
  HIGH:     { text: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)' },
  MODERATE: { text: '#eab308', bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.25)' },
  LOW:      { text: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
}

const RISK_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MODERATE: '#eab308',
  LOW:      '#22c55e',
}

// ─── Occupancy bar ────────────────────────────────────────────────────────────

function OccupancyBar({ percent, riskLevel }: { percent: number; riskLevel: string }) {
  const color = RISK_COLOR[riskLevel] || '#22c55e'
  return (
    <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, percent)}%`, background: color }}
      />
    </div>
  )
}

// ─── Hourly chart (SVG sparkline) ─────────────────────────────────────────────

function HourlyChart({ data, capacity }: { data: VisitorFlowSnapshot['hourlyData']; capacity: number }) {
  const W = 420
  const H = 80
  const PAD = 8
  const maxVal = Math.max(capacity, ...data.map((d) => d.visitors))
  const px = (i: number) => PAD + (i / (data.length - 1)) * (W - PAD * 2)
  const py = (v: number) => H - PAD - ((v / maxVal) * (H - PAD * 2))

  const capLine = H - PAD - ((capacity / maxVal) * (H - PAD * 2))

  // Visitor fill path
  const pts = data.map((d, i) => `${px(i)},${py(d.visitors)}`).join(' ')
  const areaPts = [
    `${PAD},${H - PAD}`,
    ...data.map((d, i) => `${px(i)},${py(d.visitors)}`),
    `${W - PAD},${H - PAD}`,
  ].join(' ')

  return (
    <div className="relative w-full" style={{ paddingBottom: '22%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Capacity line */}
        <line x1={PAD} y1={capLine} x2={W - PAD} y2={capLine}
          stroke="rgba(234,179,8,0.4)" strokeWidth="1" strokeDasharray="4 2" />

        {/* Visitor area fill */}
        <polygon points={areaPts} fill="rgba(201,149,42,0.07)" />

        {/* Visitor line */}
        <polyline points={pts} fill="none" stroke="rgba(201,149,42,0.7)" strokeWidth="1.5" />

        {/* Hour ticks (every 3rd) */}
        {data.map((d, i) =>
          i % 3 === 0 ? (
            <text
              key={i}
              x={px(i)}
              y={H - 1}
              textAnchor="middle"
              fill="rgba(255,255,255,0.15)"
              fontSize="6"
            >
              {d.hour}
            </text>
          ) : null
        )}
      </svg>
    </div>
  )
}

// ─── Zone card ────────────────────────────────────────────────────────────────

function ZoneCard({ zone }: { zone: VisitorZone }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${zone.occupancyPercent >= 80 ? RISK_COLOR[zone.riskLevel] + '40' : 'rgba(255,255,255,0.05)'}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-xs font-semibold" style={{ color: '#e8e4dc' }}>{zone.name}</p>
          <p className="text-[10px] text-muted">{zone.description}</p>
        </div>
        <RiskBadge level={zone.riskLevel} size="sm" />
      </div>
      <OccupancyBar percent={zone.occupancyPercent} riskLevel={zone.riskLevel} />
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-muted">{zone.currentOccupancy} / {zone.capacity} persons</span>
        <span
          className="text-[10px] font-bold"
          style={{ color: RISK_COLOR[zone.riskLevel] }}
        >
          {zone.occupancyPercent}%
        </span>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function VisitorFlowAgent() {
  const [selectedSiteId, setSelectedSiteId] = useState(HERITAGE_SITES[0].id)
  const [snapshot, setSnapshot] = useState<VisitorFlowSnapshot | null>(null)
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([])
  const [loading, setLoading] = useState(false)

  async function handleRun() {
    setLoading(true)
    setSnapshot(null)
    setAgentSteps([])

    const onProgress: VisitorFlowProgressCallback = (steps) => setAgentSteps([...steps])

    try {
      const result = await runVisitorFlowAgent(selectedSiteId, onProgress)
      setSnapshot(result)
    } finally {
      setLoading(false)
    }
  }

  const pressureC = PRESSURE_COLOR[snapshot?.pressureLevel || 'LOW']

  return (
    <div className="p-7 animate-fade-in" style={{ minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#2a4060' }}>
              Visitor Flow Management · AI Agent
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: '#f0ead8' }}>Visitor Flow Management</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4540' }}>
            Zone occupancy monitoring · Capacity thresholds · Heritage pressure routing
          </p>
        </div>
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
      </div>

      {/* Site selector + Run */}
      <div className="panel p-5 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Heritage Site</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-2">
              {HERITAGE_SITES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSiteId(s.id)}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: selectedSiteId === s.id ? 'rgba(201,149,42,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedSiteId === s.id ? 'rgba(201,149,42,0.25)' : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <p className="text-[10px] font-semibold truncate" style={{ color: selectedSiteId === s.id ? '#e8b84b' : '#8a8070' }}>
                    {s.name}
                  </p>
                  <p className="text-[9px] text-muted mt-0.5">{s.visitorPressure}</p>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleRun}
            disabled={loading}
            className="btn-primary text-sm px-6 py-2.5 flex-shrink-0"
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Analysing…</>
            ) : (
              <><Activity className="w-4 h-4" /> Run Flow Analysis</>
            )}
          </button>
        </div>
      </div>

      {/* Agent workflow */}
      {agentSteps.length > 0 && (
        <div className="panel p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-blue-400" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">AI Agent Pipeline</p>
          </div>
          <AgentWorkflow steps={agentSteps} />
        </div>
      )}

      {/* No result */}
      {!snapshot && !loading && (
        <div className="panel p-8 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: '#60a5fa' }} />
          <p className="font-serif text-base font-semibold mb-1" style={{ color: '#6a6060' }}>
            Select a site and run flow analysis
          </p>
          <p className="text-sm text-muted">
            The AI agent will assess current zone occupancy, identify capacity pressures, and generate routing recommendations.
          </p>
        </div>
      )}

      {/* Results */}
      {snapshot && (
        <div className="space-y-5">

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Visitors', value: snapshot.totalVisitors.toLocaleString(), icon: Users, color: '#60a5fa' },
              { label: 'Safe Capacity', value: snapshot.safeCapacity.toLocaleString(), icon: CheckCircle, color: '#4ade80' },
              { label: 'Occupancy', value: `${snapshot.occupancyPercent}%`, icon: Activity, color: RISK_COLOR[snapshot.pressureLevel === 'EXTREME' ? 'CRITICAL' : snapshot.pressureLevel === 'HIGH' ? 'HIGH' : 'MODERATE'] },
              { label: 'Peak Hour', value: snapshot.peakHour, icon: Clock, color: '#c9952a' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="panel p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-4 h-4" style={{ color }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</span>
                </div>
                <p className="text-xl font-bold font-serif" style={{ color: '#f0ead8' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Pressure badge + routing advice */}
          <div
            className="panel p-5"
            style={{ border: `1px solid ${pressureC.border}` }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1">Current Pressure Level</p>
                <div className="flex items-center gap-3">
                  <span
                    className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ color: pressureC.text, background: pressureC.bg, border: `1px solid ${pressureC.border}` }}
                  >
                    {snapshot.pressureLevel}
                  </span>
                  <span className="text-sm text-muted">{snapshot.totalVisitors} / {snapshot.safeCapacity} capacity</span>
                </div>
              </div>
              <OccupancyBar percent={snapshot.occupancyPercent} riskLevel={
                snapshot.occupancyPercent >= 90 ? 'CRITICAL' :
                snapshot.occupancyPercent >= 70 ? 'HIGH' :
                snapshot.occupancyPercent >= 45 ? 'MODERATE' : 'LOW'
              } />
            </div>

            <div className="p-3.5 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Routing Advice</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#b8b0a4' }}>{snapshot.routingAdvice}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Agent Recommendations</p>
              <div className="space-y-1.5">
                {snapshot.agentRecommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" style={{ color: '#c9952a' }} />
                    <p className="text-xs" style={{ color: '#9a9080' }}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Zone cards */}
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gold-500" style={{ color: '#c9952a' }} />
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Zone Occupancy</p>
              </div>
              <div className="space-y-3">
                {snapshot.zones.map((zone) => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))}
              </div>
            </div>

            {/* Hourly chart */}
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Hourly Footfall</p>
              </div>
              <div className="mb-3 flex items-center gap-4 text-[10px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 inline-block rounded" style={{ background: 'rgba(201,149,42,0.7)' }} />
                  Visitor count
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 inline-block rounded" style={{ background: 'rgba(234,179,8,0.4)' }} />
                  Safe capacity
                </span>
              </div>
              <HourlyChart data={snapshot.hourlyData} capacity={snapshot.safeCapacity} />

              {/* Heritage fabric warning */}
              {snapshot.occupancyPercent >= 70 && (
                <div
                  className="mt-4 p-3 rounded-xl flex items-start gap-2"
                  style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.2)' }}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs" style={{ color: '#9a7060' }}>
                    Visitor pressure at this level causes measurable mechanical stress on historic fabric.
                    Conservation team should be alerted if pressure remains above 70% for more than 2 hours.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-[10px] leading-relaxed" style={{ color: '#3a3530' }}>
              <span className="font-bold">AI-assisted simulation.</span>{' '}
              Visitor flow data and zone occupancy estimates are generated by the AI agent using site capacity parameters and current visitor pressure data.
              Actual visitor counts require integration with on-site footfall sensors. Recommendations are advisory — site management decisions remain with authorized heritage authorities.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
