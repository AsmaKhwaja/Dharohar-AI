// ─── Heritage Site ──────────────────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
export type ConservationStatus = 'STABLE' | 'MONITORING' | 'INTERVENTION' | 'EMERGENCY'
export type HeritageType = 'UNESCO World Heritage' | 'ASI Protected' | 'State Protected' | 'Municipal Heritage'

export interface HeritageSite {
  id: string
  name: string
  location: string
  heritageType: HeritageType
  healthScore: number
  previousHealthScore: number        // NEW — for score change tracking
  riskLevel: RiskLevel
  visitorPressure: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'
  visitorPressureNumeric: number     // NEW — 0-100 for simulator
  lastInspection: string
  monthsSinceInspection: number      // NEW — for risk calculation
  conservationStatus: ConservationStatus
  description: string
  established: string
  coordinates: string
  activeAlerts: number
  image?: string
}

// ─── Incident ────────────────────────────────────────────────────────────────

export type IncidentType =
  | 'Structural deterioration'
  | 'Surface damage'
  | 'Water/moisture damage'
  | 'Visitor pressure'
  | 'Encroachment/change'
  | 'Maintenance concern'

export type EnvironmentalCondition = 'DRY' | 'HUMID' | 'WET' | 'EXTREME_HEAT' | 'POST_MONSOON'
export type VisitorPressureLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'

export interface IncidentForm {
  siteId: string
  incidentType: IncidentType | ''
  observedCondition: string
  visitorPressure: VisitorPressureLevel | ''
  environmentalCondition: EnvironmentalCondition | ''
  lastInspectionMonths?: number      // NEW — months since last inspection
  evidenceImage?: File | null
}

// ─── Multi-Agent Types ────────────────────────────────────────────────────────

export type AgentStatus = 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED'

export interface AgentStep {
  id: string
  name: string
  role: string
  status: AgentStatus
  output?: string
  startedAt?: number
  completedAt?: number
}

export interface ConditionAnalysis {
  deteriorationIndicators: string[]
  evidenceFound: string[]
  severityEstimate: RiskLevel
  uncertainty: string
  rawConditionText: string
}

export interface RiskAnalysis {
  combinedRiskScore: number          // 0-100
  interactionEffects: string[]
  primaryFactors: Array<{ factor: string; impact: number; explanation: string }>
  heritageContextNotes: string
}

export interface ConservationAdvice {
  actions: Array<{
    priority: 'P1' | 'P2' | 'P3'
    action: string
    reason: string
    timeframe: string
  }>
  monitoringPlan: string
  stakeholder: string
}

// ─── AI Assessment ──────────────────────────────────────────────────────────

export interface RiskDriver {
  factor: string
  impact: number                     // 0-100 — NEW replaces severity string only
  severity: RiskLevel
  detail: string
  explanation: string                // NEW — alias/extended
}

export interface ConservationAction {
  priority: 'P1' | 'P2' | 'P3' | 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'
  action: string
  reason: string                     // NEW canonical field
  urgency: string
  timeframe: string                  // NEW canonical field
  stakeholder: string
  reviewTimeline: string
  justification: string
}

export interface ReasoningStep {
  label: string
  value: string
  type: 'evidence' | 'inference' | 'uncertainty' | 'recommendation'
}

export interface AIAssessmentResult {
  id: string
  siteId: string
  siteName: string
  timestamp: string
  healthScore: number
  previousHealthScore: number
  scoreDelta: number                 // NEW — pre-calculated
  riskLevel: RiskLevel
  confidence: number
  riskDrivers: RiskDriver[]
  evidenceSummary: string
  whyAtRisk: string
  recommendedActions: ConservationAction[]
  monitoringPlan: string             // NEW
  stakeholder: string                // NEW
  humanVerificationRequired: boolean
  disclaimer: string
  modelUsed: string
  demoMode: boolean
  agentSteps?: AgentStep[]           // NEW — visible workflow
  reasoningChain?: ReasoningStep[]   // NEW — explainability panel
  conditionAnalysis?: ConditionAnalysis   // NEW
  riskAnalysis?: RiskAnalysis             // NEW
  conservationAdvice?: ConservationAdvice // NEW
}

// ─── Score Change ─────────────────────────────────────────────────────────────

export interface ScoreChangeAnalysis {
  siteId: string
  siteName: string
  previousScore: number
  currentScore: number
  delta: number
  primaryReasons: Array<{
    factor: string
    impact: RiskLevel
    explanation: string
  }>
  nextActions: ConservationAction[]
  generatedAt: string
  demoMode: boolean
}

// ─── What-If Simulator ────────────────────────────────────────────────────────

export interface WhatIfScenario {
  siteId: string
  currentVisitorPressure: number
  simulatedVisitorPressure: number
  changePercent: number
  currentHealthScore: number
  predictedHealthScore: number
  currentRisk: RiskLevel
  predictedRisk: RiskLevel
  interpretation: string
  recommendations: string[]
  disclaimer: string
}

// ─── Conservation Case ───────────────────────────────────────────────────────

export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'RESOLVED' | 'ESCALATED'

export interface ConservationCase {
  id: string
  siteId: string
  siteName: string
  caseNumber: string
  title: string
  incidentType: IncidentType
  riskLevel: RiskLevel
  status: CaseStatus
  createdAt: string
  updatedAt: string
  assignedTo: string
  priority: number
  healthScoreAtIncident: number
  assessment?: AIAssessmentResult
  notes: string
}

// ─── Story Mode ──────────────────────────────────────────────────────────────

export type StoryInterest = 'Architecture' | 'History' | 'Culture' | 'Family-friendly' | '5-minute quick story'

export interface HeritageStory {
  siteId: string
  siteName: string
  interest: StoryInterest
  content: string
  generatedAt: string
  demoMode: boolean
  groundedInKnowledge: boolean       // NEW
  knowledgeSources: string[]         // NEW
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  overallHealthScore: number
  criticalAlerts: number
  sitesMonitored: number
  averageVisitorPressure: string
  activeConservationCases: number
  assessmentsToday: number
  lastUpdated: string
}

// ─── Encroachment Detection ───────────────────────────────────────────────────

export type EncroachmentType =
  | 'Unauthorized construction'
  | 'Commercial encroachment'
  | 'Residential encroachment'
  | 'Signage/advertising violation'
  | 'Illegal demolition'
  | 'Infrastructure intrusion'

export type EncroachmentSeverity = 'MINOR' | 'MODERATE' | 'SIGNIFICANT' | 'CRITICAL'

export interface EncroachmentRecord {
  id: string
  siteId: string
  siteName: string
  caseNumber: string
  type: EncroachmentType
  severity: EncroachmentSeverity
  location: string
  description: string
  detectedAt: string
  reportedBy: string
  status: 'NEW' | 'UNDER_REVIEW' | 'ESCALATED' | 'ACTION_TAKEN' | 'RESOLVED'
  bufferZoneViolation: boolean
  estimatedImpact: string
  regulatoryReference: string
  agentAssessment?: EncroachmentAssessment
}

export interface EncroachmentAssessment {
  threatLevel: EncroachmentSeverity
  immediateRisk: string
  heritageImpact: string
  legalViolations: string[]
  recommendedActions: Array<{
    action: string
    authority: string
    timeframe: string
    priority: 'P1' | 'P2' | 'P3'
  }>
  precedentNotes: string
  modelUsed: string
  demoMode: boolean
  agentSteps?: AgentStep[]
}

// ─── Visitor Flow Management ──────────────────────────────────────────────────

export interface VisitorZone {
  id: string
  name: string
  capacity: number               // max safe capacity (persons)
  currentOccupancy: number       // current estimated occupancy
  occupancyPercent: number       // 0-100
  riskLevel: RiskLevel
  description: string
}

export interface VisitorFlowSnapshot {
  siteId: string
  siteName: string
  timestamp: string
  totalVisitors: number
  safeCapacity: number
  occupancyPercent: number
  peakHour: string
  zones: VisitorZone[]
  hourlyData: Array<{ hour: string; visitors: number; capacity: number }>
  pressureLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'
  agentRecommendations: string[]
  routingAdvice: string
  demoMode: boolean
  agentSteps?: AgentStep[]
}

// ─── Conservation Report ──────────────────────────────────────────────────────

export interface ConservationReport {
  id: string
  generatedAt: string
  period: string
  networkSummary: string
  siteReports: Array<{
    siteId: string
    siteName: string
    healthScore: number
    riskLevel: RiskLevel
    keyIssues: string[]
    recommendedActions: string[]
  }>
  overallRecommendations: string[]
  prioritySites: string[]
  markdown: string
  modelUsed: string
  demoMode: boolean
}
