
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userLogin, userRegister } from '../api'
import './UserAuth.css'

export default function UserAuth() {
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setError('')
    setSuccess('')
    setForm({ name: '', email: '', password: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.')
      return
    }

    if (mode === 'signup' && !form.name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (mode === 'signup' && form.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        await userRegister({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        })

        setSuccess('Account created successfully! Please log in.')
        setMode('login')
        setForm({
          name: '',
          email: form.email.trim(),
          password: '',
        })
      } else {
        const data = await userLogin({
          email: form.email.trim(),
          password: form.password,
        })

        if (!data.token) {
          throw new Error('Authentication token was not received.')
        }
        localStorage.removeItem('ghardrishya_admin_token')
        localStorage.removeItem('ghardrishya_admin')
        localStorage.setItem('ghardrishya_user_token', data.token)
        localStorage.setItem('ghardrishya_user', JSON.stringify(data.user))

        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="adminlogin userauth">
      <div className="adminlogin__orb adminlogin__orb--1" aria-hidden="true" />
      <div className="adminlogin__orb adminlogin__orb--2" aria-hidden="true" />

      <div className="adminlogin__card glass-card anim-fadeInUp">
        <div className="adminlogin__header">
          <div className="adminlogin__icon">🏠</div>
          <h1 className="adminlogin__title">Welcome to GharDrishya</h1>
          <p className="adminlogin__subtitle">
            Log in or create an account to start planning your dream home.
          </p>
        </div>

        <div className="userauth__tabs">
          <button
            type="button"
            className={`userauth__tab ${mode === 'login' ? 'userauth__tab--active' : ''}`}
            onClick={() => changeMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`userauth__tab ${mode === 'signup' ? 'userauth__tab--active' : ''}`}
            onClick={() => changeMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="adminlogin__error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="userauth__success" role="status">
            ✅ {success}
          </div>
        )}

        <form
          id="user-auth-form"
          className="adminlogin__form"
          onSubmit={handleSubmit}
          noValidate
        >
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="user-name" className="form-label">Full Name</label>
              <input
                id="user-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user-email" className="form-label">Email</label>
            <input
              id="user-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-password" className="form-label">Password</label>
            <div className="adminlogin__pass-wrap">
              <input
                id="user-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder={mode === 'signup' ? 'Minimum 8 characters' : 'Enter your password'}
                value={form.password}
                onChange={handleChange}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
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
            id="user-auth-submit"
            type="submit"
            className={`btn btn-primary adminlogin__submit ${loading ? 'adminlogin__submit--loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="adminlogin__spinner" aria-hidden="true" />
                Please wait…
              </>
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="adminlogin__back">
          <Link to="/admin" className="adminlogin__back-link">
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  )
}
