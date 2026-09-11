
import { useState } from 'react'
import { ChevronDown, ChevronUp, GitBranch, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react'
import type { ReasoningStep } from '../types'

interface AIReasoningPanelProps {
  reasoningChain: ReasoningStep[]
}

const TYPE_CONFIG = {
  evidence:       { icon: GitBranch,    color: '#60a5fa', label: 'Evidence' },
  inference:      { icon: Lightbulb,    color: '#c9952a', label: 'Inference' },
  uncertainty:    { icon: AlertTriangle,color: '#fbbf24', label: 'Uncertainty' },
  recommendation: { icon: CheckCircle,  color: '#4ade80', label: 'Recommendation' },
}

export default function AIReasoningPanel({ reasoningChain }: AIReasoningPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(14,18,28,0.8)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4" style={{ color: '#c9952a' }} />
          <span className="text-sm font-semibold" style={{ color: '#e8e4dc' }}>AI Reasoning Chain</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
            style={{ background: 'rgba(201,149,42,0.1)', border: '1px solid rgba(201,149,42,0.2)', color: '#c9952a' }}
          >
            Explainable AI
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4" style={{ color: '#4a4540' }} />
          : <ChevronDown className="w-4 h-4" style={{ color: '#4a4540' }} />
        }
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 animate-fade-in">
          <p className="text-[11px] mb-4" style={{ color: '#4a4540' }}>
            Evidence chain showing how the Heritage Health Score and Risk Level were determined.
            Items marked as <span style={{ color: '#fbbf24' }}>Uncertainty</span> require human expert verification.
          </p>
          <div className="space-y-0">
            {reasoningChain.map((step, i) => {
              const cfg = TYPE_CONFIG[step.type]
              const Icon = cfg.icon
              const isLast = i === reasoningChain.length - 1
              return (
                <div key={i} className="flex gap-3">
                  {/* Vertical line + icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}40` }}
                    >
                      <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                    </div>
                    {!isLast && <div className="w-px flex-1 my-1" style={{ background: 'rgba(255,255,255,0.05)' }} />}
                  </div>
                  {/* Content */}
                  <div className={`pb-3 ${isLast ? '' : ''}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px]" style={{ color: '#3a3530' }}>·</span>
                      <span className="text-xs font-semibold" style={{ color: '#8a8070' }}>{step.label}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#6a6050' }}>{step.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
