/**
 * Visitor Flow Management Agent
 *
 * Monitors visitor density across zones, identifies capacity exceedances,
 * generates routing recommendations, and predicts heritage fabric stress
 * from current and projected visitor patterns.
 */

import type {
  VisitorFlowSnapshot,
  VisitorZone,
  RiskLevel,
  AgentStep,
  AgentStatus,
} from '../types'
import { HERITAGE_SITES } from '../data/demoData'

export type VisitorFlowProgressCallback = (steps: AgentStep[]) => void

// ─── Zone definitions per site ─────────────────────────────────────────────────

const SITE_ZONES: Record<string, Array<{ id: string; name: string; capacity: number; description: string }>> = {
  'ahmedabad-walled-city': [
    { id: 'pol-lanes',       name: 'Pol Lane Network',         capacity: 800,  description: 'Historic residential lanes and pol gateways' },
    { id: 'manek-chowk',    name: 'Manek Chowk Precinct',     capacity: 600,  description: 'Central market square and food zone' },
    { id: 'jama-masjid',    name: 'Jama Masjid Complex',      capacity: 500,  description: 'Principal mosque courtyard and surrounds' },
    { id: 'heritage-walk',  name: 'Heritage Walk Route',       capacity: 400,  description: 'Guided heritage walk primary corridor' },
  ],
  'bhadra-fort': [
    { id: 'main-courtyard', name: 'Main Courtyard',            capacity: 350,  description: 'Central fort courtyard and palace remains' },
    { id: 'ramparts',       name: 'Rampart Walk',              capacity: 200,  description: 'Perimeter wall walkways' },
    { id: 'gateway-arch',   name: 'Bhadra Gateway',            capacity: 250,  description: 'Entry gateway and forecourt' },
  ],
  'teen-darwaza': [
    { id: 'archway-passage', name: 'Triple Archway Passage',   capacity: 300,  description: 'Primary passage through three arches' },
    { id: 'forecourt',       name: 'Gateway Forecourt',        capacity: 400,  description: 'Arrival plaza and viewing area' },
  ],
  'pol-heritage-zone': [
    { id: 'sheth-ni-pol',   name: 'Sheth ni Pol',              capacity: 200,  description: 'Primary heritage pol — critical conservation zone' },
    { id: 'kuvawala-pol',   name: 'Kuvawala Pol',              capacity: 180,  description: 'Central residential pol network' },
    { id: 'doshiwada-pol',  name: 'Doshiwada ni Pol',          capacity: 220,  description: 'Southern pol cluster' },
  ],
  'modhera-sun-temple': [
    { id: 'surya-kund',     name: 'Surya Kund Step-well',      capacity: 300,  description: 'Ceremonial step-well — carved stone steps' },
    { id: 'sabha-mandap',   name: 'Sabha Mandap',              capacity: 200,  description: 'Assembly hall — densely carved pillars' },
    { id: 'gudhamandap',    name: 'Gudhamandap Sanctum',       capacity: 100,  description: 'Inner sanctum — highest heritage sensitivity' },
  ],
}

// ─── Occupancy simulation ──────────────────────────────────────────────────────

function generateOccupancy(capacity: number, sitePressureNumeric: number): number {
  // Map site pressure (0–100) to occupancy factor (0.3–1.1)
  const factor = 0.3 + (sitePressureNumeric / 100) * 0.8
  const noise = (Math.random() - 0.5) * 0.15
  return Math.round(Math.min(capacity * 1.1, capacity * (factor + noise)))
}

function generateHourlyData(
  safeCapacity: number,
  sitePressureNumeric: number
): Array<{ hour: string; visitors: number; capacity: number }> {
  const peakFactor = sitePressureNumeric / 100
  const profile = [0.05, 0.08, 0.1, 0.18, 0.22, 0.3, 0.35, 0.4, 0.38, 0.32, 0.28, 0.2, 0.12, 0.08]
  return profile.map((p, i) => {
    const hour = `${(i + 7).toString().padStart(2, '0')}:00`
    const noise = 0.9 + Math.random() * 0.2
    return {
      hour,
      visitors: Math.round(safeCapacity * p * peakFactor * 1.2 * noise),
      capacity: safeCapacity,
    }
  })
}

// ─── Agent helpers ─────────────────────────────────────────────────────────────

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
  makeStep('sensor',    'Visitor Sensor Aggregator',   'Aggregates footfall counts across zones and entry points'),
  makeStep('capacity',  'Capacity Threshold Analyser', 'Compares current occupancy against safe capacity thresholds per zone'),
  makeStep('routing',   'Routing Optimisation Agent',  'Calculates load redistribution routes and visitor management recommendations'),
  makeStep('forecast',  'Pressure Forecast Agent',     'Projects heritage fabric stress for current session and next 2 hours'),
]

// ─── Core snapshot builder ────────────────────────────────────────────────────

function buildFlowSnapshot(siteId: string, agentSteps: AgentStep[]): VisitorFlowSnapshot {
  const site = HERITAGE_SITES.find((s) => s.id === siteId)
  if (!site) throw new Error('Site not found')

  const zoneTemplates = SITE_ZONES[siteId] || [
    { id: 'main', name: 'Main Area', capacity: 400, description: 'Primary visitor area' },
  ]

  const zones: VisitorZone[] = zoneTemplates.map((zt) => {
    const currentOccupancy = generateOccupancy(zt.capacity, site.visitorPressureNumeric)
    const occupancyPercent = Math.round((currentOccupancy / zt.capacity) * 100)
    const riskLevel: RiskLevel =
      occupancyPercent >= 90 ? 'CRITICAL' :
      occupancyPercent >= 75 ? 'HIGH' :
      occupancyPercent >= 50 ? 'MODERATE' : 'LOW'
    return {
      id: zt.id,
      name: zt.name,
      capacity: zt.capacity,
      currentOccupancy,
      occupancyPercent,
      riskLevel,
      description: zt.description,
    }
  })

  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0)
  const totalOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0)
  const overallPercent = Math.round((totalOccupancy / totalCapacity) * 100)

  const pressureLevel: VisitorFlowSnapshot['pressureLevel'] =
    overallPercent >= 90 ? 'EXTREME' :
    overallPercent >= 70 ? 'HIGH' :
    overallPercent >= 45 ? 'MODERATE' : 'LOW'

  const hourlyData = generateHourlyData(totalCapacity, site.visitorPressureNumeric)
  const peakEntry = hourlyData.reduce((a, b) => (a.visitors > b.visitors ? a : b))
  const peakHour = peakEntry.hour

  // Zone-specific routing advice
  const criticalZones = zones.filter((z) => z.occupancyPercent >= 80).map((z) => z.name)
  const safeZones = zones.filter((z) => z.occupancyPercent < 50).map((z) => z.name)

  const agentRecommendations: string[] = []
  if (criticalZones.length > 0) {
    agentRecommendations.push(`Divert visitors from high-occupancy zones: ${criticalZones.join(', ')}`)
  }
  if (safeZones.length > 0) {
    agentRecommendations.push(`Route additional visitors to lower-occupancy areas: ${safeZones.join(', ')}`)
  }
  agentRecommendations.push('Deploy visitor management staff at zone entry points exceeding 75% capacity')
  if (overallPercent >= 85) {
    agentRecommendations.push('Consider timed-entry ticketing for remainder of session to prevent further crowding')
    agentRecommendations.push('Alert heritage conservation team — visitor pressure approaching fabric-stress threshold')
  }
  agentRecommendations.push('Enforce minimum 2m spacing near carved/fragile surface elements')

  const routingAdvice =
    criticalZones.length > 0
      ? `Current routing is concentrating visitors in ${criticalZones.join(' and ')}. Recommend immediate re-routing via alternate access paths. ${safeZones.length > 0 ? `Guide additional visitors toward ${safeZones[0]} which has available capacity.` : ''}`
      : `Visitor distribution is within acceptable parameters. Continue standard monitoring and maintain queue management at ${zones[0]?.name}.`

  return {
    siteId,
    siteName: site.name,
    timestamp: new Date().toISOString(),
    totalVisitors: totalOccupancy,
    safeCapacity: totalCapacity,
    occupancyPercent: overallPercent,
    peakHour,
    zones,
    hourlyData,
    pressureLevel,
    agentRecommendations,
    routingAdvice,
    demoMode: true,
    agentSteps,
  }
}

// ─── Public interface ──────────────────────────────────────────────────────────

export async function runVisitorFlowAgent(
  siteId: string,
  onProgress?: VisitorFlowProgressCallback
): Promise<VisitorFlowSnapshot> {
  const noop: VisitorFlowProgressCallback = () => {}
  const progress = onProgress || noop
  const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

  let steps = INITIAL_STEPS.map((s) => ({ ...s }))

  // Step 1 — Sensor
  steps = updateStep(steps, 'sensor', 'ANALYZING')
  progress([...steps])
  await delay(500)
  const site = HERITAGE_SITES.find((s) => s.id === siteId)
  steps = updateStep(steps, 'sensor', 'COMPLETED', `Footfall data aggregated — pressure: ${site?.visitorPressure || 'MODERATE'}`)
  progress([...steps])

  // Step 2 — Capacity
  steps = updateStep(steps, 'capacity', 'ANALYZING')
  progress([...steps])
  await delay(600)
  const zones = SITE_ZONES[siteId] || []
  steps = updateStep(steps, 'capacity', 'COMPLETED', `${zones.length} zones analysed`)
  progress([...steps])

  // Step 3 — Routing
  steps = updateStep(steps, 'routing', 'ANALYZING')
  progress([...steps])
  await delay(500)
  steps = updateStep(steps, 'routing', 'COMPLETED', `Routing optimisation complete`)
  progress([...steps])

  // Step 4 — Forecast
  steps = updateStep(steps, 'forecast', 'ANALYZING')
  progress([...steps])
  await delay(600)
  steps = updateStep(steps, 'forecast', 'COMPLETED', `2-hour pressure forecast generated`)
  progress([...steps])

  const snapshot = buildFlowSnapshot(siteId, steps)
  return { ...snapshot, agentSteps: steps }
}
