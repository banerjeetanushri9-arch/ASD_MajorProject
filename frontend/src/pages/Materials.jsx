
 // src/pages/Materials.jsx — Live materials and state-wise rates page.
 // Fetches data from GET /api/materials and GET /api/rates.

import { useState, useEffect, useCallback } from 'react'
import { getMaterials, getRates } from '../api'
import './Materials.css'

// Material icons
const MATERIAL_ICONS = {
  brick: '🧱',
  flyash: '🏗️',
  block: '⬛',
  rcc: '🏢',
  tin: '🏠',
}

// Skeleton loader
function SkeletonCards({ count = 3 }) {
  return (
    <div className="materials__grid">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: '140px', borderRadius: '1rem' }}
        />
      ))}
    </div>
  )
}

// Individual material card
function MaterialCard({ id, label, multiplier, onClick }) {
  const pct = ((multiplier - 1) * 100).toFixed(0)

  const pctLabel =
    pct > 0 ? `+${pct}%` :
    pct < 0 ? `${pct}%` :
    'Base'

  const pctColor =
    pct > 0 ? 'var(--clr-saffron-400)' :
    pct < 0 ? 'var(--clr-green-400)' :
    'var(--clr-teal-300)'

  return (
    <div
      className="mat-card glass-card"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${label}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="mat-card__icon">
        <span>{MATERIAL_ICONS[id] || '📦'}</span>
      </div>

      <div className="mat-card__info">
        <h3 className="mat-card__name">{label}</h3>
        <p className="mat-card__id">
          ID: <code>{id}</code>
        </p>
      </div>

      <div className="mat-card__multiplier">
        <span className="mat-card__mult-val">
          ×{multiplier.toFixed(1)}
        </span>

        <span
          className="mat-card__pct-badge badge"
          style={{
            color: pctColor,
            background: `${pctColor}18`,
            border: `1px solid ${pctColor}30`,
          }}
        >
          {pctLabel} cost
        </span>
      </div>
    </div>
  )
}

// Individual rate row
function RateRow({ name, baseRate }) {
  const flags = {
    Chhattisgarh: '🏔️',
    'Madhya Pradesh': '🌾',
    Odisha: '🌊',
  }

  const examples = {
    '1BHK': Math.round(270 * baseRate),
    '2BHK': Math.round(450 * baseRate),
  }

  return (
    <div className="rate-row glass-card">
      <div className="rate-row__state">
        <span className="rate-row__flag">
          {flags[name] || '📍'}
        </span>
        <span className="rate-row__state-name">{name}</span>
      </div>

      <div className="rate-row__rate">
        <span className="rate-row__rate-value">
          ₹{baseRate.toLocaleString('en-IN')}
        </span>
        <span className="rate-row__rate-unit">/ sq ft</span>
      </div>

      <div className="rate-row__examples">
        <span className="rate-row__example-label">1 BHK min:</span>
        <span className="rate-row__example-val">
          ₹{examples['1BHK'].toLocaleString('en-IN')}
        </span>

        <span className="rate-row__example-label">2 BHK min:</span>
        <span className="rate-row__example-val">
          ₹{examples['2BHK'].toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  )
}

// Material details popup
function MaterialModal({ material, onClose }) {
  if (!material) return null

  const pct = ((material.multiplier - 1) * 100).toFixed(0)

  const costImpact =
    pct > 0 ? `+${pct}%` :
    pct < 0 ? `${pct}%` :
    'Base Cost'

  return (
    <div
      className="material-modal-overlay"
      onClick={onClose}
    >
      <div
        className="material-modal glass-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="material-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="material-modal__close"
          onClick={onClose}
          aria-label="Close material details"
        >
          ×
        </button>

        <div className="material-modal__icon">
          {MATERIAL_ICONS[material.id] || '📦'}
        </div>

        <p className="section-label">
          {material.type === 'wall' ? 'Wall Material' : 'Roof Material'}
        </p>

        <h2 id="material-modal-title">
          {material.label}
        </h2>

        <p className="material-modal__id">
          Material ID: {material.id}
        </p>

        <div className="material-modal__details">
          <div className="material-modal__detail">
            <span>Cost Multiplier</span>
            <strong>×{material.multiplier.toFixed(1)}</strong>
          </div>

          <div className="material-modal__detail">
            <span>Cost Impact</span>
            <strong>{costImpact}</strong>
          </div>
        </div>

        <p className="material-modal__description">
          This multiplier is applied to the base construction cost
          when calculating your house estimate.
        </p>

        <button
          type="button"
          className="btn btn-teal material-modal__done"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function Materials() {
  const [materials, setMaterials] = useState(null)
  const [rates, setRates] = useState([])
  const [filterState, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  // Fetch materials and rates
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [mats, rts] = await Promise.all([
        getMaterials(),
        getRates(),
      ])

      setMaterials({
  walls: Array.isArray(mats)
    ? mats.filter(material => material.category === 'wall')
    : mats?.walls ?? [],
  roofs: Array.isArray(mats)
    ? mats.filter(material => material.category === 'roof')
    : mats?.roofs ?? [],
})
      setRates(rts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(el => {
          if (el.isIntersecting) {
            el.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    els.forEach(el => obs.observe(el))

    return () => obs.disconnect()
  }, [materials, rates])

  // Close popup with Escape key
  useEffect(() => {
    if (!selectedMaterial) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMaterial(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedMaterial])

  // Filter rates
  const filteredRates = filterState
    ? rates.filter(r => r.name === filterState)
    : rates

  const stateOptions = [...new Set(rates.map(r => r.name))]

  return (
    <div className="materials">
      {/* Page hero */}
      <section
        className="page-hero materials__hero"
        aria-label="Page header"
      >
        <div className="container">
          <p className="section-label anim-fadeInUp">Live Data</p>

          <h1 className="anim-fadeInUp anim-delay-1">
            Construction Materials<br />
            &amp; <span className="txt-gradient-saffron">State-wise Rates</span>
          </h1>

          <p className="materials__hero-sub anim-fadeInUp anim-delay-2">
            All data fetched live from the GharDrishya backend.
            Rates reflect official Ministry of Rural Development guidelines.
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

              <p>
                Make sure the Express API server is running on{' '}
                <code>localhost:3001</code>.
              </p>

              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Error: {error}
              </p>
            </div>

            <button
              className="btn btn-sm btn-teal"
              onClick={fetchData}
            >
              Retry
            </button>
          </div>
        )}

        {/* Wall Materials */}
        <section
          className="section materials__section"
          aria-label="Wall materials"
        >
          <div className="materials__section-header reveal">
            <div>
              <p className="section-label">Wall Options</p>
              <h2 className="section-title">Wall Materials</h2>

              <p className="section-subtitle">
                Choose your wall material. The multiplier is applied
                to your base cost calculation.
              </p>
            </div>

            <span className="badge badge-teal">
              {materials?.walls?.length ?? 0} options
            </span>
          </div>

          {loading ? (
            <SkeletonCards count={3} />
          ) : materials?.walls?.length > 0 ? (
            <div className="materials__grid">
              {(materials?.walls ?? []).map(w => (
                <MaterialCard
                  key={w.id}
                  {...w}
                  type="wall"
                  onClick={() => setSelectedMaterial({
                    ...w,
                    type: 'wall',
                  })}
                />
              ))}
            </div>
          ) : (
            !error && (
              <p className="materials__empty">
                No wall materials found.
              </p>
            )
          )}
        </section>

        <div className="divider" />

        {/* Roof Materials */}
        <section
          className="section materials__section"
          aria-label="Roof materials"
        >
          <div className="materials__section-header reveal">
            <div>
              <p className="section-label">Roof Options</p>
              <h2 className="section-title">Roof Materials</h2>

              <p className="section-subtitle">
                Choose between an RCC slab (durable) or tin sheet
                (economical) roof.
              </p>
            </div>

            <span className="badge badge-saffron">
              {materials?.roofs?.length ?? 0} options
            </span>
          </div>

          {loading ? (
            <SkeletonCards count={2} />
          ) : materials?.roofs?.length > 0 ? (
            <div className="materials__grid">
              {(materials?.roofs ?? []).map(r => (
                <MaterialCard
                  key={r.id}
                  {...r}
                  type="roof"
                  onClick={() => setSelectedMaterial({
                    ...r,
                    type: 'roof',
                  })}
                />
              ))}
            </div>
          ) : (
            !error && (
              <p className="materials__empty">
                No roof materials found.
              </p>
            )
          )}
        </section>

        <div className="divider" />

        {/* State-wise Rates */}
        <section
          className="section materials__section"
          aria-label="State-wise rates"
        >
          <div className="materials__section-header reveal">
            <div>
              <p className="section-label">Official Rates</p>
              <h2 className="section-title">State-wise Base Rates</h2>

              <p className="section-subtitle">
                Base construction cost per square foot as per MoRD
                guidelines. Used in all estimates.
              </p>
            </div>

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
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>

          {loading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: '90px', borderRadius: '1rem' }}
                />
              ))}
            </div>
          ) : filteredRates.length > 0 ? (
            <div className="rates__list">
              {filteredRates.map(r => (
                <RateRow key={r.id} {...r} />
              ))}
            </div>
          ) : (
            !error && (
              <p className="materials__empty">
                {filterState
                  ? `No rates found for ${filterState}.`
                  : 'No rates available.'}
              </p>
            )
          )}
        </section>

        {/* Disclaimer */}
        <div className="materials__disclaimer reveal">
          <span className="materials__disclaimer-icon">ℹ️</span>

          <p>
            <strong>Note:</strong> These are base rates per sq ft.
            Final estimates depend on your selected house type,
            wall material, and roof type. Actual construction costs
            may vary. Consult your local gram panchayat for the latest updates.
          </p>
        </div>
      </div>

      {/* Material details popup */}
      <MaterialModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />
    </div>
  )
}
