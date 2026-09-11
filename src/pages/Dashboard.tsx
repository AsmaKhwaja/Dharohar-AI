import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  AlertTriangle,
  Eye,
  Users,
  FolderKanban,
  BrainCircuit,
  TrendingDown,
  Clock,
  MapPin,
  ChevronRight,
  Activity,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  FileText,
  Download,
  X,
  RefreshCw,
} from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import { HERITAGE_SITES, DEMO_CASES, DASHBOARD_STATS, DEMO_ASSESSMENT } from '../data/demoData'
import { generateConservationReport } from '../services/conservationReportAgent'
import type { ConservationReport } from '../types'

// ─── colour helpers ────────────────────────────────────────────────────────

const RISK_HEX: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MODERATE: '#eab308',
  LOW:      '#22c55e',
}

const STAT_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  sand:    { text: '#c9952a', bg: 'rgba(201,149,42,0.08)',  border: 'rgba(201,149,42,0.2)' },
  red:     { text: '#f87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)' },
  blue:    { text: '#60a5fa', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)' },
  emerald: { text: '#4ade80', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)' },
  orange:  { text: '#fb923c', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.2)' },
  purple:  { text: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)' },
}

// ─── sub-components ────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delta,
  color = 'sand',
}: {
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>
  label: string
  value: string | number
  sub?: string
  delta?: string
  color?: string
}) {
  const c = STAT_COLORS[color]
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <Icon className="w-4.5 h-4.5" style={{ color: c.text, width: '1.05rem', height: '1.05rem' }} />
        </div>
        <Activity className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: c.text }} />
      </div>
      <p className="text-2xl font-bold font-serif mb-0.5" style={{ color: '#f0ead8' }}>{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: '#4a4540' }}>{label}</p>
      {sub && <p className="text-[10px]" style={{ color: '#3a3530' }}>{sub}</p>}
      {delta && (
        <p className="text-[10px] font-semibold mt-1 flex items-center gap-1" style={{ color: c.text }}>
          <TrendingDown className="w-3 h-3" />{delta}
        </p>
      )}
    </div>
  )
}

function HealthBar({ score }: { score: number }) {
  const color = RISK_HEX[score < 35 ? 'CRITICAL' : score < 55 ? 'HIGH' : score < 75 ? 'MODERATE' : 'LOW']
  return (
    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const stats = DASHBOARD_STATS
  const recentCases = DEMO_CASES.slice(0, 4)
  const [selectedSiteIdx, setSelectedSiteIdx] = useState(0)
  const selectedSite = HERITAGE_SITES[selectedSiteIdx]
  const [report, setReport] = useState<ConservationReport | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)

  async function handleGenerateReport() {
    setReportLoading(true)
    setShowReport(true)
    try {
      const r = await generateConservationReport()
      setReport(r)
    } finally {
      setReportLoading(false)
    }
  }

  function handleDownloadReport() {
    if (!report) return
    const blob = new Blob([report.markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `DHAROHAR-AI-Conservation-Report-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-7 animate-fade-in" style={{ minHeight: '100vh' }}>

      {/* ── Page header ─────────────────────────────── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-ring" />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#3a5040' }}>Conservation Command Center · Live</span>
          </div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: '#f0ead8' }}>Heritage Guardian Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4540' }}>
            Gujarat Heritage Network · {HERITAGE_SITES.length} sites monitored · Updated {new Date(stats.lastUpdated).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => navigate('/story')} className="btn-secondary text-sm px-4 py-2">
            <BookOpen className="w-4 h-4" /> Story Mode
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="btn-secondary text-sm px-4 py-2"
          >
            {reportLoading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</>
              : <><FileText className="w-4 h-4" /> Conservation Report</>
            }
          </button>
          <button onClick={() => navigate('/assessment')} className="btn-primary text-sm px-5 py-2">
            <BrainCircuit className="w-4 h-4" /> Run AI Assessment
          </button>
        </div>
      </div>

      {/* ── Critical alert banner ─────────────────── */}
      {stats.criticalAlerts > 0 && (
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-ring flex-shrink-0" />
          <p className="text-sm flex-1" style={{ color: '#fca5a5' }}>
            <span className="font-bold">{stats.criticalAlerts} active alerts</span>
            <span style={{ color: '#8a4040' }}> require immediate conservation attention across monitored sites.</span>
          </p>
          <button onClick={() => navigate('/cases')} className="btn-ghost text-xs flex items-center gap-1">
            View Cases <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Stats row ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-7">
        <StatCard icon={Shield}      label="Heritage Health"  value={`${stats.overallHealthScore}/100`} sub="Avg across 5 sites"              color="sand" />
        <StatCard icon={AlertTriangle} label="Active Alerts"  value={stats.criticalAlerts}              sub="Require attention" delta="↓ since yesterday" color="red" />
        <StatCard icon={Eye}          label="Sites Monitored" value={stats.sitesMonitored}              sub="Gujarat network"                 color="blue" />
        <StatCard icon={Users}        label="Visitor Pressure" value={stats.averageVisitorPressure}     sub="Current avg"                    color="orange" />
        <StatCard icon={FolderKanban} label="Active Cases"    value={stats.activeConservationCases}     sub="Conservation cases"             color="purple" />
        <StatCard icon={BrainCircuit} label="AI Assessments"  value={stats.assessmentsToday}            sub="Today"                          color="emerald" />
      </div>

      {/* ── Main grid ────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

        {/* ── Site Explorer ─────────────────── */}
        <div className="xl:col-span-2 panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="eyebrow text-[10px] mb-1"><Eye className="w-3 h-3" /> Site Explorer</div>
              <h2 className="font-serif text-lg font-bold" style={{ color: '#f0ead8' }}>Heritage Network</h2>
            </div>
            <button onClick={() => navigate('/sites')} className="btn-ghost text-xs flex items-center gap-1">
              All Sites <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Site list */}
          <div className="space-y-2 mb-4">
            {HERITAGE_SITES.map((site, i) => (
              <div
                key={site.id}
                onClick={() => setSelectedSiteIdx(i)}
                className="group flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: selectedSiteIdx === i ? 'rgba(201,149,42,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedSiteIdx === i ? 'rgba(201,149,42,0.2)' : 'rgba(255,255,255,0.04)'}`,
                }}
              >
                {/* Risk dot */}
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: RISK_HEX[site.riskLevel] }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate" style={{ color: '#e8e4dc' }}>{site.name}</p>
                    <RiskBadge level={site.riskLevel} size="sm" />
                  </div>
                  <HealthBar score={site.healthScore} />
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-base font-bold font-serif" style={{ color: RISK_HEX[site.riskLevel] }}>{site.healthScore}</p>
                    <p className="text-[9px] text-muted">health</p>
                  </div>
                  {site.activeAlerts > 0 && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-[10px] font-bold text-red-400">{site.activeAlerts}</span>
                    </div>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted" />
                </div>
              </div>
            ))}
          </div>

          {/* Selected site detail card */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1">Selected Site</p>
                <h3 className="font-serif text-lg font-bold mb-1" style={{ color: '#f0ead8' }}>{selectedSite.name}</h3>
                <div className="flex items-center gap-3 text-[11px] text-muted mb-2 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedSite.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Inspected {selectedSite.lastInspection}</span>
                </div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#4a4540' }}>{selectedSite.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-bold font-serif" style={{ color: RISK_HEX[selectedSite.riskLevel] }}>{selectedSite.healthScore}</p>
                <p className="text-[10px] text-muted mb-2">health score</p>
                <button
                  onClick={() => navigate('/assessment', { state: { siteId: selectedSite.id } })}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  <Zap className="w-3 h-3" /> Assess
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Intelligence + Cases ────────── */}
        <div className="flex flex-col gap-4">

          {/* AI Intelligence Panel */}
          <div className="panel p-5 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,149,42,0.1)', border: '1px solid rgba(201,149,42,0.2)' }}>
                <BrainCircuit className="w-3.5 h-3.5" style={{ color: '#c9952a' }} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted">AI Conservation Intelligence</p>
                <p className="text-sm font-semibold" style={{ color: '#f0ead8' }}>Why is health changing?</p>
              </div>
            </div>

            {/* Score */}
            <div
              className="flex items-center justify-between p-3.5 rounded-xl mb-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">{DEMO_ASSESSMENT.siteName}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-serif" style={{ color: '#e8b84b' }}>{DEMO_ASSESSMENT.healthScore}</span>
                  <span className="text-sm text-muted">/100</span>
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                <span className="text-sm font-bold text-red-400">{DEMO_ASSESSMENT.healthScore - DEMO_ASSESSMENT.previousHealthScore}</span>
                <span className="text-[10px] text-muted hidden sm:inline">pts</span>
              </div>
            </div>

            {/* Risk drivers */}
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2">Risk Drivers</p>
            <div className="space-y-1.5 mb-3">
              {DEMO_ASSESSMENT.riskDrivers.slice(0, 3).map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RISK_HEX[d.severity] }} />
                  <span className="text-xs flex-1 line-clamp-1" style={{ color: '#9a9080' }}>{d.factor}</span>
                  <span className="text-[9px] font-bold uppercase" style={{ color: RISK_HEX[d.severity] }}>{d.severity}</span>
                </div>
              ))}
            </div>

            {/* Recommended action */}
            <div
              className="p-3.5 rounded-xl mb-3"
              style={{ background: 'rgba(201,149,42,0.05)', border: '1px solid rgba(201,149,42,0.18)' }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold-500">Recommended Action</p>
              </div>
              <p className="text-xs leading-relaxed font-medium" style={{ color: '#c8c0b4' }}>
                {DEMO_ASSESSMENT.recommendedActions[0]?.action.slice(0, 110)}...
              </p>
              <p className="text-[10px] mt-1.5 text-muted">
                Urgency: {DEMO_ASSESSMENT.recommendedActions[0]?.urgency}
              </p>
            </div>

            <button
              onClick={() => navigate('/assessment')}
              className="btn-primary w-full justify-center text-xs py-2.5"
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Run AI Assessment
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Quick Cases */}
          <div className="panel p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Recent Cases</p>
              <button onClick={() => navigate('/cases')} className="btn-ghost text-xs flex items-center gap-1">
                All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {recentCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate('/cases')}
                  className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(201,149,42,0.18)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)')}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: RISK_HEX[c.riskLevel] }} />
                  <p className="text-xs flex-1 line-clamp-1" style={{ color: '#8a8070' }}>{c.title}</p>
                  <RiskBadge level={c.riskLevel} size="sm" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom: Latest assessment detail ─────── */}
      <div
        className="panel p-5"
        style={{ borderColor: 'rgba(201,149,42,0.15)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,149,42,0.1)', border: '1px solid rgba(201,149,42,0.2)' }}>
              <Activity className="w-4 h-4" style={{ color: '#c9952a' }} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Latest AI Assessment</p>
              <p className="text-sm font-semibold" style={{ color: '#f0ead8' }}>{DEMO_ASSESSMENT.siteName}</p>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}
            >
              Demo
            </span>
          </div>
          <button onClick={() => navigate('/assessment')} className="btn-primary text-xs px-4 py-2">
            New Assessment
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-muted mb-1 uppercase tracking-wider">Health Score</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-serif text-orange-400">{DEMO_ASSESSMENT.healthScore}</span>
              <span className="flex items-center gap-0.5 text-xs text-red-400 font-semibold">
                <TrendingDown className="w-3 h-3" />
                {DEMO_ASSESSMENT.healthScore - DEMO_ASSESSMENT.previousHealthScore}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted mb-1 uppercase tracking-wider">Risk Level</p>
            <RiskBadge level={DEMO_ASSESSMENT.riskLevel} />
          </div>
          <div>
            <p className="text-[10px] text-muted mb-1 uppercase tracking-wider">Confidence</p>
            <p className="text-sm font-bold" style={{ color: '#c8c0b4' }}>{DEMO_ASSESSMENT.confidence}%</p>
          </div>
          <div>
            <p className="text-[10px] text-muted mb-1 uppercase tracking-wider">Top Risk Driver</p>
            <p className="text-xs font-medium" style={{ color: '#9a9080' }}>{DEMO_ASSESSMENT.riskDrivers[0]?.factor}</p>
          </div>
        </div>

        <div
          className="mt-4 p-3.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#5a5550' }}>
            <span className="font-semibold" style={{ color: '#6a6060' }}>Evidence: </span>
            {DEMO_ASSESSMENT.evidenceSummary}
          </p>
        </div>
      </div>

      {/* ── Conservation Report Modal ─────────────────── */}
      {showReport && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-6 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full max-w-3xl rounded-2xl p-6 mt-8 mb-8"
            style={{ background: '#13151f', border: '1px solid rgba(201,149,42,0.2)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,149,42,0.1)', border: '1px solid rgba(201,149,42,0.2)' }}>
                  <FileText className="w-4 h-4" style={{ color: '#c9952a' }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Conservation Reporting Agent</p>
                  <p className="font-serif text-base font-bold" style={{ color: '#f0ead8' }}>Gujarat Heritage Network Report</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {report && (
                  <button onClick={handleDownloadReport} className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5">
                    <Download className="w-3.5 h-3.5" /> Download .md
                  </button>
                )}
                <button onClick={() => setShowReport(false)} className="btn-ghost p-1.5">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {reportLoading && (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" style={{ color: '#c9952a' }} />
                <p className="text-sm text-muted">Generating conservation report…</p>
                <p className="text-xs text-muted mt-1">IBM Granite is analysing all 5 heritage sites</p>
              </div>
            )}

            {report && !reportLoading && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Network Summary</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#b8b0a4' }}>{report.networkSummary}</p>
                </div>

                {/* Priority sites */}
                {report.prioritySites.length > 0 && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#ef4444' }}>Priority Sites — Immediate Attention Required</p>
                    {report.prioritySites.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        <p className="text-xs" style={{ color: '#c87070' }}>{s}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Site reports */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Per-Site Status</p>
                  <div className="space-y-3">
                    {report.siteReports.map((sr) => (
                      <div
                        key={sr.siteId}
                        className="p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold" style={{ color: '#e8e4dc' }}>{sr.siteName}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-serif" style={{ color: sr.healthScore < 55 ? '#f97316' : '#e8b84b' }}>{sr.healthScore}</span>
                            <RiskBadge level={sr.riskLevel} size="sm" />
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Issues</p>
                          {sr.keyIssues.slice(0, 2).map((issue, i) => (
                            <p key={i} className="text-[11px] text-muted line-clamp-1">• {issue}</p>
                          ))}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Actions</p>
                          {sr.recommendedActions.slice(0, 2).map((action, i) => (
                            <p key={i} className="text-[11px] text-muted line-clamp-1">→ {action}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall recs */}
                <div className="p-4 rounded-xl" style={{ background: 'rgba(201,149,42,0.04)', border: '1px solid rgba(201,149,42,0.15)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#c9952a' }}>Network Recommendations</p>
                  {report.overallRecommendations.slice(0, 5).map((r, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <span className="text-[10px] font-bold flex-shrink-0" style={{ color: '#c9952a' }}>{i + 1}.</span>
                      <p className="text-xs" style={{ color: '#8a8070' }}>{r}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[10px] text-muted">Generated: {new Date(report.generatedAt).toLocaleString()} · {report.modelUsed}</p>
                  <button onClick={handleDownloadReport} className="btn-primary text-xs px-4 py-2">
                    <Download className="w-3.5 h-3.5" /> Export Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
