import { AlertTriangle, X } from 'lucide-react'

interface ErrorAlertProps {
  message: string
  onDismiss?: () => void
}

export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-700/40 rounded-lg text-red-300">
      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-200 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
