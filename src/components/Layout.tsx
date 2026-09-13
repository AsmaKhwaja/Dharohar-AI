import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Landmark,
  BrainCircuit,
  FolderKanban,
  BookOpen,
  Shield,
  ArrowLeft,
  Cpu,
  AlertOctagon,
  Users,
  Clock,
  Menu,
  X,
  ChevronRight,
  Search,
  HelpCircle,
  Keyboard,
} from 'lucide-react'
import CommandPalette from './CommandPalette'

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sites',        icon: Landmark,        label: 'Heritage Sites' },
  { to: '/assessment',   icon: BrainCircuit,    label: 'AI Assessment' },
  { to: '/cases',        icon: FolderKanban,    label: 'Conservation Cases' },
  { to: '/encroachment', icon: AlertOctagon,    label: 'Encroachment' },
  { to: '/visitor-flow', icon: Users,           label: 'Visitor Flow' },
  { to: '/story',        icon: BookOpen,        label: 'Story Mode' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [timeStr, setTimeStr] = useState('')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [showKeyHints, setShowKeyHints] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  // Keyboard shortcut for ? key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setShowKeyHints((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const activeItem = NAV_ITEMS.find((item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))

  return (
    <div className="flex h-screen overflow-hidden bg-page text-slate-100">
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Keyboard Shortcuts Modal */}
      {showKeyHints && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-base font-bold text-slate-100">Keyboard Shortcuts Cheat Sheet</h3>
              </div>
              <button onClick={() => setShowKeyHints(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Open Command Palette</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-mono text-xs">Ctrl + K</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Toggle Shortcuts Menu</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-mono text-xs">Shift + / (?)</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Close Overlay / Modal</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-mono text-xs">Escape</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar Desktop & Overlay Mobile ────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="p-5 border-b border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.2) 0%, rgba(37,99,235,0.15) 100%)', border: '1px solid rgba(217,119,6,0.3)' }}
            >
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-serif text-base font-bold tracking-wide text-slate-100 leading-tight">DHAROHAR AI</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Heritage Guardian</p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/')
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={isActive ? 'nav-link-active' : 'nav-link'}
              >
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer info & IBM Badge */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* IBM watsonx.ai Badge */}
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center gap-3 shadow-inner">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">IBM Granite™ LLM</p>
              <p className="text-[10px] text-blue-400/80 font-medium">watsonx.ai powered</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
              <span className="font-semibold text-emerald-400">System Live</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{timeStr || '12:00:00'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar for Mobile & Breadcrumb Nav */}
        <header className="h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-400">Command Center</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-semibold text-amber-400">{activeItem?.label || 'Overview'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-medium">Quick Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 border border-slate-700 rounded text-slate-400">
                Ctrl K
              </kbd>
            </button>

            <button
              onClick={() => setShowKeyHints(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scroll-area bg-page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
