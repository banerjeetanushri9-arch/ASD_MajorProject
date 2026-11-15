
import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Home' },
  { to: '/overview', label: 'Overview' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/materials', label: 'Materials & Rates' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin =
    localStorage.getItem('ghardrishya_admin_token') &&
    localStorage.getItem('ghardrishya_admin') === 'true'

  const isUser = !!localStorage.getItem('ghardrishya_user_token')

  const homePath = isAdmin ? '/admin/dashboard' : isUser ? '/dashboard' : '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const closeMenu = () => setMenuOpen(false)

  function handleLogout() {
    if (isAdmin) {
      localStorage.removeItem('ghardrishya_admin')
      localStorage.removeItem('ghardrishya_admin_token')
      navigate('/admin')
    } else {
      localStorage.removeItem('ghardrishya_user_token')
      localStorage.removeItem('ghardrishya_user')
      navigate('/')
    }

    closeMenu()
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">
        <Link
          to={homePath}
          className="navbar__logo"
          onClick={closeMenu}
          aria-label="GharDrishya Home"
        >
          <span className="navbar__logo-icon" aria-hidden="true">🏠</span>
          <span className="navbar__logo-text">
            Ghar<span className="navbar__logo-accent">Drishya</span>
          </span>
        </Link>

        {isUser && !isAdmin && (
          <nav className="navbar__links" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="navbar__actions">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="btn btn-sm btn-ghost">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Logout
              </button>
            </>
          ) : isUser ? (
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
              Logout
            </button>
          ) : (
            <Link to="/admin" className="btn btn-sm btn-secondary">
              Admin Login
            </Link>
          )}

          {isUser && !isAdmin && (
            <Link to="/how-it-works" className="btn btn-sm btn-primary navbar__cta">
              Start Building
            </Link>
          )}
        </div>

        {isUser && !isAdmin && (
          <button
            id="navbar-menu-toggle"
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        )}
      </div>

      {isUser && !isAdmin && (
        <div
          className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <nav aria-label="Mobile navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`
                }
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}

            <div className="navbar__drawer-actions">
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
              <Link to="/how-it-works" className="btn btn-primary" onClick={closeMenu}>
                🏠 Start Building
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
