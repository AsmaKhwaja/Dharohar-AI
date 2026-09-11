import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Shield,
  BrainCircuit,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Activity,
  TrendingDown,
  Eye,
  Zap,
  CheckCircle,
  ChevronRight,
} from 'lucide-react'
import { HERITAGE_SITES, DASHBOARD_STATS } from '../data/demoData'

// Live feed ticker items
const LIVE_FEED = [
  { type: 'alert', msg: 'Pol Heritage Zone — structural shoring inspection due', time: '2m ago' },
  { type: 'ai',    msg: 'AI assessment completed: Bhadra Fort eastern rampart', time: '14m ago' },
  { type: 'alert', msg: 'Teen Darwaza — visitor pressure elevated to HIGH', time: '31m ago' },
  { type: 'ok',    msg: 'Modhera Sun Temple — kund algae treatment applied', time: '1h ago' },
  { type: 'ai',    msg: 'AI assessment: Ahmedabad Walled City encroachment report', time: '2h ago' },
]

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'IBM Granite AI Analysis',
    desc: 'Structured Heritage Risk Assessments powered by IBM Granite LLM. Explainable risk drivers, evidence summaries, and confidence scores — not black-box outputs.',
    color: 'text-blue-400',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.15)',
  },
  {
    icon: Shield,
    title: 'Conservation Action Plans',
    desc: 'Prioritised immediate, short-term, and long-term actions with responsible stakeholder assignments and review timelines — ready for conservation authority sign-off.',
    color: 'text-gold-400',
    bg: 'rgba(201,149,42,0.08)',
    border: 'rgba(201,149,42,0.2)',
  },
  {
    icon: Activity,
    title: 'Real-Time Risk Monitoring',
    desc: 'Heritage Health Scores tracked continuously across 5 Gujarat sites. Risk level changes trigger immediate alerts to the Conservation Command Center.',
    color: 'text-emerald-400',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.15)',
  },
  {
    icon: BookOpen,
    title: 'Heritage Story Engine',
    desc: 'AI-crafted visitor narratives tailored to Architecture, History, Culture, or Family audiences — turning conservation data into public engagement.',
    color: 'text-purple-400',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.15)',
  },
]

const RISK_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MODERATE: '#eab308',
  LOW:      '#22c55e',
}

function LiveFeedItem({ item, index }: { item: typeof LIVE_FEED[0]; index: number }) {
  const icon = item.type === 'alert' ? '🔴' : item.type === 'ai' ? '🟡' : '🟢'
  return (
    <div
      className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0 ticker-item"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <span className="text-sm flex-shrink-0">{icon}</span>
      <p className="text-xs text-muted-100 flex-1 leading-snug">{item.msg}</p>
      <span className="text-[10px] text-muted flex-shrink-0">{item.time}</span>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [activeSite, setActiveSite] = useState(0)
  const [tickTime, setTickTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const t = setInterval(() => setTickTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(t)
  }, [])

  const site = HERITAGE_SITES[activeSite]

  return (
    <div className="min-h-screen" style={{ background: '#0c0e14' }}>

      {/* ── Top nav bar ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5" style={{ background: 'rgba(12,14,20,0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,149,42,0.15)', border: '1px solid rgba(201,149,42,0.3)' }}>
              <Shield className="w-4 h-4 text-gold-500" />
            </div>
            <div>
              <span className="font-serif text-base font-bold text-gold-400 tracking-wider">DHAROHAR AI</span>
              <span className="hidden sm:inline text-xs text-muted ml-2">Heritage Guardian</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {['Dashboard', 'Heritage Sites', 'AI Assessment', 'Story Mode'].map((item) => (
              <button
                key={item}
                onClick={() => navigate(item === 'Dashboard' ? '/dashboard' : item === 'Heritage Sites' ? '/sites' : item === 'AI Assessment' ? '/assessment' : '/story')}
                className="text-sm text-muted-100 hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-ring" />
              <span className="text-xs font-semibold text-emerald-400">Live</span>
            </div>
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm px-4 py-2">
              Enter Command Center
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] -top-80 left-1/2 -translate-x-1/2" style={{ background: 'rgba(201,149,42,0.06)' }} />
        <div className="orb w-[400px] h-[400px] top-20 -left-40" style={{ background: 'rgba(59,130,246,0.04)' }} />
        <div className="orb w-[300px] h-[300px] top-40 -right-20" style={{ background: 'rgba(168,85,247,0.04)' }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'rgba(201,149,42,0.08)', border: '1px solid rgba(201,149,42,0.2)' }}>
              <Zap className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold-500">Powered by IBM Granite LLM</span>
            </div>

            {/* Title */}
            <h1 className="animate-slide-up font-serif text-5xl sm:text-6xl font-bold leading-tight mb-4" style={{ color: '#f0ead8' }}>
              DHAROHAR AI
            </h1>
            <h2 className="animate-slide-up delay-100 font-serif text-2xl sm:text-3xl font-medium mb-4 text-glow-gold" style={{ color: '#e8b84b' }}>
              AI Heritage Guardian
            </h2>
            <p className="animate-slide-up delay-200 text-lg font-medium tracking-widest mb-6" style={{ color: '#6b6456' }}>
              Detect &nbsp;·&nbsp; Understand &nbsp;·&nbsp; Prioritize &nbsp;·&nbsp; Preserve
            </p>
            <p className="animate-slide-up delay-300 text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#8a8070' }}>
              An AI-powered Conservation Command Center that combines incident evidence, heritage context, and visitor pressure with IBM Granite to produce explainable risk assessments — enabling faster, smarter conservation decisions.
            </p>

            {/* CTAs */}
            <div className="animate-slide-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto justify-center"
              >
                <BrainCircuit className="w-5 h-5" />
                Enter Command Center
              </button>
              <button
                onClick={() => navigate('/story')}
                className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto justify-center"
              >
                <BookOpen className="w-5 h-5" />
                Explore Heritage Story
              </button>
            </div>
          </div>

          {/* System not a chatbot callout */}
          <div className="animate-slide-up delay-500 mt-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-sm" style={{ background: 'rgba(201,149,42,0.05)', border: '1px solid rgba(201,149,42,0.12)' }}>
              <Shield className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <span style={{ color: '#8a8070' }}>
                <span style={{ color: '#c9952a' }} className="font-semibold">This is a Conservation Intelligence System</span>, not a chatbot.
                Built for government heritage authorities, site managers, and conservation professionals.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live metrics strip ──────────────────────────────── */}
      <section className="border-y border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-8 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Live</span>
              <span className="text-xs text-muted">{tickTime}</span>
            </div>
            {[
              { label: 'Heritage Health', value: `${DASHBOARD_STATS.overallHealthScore}/100`, color: '#eab308' },
              { label: 'Active Alerts', value: DASHBOARD_STATS.criticalAlerts, color: '#ef4444' },
              { label: 'Sites Monitored', value: DASHBOARD_STATS.sitesMonitored, color: '#3b82f6' },
              { label: 'Active Cases', value: DASHBOARD_STATS.activeConservationCases, color: '#c9952a' },
              { label: 'AI Assessments Today', value: DASHBOARD_STATS.assessmentsToday, color: '#22c55e' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-bold font-serif" style={{ color: m.color }}>{m.value}</span>
                <span className="text-xs text-muted">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main demo section ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left — Site Explorer */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <div className="eyebrow mb-2"><Eye className="w-3.5 h-3.5" /> Heritage Site Network</div>
              <h3 className="section-title">Gujarat Conservation Network</h3>
              <p className="text-sm mt-1" style={{ color: '#6b6456' }}>5 sites monitored · Click a site for live intelligence</p>
            </div>

            {/* Site grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HERITAGE_SITES.map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSite(i)}
                  className="site-card cursor-pointer rounded-2xl p-4"
                  style={{
                    background: activeSite === i ? 'rgba(201,149,42,0.08)' : 'rgba(16,20,32,0.8)',
                    border: `1px solid ${activeSite === i ? 'rgba(201,149,42,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-white leading-snug">{s.name}</p>
                      <p className="text-xs text-muted mt-0.5">{s.location}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 risk-dot-${s.riskLevel.toLowerCase()}`} style={{ background: RISK_COLOR[s.riskLevel] }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: RISK_COLOR[s.riskLevel] }}>{s.riskLevel}</span>
                    </div>
                  </div>
                  {/* Health bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-[10px] text-muted mb-1">
                      <span>Heritage Health</span>
                      <span className="font-bold" style={{ color: RISK_COLOR[s.riskLevel] }}>{s.healthScore}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${s.healthScore}%`, background: RISK_COLOR[s.riskLevel] }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted">{s.heritageType}</span>
                    {s.activeAlerts > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
                        <AlertTriangle className="w-3 h-3" />{s.activeAlerts}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Active site detail */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(16,20,32,0.8)', border: '1px solid rgba(201,149,42,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="eyebrow text-[10px]"><Activity className="w-3 h-3" /> Selected Site</div>
                <button onClick={() => navigate('/assessment')} className="btn-ghost text-xs flex items-center gap-1">
                  Run Assessment <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">{site.name}</h4>
                  <p className="text-xs text-muted mt-0.5">{site.location} · Est. {site.established}</p>
                  <p className="text-xs mt-3 leading-relaxed" style={{ color: '#6b6456' }}>{site.description.slice(0, 160)}...</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold font-serif" style={{ color: RISK_COLOR[site.riskLevel] }}>{site.healthScore}</p>
                  <p className="text-[10px] text-muted">Health Score</p>
                  <span className="heritage-badge mt-2 inline-block" style={{
                    background: `${RISK_COLOR[site.riskLevel]}22`,
                    color: RISK_COLOR[site.riskLevel],
                    border: `1px solid ${RISK_COLOR[site.riskLevel]}55`,
                    fontSize: '10px',
                  }}>
                    ● {site.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — AI Intelligence Panel */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="eyebrow mb-2"><BrainCircuit className="w-3.5 h-3.5" /> AI Conservation Intelligence</div>
              <h3 className="section-title">Why is heritage health changing?</h3>
            </div>

            {/* Intelligence card */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(16,20,32,0.9)', border: '1px solid rgba(201,149,42,0.2)' }}>
              {/* Score */}
              <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Heritage Health Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-serif text-gold-400">64</span>
                    <span className="text-sm text-muted">/100</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-sm font-bold text-red-400">−11</span>
                  <span className="text-xs text-muted">this week</span>
                </div>
              </div>

              {/* Risk drivers */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Risk Drivers</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Increased visitor pressure', severity: 'HIGH', color: '#f97316' },
                    { label: 'New surface deterioration detected', severity: 'HIGH', color: '#f97316' },
                    { label: 'Moisture exposure from drainage failure', severity: 'MODERATE', color: '#eab308' },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs flex-1" style={{ color: '#c8c0b4' }}>{d.label}</span>
                      <span className="text-[10px] font-bold uppercase" style={{ color: d.color }}>{d.severity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(201,149,42,0.06)', border: '1px solid rgba(201,149,42,0.2)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-500">Recommended Action</p>
                </div>
                <p className="text-sm font-medium text-white leading-snug">
                  Schedule expert inspection within 7 days. Deploy temporary protective barriers at identified deterioration zones.
                </p>
                <p className="text-xs mt-2 text-muted">Stakeholder: ASI Conservation Division · Review: 72 hours</p>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate('/assessment')}
                className="btn-primary w-full justify-center text-sm py-3"
              >
                <BrainCircuit className="w-4 h-4" />
                Run AI Assessment Now
              </button>
            </div>

            {/* Live feed */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(16,20,32,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Live Activity</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-ring" />
                  <span className="text-[10px] text-emerald-400 font-semibold">LIVE</span>
                </div>
              </div>
              {LIVE_FEED.map((item, i) => (
                <LiveFeedItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature cards ──────────────────────────────── */}
      <section className="border-t border-white/5" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="eyebrow mb-3 justify-center">Built for heritage professionals</div>
            <h3 className="font-serif text-3xl font-bold" style={{ color: '#f0ead8' }}>
              Conservation Intelligence at Every Level
            </h3>
            <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: '#6b6456' }}>
              From field incident reports to AI-powered action plans — DHAROHAR AI closes the gap between observation and intervention.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl p-5 animate-slide-up"
                style={{
                  background: f.bg,
                  border: `1px solid ${f.border}`,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h4 className={`text-sm font-bold mb-2 ${f.color}`}>{f.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#6b6456' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────── */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-serif text-3xl font-bold mb-4" style={{ color: '#f0ead8' }}>
              Heritage Conservation Demands Intelligent Action
            </h3>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: '#6b6456' }}>
              Every delayed inspection is a risk compounded. Every unlogged incident is a pattern missed. DHAROHAR AI gives conservation authorities the speed and clarity to act before deterioration becomes irreversible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-base px-8 py-4 w-full sm:w-auto justify-center"
              >
                <BrainCircuit className="w-5 h-5" />
                Launch Command Center
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <button
                onClick={() => navigate('/assessment')}
                className="btn-secondary text-base px-8 py-4 w-full sm:w-auto justify-center"
              >
                Run AI Assessment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold-500" />
            <span className="font-serif text-sm font-bold text-gold-400">DHAROHAR AI</span>
            <span className="text-xs text-muted">Heritage Guardian</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted">
            <span>Powered by IBM Granite LLM</span>
            <span>·</span>
            <span>ASI · INTACH · UNESCO data</span>
            <span>·</span>
            <span>Gujarat Heritage Network</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
