
import { CheckCircle, Loader2, Circle, XCircle } from 'lucide-react'
import type { AgentStep } from '../types'

interface AgentWorkflowProps {
  steps: AgentStep[]
  compact?: boolean
}

const STATUS_CONFIG = {
  PENDING:   { icon: Circle,       color: '#4a4540', bg: 'transparent',              label: 'Pending' },
  ANALYZING: { icon: Loader2,      color: '#c9952a', bg: 'rgba(201,149,42,0.08)',    label: 'Analyzing...' },
  COMPLETED: { icon: CheckCircle,  color: '#4ade80', bg: 'rgba(34,197,94,0.08)',     label: 'Completed' },
  FAILED:    { icon: XCircle,      color: '#f87171', bg: 'rgba(239,68,68,0.08)',     label: 'Failed' },
}

export default function AgentWorkflow({ steps, compact = false }: AgentWorkflowProps) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#4a4540' }}>
        Heritage Guardian Orchestrator — Agent Workflow
      </p>
      {steps.map((step, i) => {
        const cfg = STATUS_CONFIG[step.status]
        const Icon = cfg.icon
        const isLast = i === steps.length - 1

        return (
          <div key={step.id}>
            <div
              className="flex items-start gap-3 p-3 rounded-xl transition-all duration-300"
              style={{ background: cfg.bg, border: `1px solid ${cfg.color}22` }}
            >
              <div className="flex-shrink-0 mt-0.5">
                <Icon
                  className={`w-4 h-4 ${step.status === 'ANALYZING' ? 'animate-spin' : ''}`}
                  style={{ color: cfg.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold" style={{ color: step.status === 'PENDING' ? '#4a4540' : '#e8e4dc' }}>
                    {step.name}
                  </p>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                    style={{ color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
                {!compact && (
                  <p className="text-xs mt-0.5" style={{ color: '#4a4540' }}>{step.role}</p>
                )}
                {step.output && step.status === 'COMPLETED' && (
                  <p className="text-[11px] mt-1 font-medium" style={{ color: '#6b8060' }}>
                    ✓ {step.output}
                  </p>
                )}
              </div>
            </div>
            {/* Connector line */}
            {!isLast && (
              <div className="ml-4 w-px h-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
