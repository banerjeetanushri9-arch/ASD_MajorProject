// src/pages/Home.jsx — Landing page with hero, stats, and feature highlights.
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

// Animated particle canvas background
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function createParticles() {
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(46, 163, 204, ${p.alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
}

// Stats data
const STATS = [
  { value: '3+', label: 'States Covered' },
  { value: '2',  label: 'House Types' },
  { value: '5',  label: 'Material Options' },
  { value: '4',  label: 'Build Stages' },
]

// Feature highlights shown below hero
const FEATURES = [
  {
    icon: '🧱',
    title: 'Compare Materials',
    desc: 'Explore brick, flyash, and concrete block options with real cost impact',
    color: 'var(--clr-saffron-500)',
    link: '/materials',
  },
  {
    icon: '📐',
    title: 'Choose House Size',
    desc: '1 BHK (270 sq ft) or 2 BHK (450 sq ft) — see exact area and budget',
    color: 'var(--clr-teal-400)',
    link: '/how-it-works',
  },
  {
    icon: '📊',
    title: 'Stage-wise Breakdown',
    desc: 'Know exactly how much to spend on foundation, walls, roof, and finishing',
    color: 'var(--clr-green-400)',
    link: '/how-it-works',
  },
  {
    icon: '🏛️',
    title: 'Government Backed',
    desc: 'Rates sourced from Ministry of Rural Development state-wise data',
    color: 'var(--clr-earth-200)',
    link: '/overview',
  },
]

export default function Home() {
  // Scroll-reveal effect
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero" aria-label="Hero section">
        <ParticleCanvas />

        {/* Decorative orbs */}
        <div className="hero__orb hero__orb--1" aria-hidden="true" />
        <div className="hero__orb hero__orb--2" aria-hidden="true" />
        <div className="hero__orb hero__orb--3" aria-hidden="true" />

        <div className="container hero__content">
          <div className="hero__badge anim-fadeInUp">
            <span>🏛️</span>
            Ministry of Rural Development — PMAY-G Digital Initiative
          </div>

          <h1 className="hero__title anim-fadeInUp anim-delay-1">
            See Your Home
            <span className="hero__title-gradient"> Before It's Built</span>
          </h1>

          <p className="hero__subtitle anim-fadeInUp anim-delay-2">
            GharDrishya empowers rural beneficiaries to visualize their house in 3D,
            compare materials, and get instant transparent cost estimates — stage by stage.
          </p>

          {/* CTA buttons */}
          <div className="hero__ctas anim-fadeInUp anim-delay-3">
            <Link to="/how-it-works" id="hero-start-building-btn" className="btn btn-primary hero__btn-primary">
              🏠 Start Building
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 1L15 8L8 15M15 8H1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </Link>

            <button
              id="hero-3d-viewer-btn"
              className="btn btn-secondary hero__btn-3d"
              title="Unity 3D Viewer — Integration coming soon"
              onClick={() => alert('🔧 Unity 3D integration will be available once the Unity build is ready. Stay tuned!')}
            >
              <span className="hero__btn-icon">🎮</span>
              Launch 3D Viewer
              <span className="badge badge-earth" style={{fontSize:'0.65rem', padding:'0.15rem 0.5rem'}}>Soon</span>
            </button>

            <button
              id="hero-ar-btn"
              className="btn btn-secondary hero__btn-ar"
              title="AR Experience — Integration coming soon"
              onClick={() => alert('📱 AR experience will be available once the AR build is ready. Stay tuned!')}
            >
              <span>📱</span>
              AR Preview
              <span className="badge badge-earth" style={{fontSize:'0.65rem', padding:'0.15rem 0.5rem'}}>Soon</span>
            </button>
          </div>

          {/* Stats strip */}
          <div className="hero__stats anim-fadeInUp anim-delay-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="hero__stat">
                <span className="hero__stat-value">{value}</span>
                <span className="hero__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-indicator" aria-label="Scroll down">
          <span />
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className="home__features section" aria-label="Key features">
        <div className="container">
          <div className="home__features-header reveal">
            <p className="section-label">Why GharDrishya?</p>
            <h2 className="section-title">Everything you need to plan your home</h2>
            <p className="section-subtitle">
              From choosing materials to understanding construction stages, we give you complete clarity before you spend a single rupee.
            </p>
          </div>

          <div className="home__features-grid">
            {FEATURES.map(({ icon, title, desc, color, link }, i) => (
              <Link
                key={title}
                to={link}
                className={`home__feature-card glass-card reveal`}
                style={{ '--card-accent': color, animationDelay: `${i * 0.1}s` }}
              >
                <div className="home__feature-icon" style={{ background: `${color}18`, borderColor: `${color}30` }}>
                  <span style={{ fontSize: '1.75rem' }}>{icon}</span>
                </div>
                <h3 className="home__feature-title">{title}</h3>
                <p className="home__feature-desc">{desc}</p>
                <span className="home__feature-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scheme Banner ── */}
      <section className="home__scheme section" aria-label="Scheme information">
        <div className="container">
          <div className="home__scheme-card glass-card reveal">
            <div className="home__scheme-content">
              <div className="home__scheme-icon">🏛️</div>
              <div>
                <p className="section-label" style={{ marginBottom: '0.4rem' }}>Pradhan Mantri Awaas Yojana — Gramin</p>
                <h2 className="home__scheme-title">Housing for All by 2024</h2>
                <p className="home__scheme-desc">
                  PMAY-G is the flagship rural housing scheme of the Government of India, aiming to provide pucca houses to all rural households.
                  GharDrishya brings digital transparency to every beneficiary so they can plan construction confidently and avoid cost overruns.
                </p>
              </div>
            </div>
            <div className="home__scheme-actions">
              <Link to="/overview" className="btn btn-teal">Learn More</Link>
              <Link to="/materials" className="btn btn-ghost">View Rates</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3D Experience Teaser ── */}
      <section className="home__3d section" aria-label="3D experience teaser">
        <div className="container">
          <div className="home__3d-inner">
            <div className="home__3d-text reveal">
              <p className="section-label">3D & AR Experience</p>
              <h2 className="section-title">Walk through your house before construction</h2>
              <p className="section-subtitle">
                Our Unity-powered 3D viewer lets you see a detailed miniature of your house.
                Change wall materials and roof types and watch the structure update in real time.
              </p>
              <div className="home__3d-actions" style={{ marginTop: 'var(--space-xl)' }}>
                <button
                  id="home-3d-launch-btn"
                  className="btn btn-primary"
                  onClick={() => alert('🔧 Unity 3D integration coming soon! Integration details will be provided when the Unity build is ready.')}
                >
                  🎮 Launch 3D Viewer
                </button>
                <button
                  id="home-ar-launch-btn"
                  className="btn btn-secondary"
                  onClick={() => alert('📱 AR Preview coming soon! Scan your plot with your phone camera to place your virtual house.')}
                >
                  📱 Try AR Preview
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--txt-muted)', marginTop: 'var(--space-md)' }}>
                * Unity and AR builds are under development. Integration details will be connected once ready.
              </p>
            </div>
            <div className="home__3d-visual reveal" aria-hidden="true">
              <div className="home__3d-mockup">
                <div className="home__3d-mockup-screen">
                  <div className="home__3d-house">
                    {/* CSS 3D house illustration */}
                    <div className="css-house">
                      <div className="css-house__roof" />
                      <div className="css-house__body">
                        <div className="css-house__door" />
                        <div className="css-house__window css-house__window--l" />
                        <div className="css-house__window css-house__window--r" />
                      </div>
                    </div>
                    <div className="home__3d-label">3D Viewer — Coming Soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
