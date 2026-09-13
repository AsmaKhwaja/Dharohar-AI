import { useState, useRef, useCallback, useEffect } from 'react'
import { SlidersHorizontal, Eye, ShieldCheck, Sparkles, X } from 'lucide-react'

interface BeforeAfterSliderProps {
  title: string
  siteName: string
  beforeLabel?: string
  afterLabel?: string
  beforeImage?: string
  afterImage?: string
  onClose?: () => void
}

export default function BeforeAfterSlider({
  title,
  siteName,
  beforeLabel = '1985 Archaeological Survey Baseline',
  afterLabel = '2026 IBM Multi-Spectral AI Scan',
  beforeImage = 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=80',
  afterImage = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  onClose,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(percentage)
    },
    []
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      handleMove(e.touches[0].clientX)
    },
    [isDragging, handleMove]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      handleMove(e.clientX)
    },
    [isDragging, handleMove]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Interactive Structural Comparison
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[10px] text-blue-300 font-semibold">
              LiDAR Overlay
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400">{siteName} · Drag the center split slider left/right</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Draggable Image Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="relative w-full h-80 rounded-xl overflow-hidden cursor-ew-resize select-none border border-slate-700 shadow-inner group"
      >
        {/* After Image (Background full) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-125"
        />

        {/* Before Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover filter sepia-[0.35] brightness-90 max-w-none"
            style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%' }}
          />
        </div>

        {/* Labels Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-bold text-slate-200 flex items-center gap-1.5 pointer-events-none shadow-md">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>{beforeLabel}</span>
        </div>
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 pointer-events-none shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{afterLabel}</span>
        </div>

        {/* Vertical Split Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_rgba(217,119,6,0.8)] pointer-events-none"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-xl group-hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-4 h-4 rotate-90" />
          </div>
        </div>
      </div>

      {/* Comparative Legend */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-2 gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span>Historical Mortar Formulation: <strong className="text-slate-200">Lime + Jaggery</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AI Stress Detection: <strong className="text-emerald-400">98.4% Structural Fidelity</strong></span>
        </div>
      </div>
    </div>
  )
}
