/**
 * DHAROHAR AI — Heritage Guardian Orchestrator
 *
 * Multi-agent reasoning pipeline for heritage conservation intelligence.
 *
 * Agents:
 *   1. Condition Analyst
 *   2. Heritage Risk Analyst
 *   3. Conservation Advisor
 *   4. Heritage Guardian Orchestrator (synthesis)
 *
 * Architecture designed so agents can be mapped to IBM watsonx Orchestrate
 * collaborator agents when that integration becomes available.
 * Currently implemented as modular local reasoning functions.
 */

import type {
  IncidentForm,
  AIAssessmentResult,
  AgentStep,
  AgentStatus,
  ConditionAnalysis,
  RiskAnalysis,
  ConservationAdvice,
  RiskLevel,
  ReasoningStep,
  ConservationAction,
  RiskDriver,
} from '../types'
import type { HeritageSite } from '../types'
import { retrieveHeritageKnowledge, getHeritageSensitivityContext } from '../data/heritageKnowledge'

// ─── Agent Step tracking ─────────────────────────────────────────────────────

export type AgentProgressCallback = (steps: AgentStep[]) => void

function makeStep(id: string, name: string, role: string): AgentStep {
  return { id, name, role, status: 'PENDING' }
}

function updateStep(
  steps: AgentStep[],
  id: string,
  status: AgentStatus,
  output?: string
): AgentStep[] {
  return steps.map((s) =>
    s.id === id
      ? { ...s, status, output, startedAt: status === 'ANALYZING' ? Date.now() : s.startedAt, completedAt: status === 'COMPLETED' || status === 'FAILED' ? Date.now() : undefined }
      : s
  )
}

const INITIAL_STEPS: AgentStep[] = [
  makeStep('condition',    'Condition Analyst',            'Analyses reported heritage condition and deterioration indicators'),
  makeStep('risk',         'Heritage Risk Analyst',        'Combines condition, heritage sensitivity, visitor pressure and environment'),
  makeStep('advisor',      'Conservation Advisor',         'Converts risk assessment into prioritised conservation actions'),
  makeStep('orchestrator', 'Heritage Guardian Orchestrator','Synthesises agent outputs into final Conservation Intelligence Report'),
]

// ─── 1. CONDITION ANALYST ─────────────────────────────────────────────────────

function runConditionAnalyst(form: IncidentForm): ConditionAnalysis {
  const condition = form.observedCondition.toLowerCase()
  const incidentType = form.incidentType

  const indicators: string[] = []
  const evidence: string[] = []

  // Evidence from incident type
  if (incidentType === 'Structural deterioration') {
    indicators.push('Structural integrity concern')
    indicators.push('Progressive masonry deterioration risk')
  }
  if (incidentType === 'Surface damage') {
    indicators.push('Surface material loss')
    indicators.push('Decorative fabric at risk')
  }
  if (incidentType === 'Water/moisture damage') {
    indicators.push('Active moisture infiltration')
    indicators.push('Salt crystallisation risk')
  }
  if (incidentType === 'Visitor pressure') {
    indicators.push('Mechanical wear from footfall')
    indicators.push('Carrying capacity stress')
  }

  // Evidence from condition text
  if (condition.includes('crack') || condition.includes('cracking')) {
    indicators.push('Active cracking detected')
    evidence.push('Cracking reported — may indicate structural loading, settlement, or moisture-driven expansion')
  }
  if (condition.includes('moisture') || condition.includes('stain') || condition.includes('damp') || condition.includes('wet')) {
    indicators.push('Moisture evidence present')
    evidence.push('Moisture/staining reported — risk of salt crystallisation and lime mortar degradation')
  }
  if (condition.includes('spall') || condition.includes('flak') || condition.includes('erosion')) {
    indicators.push('Surface spalling / erosion')
    evidence.push('Spalling or erosion reported — indicates active surface material loss')
  }
  if (condition.includes('vegetation') || condition.includes('plant') || condition.includes('root')) {
    indicators.push('Vegetation encroachment')
    evidence.push('Vegetation reported — root penetration can fracture masonry joints')
  }
  if (condition.includes('collapse') || condition.includes('fail') || condition.includes('fallen')) {
    indicators.push('CRITICAL: Partial failure evidence')
    evidence.push('Collapse or failure language used — treat as emergency condition pending expert verification')
  }
  if (form.observedCondition.trim()) {
    evidence.push(`Reported observation: "${form.observedCondition.slice(0, 120)}"`)
  }

  // Severity from combined signals
  const criticalSignals = indicators.filter(i => i.includes('CRITICAL') || i.includes('collapse')).length
  const highSignals = indicators.filter(i => i.includes('Active') || i.includes('moisture') || i.includes('crack')).length

  let severityEstimate: RiskLevel = 'MODERATE'
  if (criticalSignals > 0) severityEstimate = 'CRITICAL'
  else if (highSignals >= 2 || incidentType === 'Structural deterioration') severityEstimate = 'HIGH'
  else if (highSignals === 1) severityEstimate = 'MODERATE'
  else severityEstimate = 'LOW'

  const uncertainty =
    form.evidenceImage
      ? 'Image evidence provided — visual interpretation should be treated as preliminary only. Structural condition cannot be certified from images alone.'
      : 'No image evidence provided. Assessment based on text description only. On-site verification is required to confirm reported conditions.'

  return {
    deteriorationIndicators: indicators,
    evidenceFound: evidence.length > 0 ? evidence : ['Limited condition evidence in report — apply precautionary approach'],
    severityEstimate,
    uncertainty,
    rawConditionText: form.observedCondition,
  }
}

// ─── 2. HERITAGE RISK ANALYST ──────────────────────────────────────────────────

function runRiskAnalyst(
  form: IncidentForm,
  site: HeritageSite,
  conditionAnalysis: ConditionAnalysis
): RiskAnalysis {
  const knowledge = retrieveHeritageKnowledge(site.id)
  const sensitivity = knowledge?.heritageSensitivity || 'HIGH'

  // Factor scores 0–100
  let visitorScore = 0
  switch (form.visitorPressure) {
    case 'EXTREME': visitorScore = 90; break
    case 'HIGH':    visitorScore = 70; break
    case 'MODERATE':visitorScore = 45; break
    case 'LOW':     visitorScore = 20; break
  }

  let envScore = 0
  switch (form.environmentalCondition) {
    case 'POST_MONSOON':  envScore = 85; break
    case 'WET':           envScore = 75; break
    case 'HUMID':         envScore = 55; break
    case 'EXTREME_HEAT':  envScore = 60; break
    case 'DRY':           envScore = 25; break
  }

  const sensitivityScore = sensitivity === 'VERY_HIGH' ? 90 : sensitivity === 'HIGH' ? 70 : 50

  const maintenanceScore = Math.min(100, ((form.lastInspectionMonths || site.monthsSinceInspection || 6) / 12) * 80)

  const conditionScore = conditionAnalysis.severityEstimate === 'CRITICAL' ? 95
    : conditionAnalysis.severityEstimate === 'HIGH' ? 75
    : conditionAnalysis.severityEstimate === 'MODERATE' ? 50
    : 25

  // Interaction effects — compounding risk
  const interactionEffects: string[] = []
  let interactionBonus = 0

  if (visitorScore >= 70 && conditionScore >= 50) {
    interactionEffects.push('High visitor pressure + active deterioration = accelerated wear (compounding effect)')
    interactionBonus += 8
  }
  if (envScore >= 70 && conditionScore >= 50) {
    interactionEffects.push('Adverse environmental conditions + reported deterioration = moisture-driven risk amplification')
    interactionBonus += 6
  }
  if (maintenanceScore >= 50 && conditionScore >= 50) {
    interactionEffects.push('Deferred maintenance + active deterioration = unmitigated progressive risk')
    interactionBonus += 6
  }
  if (sensitivityScore >= 70 && (envScore >= 55 || visitorScore >= 60)) {
    interactionEffects.push('High heritage sensitivity + stressor conditions = elevated consequence if deterioration proceeds')
    interactionBonus += 5
  }

  // Weighted combined risk score
  const combinedRiskScore = Math.min(100, Math.round(
    conditionScore * 0.30 +
    visitorScore   * 0.22 +
    envScore       * 0.20 +
    sensitivityScore * 0.15 +
    maintenanceScore * 0.13 +
    interactionBonus
  ))

  const primaryFactors = [
    { factor: 'Observed Condition', impact: conditionScore, explanation: conditionAnalysis.evidenceFound[0] || 'Condition indicators identified in report' },
    { factor: 'Visitor Pressure', impact: visitorScore, explanation: `Pressure level: ${form.visitorPressure}. Higher visitor intensity increases mechanical wear and management complexity.` },
    { factor: 'Environmental Exposure', impact: envScore, explanation: `Environmental condition: ${form.environmentalCondition}. Adverse conditions accelerate material degradation.` },
    { factor: 'Heritage Sensitivity', impact: sensitivityScore, explanation: `Sensitivity: ${sensitivity}. Higher sensitivity means greater consequence if deterioration proceeds.` },
    { factor: 'Maintenance Status', impact: Math.round(maintenanceScore), explanation: `${form.lastInspectionMonths || site.monthsSinceInspection || 'Unknown'} months since last inspection. Longer gaps allow defects to escalate undetected.` },
  ].sort((a, b) => b.impact - a.impact)

  const heritageContextNotes = getHeritageSensitivityContext(site.id)

  return { combinedRiskScore, interactionEffects, primaryFactors, heritageContextNotes }
}

// ─── 3. CONSERVATION ADVISOR ───────────────────────────────────────────────────

function runConservationAdvisor(
  riskLevel: RiskLevel,
  riskAnalysis: RiskAnalysis,
  conditionAnalysis: ConditionAnalysis
): ConservationAdvice {
  const isHighOrCritical = riskLevel === 'HIGH' || riskLevel === 'CRITICAL'
  const topFactor = riskAnalysis.primaryFactors[0]?.factor || 'Heritage condition'

  const actions: ConservationAdvice['actions'] = []

  // P1 — always recommend expert inspection for high/critical
  if (isHighOrCritical) {
    actions.push({
      priority: 'P1',
      action: 'Commission expert inspection by qualified heritage conservation professional',
      reason: `AI-assessed ${riskLevel} risk requires professional on-site verification before physical intervention.`,
      timeframe: riskLevel === 'CRITICAL' ? 'Within 72 hours' : 'Within 7 days',
    })
  } else {
    actions.push({
      priority: 'P1',
      action: 'Schedule routine condition monitoring visit',
      reason: `Current risk level is ${riskLevel}. Professional monitoring will confirm AI preliminary assessment.`,
      timeframe: 'Within 4 weeks',
    })
  }

  // P2 — based on primary risk factor
  if (topFactor === 'Visitor Pressure' || riskAnalysis.primaryFactors.find(f => f.factor === 'Visitor Pressure' && f.impact >= 60)) {
    actions.push({
      priority: 'P2',
      action: 'Implement temporary visitor management protocols around affected zone',
      reason: 'Visitor pressure is a primary risk driver. Reducing footfall near deteriorating fabric will slow active deterioration.',
      timeframe: 'Within 48 hours',
    })
  } else if (conditionAnalysis.deteriorationIndicators.includes('Active moisture infiltration') || conditionAnalysis.deteriorationIndicators.includes('Moisture evidence present')) {
    actions.push({
      priority: 'P2',
      action: 'Install temporary weatherproofing and inspect drainage routes',
      reason: 'Moisture is an active risk factor. Temporary protection reduces ongoing damage while permanent repair is planned.',
      timeframe: 'Within 1 week',
    })
  } else {
    actions.push({
      priority: 'P2',
      action: 'Increase documentation and photographic monitoring frequency',
      reason: 'Consistent monitoring enables early detection of deterioration progression.',
      timeframe: 'Immediately',
    })
  }

  // P3 — longer-term
  actions.push({
    priority: 'P3',
    action: 'Commission comprehensive conservation management review',
    reason: 'Systematic planning ensures consistent methodology, authentic materials, and reversible interventions in line with UNESCO/ASI guidelines.',
    timeframe: 'Within 3 months',
  })

  const monitoringPlan =
    isHighOrCritical
      ? 'Weekly photographic survey of affected areas. Monthly crack width and moisture monitoring. Immediate escalation if condition worsens.'
      : 'Monthly visual inspection. Quarterly photographic documentation. Annual professional condition survey.'

  const stakeholder =
    riskLevel === 'CRITICAL' ? 'ASI Emergency Conservation Division + AMC Heritage Cell + UNESCO India' :
    riskLevel === 'HIGH'     ? 'ASI Conservation Division + INTACH Regional Chapter' :
                               'Site Management Authority + ASI Conservation Division'

  return { actions, monitoringPlan, stakeholder }
}

// ─── 4. HERITAGE GUARDIAN ORCHESTRATOR ────────────────────────────────────────

function orchestratorSynthesis(
  form: IncidentForm,
  site: HeritageSite,
  condition: ConditionAnalysis,
  risk: RiskAnalysis,
  advice: ConservationAdvice,
  modelUsed: string,
  demoMode: boolean
): AIAssessmentResult {
  // Derive risk level from combined score
  const riskLevel: RiskLevel =
    risk.combinedRiskScore >= 75 ? 'CRITICAL' :
    risk.combinedRiskScore >= 55 ? 'HIGH' :
    risk.combinedRiskScore >= 35 ? 'MODERATE' :
    'LOW'

  // Health score = site base score adjusted by risk delta
  const riskDelta = risk.combinedRiskScore - 50 // delta above/below neutral
  const healthScore = Math.max(10, Math.min(95, Math.round(site.healthScore - riskDelta * 0.3)))

  const scoreDelta = healthScore - site.healthScore

  // Confidence: lower if image absent and condition text short
  const hasImage = !!form.evidenceImage
  const hasDetail = form.observedCondition.length > 40
  const confidence = Math.round(
    60 +
    (hasImage ? 15 : 0) +
    (hasDetail ? 10 : 0) +
    (risk.interactionEffects.length * 3)
  )

  // Build risk drivers from factor analysis
  const riskDrivers: RiskDriver[] = risk.primaryFactors.slice(0, 4).map((f) => ({
    factor: f.factor,
    impact: f.impact,
    severity: f.impact >= 75 ? 'CRITICAL' : f.impact >= 55 ? 'HIGH' : f.impact >= 35 ? 'MODERATE' : 'LOW',
    detail: f.explanation,
    explanation: f.explanation,
  }))

  // Build recommended actions
  const recommendedActions: ConservationAction[] = advice.actions.map((a) => ({
    priority: a.priority,
    action: a.action,
    reason: a.reason,
    urgency: a.timeframe,
    timeframe: a.timeframe,
    stakeholder: advice.stakeholder,
    reviewTimeline: a.timeframe,
    justification: a.reason,
  }))

  // Build reasoning chain for explainability panel
  const reasoningChain: ReasoningStep[] = [
    { label: 'Observed Condition', value: form.observedCondition || 'Condition reported via incident form', type: 'evidence' },
    ...condition.evidenceFound.slice(0, 2).map(e => ({ label: 'Condition Finding', value: e, type: 'evidence' as const })),
    { label: 'Visitor Pressure', value: `${form.visitorPressure} — Impact score: ${risk.primaryFactors.find(f => f.factor === 'Visitor Pressure')?.impact ?? 'N/A'}`, type: 'evidence' },
    { label: 'Environmental Conditions', value: `${form.environmentalCondition} — Impact score: ${risk.primaryFactors.find(f => f.factor === 'Environmental Exposure')?.impact ?? 'N/A'}`, type: 'evidence' },
    { label: 'Maintenance Status', value: `${form.lastInspectionMonths || site.monthsSinceInspection || 'Unknown'} months since last inspection`, type: 'evidence' },
    { label: 'Heritage Sensitivity', value: `${retrieveHeritageKnowledge(site.id)?.heritageSensitivity || 'HIGH'} — influences consequence weighting`, type: 'inference' },
    ...risk.interactionEffects.map(e => ({ label: 'Interaction Effect', value: e, type: 'inference' as const })),
    { label: 'Uncertainty', value: condition.uncertainty, type: 'uncertainty' },
    { label: 'Combined Risk Score', value: `${risk.combinedRiskScore}/100 → Risk Level: ${riskLevel}`, type: 'inference' },
    { label: 'Heritage Health Score', value: `${healthScore}/100 (${scoreDelta >= 0 ? '+' : ''}${scoreDelta} from previous ${site.healthScore})`, type: 'inference' },
    { label: 'Recommendation', value: recommendedActions[0]?.action || 'Professional inspection recommended', type: 'recommendation' },
  ]

  // Build evidence summary
  const evidenceSummary =
    `Assessment based on reported ${form.incidentType} incident at ${site.name}. ` +
    (form.observedCondition ? `Reported condition: "${form.observedCondition.slice(0, 120)}". ` : '') +
    `Visitor pressure: ${form.visitorPressure}. Environmental condition: ${form.environmentalCondition}. ` +
    (condition.evidenceFound[0] ? condition.evidenceFound[0] + '. ' : '') +
    `${risk.interactionEffects.length > 0 ? 'Interaction effects identified: ' + risk.interactionEffects[0] : ''}`

  const whyAtRisk =
    `${site.name} is assessed as ${riskLevel} risk based on combined analysis of ${risk.primaryFactors.length} factors. ` +
    `The primary driver is ${risk.primaryFactors[0]?.factor} (impact: ${risk.primaryFactors[0]?.impact}/100). ` +
    (risk.interactionEffects[0] ? risk.interactionEffects[0] + '. ' : '') +
    `${retrieveHeritageKnowledge(site.id)?.conservationConsiderations.slice(0, 180) || 'Heritage sensitivity warrants precautionary approach.'}`

  return {
    id: `assessment-${Date.now()}`,
    siteId: form.siteId,
    siteName: site.name,
    timestamp: new Date().toISOString(),
    healthScore,
    previousHealthScore: site.healthScore,
    scoreDelta,
    riskLevel,
    confidence: Math.min(95, confidence),
    riskDrivers,
    evidenceSummary,
    whyAtRisk,
    recommendedActions,
    monitoringPlan: advice.monitoringPlan,
    stakeholder: advice.stakeholder,
    humanVerificationRequired: riskLevel === 'HIGH' || riskLevel === 'CRITICAL',
    disclaimer:
      'This is an AI-assisted preliminary assessment. It does NOT constitute a certified structural engineering inspection. All structural risk determinations must be verified by a licensed heritage conservation engineer with on-site inspection.',
    modelUsed,
    demoMode,
    agentSteps: INITIAL_STEPS.map((s) => ({ ...s, status: 'COMPLETED' })),
    reasoningChain,
    conditionAnalysis: condition,
    riskAnalysis: risk,
    conservationAdvice: advice,
  }
}

// ─── PUBLIC INTERFACE ──────────────────────────────────────────────────────────

/**
 * Run the full Heritage Guardian Orchestrator pipeline.
 * Calls agents sequentially, reporting progress via callback.
 */
export async function runOrchestrator(
  form: IncidentForm,
  site: HeritageSite,
  modelUsed: string,
  demoMode: boolean,
  onProgress: AgentProgressCallback,
  simulatedDelay = true
): Promise<AIAssessmentResult> {
  let steps = INITIAL_STEPS.map(s => ({ ...s }))
  const delay = (ms: number) => simulatedDelay ? new Promise<void>(r => setTimeout(r, ms)) : Promise.resolve()

  // Step 1 — Condition Analyst
  steps = updateStep(steps, 'condition', 'ANALYZING')
  onProgress([...steps])
  await delay(600)
  const condition = runConditionAnalyst(form)
  steps = updateStep(steps, 'condition', 'COMPLETED', `${condition.deteriorationIndicators.length} indicators found`)
  onProgress([...steps])

  // Step 2 — Risk Analyst
  steps = updateStep(steps, 'risk', 'ANALYZING')
  onProgress([...steps])
  await delay(700)
  const risk = runRiskAnalyst(form, site, condition)
  steps = updateStep(steps, 'risk', 'COMPLETED', `Combined risk score: ${risk.combinedRiskScore}/100`)
  onProgress([...steps])

  // Step 3 — Conservation Advisor
  const riskLevel: RiskLevel =
    risk.combinedRiskScore >= 75 ? 'CRITICAL' :
    risk.combinedRiskScore >= 55 ? 'HIGH' :
    risk.combinedRiskScore >= 35 ? 'MODERATE' : 'LOW'
  steps = updateStep(steps, 'advisor', 'ANALYZING')
  onProgress([...steps])
  await delay(500)
  const advice = runConservationAdvisor(riskLevel, risk, condition)
  steps = updateStep(steps, 'advisor', 'COMPLETED', `${advice.actions.length} actions generated`)
  onProgress([...steps])

  // Step 4 — Orchestrator synthesis
  steps = updateStep(steps, 'orchestrator', 'ANALYZING')
  onProgress([...steps])
  await delay(600)
  const result = orchestratorSynthesis(form, site, condition, risk, advice, modelUsed, demoMode)
  steps = updateStep(steps, 'orchestrator', 'COMPLETED', `Final report: ${result.riskLevel} risk`)
  onProgress([...steps])

  return { ...result, agentSteps: steps }
}
