import { useState } from 'react'
import {
  Video,
  X,
  Radio,
  Sliders,
  Maximize2,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Cpu,
} from 'lucide-react'

interface DroneSensorModalProps {
  isOpen: boolean
  siteName: string
  location: string
  onClose: () => void
}

export default function DroneSensorModal({ isOpen, siteName, location, onClose }: DroneSensorModalProps) {
  const [sensorMode, setSensorMode] = useState<'RGB' | 'THERMAL' | 'LIDAR' | 'ULTRASONIC'>('RGB')
  const [zoomLevel, setZoomLevel] = useState(1.5)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">LIVE FEED · DRONE UNIT #04</span>
              </div>
              <h3 className="font-serif text-base font-bold text-slate-100">{siteName} — Structural Sensor Matrix</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">{location}</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Screen */}
        <div className="relative h-96 bg-black overflow-hidden flex items-center justify-center group">
          {/* Simulated Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Background Camera Footage Simulation */}
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
            alt="Drone Feed"
            className={`w-full h-full object-cover transition-all duration-500 ${
              sensorMode === 'THERMAL'
                ? 'filter hue-rotate-180 contrast-200 saturate-200 invert'
                : sensorMode === 'LIDAR'
                ? 'filter contrast-200 grayscale sepia-100'
                : sensorMode === 'ULTRASONIC'
                ? 'filter invert contrast-150'
                : 'brightness-90 contrast-105'
            }`}
            style={{ transform: `scale(${zoomLevel})` }}
          />

          {/* Dynamic HUD Overlays */}
          <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between">
            {/* Top HUD */}
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>FPS: 60.0 | LAT: 23.832 | LON: 72.119</span>
              </div>
              <div>
                <span>ALTITUDE: 45m | WINDS: 12 km/h</span>
              </div>
            </div>

            {/* Center Target reticle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border border-amber-400/40 rounded-full border-dashed animate-spin-slow flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="flex items-center justify-between text-xs text-slate-200 bg-slate-950/80 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Active Sensor: <strong className="text-amber-300 font-bold">{sensorMode}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                {sensorMode === 'THERMAL' && <span className="text-rose-400 font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Hotspot 41.2°C Detected</span>}
                {sensorMode === 'LIDAR' && <span className="text-blue-400 font-bold flex items-center gap-1"><Compass className="w-3.5 h-3.5" /> Elevation Variance: +0.4mm</span>}
                {sensorMode === 'ULTRASONIC' && <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Mortar Density Nominal</span>}
                {sensorMode === 'RGB' && <span className="text-slate-300 font-bold">Standard Visual Inspection</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Control Toolbar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Sensor Overlay:
            </span>
            {(['RGB', 'THERMAL', 'LIDAR', 'ULTRASONIC'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSensorMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  sensorMode === mode
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Zoom:</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.25"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-xs font-mono text-amber-400 font-bold">{zoomLevel}x</span>
            <button
              onClick={() => setZoomLevel(1.5)}
              className="p-1 rounded text-slate-400 hover:text-slate-200"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
