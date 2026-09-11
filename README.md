# DHAROHAR AI — Heritage Guardian

> **Detect. Understand. Prioritize. Preserve.**

AI-powered Heritage Conservation Command Center for Gujarat's World Heritage Network.
Built on **IBM Granite LLM** via **watsonx.ai**.

---

## Overview

DHAROHAR AI monitors heritage sites across Gujarat — Ahmedabad's UNESCO World Heritage Walled City, Bhadra Fort, Teen Darwaza, the Pol Heritage Zone, and Modhera Sun Temple — using a multi-agent AI pipeline that combines incident evidence, site knowledge, visitor pressure and environmental data to produce explainable Heritage Risk Assessments and Conservation Action Plans.

---

## Features

| Agent | Description |
|---|---|
| **Structural Health Monitoring** | Heritage Guardian Orchestrator with 4 AI agents: Condition Analyst → Risk Analyst → Conservation Advisor → Synthesis |
| **Encroachment Detection** | Regulatory compliance analyst + buffer zone monitoring + enforcement action planner |
| **Visitor Flow Management** | Per-zone occupancy tracking + capacity threshold analysis + routing recommendations |
| **Heritage Storytelling** | IBM Granite-powered storytelling with verified knowledge grounding |
| **Conservation Reporting** | One-click network report generation with markdown export |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Leave blank to run in Demo Mode (no IBM credentials needed)
VITE_WATSONX_API_KEY=
VITE_WATSONX_PROJECT_ID=
VITE_DEMO_MODE=true
```

### 3. Start frontend

```bash
npm run dev
```

Open **http://localhost:5173**

---

## Demo Mode

**Demo Mode is the default.** The application is fully functional without IBM credentials.

When `VITE_DEMO_MODE=true` or credentials are absent:
- All AI pipelines run using deterministic local reasoning
- All 5 agents work end-to-end with realistic outputs
- UI clearly labels everything as "Demo AI Mode"
- The demo flow works: Dashboard → Sites → Incident → Assessment → Action Plan → Report

---

## IBM Granite Integration

To activate live IBM Granite reasoning:

### 1. Start the backend proxy server

```bash
cd server
npm install
node server.js
```

Required environment variables for the server:

```env
WATSONX_API_KEY=your_ibm_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
PORT=3001
```

### 2. Set frontend to live mode

In `.env`:
```env
VITE_WATSONX_API_KEY=your_ibm_api_key
VITE_WATSONX_PROJECT_ID=your_project_id
VITE_DEMO_MODE=false
```

The frontend proxies all Granite calls through `POST /api/granite/*` — credentials never appear in the browser bundle.

---

## Architecture

```
src/
├── App.tsx                        # Router (7 routes)
├── components/
│   ├── Layout.tsx                 # Sidebar navigation
│   ├── AgentWorkflow.tsx          # AI agent step visualization
│   ├── AIReasoningPanel.tsx       # Explainability panel
│   ├── AssessmentResult.tsx       # Full assessment display
│   ├── ScoreChangePanel.tsx       # Health score delta
│   ├── WhatIfSimulator.tsx        # Visitor pressure simulator
│   ├── RiskBadge.tsx              # Risk level badge
│   └── HealthScore.tsx            # Score display
├── data/
│   ├── demoData.ts                # 5 sites, 5 cases, 4 encroachment records
│   └── heritageKnowledge.ts       # Curated knowledge for all sites
├── pages/
│   ├── Dashboard.tsx              # Command center + report generation
│   ├── HeritageSites.tsx          # Site browser + what-if simulator
│   ├── AIAssessment.tsx           # Incident form + AI assessment
│   ├── ConservationCases.tsx      # Case management
│   ├── EncroachmentDetection.tsx  # Encroachment agent
│   ├── VisitorFlowAgent.tsx       # Visitor flow agent
│   └── StoryMode.tsx              # Heritage storytelling
├── services/
│   ├── orchestrator.ts            # 4-agent assessment pipeline
│   ├── graniteService.ts          # IBM Granite proxy client
│   ├── encroachmentAgent.ts       # Encroachment detection agent
│   ├── visitorFlowAgent.ts        # Visitor flow management agent
│   ├── conservationReportAgent.ts # Conservation reporting agent
│   └── demoFallback.ts            # Demo mode fallbacks
└── types/index.ts                 # All TypeScript types

server/
├── server.js                      # Express proxy — routes IBM API calls
└── package.json
```

---

## IBM Cloud Deployment

### Frontend (IBM Cloud Static Sites / CF)

```bash
npm run build
# Deploy dist/ to IBM Cloud Static Sites or Cloud Foundry
```

### Backend Proxy (IBM Cloud Code Engine / CF)

```bash
cd server
# Set environment variables:
# WATSONX_API_KEY, WATSONX_PROJECT_ID, PORT, ALLOWED_ORIGIN
node server.js
```

Update `vite.config.ts` to point the `/api` proxy to your deployed server URL in production.

---

## Navigation

| Route | Page |
|---|---|
| `/dashboard` | Heritage Guardian Command Center |
| `/sites` | Heritage Site Browser |
| `/assessment` | AI Incident Assessment |
| `/cases` | Conservation Cases |
| `/encroachment` | Encroachment Detection Agent |
| `/visitor-flow` | Visitor Flow Management Agent |
| `/story` | Heritage Story Mode |

---

## Safety Notes

DHAROHAR AI includes mandatory AI safety guardrails:

- **Never** claims to provide certified structural engineering inspections
- **Always** labels AI assessments as preliminary
- **Always** recommends professional expert verification for HIGH/CRITICAL risk
- **Clearly** distinguishes observed evidence from inferred risk from uncertainty
- **Never** fabricates historical facts outside the verified knowledge base

---

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (dark heritage theme — gold/sand accents)
- IBM Granite LLM via watsonx.ai (proxied through Express backend)
- React Router v6
- Lucide React icons

---

*DHAROHAR AI — Built for IBM Hackathon 2024 · Gujarat Heritage Network*
