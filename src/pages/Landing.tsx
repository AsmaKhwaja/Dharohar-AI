import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Shield,
  BrainCircuit,
  ArrowRight,
  Eye,
  ChevronRight,
  Cpu,
  Users,
  AlertOctagon,
  X,
  Sparkles,
} from 'lucide-react'
import { HERITAGE_SITES, DASHBOARD_STATS } from '../data/demoData'

const FEATURES = [
  {
    icon: Cpu,
    title: 'IBM Granite LLM Architecture',
    desc: 'Structured Heritage Risk Assessments powered by IBM Granite via watsonx.ai. Multi-agent evidence reasoning, confidence metrics, and deterministic fallback mode.',
    badge: 'IBM watsonx.ai',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    icon: Shield,
    title: 'Conservation Action Engine',
    desc: 'Automated generation of immediate, short-term, and long-term intervention plans tailored to ASI/UNESCO conservation standards.',
    badge: 'Executive Plan',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  {
    icon: AlertOctagon,
    title: 'Buffer Zone Encroachment Radar',
    desc: 'Automated monitoring of 100m Prohibited and 200m Regulated heritage buffer zones against illegal construction activities.',
    badge: 'Spatial Audit',
    color: 'text-rose-400',
    border: 'border-rose-500/20',
  },
  {
    icon: Users,
    title: 'Visitor Pressure Optimizer',
    desc: 'Real-time zone occupancy tracking, capacity threshold alerts, and crowd rerouting recommendations to protect historic masonry.',
    badge: 'Flow Control',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const [activeSiteIdx, setActiveSiteIdx] = useState(0)
  const [showArchModal, setShowArchModal] = useState(false)
  const [tickTime, setTickTime] = useState('')

  useEffect(() => {
    const update = () => setTickTime(new Date().toLocaleTimeString())
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const site = HERITAGE_SITES[activeSiteIdx]

  return (
    <div className="min-h-screen bg-page text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">

      {/* ── Top Header Navigation Bar ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-slate-100 tracking-wide">DHAROHAR AI</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-amber-400 ml-2.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                IBM Hackathon 2024
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Command Center
            </button>
            <button onClick={() => navigate('/sites')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Heritage Sites
            </button>
            <button onClick={() => navigate('/assessment')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              AI Assessment
            </button>
            <button onClick={() => navigate('/encroachment')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Encroachment
            </button>
            <button onClick={() => navigate('/visitor-flow')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Visitor Flow
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchModal(true)}
              className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>IBM Architecture</span>
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-xs sm:text-sm px-4 py-2">
              Enter Platform <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            
            {/* IBM Granite Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-lg">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Powered by IBM Granite™ LLM via watsonx.ai</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-5xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight mb-4">
              DHAROHAR AI
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-amber-400 mb-6 font-serif">
              Heritage Conservation Command Center
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
              An enterprise multi-agent AI system designed for heritage authorities, ASI, and site custodians to monitor, assess, and preserve historic structures across Gujarat's World Heritage Network.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto shadow-xl"
              >
                <Shield className="w-5 h-5" />
                Launch Command Center
              </button>
              <button
                onClick={() => navigate('/assessment')}
                className="btn-ibm text-base px-8 py-3.5 w-full sm:w-auto shadow-xl"
              >
                <BrainCircuit className="w-5 h-5" />
                Run AI Incident Assessment
              </button>
            </div>
          </div>

          {/* Core Pillars Callout */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { title: 'Detect', sub: 'Structural cracks & algae' },
              { title: 'Understand', sub: 'IBM Granite reasoning' },
              { title: 'Prioritize', sub: 'Risk score matrices' },
              { title: 'Preserve', sub: 'Actionable intervention plans' },
            ].map((p, i) => (
              <div key={i} className="panel p-4 border border-slate-800">
                <p className="text-sm font-bold text-amber-400 uppercase tracking-widest">{p.title}</p>
                <p className="text-xs text-slate-400 mt-1">{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live System Strip ───────────────────────────────────────────── */}
      <section className="bg-slate-900/60 border-b border-slate-800 py-3.5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6 overflow-x-auto text-xs">
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-ring" />
            <span className="font-bold text-emerald-400 uppercase tracking-wider">Network Status: Live</span>
            <span className="text-slate-500 font-mono">[{tickTime || '12:00:00'}]</span>
          </div>

          <div className="flex items-center gap-8 flex-shrink-0 text-slate-300">
            <div>Monitored Sites: <span className="font-bold text-amber-400">{DASHBOARD_STATS.sitesMonitored} Sites</span></div>
            <div>Avg Network Health: <span className="font-bold text-emerald-400">{DASHBOARD_STATS.overallHealthScore}/100</span></div>
            <div>Active Alerts: <span className="font-bold text-rose-400">{DASHBOARD_STATS.criticalAlerts} Critical</span></div>
            <div>AI Assessments Today: <span className="font-bold text-blue-400">{DASHBOARD_STATS.assessmentsToday} Completed</span></div>
          </div>
        </div>
      </section>

      {/* ── Interactive Feature Grid ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow"><Sparkles className="w-4 h-4" /> Built for IBM Hackathon</span>
          <h2 className="section-title mt-2">Enterprise Multi-Agent Architecture</h2>
          <p className="text-sm text-slate-400 mt-2">
            Combining deterministic local reasoning fallbacks with live IBM Granite LLM intelligence via watsonx.ai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon
            return (
              <div key={idx} className={`panel p-6 border ${f.border} flex flex-col justify-between hover:border-amber-500/40 transition-all group`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-100 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">Agent #0{idx + 1}</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Monitored Heritage Sites Explorer Preview ─────────────────── */}
      <section className="bg-slate-900/40 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="eyebrow"><Eye className="w-4 h-4" /> Gujarat World Heritage Network</span>
              <h2 className="section-title mt-1">Live Monitored Heritage Network</h2>
            </div>
            <button onClick={() => navigate('/sites')} className="btn-secondary text-xs px-4 py-2 self-start md:self-auto">
              View All Sites & What-If Simulator <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Site selector list */}
            <div className="space-y-3">
              {HERITAGE_SITES.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSiteIdx(idx)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    activeSiteIdx === idx
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-slate-100">{s.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      s.riskLevel === 'CRITICAL' ? 'bg-rose-950/60 text-rose-300 border-rose-800' :
                      s.riskLevel === 'HIGH' ? 'bg-amber-950/60 text-amber-300 border-amber-800' :
                      'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    }`}>
                      {s.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{s.location} · {s.heritageType}</p>
                </div>
              ))}
            </div>

            {/* Active Site Preview Card */}
            <div className="lg:col-span-2 panel p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{site.heritageType}</span>
                    <h3 className="font-serif text-2xl font-bold text-slate-100">{site.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{site.location}</p>
                  </div>
                  <div className="text-right bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Health Index</p>
                    <p className="text-2xl font-serif font-extrabold text-amber-400">{site.healthScore}<span className="text-xs text-slate-500">/100</span></p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  {site.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Visitor Strain</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{site.visitorPressure}</p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Established</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{site.established}</p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Coordinates</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{site.coordinates}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Structural integrity monitored continuously.</span>
                <button
                  onClick={() => navigate('/assessment', { state: { siteId: site.id } })}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Assess Site Incident
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IBM Architecture Modal ─────────────────────────────────────── */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="panel p-6 max-w-2xl w-full border border-blue-500/30 space-y-5 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-100">IBM Granite AI Multi-Agent Pipeline</h3>
                  <p className="text-xs text-blue-400">Powered by IBM watsonx.ai Framework</p>
                </div>
              </div>
              <button onClick={() => setShowArchModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-900/60 text-blue-300 font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold text-slate-100">Agent 1: Structural Condition Analyst</p>
                  <p className="text-slate-400 mt-0.5">Extracts observable physical anomalies (cracks, spalling, moisture) & cross-references material degradation curves.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-900/60 text-amber-300 font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold text-slate-100">Agent 2: Heritage Risk Analyst</p>
                  <p className="text-slate-400 mt-0.5">Calculates site risk scores (0-100) taking into account environmental factors, visitor strain, & buffer violations.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-300 font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold text-slate-100">Agent 3: Conservation Advisor</p>
                  <p className="text-slate-400 mt-0.5">Synthesizes UNESCO & ASI conservation guidelines to formulate immediate and long-term action plans.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-900/60 text-purple-300 font-bold flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <p className="font-semibold text-slate-100">Agent 4: Executive Synthesis</p>
                  <p className="text-slate-400 mt-0.5">Generates executive summaries, confidence matrices, & formal conservation reports ready for authority sign-off.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">IBM Granite-13B / 20B Granite Models</span>
              <button onClick={() => setShowArchModal(false)} className="btn-secondary text-xs px-4 py-2">
                Close Architecture View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-slate-300">DHAROHAR AI</span>
            <span>— Gujarat Heritage Conservation Command Center</span>
          </div>
          <p>Built for IBM Hackathon 2024 · Gujarat World Heritage Network</p>
        </div>
      </footer>
    </div>
  )
}
