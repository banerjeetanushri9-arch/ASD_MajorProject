// src/pages/AdminLogin.jsx — Admin login page.
// Uses hardcoded credentials (admin / admin123) for demo.
// Sets a localStorage flag on success, then redirects to dashboard.
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './AdminLogin.css'

// Hardcoded credentials for demo — replace with real auth in production
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin123'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)
    // Simulate a small delay so it feels like a real auth call
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)

    if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
      localStorage.setItem('ghardrishya_admin', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials. Try admin / admin123 for demo.')
    }
  }

  return (
    <div className="adminlogin">
      {/* Decorative orbs */}
      <div className="adminlogin__orb adminlogin__orb--1" aria-hidden="true" />
      <div className="adminlogin__orb adminlogin__orb--2" aria-hidden="true" />

      <div className="adminlogin__card glass-card anim-fadeInUp">
        {/* Header */}
        <div className="adminlogin__header">
          <div className="adminlogin__icon">🔐</div>
          <h1 className="adminlogin__title">Admin Login</h1>
          <p className="adminlogin__subtitle">
            Rate management dashboard for GharDrishya administrators.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="adminlogin__error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form id="admin-login-form" className="adminlogin__form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="admin-username" className="form-label">Username</label>
            <input
              id="admin-username"
              name="username"
              type="text"
              className="form-input"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">Password</label>
            <div className="adminlogin__pass-wrap">
              <input
                id="admin-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="adminlogin__show-pass"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            className={`btn btn-primary adminlogin__submit ${loading ? 'adminlogin__submit--loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="adminlogin__spinner" aria-hidden="true" />
                Verifying…
              </>
            ) : (
              <>🔓 Login</>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div className="adminlogin__hint">
          <span>💡</span>
          <span>Demo credentials: <code>admin</code> / <code>admin123</code></span>
        </div>

        {/* Back link */}
        <div className="adminlogin__back">
          <Link to="/" className="adminlogin__back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
