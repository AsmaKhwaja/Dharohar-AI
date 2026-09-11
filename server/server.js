/**
 * DHAROHAR AI — Backend API Proxy Server
 *
 * Proxies IBM Granite / watsonx.ai calls so API credentials are
 * never exposed in the browser bundle.
 *
 * Routes:
 *   POST /api/granite/assessment  — heritage risk assessment
 *   POST /api/granite/story       — heritage storytelling
 *   GET  /api/health              — liveness probe
 *
 * IBM Cloud deployment: set PORT env var (default 3001).
 * All IBM credentials must be provided as environment variables.
 */

import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }))

const PORT = process.env.PORT || 3001
const WATSONX_API_URL =
  process.env.WATSONX_API_URL ||
  'https://us-south.ml.cloud.ibm.com/ml/v1/text/generation'
const GRANITE_MODEL = process.env.GRANITE_MODEL || 'ibm/granite-13b-instruct-v2'
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID || ''
const IBM_API_KEY = process.env.WATSONX_API_KEY || ''

// ─── IBM IAM Token ────────────────────────────────────────────────────────────

let cachedToken = null
let tokenExpiry = 0

async function getIBMToken() {
  if (cachedToken && Date.now() < tokenExpiry - 30_000) return cachedToken

  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${IBM_API_KEY}`,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`IBM IAM token error: ${res.status} — ${err}`)
  }
  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiry = Date.now() + data.expires_in * 1000
  return cachedToken
}

// ─── Granite call helper ──────────────────────────────────────────────────────

async function callGranite(prompt, systemPrompt, maxTokens = 1400) {
  const token = await getIBMToken()
  const res = await fetch(WATSONX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model_id: GRANITE_MODEL,
      input: `${systemPrompt}\n\n${prompt}`,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: maxTokens,
        stop_sequences: ['###END###'],
        temperature: 0.2,
      },
      project_id: WATSONX_PROJECT_ID,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Granite API error: ${res.status} — ${err}`)
  }
  const data = await res.json()
  return (data.results?.[0]?.generated_text ?? '').replace('###END###', '').trim()
}

// ─── System prompts ───────────────────────────────────────────────────────────

const ASSESSMENT_SYSTEM_PROMPT = `You are an expert heritage conservation AI advisor and multidisciplinary reasoning system.

## Safety Rules (MANDATORY)
- Never state that AI has legally certified a heritage structure as safe or unsafe.
- Never claim a crack is structurally dangerous solely from an image description.
- Always include: "AI-assisted preliminary assessment."
- Recommend professional heritage conservation inspection when risk is HIGH or CRITICAL.
- Never make structural engineering certifications from visual evidence alone.
- If information is outside the provided heritage knowledge, state: "This information is outside the application's verified knowledge scope."
- Distinguish: observed evidence vs inferred risk vs uncertainty vs recommended human verification.

## Output Format
Return ONLY valid JSON. No markdown. No explanation outside the JSON.`

const STORY_SYSTEM_PROMPT = `You are a passionate heritage storyteller with deep knowledge of Indian architectural history and cultural heritage.

## Rules
- Only use facts from the verified knowledge provided.
- Never invent rulers, dates, or events not in the knowledge base.
- If asked about topics outside the verified knowledge, say: "This information is outside the application's verified knowledge scope."
- Write in a vivid, engaging, educational style appropriate to the requested interest.
- Length: 300-450 words.`

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    granite: IBM_API_KEY ? 'configured' : 'not configured (demo mode)',
    timestamp: new Date().toISOString(),
  })
})

// ─── POST /api/granite/assessment ─────────────────────────────────────────────

app.post('/api/granite/assessment', async (req, res) => {
  if (!IBM_API_KEY || !WATSONX_PROJECT_ID) {
    return res.status(503).json({ error: 'IBM credentials not configured', demoMode: true })
  }

  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'prompt required' })

  try {
    const text = await callGranite(prompt, ASSESSMENT_SYSTEM_PROMPT, 1400)
    res.json({ text, model: GRANITE_MODEL })
  } catch (err) {
    console.error('[assessment] Granite error:', err.message)
    res.status(502).json({ error: err.message })
  }
})

// ─── POST /api/granite/story ──────────────────────────────────────────────────

app.post('/api/granite/story', async (req, res) => {
  if (!IBM_API_KEY || !WATSONX_PROJECT_ID) {
    return res.status(503).json({ error: 'IBM credentials not configured', demoMode: true })
  }

  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'prompt required' })

  try {
    const text = await callGranite(prompt, STORY_SYSTEM_PROMPT, 700)
    res.json({ text, model: GRANITE_MODEL })
  } catch (err) {
    console.error('[story] Granite error:', err.message)
    res.status(502).json({ error: err.message })
  }
})

// ─── POST /api/granite/encroachment ──────────────────────────────────────────

app.post('/api/granite/encroachment', async (req, res) => {
  if (!IBM_API_KEY || !WATSONX_PROJECT_ID) {
    return res.status(503).json({ error: 'IBM credentials not configured', demoMode: true })
  }

  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'prompt required' })

  try {
    const text = await callGranite(prompt, ASSESSMENT_SYSTEM_PROMPT, 800)
    res.json({ text, model: GRANITE_MODEL })
  } catch (err) {
    console.error('[encroachment] Granite error:', err.message)
    res.status(502).json({ error: err.message })
  }
})

// ─── POST /api/granite/report ─────────────────────────────────────────────────

app.post('/api/granite/report', async (req, res) => {
  if (!IBM_API_KEY || !WATSONX_PROJECT_ID) {
    return res.status(503).json({ error: 'IBM credentials not configured', demoMode: true })
  }

  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'prompt required' })

  try {
    const text = await callGranite(prompt, ASSESSMENT_SYSTEM_PROMPT, 1600)
    res.json({ text, model: GRANITE_MODEL })
  } catch (err) {
    console.error('[report] Granite error:', err.message)
    res.status(502).json({ error: err.message })
  }
})

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`DHAROHAR AI proxy server running on port ${PORT}`)
  console.log(`IBM Granite: ${IBM_API_KEY ? 'CONFIGURED' : 'NOT CONFIGURED (demo mode active)'}`)
})
