// src/pages/Overview.jsx — Project overview and benefits page.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Overview.css'

const BENEFITS = [
  {
    icon: '🔍',
    title: 'Full Transparency',
    desc: 'Every rupee of your PMAY-G grant is accounted for. See cost breakdowns by construction stage so there are no surprises.',
    color: 'var(--clr-teal-400)',
  },
  {
    icon: '📅',
    title: 'Better Planning',
    desc: 'Knowing costs in advance helps you schedule work, arrange labour, and procure materials on time — avoiding delays.',
    color: 'var(--clr-saffron-400)',
  },
  {
    icon: '💰',
    title: 'Cost Clarity',
    desc: 'Compare wall and roof materials instantly. Choose what fits your budget without compromising on quality.',
    color: 'var(--clr-green-400)',
  },
  {
    icon: '⏱️',
    title: 'On-time Completion',
    desc: 'Stage-wise tracking ensures you finish construction within the grant disbursement timeline set by the government.',
    color: 'var(--clr-earth-200)',
  },
]

const MILESTONES = [
  { year: '2016', event: 'PMAY-G launched — target 2.95 crore houses by 2024' },
  { year: '2023', event: 'Digital tools mandated for beneficiary transparency' },
  { year: '2024', event: 'GharDrishya pilot launched across 3 states' },
  { year: '2025', event: '3D visualizer and AR feature integrated' },
]

export default function Overview() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      e => e.forEach(el => el.isIntersecting && el.target.classList.add('visible')),
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="overview">
      {/* Page hero */}
      <section className="page-hero overview__hero" aria-label="Page header">
        <div className="container">
          <p className="section-label anim-fadeInUp">About the Project</p>
          <h1 className="anim-fadeInUp anim-delay-1">
            Empowering Rural Beneficiaries<br />
            with <span className="txt-gradient">Digital Clarity</span>
          </h1>
          <p className="overview__hero-sub anim-fadeInUp anim-delay-2">
            GharDrishya is a digital initiative under PMAY-G that gives every rural household
            the power to visualize, plan, and track their house construction before spending a single rupee.
          </p>
        </div>
      </section>

      {/* Mission statement */}
      <section className="section overview__mission" aria-label="Mission">
        <div className="container">
          <div className="overview__mission-card glass-card reveal">
            <div className="overview__mission-icon">🎯</div>
            <div>
              <h2>Our Mission</h2>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                To eliminate information asymmetry in rural housing construction by providing beneficiaries
                with real-time 3D visualizations, transparent cost estimates, and stage-wise payment guidance —
                all in one easy-to-use platform accessible on any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section overview__benefits" aria-label="Benefits">
        <div className="container">
          <div className="overview__benefits-header reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Why It Matters</p>
            <h2 className="section-title">Benefits for Every Beneficiary</h2>
          </div>

          <div className="grid-2">
            {BENEFITS.map(({ icon, title, desc, color }, i) => (
              <div
                key={title}
                className="overview__benefit-card glass-card reveal"
                style={{ '--card-accent': color }}
              >
                <div className="overview__benefit-icon" style={{ background: `${color}18`, borderColor: `${color}30` }}>
                  <span>{icon}</span>
                </div>
                <div>
                  <h3 className="overview__benefit-title">{title}</h3>
                  <p style={{ fontSize: '0.95rem', marginTop: 'var(--space-sm)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats ribbon */}
      <section className="overview__stats-ribbon" aria-label="Project statistics">
        <div className="container">
          <div className="overview__stats-grid reveal">
            {[
              { n: '2.95 Cr', l: 'Target Houses (PMAY-G)' },
              { n: '3',       l: 'States in Pilot' },
              { n: '₹1,100+', l: 'Base Rate per sq ft' },
              { n: '4',       l: 'Construction Stages' },
            ].map(({ n, l }) => (
              <div key={l} className="overview__stat">
                <span className="overview__stat-num">{n}</span>
                <span className="overview__stat-lbl">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section overview__timeline-section" aria-label="Project timeline">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Journey</p>
            <h2 className="section-title">Project Milestones</h2>
          </div>
          <div className="overview__timeline">
            {MILESTONES.map(({ year, event }, i) => (
              <div key={year} className="overview__timeline-item reveal">
                <div className="overview__timeline-dot">
                  <span>{year}</span>
                </div>
                <div className="overview__timeline-card glass-card">
                  <p>{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" aria-label="Next steps">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2>Ready to Visualize Your Home?</h2>
            <p className="section-subtitle" style={{ margin: 'var(--space-lg) auto var(--space-xl)' }}>
              Explore how the system works and start building your estimate today.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/how-it-works" className="btn btn-primary">See How It Works</Link>
              <Link to="/materials"    className="btn btn-secondary">View Materials & Rates</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
