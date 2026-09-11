import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'
  return (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className={`${sizeClass} text-sand-400 animate-spin`} />
      {message && <p className="text-sm text-stone-400 animate-pulse">{message}</p>}
    </div>
  )
}
