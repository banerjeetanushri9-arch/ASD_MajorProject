// src/pages/HowItWorks.jsx — Step-by-step explainer page.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './HowItWorks.css'

const STEPS = [
  {
    num: '01',
    icon: '🏠',
    title: 'Select House Type',
    desc: 'Choose between a 1 BHK (270 sq ft) or 2 BHK (450 sq ft) house based on your family size and PMAY-G eligibility.',
    details: ['1 BHK — 270 sq ft', '2 BHK — 450 sq ft', 'Eligibility as per PMAY-G guidelines'],
    color: 'var(--clr-teal-400)',
  },
  {
    num: '02',
    icon: '🧱',
    title: 'Pick Your Materials',
    desc: 'Choose wall material (Brick, Flyash Brick, or Concrete Block) and roof type (RCC Slab or Tin Sheet). Each option has a cost multiplier.',
    details: ['Brick — standard (×1.0)', 'Flyash Brick — economical (×0.9)', 'Concrete Block — premium (×1.1)', 'RCC Roof (×1.0) or Tin Sheet (×0.7)'],
    color: 'var(--clr-saffron-400)',
  },
  {
    num: '03',
    icon: '📍',
    title: 'Choose Your State',
    desc: 'Base construction rates vary by state. The system uses official Ministry of Rural Development rates for Chhattisgarh, Madhya Pradesh, and Odisha.',
    details: ['Chhattisgarh — ₹1,200 / sq ft', 'Madhya Pradesh — ₹1,150 / sq ft', 'Odisha — ₹1,100 / sq ft'],
    color: 'var(--clr-green-400)',
  },
  {
    num: '04',
    icon: '📊',
    title: 'Get Your Estimate',
    desc: 'The system calculates your total cost and breaks it down into 4 construction stages, so you know exactly when to expect disbursements.',
    details: ['Foundation — 20% of total', 'Walls — 35% of total', 'Roof — 25% of total', 'Finishing — 20% of total'],
    color: 'var(--clr-earth-200)',
  },
]

const FORMULA_STEPS = [
  { label: 'Area × Base Rate', desc: 'e.g. 270 sq ft × ₹1,200 = ₹3,24,000' },
  { label: '× Wall Multiplier', desc: 'e.g. Flyash ×0.9 = ₹2,91,600' },
  { label: '× Roof Multiplier', desc: 'e.g. RCC ×1.0 = ₹2,91,600' },
  { label: '= Total Cost', desc: 'Rounded to nearest rupee' },
]

export default function HowItWorks() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      e => e.forEach(el => el.isIntersecting && el.target.classList.add('visible')),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="hiw">
      {/* Page hero */}
      <section className="page-hero hiw__hero" aria-label="Page header">
        <div className="container">
          <p className="section-label anim-fadeInUp">Process Walkthrough</p>
          <h1 className="anim-fadeInUp anim-delay-1">
            From Selection to<br />
            <span className="txt-gradient-teal">Instant Estimate</span>
          </h1>
          <p className="hiw__hero-sub anim-fadeInUp anim-delay-2">
            Four simple steps. Fully transparent. Completely free for PMAY-G beneficiaries.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section hiw__steps-section" aria-label="Process steps">
        <div className="container">
          {STEPS.map(({ num, icon, title, desc, details, color }, i) => (
            <div
              key={num}
              className={`hiw__step reveal ${i % 2 === 1 ? 'hiw__step--reverse' : ''}`}
              style={{ '--step-color': color }}
            >
              {/* Step illustration */}
              <div className="hiw__step-visual">
                <div className="hiw__step-circle" style={{ background: `${color}18`, borderColor: `${color}30` }}>
                  <span className="hiw__step-emoji">{icon}</span>
                  <span className="hiw__step-num">{num}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hiw__step-connector" aria-hidden="true" />
                )}
              </div>

              {/* Step content */}
              <div className="hiw__step-content glass-card">
                <div className="hiw__step-header">
                  <span className="hiw__step-badge badge badge-teal" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                    Step {num}
                  </span>
                  <h2 className="hiw__step-title">{title}</h2>
                </div>
                <p className="hiw__step-desc">{desc}</p>
                <ul className="hiw__step-details">
                  {details.map(d => (
                    <li key={d} className="hiw__step-detail-item">
                      <span className="hiw__step-check" style={{ color }}>✓</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formula explainer */}
      <section className="section hiw__formula-section" aria-label="Cost formula">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">The Math</p>
            <h2 className="section-title">How the Cost is Calculated</h2>
            <p className="section-subtitle" style={{ margin: 'var(--space-md) auto 0' }}>
              A simple, transparent formula — no hidden charges, no ambiguity.
            </p>
          </div>

          <div className="hiw__formula reveal">
            <div className="hiw__formula-box glass-card">
              <div className="hiw__formula-title">Total Cost Formula</div>
              <div className="hiw__formula-eq">
                Area (sq ft) × Base Rate (₹/sq ft) × Wall Multiplier × Roof Multiplier
              </div>
              <div className="hiw__formula-example">
                <span className="hiw__formula-label">Example: 1BHK + Flyash + RCC in Chhattisgarh</span>
                <span className="hiw__formula-result">270 × 1,200 × 0.9 × 1.0 = <strong>₹2,91,600</strong></span>
              </div>
            </div>

            <div className="hiw__formula-steps">
              {FORMULA_STEPS.map(({ label, desc }) => (
                <div key={label} className="hiw__formula-step reveal">
                  <div className="hiw__formula-step-label">{label}</div>
                  <div className="hiw__formula-step-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stage breakdown */}
      <section className="section hiw__stages-section" aria-label="Stage breakdown">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Construction Stages</p>
            <h2 className="section-title">Stage-wise Cost Distribution</h2>
          </div>

          <div className="hiw__stages reveal">
            {[
              { name: 'Foundation', pct: 20, color: 'var(--clr-teal-400)', icon: '⛏️' },
              { name: 'Walls',      pct: 35, color: 'var(--clr-saffron-400)', icon: '🧱' },
              { name: 'Roof',       pct: 25, color: 'var(--clr-green-400)', icon: '🏠' },
              { name: 'Finishing',  pct: 20, color: 'var(--clr-earth-200)', icon: '🎨' },
            ].map(({ name, pct, color, icon }) => (
              <div key={name} className="hiw__stage glass-card">
                <span className="hiw__stage-icon">{icon}</span>
                <div className="hiw__stage-info">
                  <span className="hiw__stage-name">{name}</span>
                  <div className="hiw__stage-bar">
                    <div
                      className="hiw__stage-bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
                <span className="hiw__stage-pct" style={{ color }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" aria-label="Call to action">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2>See it in action</h2>
            <p className="section-subtitle" style={{ margin: 'var(--space-lg) auto var(--space-xl)' }}>
              Check live construction rates and material options, or launch the 3D viewer.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/materials" className="btn btn-primary">View Materials & Rates</Link>
              <button
                className="btn btn-secondary"
                onClick={() => alert('🔧 Unity 3D integration coming soon!')}
              >
                🎮 Launch 3D Viewer
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
