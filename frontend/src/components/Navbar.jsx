// src/components/Navbar.jsx — Sticky top navigation bar.
// Highlights active route, collapses to hamburger on mobile.
import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/overview',     label: 'Overview' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/materials',    label: 'Materials & Rates' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navigate = useNavigate()
  const isAdmin = localStorage.getItem('ghardrishya_admin') === 'true'

  // Add background when user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change (mobile)
  const closeMenu = () => setMenuOpen(false)

  function handleLogout() {
    localStorage.removeItem('ghardrishya_admin')
    navigate('/admin')
    closeMenu()
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={closeMenu} aria-label="GharDrishya Home">
          <span className="navbar__logo-icon" aria-hidden="true">🏠</span>
          <span className="navbar__logo-text">
            Ghar<span className="navbar__logo-accent">Drishya</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="navbar__actions">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="btn btn-sm btn-ghost">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-sm btn-secondary">Logout</button>
            </>
          ) : (
            <Link to="/admin" className="btn btn-sm btn-secondary">Admin Login</Link>
          )}
          <Link to="/" className="btn btn-sm btn-primary navbar__cta">Start Building</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          id="navbar-menu-toggle"
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
          <div className="navbar__drawer-actions">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="btn btn-teal" onClick={closeMenu}>Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
              </>
            ) : (
              <Link to="/admin" className="btn btn-secondary" onClick={closeMenu}>Admin Login</Link>
            )}
            <Link to="/" className="btn btn-primary" onClick={closeMenu}>🏠 Start Building</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
