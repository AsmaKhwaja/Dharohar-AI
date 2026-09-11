interface HealthScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-400'
  if (score >= 55) return 'text-yellow-400'
  if (score >= 35) return 'text-orange-400'
  return 'text-red-400'
}

function getBarColor(score: number): string {
  if (score >= 75) return 'bg-emerald-400'
  if (score >= 55) return 'bg-yellow-400'
  if (score >= 35) return 'bg-orange-400'
  return 'bg-red-400'
}

function getLabel(score: number): string {
  if (score >= 75) return 'Good'
  if (score >= 55) return 'Fair'
  if (score >= 35) return 'Poor'
  return 'Critical'
}

export default function HealthScore({ score, size = 'md', showLabel = true }: HealthScoreProps) {
  const colorClass = getScoreColor(score)
  const barColor = getBarColor(score)
  const label = getLabel(score)

  const textSize = size === 'lg' ? 'text-5xl' : size === 'md' ? 'text-3xl' : 'text-xl'
  const labelSize = size === 'lg' ? 'text-sm' : 'text-xs'
  const barHeight = size === 'lg' ? 'h-3' : size === 'md' ? 'h-2' : 'h-1.5'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className={`font-bold font-serif ${textSize} ${colorClass}`}>{score}</span>
        <span className="text-stone-500 text-sm">/100</span>
        {showLabel && (
          <span className={`${labelSize} font-semibold ${colorClass} uppercase tracking-wider`}>
            {label}
          </span>
        )}
      </div>
      <div className={`w-full bg-stone-800 rounded-full ${barHeight} overflow-hidden`}>
        <div
          className={`health-bar-fill ${barColor} ${barHeight}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
