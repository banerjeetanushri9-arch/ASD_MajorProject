// src/api.js — Single source of truth for all API calls.
// All requests go to /api (proxied to localhost:3000 by vite.config.js).

const BASE = '/api'

// Helper: wraps fetch and returns parsed JSON (throws on error)
async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// GET /api/house-types → [{ id, label, areaSqFt }, ...]
export const getHouseTypes = () => request('/house-types')

// GET /api/materials → { walls: [...], roofs: [...] }
export const getMaterials = () => request('/materials')

// GET /api/rates?state=... → [{ id, state, baseRate }]
export const getRates = (state = '') =>
  request(`/rates${state ? `?state=${encodeURIComponent(state)}` : ''}`)

// POST /api/rates  body: { state, baseRate }
export const createRate = (body) =>
  request('/rates', { method: 'POST', body: JSON.stringify(body) })

// PUT /api/rates/:id  body: { baseRate }
export const updateRate = (id, body) =>
  request(`/rates/${id}`, { method: 'PUT', body: JSON.stringify(body) })

// POST /api/estimate  body: { houseType, wall, roof, state }
export const postEstimate = (body) =>
  request('/estimate', { method: 'POST', body: JSON.stringify(body) })
