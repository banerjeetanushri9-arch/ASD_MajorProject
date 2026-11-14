// src/pages/Materials.jsx — Live materials and state-wise rates page.
// Fetches data from GET /api/materials and GET /api/rates.
import { useState, useEffect, useCallback } from 'react'
import { getMaterials, getRates } from '../api'
import './Materials.css'

// Skeleton loader for a row of cards
function SkeletonCards({ count = 3 }) {
  return (
    <div className="materials__grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '1rem' }} />
      ))}
    </div>
  )
}

// Individual material card component
function MaterialCard({ id, label, multiplier, type }) {
  const pct = ((multiplier - 1) * 100).toFixed(0)
  const pctLabel = pct > 0 ? `+${pct}%` : pct < 0 ? `${pct}%` : 'Base'
  const pctColor = pct > 0
    ? 'var(--clr-saffron-400)'
    : pct < 0
    ? 'var(--clr-green-400)'
    : 'var(--clr-teal-300)'

  const ICONS = {
    // Wall icons
    brick: '🧱', flyash: '🏗️', block: '⬛',
    // Roof icons
    rcc: '🏢', tin: '🏠',
  }

  return (
    <div className="mat-card glass-card" aria-label={`${label} material`}>
      <div className="mat-card__icon">
        <span>{ICONS[id] || '📦'}</span>
      </div>
      <div className="mat-card__info">
        <h3 className="mat-card__name">{label}</h3>
        <p className="mat-card__id">ID: <code>{id}</code></p>
      </div>
      <div className="mat-card__multiplier">
        <span className="mat-card__mult-val">×{multiplier.toFixed(1)}</span>
        <span className="mat-card__pct-badge badge" style={{ color: pctColor, background: `${pctColor}18`, border: `1px solid ${pctColor}30` }}>
          {pctLabel} cost
        </span>
      </div>
    </div>
  )
}

// Individual rate row
function RateRow({ state, baseRate }) {
  const flags = { 'Chhattisgarh': '🏔️', 'Madhya Pradesh': '🌾', 'Odisha': '🌊' }
  const examples = {
    '1BHK': Math.round(270 * baseRate),
    '2BHK': Math.round(450 * baseRate),
  }
  return (
    <div className="rate-row glass-card">
      <div className="rate-row__state">
        <span className="rate-row__flag">{flags[state] || '📍'}</span>
        <span className="rate-row__state-name">{state}</span>
      </div>
      <div className="rate-row__rate">
        <span className="rate-row__rate-value">₹{baseRate.toLocaleString('en-IN')}</span>
        <span className="rate-row__rate-unit">/ sq ft</span>
      </div>
      <div className="rate-row__examples">
        <span className="rate-row__example-label">1 BHK min:</span>
        <span className="rate-row__example-val">₹{examples['1BHK'].toLocaleString('en-IN')}</span>
        <span className="rate-row__example-label">2 BHK min:</span>
        <span className="rate-row__example-val">₹{examples['2BHK'].toLocaleString('en-IN')}</span>
      </div>
    </div>
  )
}

export default function Materials() {
  const [materials, setMaterials] = useState(null)
  const [rates, setRates]         = useState([])
  const [filterState, setFilter]  = useState('')
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  // Fetch materials and all rates in parallel on mount
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [mats, rts] = await Promise.all([getMaterials(), getRates()])
      setMaterials(mats)
      setRates(rts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      e => e.forEach(el => el.isIntersecting && el.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [materials, rates])

  // Filtered rates
  const filteredRates = filterState
    ? rates.filter(r => r.state === filterState)
    : rates

  const stateOptions = [...new Set(rates.map(r => r.state))]

  return (
    <div className="materials">
      {/* Page hero */}
      <section className="page-hero materials__hero" aria-label="Page header">
        <div className="container">
          <p className="section-label anim-fadeInUp">Live Data</p>
          <h1 className="anim-fadeInUp anim-delay-1">
            Construction Materials<br />
            &amp; <span className="txt-gradient-saffron">State-wise Rates</span>
          </h1>
          <p className="materials__hero-sub anim-fadeInUp anim-delay-2">
            All data fetched live from the GharDrishya backend. Rates reflect official Ministry of Rural Development guidelines.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Error state */}
        {error && (
          <div className="materials__error" role="alert">
            <span>⚠️</span>
            <div>
              <strong>Could not load data from backend</strong>
              <p>Make sure the Express API server is running on <code>localhost:3000</code>.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Error: {error}</p>
            </div>
            <button className="btn btn-sm btn-teal" onClick={fetchData}>Retry</button>
          </div>
        )}

        {/* ── Wall Materials ── */}
        <section className="section materials__section" aria-label="Wall materials">
          <div className="materials__section-header reveal">
            <div>
              <p className="section-label">Wall Options</p>
              <h2 className="section-title">Wall Materials</h2>
              <p className="section-subtitle">
                Choose your wall material. The multiplier is applied to your base cost calculation.
              </p>
            </div>
            <span className="badge badge-teal">
              {materials ? `${materials.walls.length} options` : '—'}
            </span>
          </div>

          {loading
            ? <SkeletonCards count={3} />
            : materials?.walls.length > 0
              ? (
                <div className="materials__grid">
                  {materials.walls.map(w => (
                    <MaterialCard key={w.id} {...w} type="wall" />
                  ))}
                </div>
              )
              : !error && <p className="materials__empty">No wall materials found.</p>
          }
        </section>

        <div className="divider" />

        {/* ── Roof Materials ── */}
        <section className="section materials__section" aria-label="Roof materials">
          <div className="materials__section-header reveal">
            <div>
              <p className="section-label">Roof Options</p>
              <h2 className="section-title">Roof Materials</h2>
              <p className="section-subtitle">
                Choose between an RCC slab (durable) or tin sheet (economical) roof.
              </p>
            </div>
            <span className="badge badge-saffron">
              {materials ? `${materials.roofs.length} options` : '—'}
            </span>
          </div>

          {loading
            ? <SkeletonCards count={2} />
            : materials?.roofs.length > 0
              ? (
                <div className="materials__grid">
                  {materials.roofs.map(r => (
                    <MaterialCard key={r.id} {...r} type="roof" />
                  ))}
                </div>
              )
              : !error && <p className="materials__empty">No roof materials found.</p>
          }
        </section>

        <div className="divider" />

        {/* ── State-wise Rates ── */}
        <section className="section materials__section" aria-label="State-wise rates">
          <div className="materials__section-header reveal">
            <div>
              <p className="section-label">Official Rates</p>
              <h2 className="section-title">State-wise Base Rates</h2>
              <p className="section-subtitle">
                Base construction cost per square foot as per MoRD guidelines. Used in all estimates.
              </p>
            </div>

            {/* Filter by state */}
            {stateOptions.length > 1 && (
              <select
                id="rates-state-filter"
                className="form-select materials__filter"
                value={filterState}
                onChange={e => setFilter(e.target.value)}
                aria-label="Filter by state"
              >
                <option value="">All States</option>
                {stateOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>

          {loading
            ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1,2,3].map(i => (
                  <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '1rem' }} />
                ))}
              </div>
            )
            : filteredRates.length > 0
              ? (
                <div className="rates__list">
                  {filteredRates.map(r => (
                    <RateRow key={r.id} {...r} />
                  ))}
                </div>
              )
              : !error && (
                <p className="materials__empty">
                  {filterState ? `No rates found for ${filterState}.` : 'No rates available.'}
                </p>
              )
          }
        </section>

        {/* Disclaimer */}
        <div className="materials__disclaimer reveal">
          <span className="materials__disclaimer-icon">ℹ️</span>
          <p>
            <strong>Note:</strong> These are base rates per sq ft. Final estimates depend on your selected house type, wall material, and roof type.
            Actual construction costs may vary. Consult your local gram panchayat for the latest updates.
          </p>
        </div>
      </div>
    </div>
  )
}
