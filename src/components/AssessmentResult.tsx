
import type { AIAssessmentResult } from '../types'
import RiskBadge from './RiskBadge'
import AgentWorkflow from './AgentWorkflow'
import AIReasoningPanel from './AIReasoningPanel'
import {
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Activity,
  Shield,
} from 'lucide-react'
import { useState } from 'react'

interface AssessmentResultProps {
  result: AIAssessmentResult
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  P1:         { label: 'P1 — Immediate',    color: '#f87171', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.2)' },
  P2:         { label: 'P2 — Short-term',   color: '#fb923c', bg: 'rgba(249,115,22,0.06)',  border: 'rgba(249,115,22,0.2)' },
  P3:         { label: 'P3 — Long-term',    color: '#60a5fa', bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.2)' },
  IMMEDIATE:  { label: 'Immediate',         color: '#f87171', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.2)' },
  SHORT_TERM: { label: 'Short-term',        color: '#fb923c', bg: 'rgba(249,115,22,0.06)',  border: 'rgba(249,115,22,0.2)' },
  LONG_TERM:  { label: 'Long-term',         color: '#60a5fa', bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.2)' },
}

const RISK_HEX: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', LOW: '#22c55e',
}

export default function AssessmentResult({ result }: AssessmentResultProps) {
  const [expandedAction, setExpandedAction] = useState<number | null>(0)
  const delta = result.scoreDelta ?? (result.healthScore - result.previousHealthScore)

  return (
    <div className="space-y-4 animate-slide-up">

      {/* ── Agent Workflow ── */}
      {result.agentSteps && result.agentSteps.length > 0 && (
        <div className="panel p-5">
          <AgentWorkflow steps={result.agentSteps} />
        </div>
      )}

      {/* ── Header ── */}
      <div className="panel p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201,149,42,0.1)', border: '1px solid rgba(201,149,42,0.2)' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#c9952a' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-lg font-bold" style={{ color: '#f0ead8' }}>
                  Conservation Intelligence Report
                </h2>
                {result.demoMode && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
                    Demo AI Mode
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#4a4540' }}>
                {result.siteName} · {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <RiskBadge level={result.riskLevel} />
            <span className="text-xs font-semibold" style={{ color: '#4a4540' }}>{result.confidence}% confidence</span>
          </div>
        </div>

        {/* Score */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4a4540' }}>Heritage Health Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold font-serif" style={{ color: RISK_HEX[result.riskLevel] }}>
                {result.healthScore}
              </span>
              <span className="text-sm" style={{ color: '#4a4540' }}>/100</span>
            </div>
            {/* Health bar */}
            <div className="mt-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${result.healthScore}%`, background: RISK_HEX[result.riskLevel] }} />
            </div>
            {delta !== 0 && (
              <div className="flex items-center gap-1.5 mt-2" style={{ color: delta < 0 ? '#f87171' : '#4ade80' }}>
                {delta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                <span className="text-xs font-semibold">
                  {delta > 0 ? '+' : ''}{delta} from previous score of {result.previousHealthScore}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4a4540' }}>AI Model</p>
            <p className="text-sm font-medium" style={{ color: '#c8c0b4' }}>{result.modelUsed}</p>
            {result.stakeholder && (
              <div className="mt-3">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#4a4540' }}>Lead Stakeholder</p>
                <p className="text-xs" style={{ color: '#8a8070' }}>{result.stakeholder}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Risk Drivers ── */}
      <div className="panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-4 h-4" style={{ color: '#c9952a' }} />
          <h3 className="font-semibold" style={{ color: '#f0ead8' }}>Risk Drivers</h3>
          <span className="text-[10px] text-muted ml-auto">Impact score 0–100</span>
        </div>
        <div className="space-y-2.5">
          {result.riskDrivers.map((driver, i) => (
            <div key={i} className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${RISK_HEX[driver.severity]}22` }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: RISK_HEX[driver.severity] }} />
                <p className="text-sm font-semibold flex-1" style={{ color: '#e8e4dc' }}>{driver.factor}</p>
                <div className="flex items-center gap-2">
                  {driver.impact !== undefined && (
                    <span className="text-xs font-bold" style={{ color: RISK_HEX[driver.severity] }}>{driver.impact}/100</span>
                  )}
                  <RiskBadge level={driver.severity} size="sm" />
                </div>
              </div>
              {/* Impact bar */}
              {driver.impact !== undefined && (
                <div className="h-1 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-1 rounded-full transition-all duration-700"
                    style={{ width: `${driver.impact}%`, background: RISK_HEX[driver.severity] }} />
                </div>
              )}
              <p className="text-xs leading-relaxed" style={{ color: '#5a5550' }}>{driver.explanation || driver.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Evidence & Why ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4" style={{ color: '#c9952a' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#f0ead8' }}>Evidence Summary</h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#6a6050' }}>{result.evidenceSummary}</p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm" style={{ color: '#f0ead8' }}>Why This Site Is At Risk</h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#6a6050' }}>{result.whyAtRisk}</p>
        </div>
      </div>

      {/* ── Conservation Actions ── */}
      <div className="panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold" style={{ color: '#f0ead8' }}>Conservation Action Plan</h3>
        </div>
        <div className="space-y-2.5">
          {result.recommendedActions.map((action, i) => {
            const cfg = PRIORITY_CONFIG[action.priority as string] || PRIORITY_CONFIG['P3']
            const isExpanded = expandedAction === i
            return (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${cfg.border}`, background: cfg.bg }}>
                <button
                  onClick={() => setExpandedAction(isExpanded ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                    style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}40`, flexShrink: 0 }}>
                    {cfg.label}
                  </span>
                  <span className="text-sm font-medium flex-1 text-left" style={{ color: '#e8e4dc' }}>{action.action}</span>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: '#4a4540' }} />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#4a4540' }} />
                  }
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-2 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-1.5" style={{ color: '#6a6050' }}>
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a4540' }} />
                        <span><span style={{ color: '#4a4540' }}>Timeframe:</span> {action.timeframe || action.urgency}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: '#6a6050' }}>
                        <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a4540' }} />
                        <span className="truncate"><span style={{ color: '#4a4540' }}>Stakeholder:</span> {action.stakeholder}</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed border-t border-white/5 pt-2" style={{ color: '#6a6050' }}>
                      <span className="font-semibold" style={{ color: '#5a5050' }}>Reason: </span>
                      {action.reason || action.justification}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Monitoring Plan ── */}
      {result.monitoringPlan && (
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4" style={{ color: '#c9952a' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#f0ead8' }}>Monitoring Plan</h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#6a6050' }}>{result.monitoringPlan}</p>
        </div>
      )}

      {/* ── AI Reasoning ── */}
      {result.reasoningChain && result.reasoningChain.length > 0 && (
        <AIReasoningPanel reasoningChain={result.reasoningChain} />
      )}

      {/* ── Knowledge sources ── */}
      <div className="flex items-center gap-3 px-1" style={{ color: '#3a3530' }}>
        <Shield className="w-3.5 h-3.5 flex-shrink-0" />
        <p className="text-[10px]">
          Grounded in curated heritage knowledge · Knowledge sources: UNESCO World Heritage documentation · ASI conservation records · INTACH heritage surveys
        </p>
      </div>

      {/* ── Disclaimer ── */}
      {result.humanVerificationRequired && (
        <div className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-400 mb-1">Human Expert Verification Required</p>
            <p className="text-xs leading-relaxed" style={{ color: '#5a5030' }}>{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  )
}
