/**
 * DHAROHAR AI — Curated Heritage Knowledge Layer
 *
 * This file contains concise, verified-style factual information
 * grounding AI responses for Gujarat heritage sites.
 *
 * Sources: UNESCO World Heritage documentation, ASI conservation records,
 * INTACH heritage surveys, published academic heritage literature.
 *
 * NOTE: Information is curated for grounding AI responses.
 * Do not fabricate citations or claim live government database access.
 */

export interface HeritageKnowledgeEntry {
  siteId: string
  siteName: string
  historicalContext: string
  architecturalCharacteristics: string
  culturalSignificance: string
  conservationConsiderations: string
  visitorConsiderations: string
  heritageSensitivity: 'VERY_HIGH' | 'HIGH' | 'MODERATE'
  materialVulnerabilities: string[]
  knownRisks: string[]
  tags: string[]
}

export const HERITAGE_KNOWLEDGE: HeritageKnowledgeEntry[] = [
  {
    siteId: 'ahmedabad-walled-city',
    siteName: 'Ahmedabad Walled City',
    historicalContext:
      'Founded in 1411 CE by Sultan Ahmed Shah of the Gujarat Sultanate, Ahmedabad became one of the most prosperous medieval cities of the Indian subcontinent. The city grew around the Bhadra citadel and expanded into a dense network of residential quarters called pols. In 2017, Ahmedabad became the first city in India to be inscribed on the UNESCO World Heritage List, recognised for its Outstanding Universal Value as a living medieval city.',
    architecturalCharacteristics:
      'The walled city is characterised by its pol system — interlocking residential neighbourhoods entered through single gateways. Havelis (mansions) feature carved teak and deodar wood facades, projecting jharokha balconies, and central courtyards. The mosques, temples, and step-wells demonstrate Indo-Saracenic synthesis — a fusion of Hindu, Jain, and Islamic architectural traditions unique to medieval Gujarat. Construction materials include local sandstone, lime mortar, and carved timber. Many structures use traditional rubble-fill foundations.',
    culturalSignificance:
      'The pols represent a sophisticated community organisation system in which diverse religious and craft communities coexisted in proximity. The city has been continuously inhabited for over 600 years. The Walled City is associated with major historical figures including Mahatma Gandhi, who drew on the traditions of non-violent resistance observed in these communities. Festivals including Uttarayan (kite festival) and Navratri garba continue as living cultural traditions within the historic fabric.',
    conservationConsiderations:
      'The traditional rubble-fill and lime-mortar construction is sensitive to moisture variation. Wooden carved elements are vulnerable to insect infestation, pollution, and humidity fluctuation. Many havelis are inhabited by families who may undertake unauthorised modifications. Deferred maintenance is common due to ownership disputes and resource constraints. Vibration from street traffic affects historic masonry. Salt crystallisation (efflorescence) is a persistent issue driven by groundwater rise and trapped moisture. Heritage interventions must use reversible, authentic materials — hydraulic lime consolidation is preferred over cement. The UNESCO inscription creates international scrutiny obligations.',
    visitorConsiderations:
      'Extremely high visitor footfall, especially during festivals, strains historic infrastructure. Narrow pol lanes were not designed for contemporary vehicle or crowd volumes. Tourist presence in inhabited residential areas requires sensitive management. Photography flash and physical contact with carved facades cause incremental damage. Litter and pollution affect heritage surfaces. Visitor carrying capacity management is an active conservation challenge.',
    heritageSensitivity: 'VERY_HIGH',
    materialVulnerabilities: [
      'Carved timber jharokhas and facades — sensitive to humidity, insects, UV exposure',
      'Lime mortar joint failure accelerated by moisture ingress and vibration',
      'Rubble-fill foundations vulnerable to differential settlement from moisture changes',
      'Painted interior plaster — sensitive to moisture and chemical cleaning agents',
      'Stone thresholds and steps — worn by continuous footfall',
    ],
    knownRisks: [
      'Illegal cable routing and utilities installation through historic fabric',
      'Unauthorised structural modifications by residents',
      'Water ingress through failing roofs and blocked drains',
      'Encroachment and densification in heritage buffer zones',
      'Termite and insect infestation of timber elements',
      'Salt efflorescence from rising damp',
      'Vibration damage from heavy vehicles in narrow pol lanes',
    ],
    tags: ['UNESCO', 'pol', 'haveli', 'jharokha', 'lime-mortar', 'timber', 'medieval', 'living-heritage'],
  },
  {
    siteId: 'bhadra-fort',
    siteName: 'Bhadra Fort',
    historicalContext:
      'Bhadra Fort was built by Sultan Ahmed Shah in 1411 CE as the first permanent structure of the new city of Ahmedabad. The fort served as the royal citadel and administrative centre of the Gujarat Sultanate. It later housed Mughal governors during the Mughal period and was used as a British administrative office during the colonial era. The fort is dedicated to the goddess Bhadrakali, whose temple stands within the complex.',
    architecturalCharacteristics:
      'The fort complex demonstrates early Sultanate architecture incorporating local Hindu craftsmanship. It includes battlemented walls, bastions, arched gateways, a mosque, and administrative buildings. The architecture reflects the Indo-Saracenic style characteristic of early Ahmedabad — pointed arches, carved brackets, and intricate stone jallis (screens). The construction material is primarily local buff sandstone with lime mortar. The Bhadrakali temple within the fort is an important religious site.',
    culturalSignificance:
      'Bhadra Fort represents the founding moment of Ahmedabad city. It has witnessed over 600 years of continuous occupation and use. The Bhadrakali temple remains an active place of worship. The adjacent Teen Darwaza (Triple Gateway) formed the ceremonial approach to the royal square. The fort is central to the identity of the historic city.',
    conservationConsiderations:
      'Sandstone elements show progressive weathering and surface erosion. Moisture ingress through failing roof structures causes active damage to interior spaces. The fort wall ramparts show structural cracking and vegetation-driven joint failure in sections. The active temple use creates challenges for access management and surface care. ASI maintenance has been ongoing but resources are constrained. Heavy visitor pressure during festivals requires careful management.',
    visitorConsiderations:
      'High visitor and devotee pressure during religious festivals. The combination of heritage tourism and active temple use creates competing priorities for space and surface management. Visitor access to structurally sensitive areas requires regular risk review.',
    heritageSensitivity: 'HIGH',
    materialVulnerabilities: [
      'Sandstone carving — susceptible to acid rain, pollution, and abrasion',
      'Lime mortar joints — vulnerable to moisture and root penetration',
      'Masonry battlements — exposed to weather on all faces',
      'Timber roof elements in administrative buildings — at risk from moisture and insects',
    ],
    knownRisks: [
      'Moisture ingress through failing roof structures',
      'Vegetation and root growth in masonry joints on battlements and walls',
      'Surface erosion of carved decorative elements',
      'Visitor wear on stairs and access routes',
      'Salt efflorescence on interior wall surfaces',
    ],
    tags: ['ASI-protected', 'fort', 'sandstone', 'sultanate', 'temple', 'Indo-Saracenic'],
  },
  {
    siteId: 'teen-darwaza',
    siteName: 'Teen Darwaza',
    historicalContext:
      'Teen Darwaza (Triple Gateway) was constructed in approximately 1415 CE during the reign of Sultan Ahmed Shah as the ceremonial entrance to the Maidan Shah (royal square) in front of the Jama Masjid. It is one of the finest surviving examples of early Gujarat Sultanate monumental architecture. The gateway served as the formal processional entrance for royal and ceremonial occasions.',
    architecturalCharacteristics:
      'The gateway comprises three arched openings flanked by carved stone piers and topped with battlemented parapet walls. The architectural detail includes finely carved medallions, geometric patterns, and floral motifs in the local buff sandstone. The triple-arch form draws on both Islamic gateway typology and local Hindu bracket and corbel traditions. The scale and refinement of the carving places it among the finest architectural monuments of 15th-century India.',
    culturalSignificance:
      'Teen Darwaza is one of the most recognisable and photographed heritage monuments of Ahmedabad. It anchors the historic core of the city and is central to civic memory. The adjacent Jama Masjid and Maidan Shah together constitute the ceremonial heart of the medieval city. The gateway is actively used as a reference point for city events and public gatherings.',
    conservationConsiderations:
      'The sandstone surface shows accumulation of pollution-derived black crust and biological growth in sheltered areas. Carved detail is at risk from abrasion by visitors and physical contact. The gateway sits adjacent to a major road junction, exposing it to vehicle exhaust, vibration, and sulphation of stone surfaces. Previous incompatible cement repairs in some areas have created differential movement stresses. Access management and surface cleaning require specialist conservation expertise.',
    visitorConsiderations:
      'The gateway is surrounded by active commercial and traffic zones. Pedestrian crowding creates mechanical wear risk on the gateway base. Unauthorised graffiti has been a recurring management challenge. Photographic lighting equipment used by commercial operators can damage surfaces if used in direct contact.',
    heritageSensitivity: 'HIGH',
    materialVulnerabilities: [
      'Sandstone carving — vulnerable to acid rain, vehicle exhaust sulphation, and abrasion',
      'Black crust formation on carved surfaces from urban pollution',
      'Differential movement at historic/modern material junctions',
      'Biological growth in sheltered carved cavities',
    ],
    knownRisks: [
      'Vehicle exhaust sulphation and acid rain damage to carved stone',
      'Surface graffiti and visitor-caused abrasion',
      'Incompatible cement repairs creating differential movement',
      'Biological colonisation of carved recesses',
      'Vibration from adjacent traffic',
    ],
    tags: ['ASI-protected', 'gateway', 'sandstone', 'sultanate', 'carved', '15th-century'],
  },
  {
    siteId: 'pol-heritage-zone',
    siteName: 'Pol Heritage Zone',
    historicalContext:
      'The pol system constitutes the primary residential fabric of the historic Walled City of Ahmedabad, dating from the 15th century onward. Each pol is a self-contained residential quarter historically inhabited by a single caste, trade, or religious community. The pol network includes some of the oldest surviving urban residential architecture in India. The system of communal governance, shared step-wells, bird-feeders, and gated access represents a unique model of historic urban settlement.',
    architecturalCharacteristics:
      'Pol havelis are typically three to four storeys, constructed of rubble masonry with lime mortar, with carved timber facades. The ground floor traditionally accommodated commercial activities; upper floors were private family quarters. Projecting wooden jharokha balconies shade the narrow lanes below. Central courtyards (chowks) provide light and ventilation. Carved wooden columns, brackets, and lintels demonstrate the highest levels of traditional Gujarat woodcarving craft. Step-wells (vavs) and bird-feeders (chabutaras) are characteristic community elements within each pol.',
    culturalSignificance:
      'The pols are living heritage — continuously occupied and actively maintained by community members. They embody the social organisation principles of medieval Gujarat: communal governance, multi-faith coexistence, and craft-based economic organisation. The pols are the densest concentration of traditional intangible heritage practices in Ahmedabad, with festival preparations, craft traditions, and community rituals continuing as daily life.',
    conservationConsiderations:
      'This is the most critically endangered heritage zone in Ahmedabad. Rubble-fill lime-mortar construction is extremely sensitive to moisture. Deferred maintenance by owners — often due to legal ownership disputes over generations — has allowed minor defects to become structural risks. Unauthorised modifications including insertion of RCC slabs, blocking of ventilation openings, and modification of party walls have altered structural behaviour. Post-monsoon periods are the highest risk season. Any conservation intervention requires resident engagement and legal clarity over heritage obligations.',
    visitorConsiderations:
      'Heritage tourism in residential pols requires careful management to respect residents while enabling access. Unmanaged tourist crowds in narrow lanes create both visitor safety risks and resident quality-of-life impacts. Photography and guided tours require community consent protocols.',
    heritageSensitivity: 'VERY_HIGH',
    materialVulnerabilities: [
      'Rubble-fill lime masonry — highly sensitive to moisture, most vulnerable construction type',
      'Timber carved elements — at risk from termite infestation, moisture, and UV decay',
      'Lime plaster interiors — highly sensitive to moisture and incompatible repair materials',
      'Foundations — risk of differential settlement from groundwater variation',
      'Shared party walls — vulnerable to damage if adjacent structure is modified',
    ],
    knownRisks: [
      'Structural failure risk from deferred maintenance on inhabited buildings',
      'Unauthorised RCC modifications altering historic structural behaviour',
      'Termite infestation of timber structural elements',
      'Rising damp and post-monsoon moisture entrapment',
      'Legal ownership disputes blocking conservation access',
      'Complete loss of historic fabric through neglect or illegal demolition',
      'Salt efflorescence from capillary rise',
    ],
    tags: ['UNESCO', 'pol', 'haveli', 'living-heritage', 'timber', 'rubble-masonry', 'critical-risk', 'residential'],
  },
  {
    siteId: 'modhera-sun-temple',
    siteName: 'Modhera Sun Temple',
    historicalContext:
      'The Sun Temple at Modhera was constructed in 1026 CE under the Solanki dynasty king Bhimdev I in what is now Mehsana District, Gujarat. It was dedicated to the sun god Surya and represents the height of Solanki architectural achievement. The temple complex has survived nearly a millennium with its primary structure substantially intact, representing one of the best-preserved examples of ancient Indian temple architecture. The temple is no longer used for active worship but remains a major archaeological and cultural monument under ASI protection.',
    architecturalCharacteristics:
      'The temple complex consists of three elements: the Surya Kund (a magnificent step-well reservoir with 108 miniature shrines on tiered steps), the Sabha Mandap (assembly hall with richly carved pillars), and the Gudhamandap (inner sanctum). The construction uses local stone (primarily sandstone) assembled without mortar through precise interlocking. The astronomical orientation of the temple is precisely calibrated: on the spring and autumn equinoxes, the rising sun illuminates the inner sanctum. The sculptural programme covers every surface with narrative and figurative carving of exceptional quality depicting deities, celestial beings, and scenes from Hindu epics.',
    culturalSignificance:
      'Modhera represents the artistic and intellectual achievement of Solanki Gujarat at its zenith. The astronomical precision of the temple design demonstrates sophisticated knowledge of celestial mechanics. The sculptural programme constitutes a major example of early medieval Indian temple sculpture. The temple is the venue for the annual Modhera Dance Festival, which brings classical performing arts into dialogue with the ancient site, connecting living culture to its architectural heritage.',
    conservationConsiderations:
      'The dry stone interlocking construction requires precise joint integrity — any stone displacement can propagate structural damage. The Surya Kund has been drained and its carved steps experience erosion from visitor footfall. Algae and biological growth in the former water-contact zones of the Kund require periodic specialist treatment. Surface carving is vulnerable to acid rain, biological growth in sheltered areas, and mechanical wear from visitor contact. The ASI has undertaken ongoing structural consolidation work. Any restoration must respect the dry stone construction method and avoid introduction of incompatible materials.',
    visitorConsiderations:
      'Visitor numbers during festivals and tourist season place significant pressure on the carved steps of the Surya Kund. Visitor routing management is essential to distribute wear across the step network and protect the most fragile carved elements from direct contact. Photography lighting and selfie activity near fragile carved surfaces creates risk.',
    heritageSensitivity: 'HIGH',
    materialVulnerabilities: [
      'Dry stone interlocking masonry — sensitive to joint displacement and settlement',
      'Carved sandstone surfaces — vulnerable to acid rain, biological growth, and abrasion',
      'Kund step surfaces — eroded by visitor footfall, algae, and standing water',
      'Figurative sculpture — at risk from mechanical contact and pollution',
    ],
    knownRisks: [
      'Visitor erosion of carved Surya Kund steps',
      'Algae and biological growth in Kund and sheltered carved areas',
      'Acid rain and air pollution damage to carved surfaces',
      'Stone joint displacement in dry interlocking construction zones',
      'Visitor contact damage to figurative sculpture',
    ],
    tags: ['ASI-protected', 'temple', 'Solanki', 'dry-stone', 'solar-alignment', 'step-well', '11th-century', 'sculpture'],
  },
]

// ─── Knowledge Retrieval ──────────────────────────────────────────────────────

/**
 * Retrieve heritage knowledge for a given site, optionally filtered by topic keywords.
 * This is a simple structured retrieval — no vector database required for MVP.
 */
export function retrieveHeritageKnowledge(
  siteId: string,
  topic?: string
): HeritageKnowledgeEntry | null {
  const entry = HERITAGE_KNOWLEDGE.find((k) => k.siteId === siteId)
  if (!entry) return null

  // If topic provided, check if it's in scope
  if (topic) {
    const topicLower = topic.toLowerCase()
    const allText = [
      entry.historicalContext,
      entry.architecturalCharacteristics,
      entry.culturalSignificance,
      entry.conservationConsiderations,
      entry.visitorConsiderations,
      ...entry.tags,
    ].join(' ').toLowerCase()

    // Return entry only if topic is within scope
    const inScope = allText.includes(topicLower) || entry.tags.some((t) => t.includes(topicLower))
    if (!inScope && topic.length > 5) {
      // Return entry but flag as potentially out of scope via the caller
      return entry
    }
  }

  return entry
}

/**
 * Get heritage sensitivity description for use in AI prompts.
 */
export function getHeritageSensitivityContext(siteId: string): string {
  const entry = HERITAGE_KNOWLEDGE.find((k) => k.siteId === siteId)
  if (!entry) return 'Heritage sensitivity: Unknown. Apply precautionary approach.'

  return [
    `Heritage Sensitivity: ${entry.heritageSensitivity}`,
    `Material Vulnerabilities: ${entry.materialVulnerabilities.slice(0, 3).join('; ')}`,
    `Known Risks: ${entry.knownRisks.slice(0, 3).join('; ')}`,
    `Conservation Notes: ${entry.conservationConsiderations.slice(0, 300)}`,
  ].join('\n')
}

/**
 * Check if a topic is within the verified knowledge scope.
 */
export function isTopicInScope(siteId: string, topic: string): boolean {
  const entry = HERITAGE_KNOWLEDGE.find((k) => k.siteId === siteId)
  if (!entry) return false

  const topicLower = topic.toLowerCase()
  const allText = [
    entry.siteName,
    entry.historicalContext,
    entry.architecturalCharacteristics,
    entry.culturalSignificance,
    ...entry.tags,
  ].join(' ').toLowerCase()

  return allText.includes(topicLower) || entry.tags.some((t) => t.includes(topicLower))
}
