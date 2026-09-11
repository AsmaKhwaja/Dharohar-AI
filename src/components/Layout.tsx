import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Landmark,
  BrainCircuit,
  FolderKanban,
  BookOpen,
  Shield,
  AlertTriangle,
  ArrowLeft,
  Cpu,
  AlertOctagon,
  Users,
} from 'lucide-react'

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

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0c0e14' }}>

      {/* ── Sidebar ──────────────────────────────── */}
      <aside
        className="flex flex-col w-60 flex-shrink-0"
        style={{
          background: 'rgba(10,12,20,0.97)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4 text-muted hover:text-white transition-colors text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,149,42,0.12)', border: '1px solid rgba(201,149,42,0.25)' }}
            >
              <Shield className="w-4.5 h-4.5 text-gold-500" style={{ width: '1.1rem', height: '1.1rem' }} />
            </div>
            <div>
              <p className="font-serif text-sm font-bold tracking-wider" style={{ color: '#e8b84b' }}>DHAROHAR AI</p>
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: '#4a4540' }}>Heritage Guardian</p>
            </div>
          </div>

          <p className="mt-3 text-[10px] italic leading-relaxed" style={{ color: '#3a3530' }}>
            "Detect. Understand. Prioritize. Preserve."
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/')
            return (
              <NavLink
                key={to}
                to={to}
                className={isActive ? 'nav-link-active' : 'nav-link'}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* IBM badge + status */}
        <div className="px-4 pb-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {/* IBM Powered badge */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
            style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">IBM Granite LLM</p>
              <p className="text-[9px]" style={{ color: '#3a4060' }}>watsonx.ai powered</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-ring flex-shrink-0" />
            <span className="text-xs" style={{ color: '#4a5050' }}>System Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-amber-500/60 flex-shrink-0" />
            <span className="text-[10px] font-medium" style={{ color: '#7a6030' }}>Demo Mode Active</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto scroll-area"
        style={{ background: '#0c0e14' }}
      >
        <Outlet />
      </main>
    </div>
  )
}
