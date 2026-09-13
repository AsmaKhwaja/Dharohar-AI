import { useState } from 'react'
import {
  Users,
  MapPin,
  Activity,
  CheckCircle,
  RefreshCw,
  Compass,
  Sliders,
  Clock,
  Zap,
} from 'lucide-react'
import { HERITAGE_SITES } from '../data/demoData'
import { runVisitorFlowAgent, type VisitorFlowProgressCallback } from '../services/visitorFlowAgent'
import type { VisitorFlowSnapshot, VisitorZone, AgentStep } from '../types'
import AgentWorkflow from '../components/AgentWorkflow'
import RiskBadge from '../components/RiskBadge'

const PRESSURE_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  EXTREME:  { text: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)' },
  HIGH:     { text: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  MODERATE: { text: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  LOW:      { text: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
}

const RISK_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MODERATE: '#f59e0b',
  LOW:      '#10b981',
}

function OccupancyBar({ percent, riskLevel }: { percent: number; riskLevel: string }) {
  const color = RISK_COLOR[riskLevel] || '#10b981'
  return (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, percent)}%`, background: color }}
      />
    </div>
  )
}

function HourlyChart({ data, capacity }: { data: VisitorFlowSnapshot['hourlyData']; capacity: number }) {
  const W = 420
  const H = 90
  const PAD = 10
  const maxVal = Math.max(capacity, ...data.map((d) => d.visitors))
  const px = (i: number) => PAD + (i / (data.length - 1)) * (W - PAD * 2)
  const py = (v: number) => H - PAD - ((v / maxVal) * (H - PAD * 2))

  const capLine = H - PAD - ((capacity / maxVal) * (H - PAD * 2))
  const pts = data.map((d, i) => `${px(i)},${py(d.visitors)}`).join(' ')
  const areaPts = [
    `${PAD},${H - PAD}`,
    ...data.map((d, i) => `${px(i)},${py(d.visitors)}`),
    `${W - PAD},${H - PAD}`,
  ].join(' ')

  return (
    <div className="relative w-full" style={{ paddingBottom: '24%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <line x1={PAD} y1={capLine} x2={W - PAD} y2={capLine}
          stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeDasharray="4 2" />

        <polygon points={areaPts} fill="rgba(37,99,235,0.1)" />
        <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="2" />

        {data.map((d, i) =>
          i % 3 === 0 ? (
            <text key={i} x={px(i)} y={H - 2} textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="bold">
              {d.hour}
            </text>
          ) : null
        )}
      </svg>
    </div>
  )
}

export default function VisitorFlowAgent() {
  const [selectedSiteId, setSelectedSiteId] = useState(HERITAGE_SITES[0].id)
  const [snapshot, setSnapshot] = useState<VisitorFlowSnapshot | null>(null)
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([])
  const [loading, setLoading] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<number>(14) // 2:00 PM default

  async function handleRun(customTime?: number) {
    setLoading(true)
    setSnapshot(null)
    setAgentSteps([])

    const onProgress: VisitorFlowProgressCallback = (steps) => setAgentSteps([...steps])

    try {
      const result = await runVisitorFlowAgent(selectedSiteId, onProgress)
      // Adjust simulation dynamically based on time of day slider
      const targetHour = customTime ?? timeOfDay
      const multiplier = targetHour >= 11 && targetHour <= 16 ? 1.35 : 0.8
      
      const updatedZones = result.zones.map((z) => {
        const adjustedOcc = Math.min(z.capacity * 1.2, Math.round(z.currentOccupancy * multiplier))
        const pct = Math.round((adjustedOcc / z.capacity) * 100)
        const rLevel = pct >= 90 ? 'CRITICAL' : pct >= 75 ? 'HIGH' : pct >= 50 ? 'MODERATE' : 'LOW'
        return { ...z, currentOccupancy: adjustedOcc, occupancyPercent: pct, riskLevel: rLevel as VisitorZone['riskLevel'] }
      })

      const totVisitors = updatedZones.reduce((acc, z) => acc + z.currentOccupancy, 0)
      const totPercent = Math.round((totVisitors / result.safeCapacity) * 100)
      const pLevel = totPercent >= 90 ? 'EXTREME' : totPercent >= 75 ? 'HIGH' : totPercent >= 50 ? 'MODERATE' : 'LOW'

      setSnapshot({
        ...result,
        zones: updatedZones,
        totalVisitors: totVisitors,
        occupancyPercent: totPercent,
        pressureLevel: pLevel,
        peakHour: `${targetHour}:00 PM Window`,
      })
    } finally {
      setLoading(false)
    }
  }

  function handleZoneOccupancyChange(zoneId: string, newOccupancy: number) {
    if (!snapshot) return

    const updatedZones = snapshot.zones.map((z) => {
      if (z.id === zoneId) {
        const pct = Math.round((newOccupancy / z.capacity) * 100)
        const rLevel = pct >= 90 ? 'CRITICAL' : pct >= 75 ? 'HIGH' : pct >= 50 ? 'MODERATE' : 'LOW'
        return { ...z, currentOccupancy: newOccupancy, occupancyPercent: pct, riskLevel: rLevel as VisitorZone['riskLevel'] }
      }
      return z
    })

    const totVisitors = updatedZones.reduce((acc, z) => acc + z.currentOccupancy, 0)
    const totPercent = Math.round((totVisitors / snapshot.safeCapacity) * 100)
    const pLevel = totPercent >= 90 ? 'EXTREME' : totPercent >= 75 ? 'HIGH' : totPercent >= 50 ? 'MODERATE' : 'LOW'

    setSnapshot({
      ...snapshot,
      zones: updatedZones,
      totalVisitors: totVisitors,
      occupancyPercent: totPercent,
      pressureLevel: pLevel,
    })
  }

  return (
    <div className="p-6 sm:p-8 animate-fade-in space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Visitor Flow Optimization · IBM Granite Agent
            </span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">Visitor Strain Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time zone density controllers, time-of-day peak simulation, and crowd rerouting
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => handleRun()} disabled={loading} className="btn-ibm text-xs sm:text-sm px-5 py-2.5 shadow-lg">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analysing Crowd Flow...</> : <><Activity className="w-4 h-4" /> Run Visitor Flow Agent</>}
          </button>
        </div>
      </div>

      {/* Site & Time-of-Day Interactive Control Bar */}
      <div className="panel p-5 border border-slate-800 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Select Site:</span>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="form-select text-xs max-w-xs"
            >
              {HERITAGE_SITES.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.visitorPressure} Strain)</option>
              ))}
            </select>
          </div>

          <button onClick={() => handleRun()} disabled={loading} className="btn-secondary text-xs px-4 py-2 self-start md:self-auto">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Simulate Site Crowd
          </button>
        </div>

        {/* Time-of-Day Interactive Slider */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Time-of-Day Traffic Controller:
            </span>
            <span className="font-mono text-amber-400 font-bold">{timeOfDay}:00 {timeOfDay >= 12 ? 'PM' : 'AM'}</span>
          </div>
          <input
            type="range"
            min={8}
            max={20}
            value={timeOfDay}
            onChange={(e) => {
              const val = Number(e.target.value)
              setTimeOfDay(val)
              if (snapshot) handleRun(val)
            }}
            className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>08:00 AM (Opening)</span>
            <span>14:00 PM (Peak Hours)</span>
            <span>20:00 PM (Closing)</span>
          </div>
        </div>
      </div>

      {/* Output View */}
      <div className="space-y-6">

        {loading && (
          <div className="panel p-6 border border-blue-500/30 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
              <p className="font-semibold text-slate-100 text-sm">IBM Granite Visitor Agent Analysing Zone Density...</p>
            </div>
            <AgentWorkflow steps={agentSteps} />
          </div>
        )}

        {!snapshot && !loading && (
          <div className="panel p-12 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[400px]">
            <Users className="w-12 h-12 text-blue-400/40 mb-3" />
            <h3 className="font-serif text-lg font-bold text-slate-100 mb-1">Click "Simulate Site Crowd" to analyze live visitor strain</h3>
            <p className="text-xs text-slate-400 max-w-sm">Evaluates zone-by-zone occupancy, peak timeline, and generates crowd rerouting recommendations.</p>
          </div>
        )}

        {snapshot && !loading && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="panel p-4 border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Site Visitors</p>
                <p className="text-2xl font-serif font-extrabold text-slate-100 mt-1">{snapshot.totalVisitors}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Safe Limit: {snapshot.safeCapacity}</p>
              </div>

              <div className="panel p-4 border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Strain Level</p>
                <p className="text-2xl font-serif font-extrabold mt-1" style={{ color: PRESSURE_COLOR[snapshot.pressureLevel]?.text || '#3b82f6' }}>
                  {snapshot.pressureLevel}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{snapshot.occupancyPercent}% Capacity</p>
              </div>

              <div className="panel p-4 border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Peak Hour Window</p>
                <p className="text-2xl font-serif font-extrabold text-amber-400 mt-1">{snapshot.peakHour}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Highest Mechanical Stress</p>
              </div>

              <div className="panel p-4 border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Zones Tracked</p>
                <p className="text-2xl font-serif font-extrabold text-emerald-400 mt-1">{snapshot.zones.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Real-time Sensors</p>
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Interactive Zone Occupancy Sliders */}
              <div className="xl:col-span-2 panel p-6 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400" /> Interactive Zone Density Controllers
                    </h3>
                    <p className="text-xs text-slate-400">Adjust individual zone sliders to test real-time crowd strain response</p>
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-bold">Interactive Sliders</span>
                </div>

                <div className="space-y-4">
                  {snapshot.zones.map((zone) => (
                    <div key={zone.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{zone.name}</p>
                          <p className="text-[11px] text-slate-400">{zone.description}</p>
                        </div>
                        <RiskBadge level={zone.riskLevel} size="sm" />
                      </div>

                      <OccupancyBar percent={zone.occupancyPercent} riskLevel={zone.riskLevel} />

                      {/* Interactive Zone Controller Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Zone Occupancy Controller:</span>
                          <span className="font-mono text-slate-200 font-bold">{zone.currentOccupancy} / {zone.capacity} Persons ({zone.occupancyPercent}%)</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={zone.capacity * 1.3}
                          value={zone.currentOccupancy}
                          onChange={(e) => handleZoneOccupancyChange(zone.id, Number(e.target.value))}
                          className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hourly Sparkline Timeline */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 uppercase tracking-wider">Hourly Traffic Density vs. Safe Capacity</span>
                    <span className="text-amber-400 font-mono font-semibold">Dashed Line = Safe Threshold</span>
                  </div>
                  <HourlyChart data={snapshot.hourlyData} capacity={snapshot.safeCapacity} />
                </div>
              </div>

              {/* Recommendations & Routing */}
              <div className="space-y-6">
                <div className="panel p-5 border border-blue-500/20 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Compass className="w-4 h-4 text-blue-400" />
                    <h3 className="font-serif text-base font-bold text-slate-100">IBM Granite Routing Plan</h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800 text-xs text-blue-200 leading-relaxed">
                    {snapshot.routingAdvice}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Actionable Flow Recommendations</p>
                    {snapshot.agentRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
