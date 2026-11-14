// src/components/Footer.jsx — Site footer with links and project attribution.
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-icon">🏠</span>
            <span className="footer__logo-text">Ghar<span>Drishya</span></span>
          </div>
          <p className="footer__tagline">
            Visualize your dream home before the first brick is laid. A digital initiative for rural housing beneficiaries under PMAY-G.
          </p>
          <div className="footer__badges">
            <span className="badge badge-saffron">🇮🇳 Ministry of Rural Development</span>
            <span className="badge badge-teal">PMAY-G Initiative</span>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <div className="footer__nav-col">
            <h4 className="footer__nav-title">Platform</h4>
            <Link to="/"             className="footer__nav-link">Home</Link>
            <Link to="/overview"     className="footer__nav-link">Project Overview</Link>
            <Link to="/how-it-works" className="footer__nav-link">How It Works</Link>
            <Link to="/materials"    className="footer__nav-link">Materials & Rates</Link>
          </div>
          <div className="footer__nav-col">
            <h4 className="footer__nav-title">3D Experience</h4>
            <span className="footer__nav-link footer__nav-link--soon">Unity 3D Viewer <span className="badge badge-earth">Coming Soon</span></span>
            <span className="footer__nav-link footer__nav-link--soon">AR Preview <span className="badge badge-earth">Coming Soon</span></span>
          </div>
          <div className="footer__nav-col">
            <h4 className="footer__nav-title">Admin</h4>
            <Link to="/admin"           className="footer__nav-link">Admin Login</Link>
            <Link to="/admin/dashboard" className="footer__nav-link">Rate Dashboard</Link>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {year} GharDrishya — Ministry of Rural Development, Govt. of India. All rights reserved.
          </p>
          <p className="footer__disclaimer">
            Cost estimates are indicative. Actual construction costs may vary based on local conditions.
          </p>
        </div>
      </div>
    </footer>
  )
}
