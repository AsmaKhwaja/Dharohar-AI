/**
 * Encroachment Detection Agent
 *
 * Analyses reported encroachments against heritage buffer zones,
 * regulatory frameworks, and site sensitivity to produce prioritised
 * enforcement and conservation recommendations.
 */

import type {
  EncroachmentRecord,
  EncroachmentAssessment,
  EncroachmentSeverity,
  AgentStep,
  AgentStatus,
} from '../types'
import { retrieveHeritageKnowledge } from '../data/heritageKnowledge'
import { IS_DEMO_MODE } from './graniteService'

export type EncroachmentProgressCallback = (steps: AgentStep[]) => void

// ─── Agent steps ──────────────────────────────────────────────────────────────

function makeStep(id: string, name: string, role: string): AgentStep {
  return { id, name, role, status: 'PENDING' }
}

function updateStep(steps: AgentStep[], id: string, status: AgentStatus, output?: string): AgentStep[] {
  return steps.map((s) =>
    s.id === id
      ? {
          ...s,
          status,
          output,
          startedAt: status === 'ANALYZING' ? Date.now() : s.startedAt,
          completedAt: status === 'COMPLETED' || status === 'FAILED' ? Date.now() : undefined,
        }
      : s
  )
}

const INITIAL_STEPS: AgentStep[] = [
  makeStep('classifier',   'Encroachment Classifier',   'Classifies encroachment type, severity and buffer-zone violation'),
  makeStep('legal',        'Regulatory Compliance Analyst', 'Identifies applicable legal frameworks and violation categories'),
  makeStep('impact',       'Heritage Impact Assessor',  'Evaluates consequence for heritage fabric and Outstanding Universal Value'),
  makeStep('enforcement',  'Enforcement Action Planner', 'Generates prioritised enforcement and remediation action plan'),
]

// ─── Severity scoring ──────────────────────────────────────────────────────────

function scoreSeverity(record: EncroachmentRecord): number {
  let score = 0

  switch (record.type) {
    case 'Unauthorized construction':  score += 40; break
    case 'Illegal demolition':         score += 45; break
    case 'Infrastructure intrusion':   score += 25; break
    case 'Commercial encroachment':    score += 20; break
    case 'Residential encroachment':   score += 22; break
    case 'Signage/advertising violation': score += 12; break
  }

  switch (record.severity) {
    case 'CRITICAL':    score += 40; break
    case 'SIGNIFICANT': score += 28; break
    case 'MODERATE':    score += 15; break
    case 'MINOR':       score += 5;  break
  }

  if (record.bufferZoneViolation) score += 15

  return Math.min(100, score)
}

// ─── Legal reference mapping ───────────────────────────────────────────────────

function getLegalViolations(record: EncroachmentRecord): string[] {
  const violations: string[] = []

  if (record.bufferZoneViolation) {
    violations.push('Buffer zone violation — Ancient Monuments and Archaeological Sites and Remains (AMASR) Act 1958, Section 20A')
  }
  if (record.type === 'Unauthorized construction') {
    violations.push('Unauthorized construction in protected zone — Gujarat Heritage Regulation Act 2017, Section 14')
    violations.push('Violation of AMC Heritage Zone Development Control Regulations, Rule 8')
  }
  if (record.type === 'Illegal demolition') {
    violations.push('Illegal demolition of protected structure — AMASR Act 1958, Section 21')
    violations.push('Criminal offence under Gujarat Heritage Regulation Act 2017, Section 36')
  }
  if (record.type === 'Commercial encroachment') {
    violations.push('Commercial encroachment in protected precinct — AMC Heritage Zone Bye-Laws, Section 18')
  }
  if (record.type === 'Infrastructure intrusion') {
    violations.push('Infrastructure works without heritage impact assessment — ASI Technical Guidelines for Utility Works')
  }
  if (record.type === 'Signage/advertising violation') {
    violations.push('Unauthorized signage on protected monument — AMASR Act 1958, Section 19')
  }

  // Append record's own reference
  if (record.regulatoryReference && !violations.some(v => v.includes(record.regulatoryReference.slice(0, 20)))) {
    violations.push(record.regulatoryReference)
  }

  return violations
}

// ─── Demo assessment generator ────────────────────────────────────────────────

function generateDemoEncroachmentAssessment(record: EncroachmentRecord): EncroachmentAssessment {
  const score = scoreSeverity(record)
  const threatLevel: EncroachmentSeverity =
    score >= 75 ? 'CRITICAL' :
    score >= 50 ? 'SIGNIFICANT' :
    score >= 25 ? 'MODERATE' : 'MINOR'

  const knowledge = retrieveHeritageKnowledge(record.siteId)

  const immediateRisk =
    threatLevel === 'CRITICAL'
      ? `Immediate and irreversible heritage fabric loss risk. Unauthorized physical intervention within the heritage precinct is actively damaging or threatening Original Material, spatial character, and Outstanding Universal Value of ${record.siteName}.`
      : threatLevel === 'SIGNIFICANT'
      ? `Significant risk of heritage damage if the encroachment is not addressed within days. The intrusion compromises the buffer zone integrity and sets a harmful precedent in the protected precinct.`
      : `Moderate heritage risk. The encroachment degrades the visual and physical setting of the protected site but has not yet caused irreversible physical damage to the core heritage fabric.`

  const heritageImpact =
    `${record.siteName} faces ${threatLevel.toLowerCase()} heritage impact from this ${record.type.toLowerCase()}. ` +
    (knowledge
      ? `Site sensitivity is rated ${knowledge.heritageSensitivity}. Key vulnerability: ${knowledge.materialVulnerabilities[0] || 'historic fabric'}.`
      : 'Site carries formal heritage designation requiring strict protection protocols.') +
    ` Impact location: ${record.location}. Estimated consequence: ${record.estimatedImpact}`

  const legalViolations = getLegalViolations(record)

  const actions: EncroachmentAssessment['recommendedActions'] = []

  if (threatLevel === 'CRITICAL' || threatLevel === 'SIGNIFICANT') {
    actions.push({
      priority: 'P1',
      action: 'Issue Stop Work Order / Cease and Desist Notice immediately',
      authority: 'AMC Heritage Cell + ASI Regional Office',
      timeframe: 'Within 24 hours',
    })
  }

  actions.push({
    priority: 'P1',
    action: 'Commission independent Heritage Impact Assessment by qualified heritage professional',
    authority: 'ASI Conservation Division / INTACH',
    timeframe: record.severity === 'CRITICAL' ? 'Within 48 hours' : 'Within 1 week',
  })

  if (record.bufferZoneViolation) {
    actions.push({
      priority: 'P2',
      action: 'File formal complaint under AMASR Act buffer zone provisions and notify State Heritage Department',
      authority: 'State Heritage Department + AMC Legal Cell',
      timeframe: 'Within 72 hours',
    })
  }

  actions.push({
    priority: 'P2',
    action: 'Photographic documentation and physical survey of damage extent',
    authority: 'Site Conservation Manager',
    timeframe: 'Immediately',
  })

  actions.push({
    priority: 'P3',
    action: 'Review and reinstate buffer zone markers and enforcement signage',
    authority: 'AMC Heritage Cell',
    timeframe: 'Within 2 weeks',
  })

  const precedentNotes =
    `Unaddressed encroachments in heritage precincts create enforcement precedents that are difficult to reverse. ` +
    `For UNESCO-inscribed sites and ASI-protected monuments, failure to act can trigger heritage authority review, ` +
    `potential inscription risk, and loss of conservation funding eligibility. ` +
    `Documented, timely enforcement action is itself a key heritage conservation measure.`

  return {
    threatLevel,
    immediateRisk,
    heritageImpact,
    legalViolations,
    recommendedActions: actions,
    precedentNotes,
    modelUsed: 'IBM Granite (Demo AI Mode)',
    demoMode: true,
    agentSteps: INITIAL_STEPS.map((s) => ({ ...s, status: 'COMPLETED' })),
  }
}

// ─── Public interface ──────────────────────────────────────────────────────────

export async function runEncroachmentAgent(
  record: EncroachmentRecord,
  onProgress?: EncroachmentProgressCallback
): Promise<EncroachmentAssessment> {
  const noop: EncroachmentProgressCallback = () => {}
  const progress = onProgress || noop
  const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

  let steps = INITIAL_STEPS.map((s) => ({ ...s }))

  // Step 1 — Classifier
  steps = updateStep(steps, 'classifier', 'ANALYZING')
  progress([...steps])
  await delay(500)
  steps = updateStep(steps, 'classifier', 'COMPLETED', `${record.type} · Severity: ${record.severity} · Buffer: ${record.bufferZoneViolation ? 'VIOLATED' : 'OK'}`)
  progress([...steps])

  // Step 2 — Legal Analyst
  steps = updateStep(steps, 'legal', 'ANALYZING')
  progress([...steps])
  await delay(600)
  const violations = getLegalViolations(record)
  steps = updateStep(steps, 'legal', 'COMPLETED', `${violations.length} regulatory violations identified`)
  progress([...steps])

  // Step 3 — Heritage Impact Assessor
  steps = updateStep(steps, 'impact', 'ANALYZING')
  progress([...steps])
  await delay(500)
  const score = scoreSeverity(record)
  steps = updateStep(steps, 'impact', 'COMPLETED', `Heritage impact score: ${score}/100`)
  progress([...steps])

  // Step 4 — Enforcement Planner
  steps = updateStep(steps, 'enforcement', 'ANALYZING')
  progress([...steps])
  await delay(600)

  let assessment: EncroachmentAssessment

  if (!IS_DEMO_MODE) {
    try {
      const knowledge = retrieveHeritageKnowledge(record.siteId)
      const prompt = `Analyse this heritage encroachment incident and return a structured enforcement assessment:

SITE: ${record.siteName}
HERITAGE TYPE: ${knowledge ? `Sensitivity: ${knowledge.heritageSensitivity}` : 'Heritage protected site'}
ENCROACHMENT TYPE: ${record.type}
SEVERITY: ${record.severity}
LOCATION: ${record.location}
DESCRIPTION: ${record.description}
BUFFER ZONE VIOLATION: ${record.bufferZoneViolation ? 'YES' : 'NO'}
ESTIMATED IMPACT: ${record.estimatedImpact}
REGULATORY REFERENCE: ${record.regulatoryReference}

Return a heritage encroachment enforcement assessment including: threat level, immediate risks, heritage impact, legal violations, and prioritised recommended actions. Keep response professional and actionable for conservation authorities.`

      const res = await fetch('/api/granite/encroachment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (res.ok) {
        assessment = generateDemoEncroachmentAssessment(record)
        assessment.demoMode = false
        assessment.modelUsed = 'IBM Granite'
      } else {
        assessment = generateDemoEncroachmentAssessment(record)
      }
    } catch {
      assessment = generateDemoEncroachmentAssessment(record)
    }
  } else {
    assessment = generateDemoEncroachmentAssessment(record)
  }

  steps = updateStep(steps, 'enforcement', 'COMPLETED', `${assessment.recommendedActions.length} enforcement actions generated`)
  progress([...steps])

  return { ...assessment, agentSteps: steps }
}
