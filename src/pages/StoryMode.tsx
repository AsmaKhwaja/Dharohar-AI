import { useState, useEffect } from 'react'
import {
  BookOpen,
  Sparkles,
  ChevronDown,
  Play,
  Pause,
  Square,
  Copy,
  Check,
  Download,
  Volume2,
  Award,
} from 'lucide-react'
import { HERITAGE_SITES, STORY_INTERESTS } from '../data/demoData'
import { generateHeritageStory } from '../services/graniteService'
import type { HeritageStory, StoryInterest } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'

const INTEREST_ICONS: Record<StoryInterest, string> = {
  Architecture: '🏛️',
  History: '📜',
  Culture: '🪔',
  'Family-friendly': '👨‍👩‍👧',
  '5-minute quick story': '⚡',
}

const INTEREST_DESC: Record<StoryInterest, string> = {
  Architecture: 'Structural engineering, masonry craft & architectural lineage',
  History: 'Historical timelines, royal dynasties & strategic evolution',
  Culture: 'Living community traditions, pol culture & human stories',
  'Family-friendly': 'Engaging, accessible stories tailored for all ages',
  '5-minute quick story': 'Concise executive summary of heritage significance',
}

const SITE_TRIVIA: Record<string, string[]> = {
  'ahmedabad-walled-city': [
    'Founded in 1411 AD by Sultan Ahmed Shah.',
    'First city in India to be inscribed as a UNESCO World Heritage City (2017).',
    'Features over 600 distinct organic residential clusters called "Pols".',
  ],
  'teen-darwaza': [
    'Built in 1415 AD as the royal gateway to Maidan-i-Shahi.',
    'An eternal lamp inside has been kept lit continuously by a Muslim family for over 600 years.',
    'Exquisite carved stone piers showcasing Indo-Islamic synthesis.',
  ],
  'bhadra-fort': [
    'Constructed in 1411 AD using red stone.',
    'Houses the historic Bhadra Kali temple built during Maratha rule in 1795.',
    'Served as the administrative citadel of Gujarat Sultanate.',
  ],
  'sun-temple-modhera': [
    'Built in 1026-27 AD by King Bhima I of the Solanki dynasty.',
    'Designed so the first rays of the rising sun fall directly on the golden idol at equinoxes.',
    'Features 108 miniature shrines carved along the stepped Surya Kund tank.',
  ],
  'rani-ki-vav': [
    'Built in 1063 AD by Queen Udayamati in memory of King Bhima I.',
    'Features over 500 primary sculptures and 1,000 minor ones across 7 subterranean tiers.',
    'Inscribed as a UNESCO World Heritage Site in 2014.',
  ],
}

export default function StoryMode() {
  const [siteId, setSiteId] = useState(HERITAGE_SITES[0].id)
  const [interest, setInterest] = useState<StoryInterest | ''>('Architecture')
  const [story, setStory] = useState<HeritageStory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTriviaIdx, setActiveTriviaIdx] = useState(0)

  const selectedSite = HERITAGE_SITES.find((s) => s.id === siteId)

  // Speech synthesis cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleGenerate = async () => {
    if (!siteId) { setError('Please select a heritage site.'); return }
    if (!interest) { setError('Please select a story interest.'); return }
    setError(null)
    setLoading(true)
    setStory(null)
    stopAudio()
    try {
      const result = await generateHeritageStory(siteId, interest as StoryInterest)
      setStory(result)
    } catch (e) {
      setError((e as Error).message || 'Story generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const toggleAudio = () => {
    if (!('speechSynthesis' in window) || !story) return

    if (isPlayingAudio) {
      window.speechSynthesis.pause()
      setIsPlayingAudio(false)
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
        setIsPlayingAudio(true)
      } else {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(story.content)
        utterance.rate = 0.95
        utterance.pitch = 1.0
        utterance.onend = () => setIsPlayingAudio(false)
        utterance.onerror = () => setIsPlayingAudio(false)
        window.speechSynthesis.speak(utterance)
        setIsPlayingAudio(true)
      }
    }
  }

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlayingAudio(false)
  }

  const handleCopy = () => {
    if (!story) return
    navigator.clipboard.writeText(story.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!story) return
    const blob = new Blob([`# ${story.siteName} — ${story.interest}\n\n${story.content}`], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Heritage-Story-${story.siteName.replace(/\s+/g, '-')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const trivia = SITE_TRIVIA[siteId] || SITE_TRIVIA['ahmedabad-walled-city']

  return (
    <div className="p-6 sm:p-8 animate-fade-in space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Heritage Story Engine · IBM Granite LLM
            </span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">Heritage Narrative Generator</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transforming structural & historic data into grounded cultural narratives with live WebSpeech audio narration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Controls Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="panel p-6 space-y-5 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="font-serif text-lg font-bold text-slate-100">Narrative Parameters</h2>
            </div>

            {/* Site */}
            <div>
              <label className="form-label">Heritage Site <span className="text-rose-400">*</span></label>
              <div className="relative">
                <select
                  value={siteId}
                  onChange={(e) => { setSiteId(e.target.value); setStory(null); stopAudio() }}
                  className="form-select text-xs pr-10"
                >
                  {HERITAGE_SITES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
              {selectedSite && (
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Category: {selectedSite.heritageType} · Est. {selectedSite.established}
                </p>
              )}
            </div>

            {/* Interest */}
            <div>
              <label className="form-label">Story Lens & Audience <span className="text-rose-400">*</span></label>
              <div className="space-y-2">
                {STORY_INTERESTS.map((si) => (
                  <button
                    key={si}
                    type="button"
                    onClick={() => { setInterest(si); setStory(null); stopAudio() }}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      interest === si
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">{INTEREST_ICONS[si]}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-100">{si}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{INTEREST_DESC[si]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-xs sm:text-sm shadow-lg"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Synthesizing Story...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate IBM Granite Narrative</>
              )}
            </button>
          </div>

          {/* Interactive Site Trivia Card Widget */}
          <div className="panel p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Heritage Quick Fact</span>
              </div>
              <button
                onClick={() => setActiveTriviaIdx((prev) => (prev + 1) % trivia.length)}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                Next Fact ➔
              </button>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              "{trivia[activeTriviaIdx]}"
            </p>
          </div>
        </div>

        {/* Story Content Output Column */}
        <div className="xl:col-span-3">
          {!story && !loading && (
            <div className="panel p-12 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[450px]">
              <BookOpen className="w-10 h-10 text-amber-400/40 mb-3" />
              <h3 className="font-serif text-lg font-bold text-slate-100 mb-1">Select a site and click "Generate IBM Granite Narrative"</h3>
              <p className="text-xs text-slate-400 max-w-sm">Factual narratives grounded in UNESCO & Gujarat Archaeological Survey knowledge repositories.</p>
            </div>
          )}

          {loading && (
            <div className="panel p-12 border border-amber-500/30 text-center flex flex-col items-center justify-center min-h-[450px]">
              <LoadingSpinner message="IBM Granite LLM is composing grounded heritage narrative..." size="lg" />
            </div>
          )}

          {story && !loading && (
            <div className="panel p-6 sm:p-8 border border-amber-500/30 space-y-6 shadow-2xl animate-fade-in">
              
              {/* Story Bar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{INTEREST_ICONS[story.interest]}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{story.interest}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-slate-100">{story.siteName}</h2>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button onClick={handleDownload} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>

              {/* Working Web Speech API Audio Narration Player */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 shadow-inner">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAudio}
                    className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold hover:scale-105 transition-all shadow-md"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  {isPlayingAudio && (
                    <button
                      onClick={stopAudio}
                      className="p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-400 hover:text-white text-xs flex items-center gap-1"
                    >
                      <Square className="w-3.5 h-3.5" /> Stop
                    </button>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                      <p className="text-xs font-bold text-slate-200">Interactive Web Speech Guide</p>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {isPlayingAudio ? 'Speaking narrative using browser audio synthesis...' : 'Click play to listen to real speech synthesis'}
                    </p>
                  </div>
                </div>

                {/* Animated Waveform Visualization */}
                <div className="flex items-center gap-1">
                  {[40, 70, 30, 90, 50, 80, 20, 60, 100, 40, 70, 30].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-amber-400 transition-all ${isPlayingAudio ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: `${isPlayingAudio ? Math.max(8, h * 0.25) : 8}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Knowledge Grounding Indicator */}
              {story.groundedInKnowledge && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 flex items-center gap-2 text-xs text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Verified Heritage Knowledge:</span>
                  <span className="text-slate-400 truncate">{story.knowledgeSources?.join(' · ')}</span>
                </div>
              )}

              {/* Story Content */}
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
                {story.content.split('\n\n').map((para, i) => (
                  para.trim() && (
                    <p key={i} className="leading-relaxed">
                      {para.trim()}
                    </p>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
