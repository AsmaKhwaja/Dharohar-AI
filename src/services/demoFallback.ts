/**
 * Demo Fallback — generates realistic AI-style assessment responses
 * when IBM Granite credentials are not available.
 */

import type {
  AIAssessmentResult,
  HeritageStory,
  IncidentForm,
  RiskLevel,
  StoryInterest,
} from '../types'
import type { HeritageSite } from '../types'

const RISK_FACTORS_BY_INCIDENT: Record<string, Array<{ factor: string; detail: string }>> = {
  'Structural deterioration': [
    {
      factor: 'Progressive Masonry Failure',
      detail:
        'Observed spalling and joint failure indicate ongoing structural degradation. Load path integrity compromised at identified locations.',
    },
    {
      factor: 'Foundation Settlement Risk',
      detail:
        'Crack patterns consistent with differential settlement. Historic rubble-fill foundations vulnerable to moisture-driven sub-surface movement.',
    },
  ],
  'Surface damage': [
    {
      factor: 'Stone Surface Degradation',
      detail:
        'Surface erosion exceeding acceptable heritage preservation thresholds. Carved decorative elements at risk of irreversible loss.',
    },
    {
      factor: 'Pollution & Biological Growth',
      detail:
        'Black crust formation and biological colonization accelerating stone dissolution on exposed surfaces.',
    },
  ],
  'Water/moisture damage': [
    {
      factor: 'Salt Crystallization',
      detail:
        'Efflorescence visible across multiple wall surfaces indicating active salt migration. Subsurface moisture entrapment confirmed.',
    },
    {
      factor: 'Drainage System Failure',
      detail:
        'Blocked or absent drainage routes allowing water pooling against historic masonry. Capillary rise observed at plinth level.',
    },
  ],
  'Visitor pressure': [
    {
      factor: 'Mechanical Wear from Footfall',
      detail:
        'Visitor traffic volume exceeding conservation carrying capacity. Irreversible stone wear documented on primary circulation routes.',
    },
    {
      factor: 'Uncontrolled Visitor Behaviour',
      detail:
        'Physical contact with carved surfaces, unauthorized photography with flash, and barrier breaches documented in recent surveys.',
    },
  ],
  'Encroachment/change': [
    {
      factor: 'Unauthorized Structural Alteration',
      detail:
        'Modifications to historic fabric without heritage authority approval. Risk of permanent loss of original material and spatial character.',
    },
    {
      factor: 'Adjacent Development Pressure',
      detail:
        'Nearby construction causing vibration damage and visual intrusion. Buffer zone compliance requires immediate enforcement review.',
    },
  ],
  'Maintenance concern': [
    {
      factor: 'Deferred Maintenance Accumulation',
      detail:
        'Minor deficiencies escalating into systemic risks due to delayed intervention. Maintenance backlog estimated at 18+ months.',
    },
    {
      factor: 'Vegetation Encroachment',
      detail:
        'Root systems of self-seeded vegetation penetrating historic masonry joints. Organic growth accelerating structural deterioration.',
    },
  ],
}

function computeRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'LOW'
  if (score >= 55) return 'MODERATE'
  if (score >= 35) return 'HIGH'
  return 'CRITICAL'
}

function adjustScore(baseScore: number, form: IncidentForm): number {
  let delta = 0
  if (form.visitorPressure === 'EXTREME') delta -= 12
  else if (form.visitorPressure === 'HIGH') delta -= 7
  else if (form.visitorPressure === 'MODERATE') delta -= 3

  if (form.environmentalCondition === 'WET') delta -= 8
  else if (form.environmentalCondition === 'POST_MONSOON') delta -= 10
  else if (form.environmentalCondition === 'EXTREME_HEAT') delta -= 5

  if (form.incidentType === 'Structural deterioration') delta -= 12
  else if (form.incidentType === 'Water/moisture damage') delta -= 8
  else if (form.incidentType === 'Encroachment/change') delta -= 6
  else delta -= 4

  return Math.max(10, Math.min(90, baseScore + delta))
}

export function generateDemoAssessment(
  form: IncidentForm,
  site: HeritageSite
): AIAssessmentResult {
  const newScore = adjustScore(site.healthScore, form)
  const riskLevel = computeRiskLevel(newScore)

  const baseFactors = RISK_FACTORS_BY_INCIDENT[form.incidentType as string] || [
    {
      factor: 'General Heritage Risk',
      detail: 'Multiple risk factors identified from submitted incident report.',
    },
  ]

  const riskDrivers = baseFactors.map((f, i) => ({
    factor: f.factor,
    severity: (i === 0 ? riskLevel : newScore < 55 ? 'HIGH' : 'MODERATE') as RiskLevel,
    impact: i === 0 ? 75 : 55,
    detail: f.detail,
    explanation: f.detail,
  }))

  if (form.visitorPressure === 'EXTREME' || form.visitorPressure === 'HIGH') {
    riskDrivers.push({
      factor: 'Visitor Carrying Capacity Exceeded',
      severity: (form.visitorPressure === 'EXTREME' ? 'HIGH' : 'MODERATE') as RiskLevel,
      impact: form.visitorPressure === 'EXTREME' ? 70 : 50,
      detail: `Current visitor pressure recorded as ${form.visitorPressure}. Site infrastructure not designed for sustained high-volume visitor impact without managed access protocols.`,
      explanation: `Current visitor pressure recorded as ${form.visitorPressure}.`,
    })
  }

  const observedText = form.observedCondition
    ? `Field observations report: "${form.observedCondition}". `
    : ''

  const scoreDelta = newScore - site.healthScore

  return {
    id: `assessment-${Date.now()}`,
    siteId: form.siteId,
    siteName: site.name,
    timestamp: new Date().toISOString(),
    healthScore: newScore,
    previousHealthScore: site.healthScore,
    scoreDelta,
    riskLevel,
    confidence: 82 + Math.floor(Math.random() * 10),
    riskDrivers,
    evidenceSummary: `${observedText}Assessment based on reported ${form.incidentType.toLowerCase()} incident with ${form.visitorPressure} visitor pressure and ${form.environmentalCondition} environmental conditions. Heritage Health Score has ${newScore < site.healthScore ? 'decreased' : 'remained stable'} from ${site.healthScore} to ${newScore}, indicating ${riskLevel.toLowerCase()} risk status.`,
    whyAtRisk: `${site.name} is particularly vulnerable due to its construction materials and age. The reported ${form.incidentType.toLowerCase()} combined with ${form.environmentalCondition} conditions creates compounding risk factors. ${site.heritageType} designations impose strict intervention protocols, potentially delaying corrective action if not escalated immediately.`,
    recommendedActions: [
      {
        priority: 'IMMEDIATE',
        action: `Conduct detailed on-site inspection by qualified heritage conservation professional to verify reported ${form.incidentType.toLowerCase()} and assess extent of damage.`,
        reason: 'AI assessment must be verified by certified professionals before conservation intervention.',
        urgency: riskLevel === 'CRITICAL' ? 'Within 24 hours' : riskLevel === 'HIGH' ? 'Within 72 hours' : 'Within 1 week',
        timeframe: riskLevel === 'CRITICAL' ? 'Within 24 hours' : riskLevel === 'HIGH' ? 'Within 72 hours' : 'Within 1 week',
        stakeholder: 'ASI Conservation Division / INTACH Regional Chapter',
        reviewTimeline: '48-hour status update',
        justification: 'AI assessment must be verified by certified professionals before conservation intervention. Field verification ensures appropriate response scale.',
      },
      {
        priority: 'SHORT_TERM',
        action: `Implement visitor management protocols to reduce pressure on affected areas. Install protective barriers around ${form.incidentType === 'Structural deterioration' ? 'structurally compromised zones' : 'damaged surfaces'}.`,
        reason: 'Reducing active stress factors will slow deterioration rate.',
        urgency: 'Within 2 weeks',
        timeframe: 'Within 2 weeks',
        stakeholder: 'Site Management Authority + AMC Heritage Cell',
        reviewTimeline: '4-week assessment',
        justification: 'Reducing active stress factors will slow deterioration rate and protect site integrity during longer-term conservation planning.',
      },
      {
        priority: 'LONG_TERM',
        action: 'Commission comprehensive conservation management plan incorporating structural survey, material analysis, and visitor capacity study.',
        reason: 'Systematic long-term planning prevents recurrence.',
        urgency: 'Within 3 months',
        timeframe: 'Within 3 months',
        stakeholder: 'Heritage Conservation Authority + Academic Partners',
        reviewTimeline: 'Annual review',
        justification: 'Systematic long-term planning is essential to prevent recurrence and ensure authentic, reversible conservation methodology aligned with UNESCO/ASI guidelines.',
      },
    ],
    monitoringPlan: 'Monthly photographic documentation. Quarterly professional condition survey. Immediate escalation if condition deteriorates.',
    stakeholder: 'ASI Conservation Division + AMC Heritage Cell',
    humanVerificationRequired: true,
    disclaimer:
      'This AI-generated assessment is an analytical aid for conservation professionals. It does NOT constitute a certified structural engineering inspection. All critical structural decisions must be validated by a licensed conservation engineer with on-site verification.',
    modelUsed: 'IBM Granite (Demo Mode)',
    demoMode: true,
  }
}

// ─── Demo Stories ─────────────────────────────────────────────────────────────

const DEMO_STORIES: Record<string, Record<StoryInterest, string>> = {
  'ahmedabad-walled-city': {
    Architecture: `Walking through the pols of Ahmedabad's Walled City is like stepping through a living architectural museum that has never closed its doors. Founded in 1411 by Sultan Ahmed Shah, this UNESCO World Heritage City represents one of the finest concentrations of pre-modern urban fabric anywhere in Asia.

The architecture of the pols is a masterclass in climate-responsive design centuries before the term existed. Carved wooden facades — known as jharokhas — project over narrow lanes, creating shade while allowing residents to observe the street below from the privacy of latticed screens. These projecting balconies are not merely decorative; they are passive cooling systems, channelling breezes upward into interior courtyards.

Each haveli — the grand multi-storey mansion of a merchant family — was designed around a central chowk, or courtyard. Light, ventilation and social life all revolved around this open core. The ground floor accommodated commerce; upper floors were private family quarters. Carved teak columns, bearing intricate floral and figural motifs, support stone lintels that have stood without mortar for six centuries.

The mosques interspersed through the urban fabric reflect a remarkable architectural synthesis: Indo-Saracenic style that fused the craftsmanship of local Hindu and Jain artisans with the spatial grammar of Islamic religious architecture. The result — most visible in the Jama Masjid nearby — is a style found nowhere else on earth.

Today's conservation challenge is precisely this richness. Every carved screen, every courtyard well, every painted threshold is irreplaceable. DHAROHAR AI monitors this fragile ensemble continuously, alerting conservation teams before damage becomes loss.`,

    History: `In the spring of 1411, Sultan Ahmed Shah looked across the eastern bank of the Sabarmati River and chose a site for his new capital. What rose over the following century would become one of the great cities of medieval Asia — a cosmopolitan centre of trade, scholarship and remarkable religious plurality.

The Walled City's history is layered like the lime-plaster on its oldest walls. Under the Sultanate, the city grew rich on the textile trade that would eventually make Gujarat the commercial gateway of the subcontinent. Merchants from Persia, Arabia, East Africa and Central Asia walked its lanes. The pols — gated residential quarters — began as practical security arrangements; they evolved into sophisticated communities with their own temples, step-wells and governance structures.

The Mughal period brought new architectural patronage but left the pol system intact. When the Marathas and later the British assumed control, the Walled City adapted again without losing its fundamental character. It was in these lanes that Mahatma Gandhi, born not far from here, absorbed the traditions of non-violent resistance and community solidarity that would shape an independence movement.

The UNESCO inscription in 2017 was recognition of something remarkable: a city that had been continuously inhabited and continuously evolving for over 600 years, yet retained enough of its original character to be considered an Outstanding Universal Value for all humanity.

Conservation today is both urgent and complex — because this is not a museum. Families still live here, businesses still trade here, and any intervention must respect the living as much as the ancient.`,

    Culture: `There is a moment in the early morning, before the city fully wakes, when the Walled City of Ahmedabad belongs entirely to itself. The smell of yesterday's jasmine garlands mingles with the smoke of a chai stall. A vendor arranges flower offerings outside a 400-year-old jain temple. A woman draws a rangoli pattern at her threshold — the same pattern her mother drew, and her mother before her, stretching back through generations uncounted.

The pols are not streets in any conventional sense. They are communities with walls. Each pol was historically home to a single caste, trade or religious group: the weavers' pol, the goldsmiths' pol, the community that served the royal court. Entry was through a single gateway — the darwaza — which could be closed at night, making each pol a self-contained village within the city.

Within the pol, life was shared and intertwined. The chabutaro — a raised stone bird-feeder — stood at the heart of many pols, embodying the Jain principle of care for all living beings. The vav, or step-well, was a gathering place for women that doubled as an engineering marvel, dropping elegantly through multiple storeys to reach the water table.

Festival life in the Walled City has a density and vibrancy found nowhere else. During Uttarayan, the January kite festival, every rooftop becomes a launch pad. During Navratri, the pol lanes fill with garba dancers. The city breathes with its calendar, its seasons, its generations.

DHAROHAR AI helps ensure that this living culture has a living setting in which to continue — that the carved thresholds, the shared wells, the ancient gateways endure for another six hundred years.`,

    'Family-friendly': `Imagine a city where the streets are so narrow that neighbours can shake hands from their windows, where buildings are decorated with carvings so intricate that you could look at them for an hour and still find new shapes, and where every doorway tells a story. Welcome to the Walled City of Ahmedabad!

Built over 600 years ago by a king called Sultan Ahmed Shah, this city is like a giant puzzle of tiny neighbourhoods called 'pols'. Each pol had its own gate that could be shut at night — a bit like having a front door for your whole neighbourhood!

Look up at the wooden buildings and you'll see balconies with screens carved from teak wood. These weren't just pretty — they were like air conditioning for the house, letting cool breezes in while keeping the hot sun out. Pretty clever for buildings that are 500 years old!

In the middle of many pols, you'll find a chabutaro — a tall stone column with a little house on top for birds to eat and rest. People built these because they believed in being kind to every living creature, even sparrows.

The step-wells, called vavs, are like underground staircases going all the way down to where the water is. They look like something from a fantasy story!

Today, scientists and AI systems like DHAROHAR AI help conservation teams make sure these magical streets stay safe for families like yours to visit for hundreds more years. Pretty amazing, right?`,

    '5-minute quick story': `The Walled City of Ahmedabad is one of humanity's great urban achievements: a medieval city, founded in 1411, that has been continuously lived in for over 600 years and earned UNESCO World Heritage status in 2017 — the first city in India to do so.

WHAT MAKES IT SPECIAL: The city's defining feature is its pol system — interlocking residential quarters, each historically home to a distinct community, entered through a single gateway. Within these pols, magnificent wooden havelis (mansions) display carved facades, projecting jharokha balconies and central courtyards that represent the pinnacle of Gujarat's medieval craft tradition.

THE ARCHITECTURE: Indo-Saracenic architecture — a fusion of local Hindu, Jain and Islamic influences — appears throughout, from the carved wooden havelis to the nearby Jama Masjid mosque. The buildings are passive solar masterpieces: oriented, shaded and ventilated without any mechanical systems.

THE HISTORY: From Sultanate capital to Mughal province to Maratha territory to the city where Gandhi developed his philosophy of non-violent resistance, Ahmedabad's Walled City has witnessed and shaped centuries of Indian history.

THE RISK: Today the city faces threats from deferred maintenance, population pressure, illegal modifications and climate change. The lime-mortar rubble construction that has stood for six centuries is vulnerable — every delayed repair compounds risk.

DHAROHAR AI ROLE: Our system provides continuous heritage health monitoring, combining visitor pressure data, environmental sensors and field incident reports with IBM Granite AI analysis to give conservation teams fast, explainable risk assessments and prioritised action plans.`,
  },
  'modhera-sun-temple': {
    Architecture: `Rising from the plains of Mehsana district, the Modhera Sun Temple is arguably the most perfectly realized expression of Solanki-era temple architecture anywhere in the world. Built in 1026 CE under the patronage of King Bhimdev I, every element of this complex — from the Surya Kund step-well to the Gudhamandap sanctum — was calculated with an astronomical precision that modern engineers still find remarkable.

The temple complex unfolds in three ceremonial stages. First, the visitor encounters the Surya Kund — a magnificent rectangular step-well descending through four tiers of carved stone, its walls lined with 108 miniature shrines. This is not merely a water reservoir; it is an architectural preparation, a gradual transition from the mundane world to the sacred.

The Sabha Mandap assembly hall follows: a pillared space whose interior columns support corbelled stone brackets of extraordinary delicacy. Each column shaft is carved with dancers, celestial beings, and narrative panels drawn from the Ramayana and Mahabharata. The sheer density of carving is overwhelming — yet the proportional system maintains a rigorous internal logic.

The Gudhamandap sanctum completes the processional sequence. Although the central image of Surya no longer stands, the carved doorway — depicting the planetary deities, the river goddesses Ganga and Yamuna, and a procession of devotees — remains one of the finest examples of stone sculpture from medieval India.

The temple's astronomical alignment is celebrated twice yearly, during the equinoxes, when the rising sun's rays strike the sanctum's inner chamber directly — a feat of solar engineering that required the builders to understand celestial mechanics with extraordinary accuracy.`,

    History: `The year is 1026 CE. The Solanki king Bhimdev I has just repelled an invasion. To mark his victory and to honour the sun god Surya — patron deity of his dynasty — he commissions a temple at Modhera, the town from which his family traces its sacred lineage.

What his craftsmen built would outlast his dynasty, outlast the sultanates and empires that followed, and stand today as one of the greatest monuments of India's medieval civilization.

The Solanki period (approximately 940–1300 CE) was a golden age for Gujarat. Under a succession of able rulers, the region prospered through trade, produced remarkable scholarship, and patronised temple construction of astonishing sophistication. The temples at Modhera and nearby sites represent this civilization at its height.

The Modhera complex was seized and desecrated during Mahmud of Ghazni's campaigns — a trauma recorded in contemporary accounts. Yet the temple endured. Later sultans, recognizing its extraordinary craftsmanship, preserved rather than demolished it. Under the Mughals, it was recognized as a heritage monument and given protective status.

British-era archaeologists were among the first to document the temple systematically, and the Archaeological Survey of India has maintained it since independence. The ongoing challenge is not preservation from deliberate destruction — those days are past — but preservation from the slower violences of time, moisture, air pollution, and the footsteps of the thousands who come each year to wonder at what Bhimdev's craftsmen built.`,

    Culture: `The Sun Temple at Modhera was never simply a place of worship. It was a community centre, an astronomical observatory, a school of craft, a social gathering place — and twice a year, at the spring and autumn equinoxes, it became a theatre of light.

During the equinoxes, as the sun rises precisely on the eastern horizon, its rays travel the full length of the temple complex, passing through the gateway of the Sabha Mandap, through the ornate doorway of the Gudhamandap, and strike the now-empty sanctum where the golden image of Surya once stood. For those few minutes, the entire temple becomes a sundial, a cosmic clock, a reminder of the intimate relationship between human civilization and celestial mechanics.

The Surya Kund step-well was a democratic space. While the inner sanctum was reserved for priests, the kund was open to all — for bathing, for drawing water, for meeting, for sitting in the shade of its miniature shrines and watching the world pass. The 108 shrines ringing its walls are a census of the medieval religious imagination: Ganesha, Vishnu, Shiva, the planetary deities, the river goddesses, the heroes of the epics.

Today, the step-well has been drained and its water no longer serves daily life. But on festival days — particularly during the annual Uttarayan celebration and the newly revived Modhera Dance Festival — the kund fills with classical performers and the temple finds its voice again, connecting the living culture of Gujarat with a civilization 1,000 years distant.`,

    'Family-friendly': `Have you ever seen a swimming pool made of stone, surrounded by over a hundred tiny temples? That's exactly what you'll find at the beginning of the Modhera Sun Temple — and it's just the first amazing thing waiting for you here!

The Modhera Sun Temple was built almost 1,000 years ago by a king named Bhimdev I, who wanted to build the most beautiful temple he could for the sun god Surya. And he absolutely succeeded!

The first thing you see is the Surya Kund — a huge rectangular pool going deep into the ground, with carved steps all the way around and 108 little shrines carved into the walls. Imagine descending those steps like you're entering an underground city of tiny temples!

Here's the coolest science fact: the temple was built with a very special secret. Twice every year — in March and September — the rising sun shines exactly through every doorway of the temple, all the way to the very back room. The builders figured out exactly where to point the temple using only the stars and mathematics. No computers, no GPS — just pure cleverness!

The columns inside are covered with hundreds of tiny carved figures: dancers, warriors, gods, mythical creatures, even stories from ancient tales like the Ramayana. You could spend hours finding all the different characters!

DHAROHAR AI watches over this incredible place, counting visitors and checking the weather, to make sure that in another 1,000 years, children just like you will still be able to climb those steps and count those little temple shrines.`,

    '5-minute quick story': `The Modhera Sun Temple, built in 1026 CE, stands as one of the most perfectly designed examples of ancient Indian temple architecture. Commissioned by Solanki king Bhimdev I in what is now Mehsana district, Gujarat, it remains in near-perfect structural condition after nearly a millennium.

THE COMPLEX: Three elements form a processional sequence of increasing sanctity. The Surya Kund step-well — a rectangular reservoir ringed by 108 carved miniature shrines — provides ceremonial purification. The Sabha Mandap assembly hall features densely carved pillars supporting corbelled stone roofs. The Gudhamandap sanctum, though now empty of its original image, retains one of India's finest carved doorways.

THE ASTRONOMY: The temple's orientation is precisely calibrated. On the spring and autumn equinoxes, the rising sun's rays travel the full depth of the complex to illuminate the inner sanctum — a feat of solar engineering requiring advanced understanding of celestial mechanics, achieved with no instruments beyond careful observation.

THE CRAFT: The level of stone carving is extraordinary. Every surface of every column in the Sabha Mandap carries narrative and figurative sculpture. The doorway figures representing the planetary deities and river goddesses are considered masterworks of Solanki-period sculpture.

THE RISK: Despite its structural soundness, Modhera faces threats from visitor erosion on the Surya Kund steps, algae growth in the drained reservoir, and the slow deterioration of carved stone surfaces from pollution and acid rain.

DHAROHAR AI ROLE: Continuous monitoring of visitor counts, environmental conditions and surface condition reports allows conservation teams to intervene before damage becomes irreversible on this irreplaceable monument.`,
  },
}

const DEFAULT_STORIES: Record<StoryInterest, string> = {
  Architecture: `This heritage site represents a remarkable achievement of traditional architectural craftsmanship, combining structural ingenuity with ornamental richness developed over generations of master builders. Its construction techniques — developed before modern engineering tools — demonstrate sophisticated understanding of materials, climate, and structural behaviour.

The spatial organization reflects the social and spiritual priorities of its era: progression from public to sacred space, climate-responsive orientation, and the integration of natural light as an active design element. Every carved surface carries meaning, encoding the cosmological beliefs and narrative traditions of the culture that created it.

Conservation of this architectural heritage requires deep understanding of original materials and techniques. Interventions must be reversible and compatible with the historic fabric — principles monitored continuously by the DHAROHAR AI system to ensure that conservation actions preserve authenticity while arresting deterioration.`,

  History: `This site has borne witness to centuries of history, surviving the rise and fall of kingdoms, the passage of trade routes, the ebb and flow of empires. Its stones carry the marks of every era: original construction, later additions, periods of neglect and revival, each layer adding to a palimpsest of living history.

To walk through this heritage site is to walk through time — not as a passive observer, but as a participant in an ongoing story that connects present communities to ancestors separated by centuries. The people who built these structures were solving the same fundamental human problems: how to shelter, how to worship, how to create beauty, how to remember.

Understanding this history is the foundation of effective conservation. You cannot preserve what you do not understand. DHAROHAR AI combines historical knowledge with real-time monitoring to ensure that conservation decisions are informed by both the deepest past and the most current conditions.`,

  Culture: `Heritage sites are not museums. They are living expressions of culture, continuously being reinterpreted, re-inhabited and re-animated by communities whose identity is inseparable from the places their ancestors created. The rituals, festivals, crafts and daily practices that occur around heritage sites are as much a part of that heritage as the stones themselves.

This is the most complex dimension of heritage conservation: ensuring that the physical fabric endures without freezing the living culture around it. Conservation must accommodate the community as a partner, not just a beneficiary — recognising that the same people who carry the risk of damaging fragile structures through daily use are also the people who carry the knowledge, skills and motivation to protect them.

DHAROHAR AI supports this balance by providing conservation teams with fast, explainable risk assessments that help make management decisions before cultural activities are unnecessarily restricted.`,

  'Family-friendly': `Welcome to one of India's most amazing heritage sites! This place was built by incredibly talented craftspeople hundreds of years ago — and everything they built, they built using only their hands, simple tools, and an incredible amount of skill and knowledge passed down from their teachers.

Think about what it means to build something that lasts for hundreds of years. No steel, no concrete, no power tools — just stone, brick, lime mortar, and wood. The people who built these places were solving the same engineering problems you learn about in school: how to hold up heavy loads, how to span a gap, how to let in light and air. They just solved them in a very different way!

Every carving you see, every decorative pattern, every sculpted figure was done by hand. Some of these carvings took years to complete. Each craftsperson trained for over a decade before they were allowed to carve the most important parts of a sacred building.

Today, scientists, historians, and computer systems like DHAROHAR AI work together to make sure these amazing places survive for you, and for your children, and for their children after that.`,

  '5-minute quick story': `This UNESCO/ASI-protected heritage site represents one of Gujarat's most significant cultural monuments, combining historical depth, architectural excellence, and living cultural relevance.

SIGNIFICANCE: The site's Outstanding Universal Value derives from its exceptional craftsmanship, historical associations, and continued role in community cultural life. Its heritage designation recognizes both its intrinsic quality and its importance as a point of connection between present generations and a rich historical tradition.

ARCHITECTURE: The construction reflects the highest technical and artistic achievements of its era, combining structural sophistication with ornamental richness that required the collaboration of multiple specialized craft traditions.

CHALLENGES: Like all living heritage sites, this monument faces a combination of natural deterioration, visitor pressure, environmental exposure, and development encroachment. Each risk factor compounds the others, requiring integrated monitoring and management.

CONSERVATION APPROACH: Effective conservation requires balancing authentic preservation with community access, economic sustainability, and climate adaptation. Interventions must be reversible, compatible with original materials, and documented for future conservators.

DHAROHAR AI ROLE: Continuous AI-powered monitoring combines incident reports, environmental data, and historical knowledge to give conservation professionals fast, explainable risk assessments and prioritized action plans — ensuring that response is always proportionate, well-informed and well-documented.`,
}

export function generateDemoStory(site: HeritageSite, interest: StoryInterest): HeritageStory {
  const stories = DEMO_STORIES[site.id] || {}
  const content = (stories as Record<StoryInterest, string>)[interest] || DEFAULT_STORIES[interest]

  return {
    siteId: site.id,
    siteName: site.name,
    interest,
    content,
    generatedAt: new Date().toISOString(),
    demoMode: true,
    groundedInKnowledge: true,
    knowledgeSources: ['UNESCO World Heritage documentation', 'ASI heritage records', 'Curated site knowledge layer'],
  }
}
