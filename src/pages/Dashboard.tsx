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
  BookOpen,
  FileText,
  Download,
  X,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import { HERITAGE_SITES, DEMO_CASES, DASHBOARD_STATS, DEMO_ASSESSMENT } from '../data/demoData'
import { generateConservationReport } from '../services/conservationReportAgent'
import type { ConservationReport } from '../types'

const RISK_HEX: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MODERATE: '#f59e0b',
  LOW:      '#10b981',
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delta,
  color = 'gold',
}: {
  icon: React.FC<{ className?: string }>
  label: string
  value: string | number
  sub?: string
  delta?: string
  color?: 'gold' | 'red' | 'blue' | 'emerald' | 'purple' | 'amber'
}) {
  return (
    <div className="stat-card group border border-slate-800 hover:border-amber-500/40">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${
            color === 'red' ? 'text-rose-400' :
            color === 'blue' ? 'text-blue-400' :
            color === 'emerald' ? 'text-emerald-400' :
            color === 'purple' ? 'text-purple-400' : 'text-amber-400'
          }`} />
        </div>
        <Activity className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
      </div>
      <p className="text-2xl font-bold font-serif text-slate-100 mb-0.5">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
      {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
      {delta && (
        <p className="text-[11px] font-semibold mt-1 flex items-center gap-1 text-rose-400">
          <TrendingDown className="w-3 h-3" />{delta}
        </p>
      )}
    </div>
  )
}

function HealthBar({ score }: { score: number }) {
  const color = score < 35 ? '#ef4444' : score < 55 ? '#f97316' : score < 75 ? '#f59e0b' : '#10b981'
  return (
    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const stats = DASHBOARD_STATS
  const recentCases = DEMO_CASES.slice(0, 4)
  const [selectedSiteIdx, setSelectedSiteIdx] = useState(0)
  const selectedSite = HERITAGE_SITES[selectedSiteIdx]
  const [report, setReport] = useState<ConservationReport | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

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

  // Dynamic multiplier for interactive time range filter
  const timeMult = timeRange === '1h' ? 0.2 : timeRange === '24h' ? 1 : timeRange === '7d' ? 4.5 : 18

  return (
    <div className="p-6 sm:p-8 animate-fade-in space-y-8 min-h-screen">

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Conservation Command Center · Live Network
            </span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">Heritage Guardian Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gujarat Heritage Network · {HERITAGE_SITES.length} UNESCO & State Heritage Sites Monitored
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Interactive Timeframe Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 ml-2" />
            {(['1h', '24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeRange === t ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button onClick={() => navigate('/story')} className="btn-secondary text-xs px-4 py-2.5">
            <BookOpen className="w-4 h-4 text-amber-400" /> Story Mode
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="btn-secondary text-xs px-4 py-2.5"
          >
            {reportLoading ? (
              <><RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> Generating…</>
            ) : (
              <><FileText className="w-4 h-4 text-blue-400" /> Conservation Report</>
            )}
          </button>
          <button onClick={() => navigate('/assessment')} className="btn-primary text-xs sm:text-sm px-5 py-2.5 shadow-lg">
            <BrainCircuit className="w-4 h-4" /> Run AI Assessment
          </button>
        </div>
      </div>

      {/* ── Critical Alert Banner ───────────────────────────────────────── */}
      {stats.criticalAlerts > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse-ring flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-rose-300">
                {stats.criticalAlerts} Critical Structural Alerts Active ({timeRange} Window)
              </p>
              <p className="text-xs text-rose-400/80">Immediate engineering inspection required for Teen Darwaza ramparts and Pol Zone shoring.</p>
            </div>
          </div>
          <button onClick={() => navigate('/cases')} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1 flex-shrink-0">
            View Cases <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 6 KPI Stat Cards Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Shield}        label="Heritage Health"  value={`${stats.overallHealthScore}/100`} sub="Network Average" color="gold" />
        <StatCard icon={AlertTriangle} label="Active Alerts"  value={stats.criticalAlerts}              sub="Action Required" delta="High Risk" color="red" />
        <StatCard icon={Eye}          label="Sites Monitored" value={stats.sitesMonitored}              sub="Gujarat Network" color="blue" />
        <StatCard icon={Users}        label="Visitor Strain"   value={stats.averageVisitorPressure}     sub="Peak Hours" color="amber" />
        <StatCard icon={FolderKanban} label="Active Cases"    value={Math.round(stats.activeConservationCases * (timeMult > 1 ? 1.4 : 1))} sub="Open Incidents" color="purple" />
        <StatCard icon={BrainCircuit} label="AI Assessments"  value={Math.round(stats.assessmentsToday * timeMult)} sub={`${timeRange} Total`} color="emerald" />
      </div>

      {/* ── Main Dashboard Layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Monitored Heritage Site Explorer */}
        <div className="xl:col-span-2 panel p-6 space-y-5 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="eyebrow"><Eye className="w-3.5 h-3.5" /> Network Directory</span>
              <h2 className="font-serif text-lg font-bold text-slate-100">Gujarat Heritage Network</h2>
            </div>
            <button onClick={() => navigate('/sites')} className="btn-ghost text-xs flex items-center gap-1">
              Explorer & What-If <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Site list items */}
          <div className="space-y-2.5">
            {HERITAGE_SITES.map((site, i) => (
              <div
                key={site.id}
                onClick={() => setSelectedSiteIdx(i)}
                className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedSiteIdx === i
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Risk indicator dot */}
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: RISK_HEX[site.riskLevel] }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-100 truncate">{site.name}</p>
                    <RiskBadge level={site.riskLevel} size="sm" />
                  </div>
                  <HealthBar score={site.healthScore} />
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-base font-bold font-serif" style={{ color: RISK_HEX[site.riskLevel] }}>{site.healthScore}</p>
                    <p className="text-[9px] text-slate-500 uppercase">Score</p>
                  </div>
                  {site.activeAlerts > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-1 rounded border border-rose-800">
                      <AlertTriangle className="w-3 h-3" /> {site.activeAlerts}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Selected site overview box */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Selected Site Intelligence</span>
                <h3 className="font-serif text-xl font-bold text-slate-100">{selectedSite.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" />{selectedSite.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" />Inspected {selectedSite.lastInspection}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-serif font-bold" style={{ color: RISK_HEX[selectedSite.riskLevel] }}>{selectedSite.healthScore}</p>
                <p className="text-[10px] text-slate-400">Health Index</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              {selectedSite.description}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">Category: <strong className="text-slate-200">{selectedSite.heritageType}</strong></span>
              <button
                onClick={() => navigate('/assessment', { state: { siteId: selectedSite.id } })}
                className="btn-primary text-xs px-4 py-2"
              >
                <Zap className="w-3.5 h-3.5" /> Assess Site Incident
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Intelligence & Recent Cases */}
        <div className="space-y-6">

          {/* IBM Granite AI Intelligence summary */}
          <div className="panel p-5 border border-amber-500/20 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">IBM Granite Reasoning</span>
                <p className="text-sm font-semibold text-slate-100">Live Risk Assessment</p>
              </div>
            </div>

            {/* Score Delta */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{DEMO_ASSESSMENT.siteName}</p>
                <p className="text-2xl font-serif font-bold text-amber-400">{DEMO_ASSESSMENT.healthScore}<span className="text-xs text-slate-500">/100</span></p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-bold">{DEMO_ASSESSMENT.healthScore - DEMO_ASSESSMENT.previousHealthScore} pts</span>
              </div>
            </div>

            {/* Risk Drivers */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Key Risk Drivers</p>
              <div className="space-y-2">
                {DEMO_ASSESSMENT.riskDrivers.slice(0, 3).map((d, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex-1 truncate">{d.factor}</span>
                    <span className="text-[10px] font-bold uppercase ml-2 px-1.5 py-0.5 rounded border" style={{ color: RISK_HEX[d.severity], borderColor: RISK_HEX[d.severity] + '44' }}>
                      {d.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider mb-1">
                <CheckCircle className="w-3.5 h-3.5" /> Action Plan
              </div>
              <p className="text-slate-300 leading-snug">{DEMO_ASSESSMENT.recommendedActions[0]?.action.slice(0, 110)}...</p>
            </div>

            <button onClick={() => navigate('/assessment')} className="btn-primary w-full justify-center text-xs py-2.5">
              <BrainCircuit className="w-4 h-4" /> Run Full AI Pipeline
            </button>
          </div>

          {/* Quick Cases Overview */}
          <div className="panel p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Active Conservation Cases</p>
              <button onClick={() => navigate('/cases')} className="btn-ghost text-xs flex items-center gap-1">
                All Cases <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {recentCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate('/cases')}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{c.title}</p>
                    <p className="text-[10px] text-slate-400">{c.siteName}</p>
                  </div>
                  <RiskBadge level={c.riskLevel} size="sm" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Conservation Report Modal Viewer ────────────────────────────── */}
      {showReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="panel p-6 max-w-3xl w-full border border-amber-500/30 space-y-5 my-8 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-100">Gujarat Heritage Network Report</h3>
                  <p className="text-xs text-amber-400">Conservation Reporting Agent Output</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {report && (
                  <button onClick={handleDownloadReport} className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Download .md
                  </button>
                )}
                <button onClick={() => setShowReport(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {reportLoading && (
              <div className="text-center py-12 space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
                <p className="text-sm text-slate-300">Synthesizing network report with IBM Granite LLM...</p>
              </div>
            )}

            {report && !reportLoading && (
              <div className="space-y-4 text-xs text-slate-300 max-h-[70vh] overflow-y-auto scroll-area pr-2">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="font-bold text-amber-400 uppercase tracking-wider mb-2">Network Summary</p>
                  <p className="leading-relaxed text-slate-200">{report.networkSummary}</p>
                </div>

                {report.prioritySites.length > 0 && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800">
                    <p className="font-bold text-rose-300 uppercase tracking-wider mb-2">Priority Attention Required</p>
                    {report.prioritySites.map((ps, idx) => (
                      <p key={idx} className="text-rose-200">• {ps}</p>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <p className="font-bold text-slate-200 uppercase tracking-wider">Monitored Site Reports</p>
                  {report.siteReports.map((sr) => (
                    <div key={sr.siteId} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-100 text-sm">{sr.siteName}</h4>
                        <RiskBadge level={sr.riskLevel} size="sm" />
                      </div>
                      <p className="text-slate-400"><strong className="text-slate-200">Issues:</strong> {sr.keyIssues.join(', ')}</p>
                      <p className="text-slate-400"><strong className="text-slate-200">Actions:</strong> {sr.recommendedActions.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
