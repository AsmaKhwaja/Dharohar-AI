
import { TrendingDown, TrendingUp, Minus, HelpCircle, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'
import type { ScoreChangeAnalysis } from '../types'
import RiskBadge from './RiskBadge'

interface ScoreChangePanelProps {
  analysis: ScoreChangeAnalysis
  onRunAssessment?: () => void
}

const IMPACT_HEX: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', LOW: '#22c55e',
}

export default function ScoreChangePanel({ analysis, onRunAssessment }: ScoreChangePanelProps) {
  const delta = analysis.delta
  const improved = delta > 0

  return (
    <div className="animate-slide-up space-y-4">
      {/* Score change visualisation */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(14,18,28,0.9)', border: '1px solid rgba(201,149,42,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4" style={{ color: '#c9952a' }} />
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#c9952a' }}>
            Heritage Health Changed
          </p>
        </div>

        {/* Visual score bars */}
        <div className="grid grid-cols-3 gap-4 items-end mb-5">
          {/* Previous */}
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: '#4a4540' }}>Previous</p>
            <div className="h-24 rounded-xl flex items-end justify-center pb-2 mb-2 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-b-xl transition-all duration-700"
                style={{ height: `${analysis.previousScore}%`, background: 'rgba(234,179,8,0.25)' }}
              />
              <span className="relative text-2xl font-bold font-serif" style={{ color: '#eab308' }}>
                {analysis.previousScore}
              </span>
            </div>
            <p className="text-[10px]" style={{ color: '#4a4540' }}>/ 100</p>
          </div>

          {/* Arrow + delta */}
          <div className="flex flex-col items-center justify-center gap-1 pb-8">
            {improved ? (
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            ) : delta < 0 ? (
              <TrendingDown className="w-6 h-6 text-red-400" />
            ) : (
              <Minus className="w-6 h-6" style={{ color: '#4a4540' }} />
            )}
            <span
              className="text-xl font-bold font-serif"
              style={{ color: improved ? '#4ade80' : delta < 0 ? '#f87171' : '#4a4540' }}
            >
              {delta > 0 ? '+' : ''}{delta}
            </span>
            <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: improved ? '#2a5040' : '#5a2020' }}>
              {improved ? 'improved' : delta < 0 ? 'declined' : 'unchanged'}
            </p>
          </div>

          {/* Current */}
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: '#4a4540' }}>Current</p>
            <div className="h-24 rounded-xl flex items-end justify-center pb-2 mb-2 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${delta < 0 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-b-xl transition-all duration-700"
                style={{ height: `${analysis.currentScore}%`, background: delta < 0 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)' }}
              />
              <span className="relative text-2xl font-bold font-serif" style={{ color: delta < 0 ? '#f87171' : '#4ade80' }}>
                {analysis.currentScore}
              </span>
            </div>
            <p className="text-[10px]" style={{ color: '#4a4540' }}>/ 100</p>
          </div>
        </div>

        {/* Primary reasons */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4a4540' }}>Primary Reasons</p>
          <div className="space-y-2">
            {analysis.primaryReasons.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${IMPACT_HEX[r.impact]}22` }}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5"
                  style={{ background: `${IMPACT_HEX[r.impact]}18`, color: IMPACT_HEX[r.impact] }}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#c8c0b4' }}>{r.factor}</span>
                    <RiskBadge level={r.impact} size="sm" />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#5a5550' }}>{r.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What should happen next */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(14,18,28,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <p className="text-sm font-bold" style={{ color: '#f0ead8' }}>What Should Happen Next?</p>
        </div>
        <div className="space-y-2 mb-4">
          {analysis.nextActions.map((a, i) => {
            const priorityColor = a.priority === 'P1' ? '#ef4444' : a.priority === 'P2' ? '#f97316' : '#3b82f6'
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${priorityColor}22` }}>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{ background: `${priorityColor}18`, color: priorityColor, border: `1px solid ${priorityColor}40` }}>
                  {a.priority}
                </span>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#c8c0b4' }}>{a.action}</p>
                  <p className="text-[10px]" style={{ color: '#4a4540' }}>{a.timeframe} · {a.stakeholder}</p>
                </div>
              </div>
            )
          })}
        </div>

        {onRunAssessment && (
          <button onClick={onRunAssessment} className="btn-primary w-full justify-center text-sm py-2.5">
            <AlertTriangle className="w-4 h-4" /> Run Full AI Assessment
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] leading-relaxed px-1" style={{ color: '#3a3530' }}>
        AI-assisted preliminary analysis. Score change analysis is based on reported incident data and does not constitute a certified engineering inspection.
        {analysis.demoMode && ' Demo AI Mode — deterministic results for demonstration purposes.'}
      </p>
    </div>
  )
}
