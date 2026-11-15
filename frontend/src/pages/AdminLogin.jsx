// Admin login connected to backend JWT authentication

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminLogin } from '../api'
import './AdminLogin.css'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.email.trim() || !form.password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await adminLogin({
        email: form.email.trim(),
        password: form.password,
      })

      if (!data.token) {
        throw new Error('Authentication token was not received.')
      }

      localStorage.removeItem('ghardrishya_user_token')
      localStorage.removeItem('ghardrishya_user')

      localStorage.setItem('ghardrishya_admin_token', data.token)
      localStorage.setItem('ghardrishya_admin', 'true')

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="adminlogin">
      <div className="adminlogin__orb adminlogin__orb--1" aria-hidden="true" />
      <div className="adminlogin__orb adminlogin__orb--2" aria-hidden="true" />

      <div className="adminlogin__card glass-card anim-fadeInUp">
        <div className="adminlogin__header">
          <div className="adminlogin__icon">🔐</div>
          <h1 className="adminlogin__title">Admin Login</h1>
          <p className="adminlogin__subtitle">
            Rate management dashboard for GharDrishya administrators.
          </p>
        </div>

        {error && (
          <div className="adminlogin__error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form
          id="admin-login-form"
          className="adminlogin__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="admin-email" className="form-label">
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="Enter admin email"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">
              Password
            </label>

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
            className={`btn btn-primary adminlogin__submit ${
              loading ? 'adminlogin__submit--loading' : ''
            }`}
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

        <div className="adminlogin__back">
          <Link to="/" className="adminlogin__back-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}