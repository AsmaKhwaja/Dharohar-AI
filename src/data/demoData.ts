import type {
  HeritageSite,
  ConservationCase,
  AIAssessmentResult,
  DashboardStats,
  ScoreChangeAnalysis,
  EncroachmentRecord,
} from '../types'

// ─── Heritage Sites ─────────────────────────────────────────────────────────

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'ahmedabad-walled-city',
    name: 'Ahmedabad Walled City',
    location: 'Ahmedabad, Gujarat',
    heritageType: 'UNESCO World Heritage',
    healthScore: 64,
    previousHealthScore: 78,
    riskLevel: 'HIGH',
    visitorPressure: 'EXTREME',
    visitorPressureNumeric: 87,
    lastInspection: '2024-03-10',
    monthsSinceInspection: 8,
    conservationStatus: 'INTERVENTION',
    description:
      'The historic walled city of Ahmedabad, founded in 1411, is the first city in India to be inscribed on the UNESCO World Heritage List. Its urban fabric includes medieval mosques, Hindu and Jain temples, havelis (traditional mansions) and intricately designed pols (historic gated communities).',
    established: '1411 CE',
    coordinates: '23.0225° N, 72.5714° E',
    activeAlerts: 4,
  },
  {
    id: 'bhadra-fort',
    name: 'Bhadra Fort',
    location: 'Bhadra, Ahmedabad',
    heritageType: 'ASI Protected',
    healthScore: 54,
    previousHealthScore: 62,
    riskLevel: 'HIGH',
    visitorPressure: 'HIGH',
    visitorPressureNumeric: 72,
    lastInspection: '2024-02-28',
    monthsSinceInspection: 5,
    conservationStatus: 'INTERVENTION',
    description:
      'Bhadra Fort, built by Sultan Ahmed Shah in 1411, is a magnificent medieval fort complex that anchors the old city of Ahmedabad. The fort comprises mosques, palaces and administrative buildings reflecting Indo-Saracenic architectural traditions of the Sultanate period.',
    established: '1411 CE',
    coordinates: '23.0246° N, 72.5796° E',
    activeAlerts: 3,
  },
  {
    id: 'teen-darwaza',
    name: 'Teen Darwaza',
    location: 'Ahmedabad, Gujarat',
    heritageType: 'ASI Protected',
    healthScore: 73,
    previousHealthScore: 79,
    riskLevel: 'MODERATE',
    visitorPressure: 'HIGH',
    visitorPressureNumeric: 68,
    lastInspection: '2024-03-15',
    monthsSinceInspection: 3,
    conservationStatus: 'MONITORING',
    description:
      'The Teen Darwaza (Triple Gateway) is a magnificent 15th-century triple-arched ceremonial gateway that once served as the royal entrance to the Maidan Shahi, the royal square. Its intricate stone carvings represent a prime example of early Sultanate-period architecture in Gujarat.',
    established: '1415 CE',
    coordinates: '23.0250° N, 72.5803° E',
    activeAlerts: 1,
  },
  {
    id: 'pol-heritage-zone',
    name: 'Pol Heritage Zone',
    location: 'Old City, Ahmedabad',
    heritageType: 'Municipal Heritage',
    healthScore: 47,
    previousHealthScore: 58,
    riskLevel: 'CRITICAL',
    visitorPressure: 'MODERATE',
    visitorPressureNumeric: 52,
    lastInspection: '2024-01-20',
    monthsSinceInspection: 11,
    conservationStatus: 'EMERGENCY',
    description:
      "The Pol system represents a unique urban settlement pattern of Ahmedabad's old city. These intricately interconnected neighborhoods—each housing a distinct community—feature ornate wooden havelis, carved facades, step-wells and traditional community spaces that embody 600 years of continuous habitation.",
    established: '15th century CE',
    coordinates: '23.0276° N, 72.5726° E',
    activeAlerts: 6,
  },
  {
    id: 'modhera-sun-temple',
    name: 'Modhera Sun Temple',
    location: 'Modhera, Mehsana District, Gujarat',
    heritageType: 'ASI Protected',
    healthScore: 78,
    previousHealthScore: 82,
    riskLevel: 'MODERATE',
    visitorPressure: 'MODERATE',
    visitorPressureNumeric: 55,
    lastInspection: '2024-03-05',
    monthsSinceInspection: 4,
    conservationStatus: 'MONITORING',
    description:
      'The Sun Temple at Modhera is an 11th-century masterpiece of Solanki dynasty architecture dedicated to the sun god Surya. Its intricate carved exterior, the ornate Surya Kund step-well, and the Sabha Mandap assembly hall collectively represent one of the finest examples of ancient Indian temple architecture.',
    established: '1026 CE',
    coordinates: '23.5838° N, 72.1330° E',
    activeAlerts: 2,
  },
]

// ─── Demo Conservation Cases ─────────────────────────────────────────────────

export const DEMO_CASES: ConservationCase[] = [
  {
    id: 'case-001',
    siteId: 'pol-heritage-zone',
    siteName: 'Pol Heritage Zone',
    caseNumber: 'DHR-2024-001',
    title: 'Critical structural failure in Sheth ni Pol haveli façade',
    incidentType: 'Structural deterioration',
    riskLevel: 'CRITICAL',
    status: 'ESCALATED',
    createdAt: '2024-03-01T09:15:00Z',
    updatedAt: '2024-03-18T14:30:00Z',
    assignedTo: 'Dr. Meera Patel, Structural Conservation Wing',
    priority: 1,
    healthScoreAtIncident: 47,
    notes:
      'Immediate shoring required. Three load-bearing columns showing severe stone spalling. Monsoon season proximity heightens risk of catastrophic collapse. ASI emergency protocol activated.',
  },
  {
    id: 'case-002',
    siteId: 'bhadra-fort',
    siteName: 'Bhadra Fort',
    caseNumber: 'DHR-2024-002',
    title: 'Moisture ingress and efflorescence on eastern rampart',
    incidentType: 'Water/moisture damage',
    riskLevel: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-03-16T09:45:00Z',
    assignedTo: 'Ar. Rajiv Sharma, INTACH Gujarat Chapter',
    priority: 2,
    healthScoreAtIncident: 54,
    notes:
      'Salt crystallization observed over 40m stretch of eastern rampart. Waterproofing assessment commissioned. Temporary protective canopies installed on most affected sections.',
  },
  {
    id: 'case-003',
    siteId: 'ahmedabad-walled-city',
    siteName: 'Ahmedabad Walled City',
    caseNumber: 'DHR-2024-003',
    title: 'New surface cracking and moisture staining near Heritage Pol Zone',
    incidentType: 'Surface damage',
    riskLevel: 'HIGH',
    status: 'OPEN',
    createdAt: '2024-03-10T08:30:00Z',
    updatedAt: '2024-03-10T08:30:00Z',
    assignedTo: 'AMC Heritage Cell',
    priority: 2,
    healthScoreAtIncident: 64,
    notes:
      'Surface cracking and moisture staining observed near a heavily visited façade. Recent heavy rainfall compounding moisture ingress. Last inspection 8 months ago. Expert inspection recommended within 7 days.',
  },
  {
    id: 'case-004',
    siteId: 'teen-darwaza',
    siteName: 'Teen Darwaza',
    caseNumber: 'DHR-2024-004',
    title: 'Surface graffiti and pollution-driven black crust formation',
    incidentType: 'Surface damage',
    riskLevel: 'MODERATE',
    status: 'IN_PROGRESS',
    createdAt: '2024-03-05T16:20:00Z',
    updatedAt: '2024-03-14T10:15:00Z',
    assignedTo: 'ASI Conservation Division',
    priority: 3,
    healthScoreAtIncident: 73,
    notes:
      'Spray paint graffiti on north archway. Conservation-grade surface cleaning underway using micro-abrasion technique to preserve original stone surface.',
  },
  {
    id: 'case-005',
    siteId: 'modhera-sun-temple',
    siteName: 'Modhera Sun Temple',
    caseNumber: 'DHR-2024-005',
    title: 'Kund step-well algae bloom and visitor erosion of stone steps',
    incidentType: 'Visitor pressure',
    riskLevel: 'MODERATE',
    status: 'PENDING_REVIEW',
    createdAt: '2024-02-28T14:00:00Z',
    updatedAt: '2024-03-12T11:30:00Z',
    assignedTo: 'ASI Modhera Site Manager',
    priority: 3,
    healthScoreAtIncident: 78,
    notes:
      'Algae growth in Surya Kund reducing water visibility and accelerating stone degradation. Visitor footfall on carved steps causing measurable stone wear. Visitor management protocol under review.',
  },
]

// ─── Demo AI Assessment ──────────────────────────────────────────────────────

export const DEMO_ASSESSMENT: AIAssessmentResult = {
  id: 'assessment-demo-001',
  siteId: 'ahmedabad-walled-city',
  siteName: 'Ahmedabad Walled City – Heritage Pol Zone',
  timestamp: new Date().toISOString(),
  healthScore: 64,
  previousHealthScore: 78,
  scoreDelta: -14,
  riskLevel: 'HIGH',
  confidence: 84,
  riskDrivers: [
    {
      factor: 'Visitor Pressure — Extreme Footfall',
      severity: 'HIGH',
      impact: 78,
      detail: 'Visitor pressure recorded as EXTREME. Historic pol lane infrastructure not designed for sustained high-volume footfall. Mechanical wear and vibration loading compound existing structural vulnerabilities.',
      explanation: 'Visitor pressure recorded as EXTREME. Historic pol lane infrastructure not designed for sustained high-volume footfall.',
    },
    {
      factor: 'New Surface Cracking and Moisture Staining',
      severity: 'HIGH',
      impact: 72,
      detail: 'Active surface cracking observed near heavily visited façade. Moisture staining confirms water ingress. Recent heavy rainfall has saturated rubble-fill masonry.',
      explanation: 'Active surface cracking observed near heavily visited façade. Moisture staining confirms water ingress.',
    },
    {
      factor: 'Deferred Inspection — 8 Months Overdue',
      severity: 'HIGH',
      impact: 65,
      detail: 'Last professional inspection was 8 months ago. Defects identified in previous inspection have not been addressed. Maintenance backlog is accumulating.',
      explanation: 'Last professional inspection 8 months ago. Maintenance backlog accumulating without intervention.',
    },
    {
      factor: 'Post-Monsoon Moisture Entrapment',
      severity: 'MODERATE',
      impact: 58,
      detail: 'Recent heavy rainfall has driven moisture into lime-mortar rubble construction. Post-monsoon moisture entrapment accelerates salt crystallisation and mortar joint failure.',
      explanation: 'Heavy rainfall driving moisture into historic lime-mortar rubble construction.',
    },
  ],
  evidenceSummary:
    'Field report confirms new surface cracking and moisture staining at a heavily visited Heritage Pol Zone façade. Observed cracking is consistent with combined structural loading and moisture-driven expansion. Visitor pressure recorded as EXTREME. Last inspection was 8 months ago. Recent heavy rainfall has created post-monsoon moisture conditions that accelerate deterioration in rubble-fill lime-mortar construction.',
  whyAtRisk:
    'This site is particularly vulnerable because its rubble-fill lime-mortar construction — characteristic of 15th–17th century pol havelis — is highly sensitive to moisture variation. The combination of extreme visitor pressure, recent heavy rainfall, post-monsoon conditions, and an 8-month inspection gap has created compounding risk factors. Each factor would represent a manageable risk in isolation; together they represent a significant and accelerating deterioration trajectory. The UNESCO inscription creates both international scrutiny obligations and access to specialist conservation resources.',
  recommendedActions: [
    {
      priority: 'P1',
      action: 'Expert inspection within 7 days by qualified heritage conservation professional',
      reason: 'Confirm structural integrity of cracked façade and assess moisture ingress extent before further deterioration.',
      urgency: 'Within 7 days',
      timeframe: '7 days',
      stakeholder: 'ASI Conservation Division / INTACH Gujarat',
      reviewTimeline: '7-day status update',
      justification: 'AI assessment indicates HIGH risk. Professional inspection required to verify structural condition and determine appropriate intervention.',
    },
    {
      priority: 'P2',
      action: 'Increase monitoring frequency and install temporary protective barriers',
      reason: 'Reduce active stress while expert inspection is arranged. Protect cracked area from further visitor-caused damage.',
      urgency: 'Within 48 hours',
      timeframe: '48 hours',
      stakeholder: 'Site Management Authority + AMC Heritage Cell',
      reviewTimeline: 'Daily check until expert inspection',
      justification: 'Immediate protective measures reduce risk during the inspection waiting period.',
    },
    {
      priority: 'P3',
      action: 'Review visitor routing to reduce pressure on affected façade zone',
      reason: 'Sustained high visitor pressure is compounding moisture-related deterioration. Rerouting will reduce mechanical loading.',
      urgency: 'Within 2 weeks',
      timeframe: '2 weeks',
      stakeholder: 'AMC Heritage Cell + Tour Operators',
      reviewTimeline: 'Monthly review',
      justification: 'Visitor pressure management is essential for long-term conservation of living heritage in active use.',
    },
  ],
  monitoringPlan: 'Weekly photographic documentation of affected zone. Monthly mortar joint and crack measurement survey. Immediate notification if crack width exceeds 5mm or new cracking appears.',
  stakeholder: 'ASI Conservation Division + AMC Heritage Cell + UNESCO India',
  humanVerificationRequired: true,
  disclaimer:
    'This is an AI-assisted preliminary assessment. It does NOT constitute a certified structural engineering inspection. All structural risk determinations must be verified by a licensed heritage conservation engineer with on-site inspection. AI analysis aids decision-making but does not replace professional judgment.',
  modelUsed: 'IBM Granite (Demo Mode)',
  demoMode: true,
  agentSteps: [
    { id: 'condition', name: 'Condition Analyst', role: 'Analyses reported heritage condition and deterioration indicators', status: 'COMPLETED' },
    { id: 'risk', name: 'Heritage Risk Analyst', role: 'Combines condition, heritage sensitivity, visitor pressure and environment', status: 'COMPLETED' },
    { id: 'advisor', name: 'Conservation Advisor', role: 'Converts risk assessment into prioritised conservation actions', status: 'COMPLETED' },
    { id: 'orchestrator', name: 'Heritage Guardian Orchestrator', role: 'Synthesises agent outputs into final Conservation Intelligence Report', status: 'COMPLETED' },
  ],
  reasoningChain: [
    { label: 'Observed Condition', value: 'New surface cracking and moisture staining observed near heavily visited façade', type: 'evidence' },
    { label: 'Surface Deterioration', value: 'Cracking pattern consistent with combined structural loading and moisture-driven expansion', type: 'inference' },
    { label: 'Visitor Pressure', value: 'EXTREME — exceeds safe carrying capacity for historic lime-mortar fabric', type: 'evidence' },
    { label: 'Environmental Exposure', value: 'Recent heavy rainfall → post-monsoon moisture entrapment in rubble-fill masonry', type: 'evidence' },
    { label: 'Maintenance Status', value: 'Last inspection 8 months ago — maintenance backlog accumulating', type: 'evidence' },
    { label: 'Heritage Sensitivity', value: 'VERY HIGH — UNESCO World Heritage rubble-lime construction, highly moisture-sensitive', type: 'inference' },
    { label: 'Interaction Effect', value: 'High visitor pressure + moisture + overdue inspection = compounding risk, higher than any factor alone', type: 'inference' },
    { label: 'Uncertainty', value: 'Extent of subsurface moisture entrapment cannot be determined without on-site investigation', type: 'uncertainty' },
    { label: 'Heritage Health Score', value: '64/100 (down from 78) — reflects combined factor interaction', type: 'inference' },
    { label: 'Recommendation', value: 'Professional inspection within 7 days — AI assessment requires human expert verification', type: 'recommendation' },
  ],
}

// ─── Demo Score Change Analysis ───────────────────────────────────────────────

export const DEMO_SCORE_CHANGE: ScoreChangeAnalysis = {
  siteId: 'ahmedabad-walled-city',
  siteName: 'Ahmedabad Walled City – Heritage Pol Zone',
  previousScore: 78,
  currentScore: 64,
  delta: -14,
  primaryReasons: [
    {
      factor: 'Visitor Pressure',
      impact: 'HIGH',
      explanation: 'Visitor footfall increased significantly following recent cultural festival season. Extreme pressure is compounding mechanical stress on historic lime-mortar fabric and accelerating surface wear on façade elements.',
    },
    {
      factor: 'Surface Deterioration',
      impact: 'HIGH',
      explanation: 'New surface cracking observed near the most heavily visited façade. Moisture staining indicates active water ingress. These defects were not present in the previous inspection 8 months ago.',
    },
    {
      factor: 'Environmental Exposure',
      impact: 'MODERATE',
      explanation: 'Recent heavy rainfall has driven moisture into rubble-fill lime-mortar construction. Post-monsoon conditions are the highest-risk season for this construction type.',
    },
    {
      factor: 'Inspection Recency',
      impact: 'MODERATE',
      explanation: 'Last professional inspection was 8 months ago. In the absence of regular monitoring, minor defects have progressed without triggering early intervention.',
    },
  ],
  nextActions: [
    {
      priority: 'P1',
      action: 'Schedule expert inspection',
      reason: 'Verify structural condition of cracked façade and determine appropriate conservation intervention.',
      urgency: 'Within 7 days',
      timeframe: '7 days',
      stakeholder: 'ASI Conservation Division',
      reviewTimeline: '7 days',
      justification: 'AI-assessed HIGH risk requires professional verification before any physical intervention.',
    },
    {
      priority: 'P2',
      action: 'Monitor affected zone',
      reason: 'Daily photographic monitoring of crack width and moisture staining extent.',
      urgency: 'Immediate',
      timeframe: 'Daily until inspection',
      stakeholder: 'Site Management',
      reviewTimeline: 'Daily',
      justification: 'Monitoring captures deterioration progression and informs urgency of intervention.',
    },
    {
      priority: 'P3',
      action: 'Review visitor routing',
      reason: 'Reduce visitor pressure on affected façade zone while conservation work is planned.',
      urgency: 'Within 2 weeks',
      timeframe: '2 weeks',
      stakeholder: 'AMC Heritage Cell',
      reviewTimeline: 'Monthly',
      justification: 'Visitor pressure reduction protects vulnerable fabric during the assessment and planning period.',
    },
  ],
  generatedAt: new Date().toISOString(),
  demoMode: true,
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export const DASHBOARD_STATS: DashboardStats = {
  overallHealthScore: 63,
  criticalAlerts: 7,
  sitesMonitored: 5,
  averageVisitorPressure: 'HIGH',
  activeConservationCases: 5,
  assessmentsToday: 3,
  lastUpdated: new Date().toISOString(),
}

// ─── Demo Encroachment Records ────────────────────────────────────────────────

export const DEMO_ENCROACHMENT_RECORDS: EncroachmentRecord[] = [
  {
    id: 'enc-001',
    siteId: 'pol-heritage-zone',
    siteName: 'Pol Heritage Zone',
    caseNumber: 'ENC-2024-001',
    type: 'Unauthorized construction',
    severity: 'CRITICAL',
    location: 'Kuvawala Pol, adjacent to listed haveli #147',
    description:
      'Concrete extension built on ground floor of listed haveli without heritage authority approval. Construction has breached the 10m buffer zone. New reinforced concrete columns drilled through original lime-mortar courtyard floor. Extension covers approximately 18 sqm. Risk of structural damage to adjacent listed property through vibration and altered drainage.',
    detectedAt: '2024-03-08T11:30:00Z',
    reportedBy: 'AMC Heritage Cell field inspector',
    status: 'ESCALATED',
    bufferZoneViolation: true,
    estimatedImpact: 'Irreversible alteration to listed courtyard fabric. Potential structural compromise to shared party wall with Grade I haveli.',
    regulatoryReference: 'Gujarat Heritage Regulation Act 2017, Section 14(3); AMC Heritage Zone Bye-Law 22(a)',
  },
  {
    id: 'enc-002',
    siteId: 'ahmedabad-walled-city',
    siteName: 'Ahmedabad Walled City',
    caseNumber: 'ENC-2024-002',
    type: 'Commercial encroachment',
    severity: 'SIGNIFICANT',
    location: 'Manek Chowk heritage precinct, north-east corner',
    description:
      'Three permanent commercial stalls constructed using metal framework and concrete base within the heritage precinct boundary. Stalls obstruct sightline to listed 15th-century mosque façade. Electrical connections made without permit, creating fire risk near historic wooden structures.',
    detectedAt: '2024-02-22T09:15:00Z',
    reportedBy: 'UNESCO India monitoring team',
    status: 'UNDER_REVIEW',
    bufferZoneViolation: true,
    estimatedImpact: 'Visual and physical intrusion into UNESCO-inscribed heritage zone. Precedent risk if not actioned promptly.',
    regulatoryReference: 'UNESCO World Heritage Regulations; AMC Heritage Zone Bye-Law 18(b)',
  },
  {
    id: 'enc-003',
    siteId: 'bhadra-fort',
    siteName: 'Bhadra Fort',
    caseNumber: 'ENC-2024-003',
    type: 'Signage/advertising violation',
    severity: 'MODERATE',
    location: 'Eastern rampart, outer face',
    description:
      'Large-format advertising banner (6m × 4m) affixed to protected rampart wall using drilled fixing points. Banner obscures historic stone detail and the fixing drill holes have compromised approximately 12 individual stone joints. Fixing method inconsistent with reversibility requirement.',
    detectedAt: '2024-03-12T14:45:00Z',
    reportedBy: 'INTACH Gujarat Chapter',
    status: 'ACTION_TAKEN',
    bufferZoneViolation: false,
    estimatedImpact: 'Reversible visual intrusion but drill fixings have caused irreversible micro-damage to historic stonework.',
    regulatoryReference: 'ASI Prohibited Area Regulations; Ancient Monuments Act 1958, Section 19',
  },
  {
    id: 'enc-004',
    siteId: 'teen-darwaza',
    siteName: 'Teen Darwaza',
    caseNumber: 'ENC-2024-004',
    type: 'Infrastructure intrusion',
    severity: 'MODERATE',
    location: 'Northern archway base',
    description:
      'Underground utility cable trench excavated within 5m of listed gateway foundations without prior heritage impact assessment. Excavation exposed original lime-mortar footings. Temporary backfill used — permanent reinstatement with heritage-compatible materials not yet completed.',
    detectedAt: '2024-01-30T08:00:00Z',
    reportedBy: 'ASI site superintendent',
    status: 'UNDER_REVIEW',
    bufferZoneViolation: false,
    estimatedImpact: 'Exposed foundations vulnerable to moisture ingress. Backfill quality requires professional assessment before sign-off.',
    regulatoryReference: 'ASI Technical Guidelines for Utility Works near Protected Monuments',
  },
]

// ─── Constants ───────────────────────────────────────────────────────────────

export const INCIDENT_TYPES = [
  'Structural deterioration',
  'Surface damage',
  'Water/moisture damage',
  'Visitor pressure',
  'Encroachment/change',
  'Maintenance concern',
] as const

export const VISITOR_PRESSURE_LEVELS = ['LOW', 'MODERATE', 'HIGH', 'EXTREME'] as const
export const ENVIRONMENTAL_CONDITIONS = ['DRY', 'HUMID', 'WET', 'EXTREME_HEAT', 'POST_MONSOON'] as const

export const STORY_INTERESTS = [
  'Architecture',
  'History',
  'Culture',
  'Family-friendly',
  '5-minute quick story',
] as const

// ─── Demo Incident (pre-configured) ──────────────────────────────────────────

export const DEMO_INCIDENT = {
  siteId: 'ahmedabad-walled-city',
  siteName: 'Ahmedabad Walled City – Heritage Pol Zone',
  incidentType: 'Surface damage' as const,
  observedCondition: 'New surface cracking and moisture staining observed near a heavily visited façade. Cracks approximately 3–5mm wide running vertically through lime-mortar joints. Moisture staining extends approximately 1.5m across the façade surface.',
  visitorPressure: 'HIGH' as const,
  environmentalCondition: 'POST_MONSOON' as const,
  lastInspectionMonths: 8,
}
