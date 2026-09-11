
import { useState } from 'react'
import { Users, ArrowRight, AlertTriangle, TrendingDown, TrendingUp, Shield } from 'lucide-react'
import type { WhatIfScenario } from '../types'
import { runWhatIfSimulator } from '../services/graniteService'
import RiskBadge from './RiskBadge'

interface WhatIfSimulatorProps {
  siteId: string
  siteName: string
}

const RISK_HEX: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', LOW: '#22c55e',
}

export default function WhatIfSimulator({ siteId, siteName }: WhatIfSimulatorProps) {
  const [changePercent, setChangePercent] = useState(30)
  const [scenario, setScenario] = useState<WhatIfScenario | null>(null)
  const [hasRun, setHasRun] = useState(false)

  const handleSimulate = () => {
    try {
      const result = runWhatIfSimulator(siteId, changePercent)
      setScenario(result)
      setHasRun(true)
    } catch {
      // site not found — should not happen with valid siteId
    }
  }

  const riskWorsened = scenario && (
    ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].indexOf(scenario.predictedRisk) >
    ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].indexOf(scenario.currentRisk)
  )

  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(14,18,28,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4" style={{ color: '#c9952a' }} />
        <p className="text-sm font-bold" style={{ color: '#f0ead8' }}>What-If Visitor Pressure Simulator</p>
      </div>
      <p className="text-xs" style={{ color: '#4a4540' }}>
        Simulate how visitor pressure changes may affect heritage health for <span style={{ color: '#8a8070' }}>{siteName}</span>.
      </p>

      {/* Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#6b6456' }}>
            Visitor Pressure Change
          </label>
          <span
            className="text-sm font-bold font-serif"
            style={{ color: changePercent > 0 ? '#f97316' : changePercent < 0 ? '#4ade80' : '#c9952a' }}
          >
            {changePercent > 0 ? '+' : ''}{changePercent}%
          </span>
        </div>
        <input
          type="range"
          min={-50}
          max={100}
          step={5}
          value={changePercent}
          onChange={(e) => { setChangePercent(Number(e.target.value)); setHasRun(false) }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(34,197,94,0.4) 0%, rgba(201,149,42,0.4) 50%, rgba(239,68,68,0.4) 100%)`,
            accentColor: '#c9952a',
          }}
        />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: '#3a3530' }}>
          <span>−50% (reduction)</span>
          <span>0%</span>
          <span>+100% (doubling)</span>
        </div>
      </div>

      <button onClick={handleSimulate} className="btn-primary w-full justify-center text-sm py-2.5">
        <Users className="w-4 h-4" />
        Simulate Scenario
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Results */}
      {hasRun && scenario && (
        <div className="space-y-3 animate-slide-up">
          {/* Before / After grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Current */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4a4540' }}>Current State</p>
              <div className="space-y-1.5">
                <div>
                  <p className="text-[10px] text-muted">Visitor Pressure</p>
                  <p className="text-base font-bold font-serif" style={{ color: '#c8c0b4' }}>{scenario.currentVisitorPressure}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted">Heritage Health</p>
                  <p className="text-xl font-bold font-serif" style={{ color: RISK_HEX[scenario.currentRisk] }}>{scenario.currentHealthScore}</p>
                </div>
                <RiskBadge level={scenario.currentRisk} size="sm" />
              </div>
            </div>

            {/* Simulated */}
            <div className="rounded-xl p-4" style={{
              background: riskWorsened ? 'rgba(239,68,68,0.05)' : 'rgba(34,197,94,0.05)',
              border: `1px solid ${riskWorsened ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
            }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: riskWorsened ? '#7a3030' : '#2a5030' }}>
                Simulated {changePercent > 0 ? '+' : ''}{changePercent}%
              </p>
              <div className="space-y-1.5">
                <div>
                  <p className="text-[10px] text-muted">Visitor Pressure</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-base font-bold font-serif" style={{ color: riskWorsened ? '#f87171' : '#86efac' }}>{scenario.simulatedVisitorPressure}</p>
                    {changePercent > 0 ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> : <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted">Predicted Health</p>
                  <p className="text-xl font-bold font-serif" style={{ color: RISK_HEX[scenario.predictedRisk] }}>{scenario.predictedHealthScore}</p>
                </div>
                <RiskBadge level={scenario.predictedRisk} size="sm" />
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#8a8070' }}>{scenario.interpretation}</p>
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4a4540' }}>Recommendations</p>
            <div className="space-y-1">
              {scenario.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: '#c9952a' }} className="text-xs flex-shrink-0">•</span>
                  <p className="text-xs" style={{ color: '#6a6050' }}>{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-amber-400 mb-0.5">AI Scenario Simulation</p>
              <p className="text-[10px]" style={{ color: '#5a5030' }}>{scenario.disclaimer}</p>
            </div>
          </div>

          {/* Knowledge note */}
          <div className="flex items-center gap-2 text-[10px]" style={{ color: '#3a3530' }}>
            <Shield className="w-3 h-3 text-muted flex-shrink-0" />
            Grounded in curated heritage knowledge · UNESCO · ASI · Heritage documentation
          </div>
        </div>
      )}
    </div>
  )
}
