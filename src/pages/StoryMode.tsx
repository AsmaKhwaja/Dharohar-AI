import { useState } from 'react'
import { BookOpen, Sparkles, ChevronDown, Clock, Building2 } from 'lucide-react'
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
  Architecture: 'Architectural analysis & design heritage',
  History: 'Historical narrative with rulers & dates',
  Culture: 'Human interest & living traditions',
  'Family-friendly': 'Engaging stories for children 8+',
  '5-minute quick story': 'Fast-paced comprehensive overview',
}

export default function StoryMode() {
  const [siteId, setSiteId] = useState('')
  const [interest, setInterest] = useState<StoryInterest | ''>('')
  const [story, setStory] = useState<HeritageStory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedSite = HERITAGE_SITES.find((s) => s.id === siteId)

  const handleGenerate = async () => {
    if (!siteId) { setError('Please select a heritage site.'); return }
    if (!interest) { setError('Please select a story interest.'); return }
    setError(null)
    setLoading(true)
    setStory(null)
    try {
      const result = await generateHeritageStory(siteId, interest as StoryInterest)
      setStory(result)
    } catch (e) {
      setError((e as Error).message || 'Story generation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider font-medium">Heritage Story Mode · IBM Granite</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-100">Heritage Story Generator</h1>
        <p className="text-stone-500 mt-1.5 text-sm">
          Experience Gujarat's heritage through AI-crafted narratives — factual, engaging, and tailored to your interest.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Controls */}
        <div className="xl:col-span-2 space-y-5">
          <div className="glass-card p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-sand-500/15 border border-sand-500/25 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-sand-400" />
              </div>
              <h2 className="font-semibold text-stone-200">Configure Story</h2>
            </div>

            {/* Site */}
            <div>
              <label className="form-label">
                Heritage Site <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={siteId}
                  onChange={(e) => { setSiteId(e.target.value); setStory(null) }}
                  className="form-input appearance-none pr-10"
                >
                  <option value="">Select a site...</option>
                  {HERITAGE_SITES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
              </div>
              {selectedSite && (
                <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                  <Building2 className="w-3 h-3" />
                  <span>{selectedSite.heritageType} · Est. {selectedSite.established}</span>
                </div>
              )}
            </div>

            {/* Interest */}
            <div>
              <label className="form-label">
                Story Interest <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {STORY_INTERESTS.map((si) => (
                  <button
                    key={si}
                    type="button"
                    onClick={() => { setInterest(si); setStory(null) }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      interest === si
                        ? 'bg-sand-500/15 border-sand-500/40 text-stone-100'
                        : 'bg-stone-900/40 border-stone-800/50 text-stone-400 hover:border-stone-700 hover:bg-stone-900/60'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{INTEREST_ICONS[si]}</span>
                    <div>
                      <p className={`text-sm font-semibold ${interest === si ? 'text-sand-300' : 'text-stone-300'}`}>{si}</p>
                      <p className="text-xs text-stone-500">{INTEREST_DESC[si]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-stone-700 border-t-stone-950 rounded-full animate-spin" />
                  Generating Story...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Heritage Story
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="p-4 bg-stone-900/40 border border-stone-800/40 rounded-xl">
            <p className="text-xs text-stone-500 leading-relaxed">
              Stories are generated using IBM Granite LLM from factual heritage data. In Demo Mode, pre-crafted narratives are served for Ahmedabad Walled City and Modhera Sun Temple. All other sites use template responses.
            </p>
          </div>
        </div>

        {/* Story Output */}
        <div className="xl:col-span-3">
          {!story && !loading && (
            <div className="flex flex-col items-center justify-center h-64 xl:h-full panel rounded-xl text-center p-12">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(201,149,42,0.08)', border: '1px solid rgba(201,149,42,0.15)' }}>
                <BookOpen className="w-8 h-8" style={{ color: '#c9952a', opacity: 0.5 }} />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: '#4a4540' }}>Your Story Awaits</h3>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#3a3530' }}>
                Select a heritage site and story interest, then click "Generate Heritage Story" to experience Gujarat's living heritage through AI narrative.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 xl:h-full panel rounded-xl text-center p-12">
              <LoadingSpinner message="IBM Granite is crafting your heritage story..." size="lg" />
            </div>
          )}

          {story && (
            <div className="panel p-7 animate-slide-up">
              {/* Story header */}
              <div className="flex items-start justify-between gap-4 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{INTEREST_ICONS[story.interest]}</span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c9952a' }}>{story.interest}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold" style={{ color: '#f0ead8' }}>{story.siteName}</h2>
                  <div className="flex items-center gap-2 mt-1.5 text-xs" style={{ color: '#4a4540' }}>
                    <Clock className="w-3 h-3" />
                    <span>Generated {new Date(story.generatedAt).toLocaleTimeString()}</span>
                    {story.demoMode && (
                      <span className="px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24', fontSize: '9px' }}>
                        Demo AI Mode
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={handleGenerate} className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" /> Regenerate
                </button>
              </div>

              {/* Knowledge grounding indicator */}
              {story.groundedInKnowledge && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Grounded in curated heritage knowledge
                  </p>
                  <span className="text-[10px] ml-auto" style={{ color: '#2a4030' }}>
                    {story.knowledgeSources?.join(' · ')}
                  </span>
                </div>
              )}

              {/* Story content */}
              <div>
                {story.content.split('\n\n').map((para, i) => (
                  para.trim() && (
                    <p key={i} className="leading-relaxed mb-4" style={{
                      fontSize: para.trim().toUpperCase() === para.trim() && para.length < 60 ? '10px' : '13px',
                      color: para.trim().toUpperCase() === para.trim() && para.length < 60 ? '#c9952a' : '#8a8070',
                      fontWeight: para.trim().toUpperCase() === para.trim() && para.length < 60 ? '700' : '400',
                      textTransform: para.trim().toUpperCase() === para.trim() && para.length < 60 ? 'uppercase' : 'none',
                      letterSpacing: para.trim().toUpperCase() === para.trim() && para.length < 60 ? '0.1em' : 'normal',
                      marginTop: para.trim().toUpperCase() === para.trim() && para.length < 60 ? '20px' : '0',
                    }}>
                      {para.trim()}
                    </p>
                  )
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] leading-relaxed" style={{ color: '#3a3530' }}>
                  <span className="font-semibold" style={{ color: '#4a4540' }}>Responsible AI note: </span>
                  This narrative is grounded in curated heritage knowledge and generated by IBM Granite AI. It should not be used as an academic citation. If a topic falls outside the verified knowledge scope, the response will indicate this explicitly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
