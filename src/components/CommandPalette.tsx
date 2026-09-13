import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutDashboard,
  Landmark,
  BrainCircuit,
  FolderKanban,
  AlertOctagon,
  Users,
  BookOpen,
  X,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react'
import { HERITAGE_SITES } from '../data/demoData'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface PaletteItem {
  label: string
  path: string
  icon: any
  category: string
  detail?: string
  siteId?: string
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          setQuery('')
          setSelectedIndex(0)
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const pages: PaletteItem[] = [
    { label: 'Dashboard Center', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Heritage Sites Directory', path: '/sites', icon: Landmark, category: 'Navigation' },
    { label: 'AI Risk Assessment Engine', path: '/assessment', icon: BrainCircuit, category: 'Navigation' },
    { label: 'Conservation Case Management', path: '/cases', icon: FolderKanban, category: 'Navigation' },
    { label: 'Encroachment Buffer Monitoring', path: '/encroachment', icon: AlertOctagon, category: 'Navigation' },
    { label: 'Visitor Flow & Crowd Dynamics', path: '/visitor-flow', icon: Users, category: 'Navigation' },
    { label: 'Story Mode & Narration', path: '/story', icon: BookOpen, category: 'Navigation' },
  ]

  const siteActions: PaletteItem[] = HERITAGE_SITES.map((site) => ({
    label: `Inspect ${site.name}`,
    path: '/sites',
    icon: Shield,
    category: 'Heritage Sites',
    detail: `${site.location} · Score: ${site.healthScore}/100`,
    siteId: site.id,
  }))

  const allItems: PaletteItem[] = [...pages, ...siteActions].filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.detail && item.detail.toLowerCase().includes(query.toLowerCase())) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (item: PaletteItem) => {
    navigate(item.path, item.siteId ? { state: { siteId: item.siteId } } : undefined)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50">
          <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, page, or heritage site (e.g. 'Rani ki Vav', 'Visitor Flow')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scroll-area">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No results found for "<span className="text-amber-400 font-medium">{query}</span>"
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 text-slate-100'
                      : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{item.label}</p>
                      {item.detail && <p className="text-[10px] text-slate-400 truncate">{item.detail}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.category}
                    </span>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                Enter
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                Esc
              </kbd>
              Close
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Sparkles className="w-3 h-3" /> IBM Watson Command
          </div>
        </div>
      </div>
    </div>
  )
}
