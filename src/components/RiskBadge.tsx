import type { RiskLevel } from '../types'

interface RiskBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md'
}

const CONFIG: Record<RiskLevel, { label: string; className: string }> = {
  CRITICAL: { label: 'Critical', className: 'risk-critical' },
  HIGH: { label: 'High', className: 'risk-high' },
  MODERATE: { label: 'Moderate', className: 'risk-moderate' },
  LOW: { label: 'Low', className: 'risk-low' },
}

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const { label, className } = CONFIG[level]
  return (
    <span
      className={`heritage-badge ${className} ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : ''}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {label}
    </span>
  )
}
