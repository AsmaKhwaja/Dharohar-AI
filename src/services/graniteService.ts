/**
 * IBM Granite LLM Service
 *
 * Routes assessment requests through the Heritage Guardian Orchestrator.
 * When IBM credentials are available, Granite provides the core LLM reasoning.
 * When credentials are unavailable, the orchestrator runs in Demo AI Mode
 * using deterministic local reasoning — same pipeline, same UI, clearly labelled.
 */

import type { IncidentForm, AIAssessmentResult, HeritageStory, StoryInterest } from '../types'
import { HERITAGE_SITES } from '../data/demoData'
import { runOrchestrator, type AgentProgressCallback } from './orchestrator'
import { retrieveHeritageKnowledge } from '../data/heritageKnowledge'
import { generateDemoStory } from './demoFallback'

export const IS_DEMO_MODE =
  !import.meta.env.VITE_WATSONX_API_KEY ||
  !import.meta.env.VITE_WATSONX_PROJECT_ID ||
  import.meta.env.VITE_DEMO_MODE === 'true'

const GRANITE_MODEL = import.meta.env.VITE_GRANITE_MODEL || 'ibm/granite-13b-instruct-v2'

// ─── Backend Proxy Call ───────────────────────────────────────────────────────
// All IBM credentials stay server-side. The browser only calls /api/granite/*.

async function callGraniteAPI(endpoint: string, prompt: string): Promise<string> {
  const response = await fetch(`/api/granite/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  if (response.status === 503) {
    throw new Error('DEMO_MODE') // backend signals credentials not configured
  }
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Granite proxy error: ${response.status} — ${err}`)
  }
  const data = await response.json() as { text: string; model: string }
  return data.text
}

// ─── Assessment Service ────────────────────────────────────────────────────────

export async function runHeritageAssessment(
  form: IncidentForm,
  onProgress?: AgentProgressCallback
): Promise<AIAssessmentResult> {
  const site = HERITAGE_SITES.find((s) => s.id === form.siteId)
  if (!site) throw new Error('Site not found')

  const noop: AgentProgressCallback = () => {}
  const progress = onProgress || noop

  // Demo Mode — run local orchestrator with Demo AI Mode label
  if (IS_DEMO_MODE) {
    return runOrchestrator(form, site, 'IBM Granite (Demo AI Mode)', true, progress)
  }

  // Live Granite Mode — run orchestrator (it will call /api/granite/assessment internally)
  try {
    return await runOrchestrator(form, site, GRANITE_MODEL, false, progress, false)
  } catch (err) {
    console.warn('Granite call failed — falling back to Demo AI Mode:', err)
    return runOrchestrator(form, site, 'IBM Granite (Demo AI Mode — Granite Unavailable)', true, progress, false)
  }
}

// ─── Score Change Service ──────────────────────────────────────────────────────

export { DEMO_SCORE_CHANGE } from '../data/demoData'

// ─── What-If Simulator ─────────────────────────────────────────────────────────

import type { WhatIfScenario, RiskLevel } from '../types'

export function runWhatIfSimulator(
  siteId: string,
  visitorChangePercent: number
): WhatIfScenario {
  const site = HERITAGE_SITES.find((s) => s.id === siteId)
  if (!site) throw new Error('Site not found')

  const currentPressure = site.visitorPressureNumeric
  const simulatedPressure = Math.min(100, Math.round(currentPressure * (1 + visitorChangePercent / 100)))

  // Health impact: each 10 units of additional visitor pressure above 50 = ~2 health points lost
  const pressureDelta = simulatedPressure - currentPressure
  const healthImpact = Math.round(pressureDelta * 0.18)
  const predictedHealth = Math.max(10, Math.min(100, site.healthScore - healthImpact))

  const scoreToRisk = (s: number): RiskLevel =>
    s >= 75 ? 'LOW' : s >= 55 ? 'MODERATE' : s >= 35 ? 'HIGH' : 'CRITICAL'

  const currentRisk = scoreToRisk(site.healthScore)
  const predictedRisk = scoreToRisk(predictedHealth)

  const riskWorsened = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].indexOf(predictedRisk) >
                       ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].indexOf(currentRisk)

  const interpretation =
    visitorChangePercent > 0
      ? `Under this scenario, a ${visitorChangePercent}% increase in visitor pressure may elevate conservation risk${riskWorsened ? ' from ' + currentRisk + ' to ' + predictedRisk : ''}. Increased footfall on historic fabric accelerates mechanical wear and reduces the buffer between current condition and critical threshold.`
      : visitorChangePercent < 0
      ? `Under this scenario, a ${Math.abs(visitorChangePercent)}% reduction in visitor pressure may reduce conservation risk${riskWorsened ? '' : ' from ' + currentRisk + ' toward ' + predictedRisk}. Reduced footfall allows heritage fabric recovery time and reduces active stress.`
      : 'No change in visitor pressure — heritage health score remains at current level.'

  const recommendations =
    visitorChangePercent > 20
      ? [
          'Activate alternate visitor routing to distribute pressure across wider network',
          'Reduce crowd concentration near sensitive structural and surface elements',
          'Increase monitoring frequency during high-pressure periods',
          'Review site carrying capacity assessment with heritage authority',
        ]
      : visitorChangePercent > 0
      ? [
          'Monitor visitor pressure trends and compare against carrying capacity baseline',
          'Maintain photographic documentation of high-traffic surfaces',
          'Review visitor management signage and routing at peak times',
        ]
      : [
          'Opportunity to undertake maintenance and surface consolidation with reduced visitor impact',
          'Document site condition during lower-pressure period as baseline for future comparison',
        ]

  return {
    siteId,
    currentVisitorPressure: currentPressure,
    simulatedVisitorPressure: simulatedPressure,
    changePercent: visitorChangePercent,
    currentHealthScore: site.healthScore,
    predictedHealthScore: predictedHealth,
    currentRisk,
    predictedRisk,
    interpretation,
    recommendations,
    disclaimer: 'AI scenario simulation — not a physical prediction. Results represent a simplified model for conservation planning purposes only.',
  }
}

// ─── Story Service ─────────────────────────────────────────────────────────────

export async function generateHeritageStory(
  siteId: string,
  interest: StoryInterest
): Promise<HeritageStory> {
  const site = HERITAGE_SITES.find((s) => s.id === siteId)
  if (!site) throw new Error('Site not found')

  if (IS_DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 1600))
    return generateDemoStory(site, interest)
  }

  const knowledge = retrieveHeritageKnowledge(site.id)

  const toneMap: Record<StoryInterest, string> = {
    Architecture: 'technical yet accessible architectural narrative',
    History: 'rich historical storytelling with dates and rulers',
    Culture: 'warm cultural and human interest narrative',
    'Family-friendly': 'fun, engaging story suitable for children aged 8+',
    '5-minute quick story': 'concise, vivid 5-minute overview covering all key aspects',
  }

  const knowledgeContext = knowledge
    ? `VERIFIED HERITAGE KNOWLEDGE (use this — do not invent facts outside this):
Historical Context: ${knowledge.historicalContext}
Architectural Characteristics: ${knowledge.architecturalCharacteristics}
Cultural Significance: ${knowledge.culturalSignificance}
Conservation Context: ${knowledge.conservationConsiderations.slice(0, 200)}`
    : `SITE BACKGROUND: ${site.description}`

  const prompt = `Write an engaging, factually accurate ${toneMap[interest]} about ${site.name}.

${knowledgeContext}

Requirements:
- Focus on: ${interest}
- Length: 300-450 words
- Style: Vivid, evocative, educational
- ONLY use facts from the verified knowledge above
- Do NOT invent rulers, dates, or events not in the knowledge base

Begin:
###END###`

  try {
    const content = await callGraniteAPI('story', prompt)
    return {
      siteId,
      siteName: site.name,
      interest,
      content,
      generatedAt: new Date().toISOString(),
      demoMode: false,
      groundedInKnowledge: true,
      knowledgeSources: ['UNESCO World Heritage documentation', 'ASI heritage records', 'Curated site knowledge layer'],
    }
  } catch (err) {
    console.warn('Story generation failed, using demo fallback:', err)
    return generateDemoStory(site, interest)
  }
}
