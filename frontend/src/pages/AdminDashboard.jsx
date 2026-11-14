// src/pages/AdminDashboard.jsx — Rate management dashboard.
// Protected route. Fetches all rates, allows inline edit (PUT) and add new (POST).
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getRates, updateRate, createRate } from '../api'
import './AdminDashboard.css'

// Toast notification component
function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="polite">
      <span>{type === 'success' ? '✅' : '❌'}</span>
      {message}
    </div>
  )
}

// Row for a single rate — inline editable
function RateRow({ rate, onSave }) {
  const [editing, setEditing]   = useState(false)
  const [value, setValue]       = useState(String(rate.baseRate))
  const [saving, setSaving]     = useState(false)
  const [err, setErr]           = useState('')

  async function handleSave() {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 100 || num > 10000) {
      setErr('Enter a valid rate between 100 and 10,000')
      return
    }
    setSaving(true)
    setErr('')
    try {
      await onSave(rate.id, num)
      setEditing(false)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setValue(String(rate.baseRate))
    setEditing(false)
    setErr('')
  }

  return (
    <tr className="dashboard__rate-row">
      <td>
        <div className="dashboard__state-cell">
          <span className="dashboard__state-dot" />
          <span className="dashboard__state-name">{rate.state}</span>
        </div>
      </td>
      <td>
        {editing ? (
          <div className="dashboard__edit-cell">
            <span className="dashboard__rupee">₹</span>
            <input
              id={`rate-input-${rate.id}`}
              type="number"
              className="form-input dashboard__rate-input"
              value={value}
              onChange={e => { setValue(e.target.value); setErr('') }}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
              min="100"
              max="10000"
              step="50"
              autoFocus
              aria-label={`Base rate for ${rate.state}`}
            />
            <span className="dashboard__unit">/ sq ft</span>
          </div>
        ) : (
          <span className="dashboard__rate-value">
            ₹{rate.baseRate.toLocaleString('en-IN')} <span className="dashboard__unit">/ sq ft</span>
          </span>
        )}
        {err && <p className="dashboard__inline-err">{err}</p>}
      </td>
      <td>
        <span className="dashboard__1bhk">
          ₹{(270 * rate.baseRate).toLocaleString('en-IN')}
        </span>
      </td>
      <td>
        <span className="dashboard__2bhk">
          ₹{(450 * rate.baseRate).toLocaleString('en-IN')}
        </span>
      </td>
      <td>
        {editing ? (
          <div className="dashboard__actions">
            <button
              id={`save-rate-${rate.id}`}
              className="btn btn-sm btn-teal"
              onClick={handleSave}
              disabled={saving}
              aria-label={`Save rate for ${rate.state}`}
            >
              {saving ? '…' : '✓ Save'}
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            id={`edit-rate-${rate.id}`}
            className="btn btn-sm btn-ghost"
            onClick={() => setEditing(true)}
            aria-label={`Edit rate for ${rate.state}`}
          >
            ✏️ Edit
          </button>
        )}
      </td>
    </tr>
  )
}

// Add-new-rate form
function AddRateForm({ existingStates, onAdd }) {
  const [form, setForm]     = useState({ state: '', baseRate: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErr('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.state.trim()) { setErr('State name is required.'); return }
    const rate = parseInt(form.baseRate, 10)
    if (isNaN(rate) || rate < 100 || rate > 10000) {
      setErr('Enter a valid rate between 100 and 10,000')
      return
    }
    setSaving(true)
    setErr('')
    try {
      await onAdd({ state: form.state.trim(), baseRate: rate })
      setForm({ state: '', baseRate: '' })
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form id="add-rate-form" className="dashboard__add-form glass-card" onSubmit={handleSubmit} noValidate>
      <h3 className="dashboard__add-title">➕ Add New State Rate</h3>

      <div className="dashboard__add-fields">
        <div className="form-group">
          <label htmlFor="new-rate-state" className="form-label">State Name</label>
          <input
            id="new-rate-state"
            name="state"
            type="text"
            className="form-input"
            placeholder="e.g. Rajasthan"
            value={form.state}
            onChange={handleChange}
            list="known-states"
          />
          <datalist id="known-states">
            {['Rajasthan', 'Uttar Pradesh', 'Bihar', 'Jharkhand', 'West Bengal'].map(s => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="new-rate-value" className="form-label">Base Rate (₹ / sq ft)</label>
          <input
            id="new-rate-value"
            name="baseRate"
            type="number"
            className="form-input"
            placeholder="e.g. 1250"
            value={form.baseRate}
            onChange={handleChange}
            min="100"
            max="10000"
            step="50"
          />
        </div>

        <button
          id="add-rate-submit"
          type="submit"
          className="btn btn-primary dashboard__add-btn"
          disabled={saving}
        >
          {saving ? '…Adding' : '+ Add Rate'}
        </button>
      </div>

      {err && <p className="dashboard__inline-err" role="alert">{err}</p>}
    </form>
  )
}

export default function AdminDashboard() {
  const navigate              = useNavigate()
  const [rates, setRates]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [toast, setToast]     = useState(null) // { message, type }

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function hideToast() { setToast(null) }

  const fetchRates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRates()
      setRates(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRates() }, [fetchRates])

  async function handleSaveRate(id, baseRate) {
    const updated = await updateRate(id, { baseRate })
    setRates(rs => rs.map(r => r.id === id ? { ...r, baseRate: updated.baseRate ?? baseRate } : r))
    showToast('Rate updated successfully!')
  }

  async function handleAddRate(body) {
    const created = await createRate(body)
    setRates(rs => [...rs, created])
    showToast(`Rate for ${created.state || body.state} added!`)
  }

  function handleLogout() {
    localStorage.removeItem('ghardrishya_admin')
    navigate('/admin')
  }

  return (
    <div className="dashboard">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={hideToast} />}

      {/* Header bar */}
      <div className="dashboard__topbar">
        <div className="container dashboard__topbar-inner">
          <div className="dashboard__topbar-left">
            <Link to="/" className="dashboard__logo">
              🏠 <span>GharDrishya</span>
            </Link>
            <span className="badge badge-saffron">Admin Dashboard</span>
          </div>
          <div className="dashboard__topbar-right">
            <span className="dashboard__admin-label">👤 admin</span>
            <button id="dashboard-logout-btn" className="btn btn-sm btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container dashboard__content">
        {/* Page title */}
        <div className="dashboard__page-header anim-fadeInUp">
          <div>
            <h1 className="dashboard__title">Rate Management</h1>
            <p className="dashboard__subtitle">
              Edit state-wise base construction rates. Changes reflect immediately in all cost estimates.
            </p>
          </div>
          <button className="btn btn-sm btn-teal" onClick={fetchRates} disabled={loading}>
            {loading ? '⟳' : '↺ Refresh'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="dashboard__error" role="alert">
            <span>⚠️</span>
            <div>
              <strong>Could not load rates</strong>
              <p>Ensure the Express API is running. Error: {error}</p>
            </div>
            <button className="btn btn-sm btn-teal" onClick={fetchRates}>Retry</button>
          </div>
        )}

        {/* Stats */}
        <div className="dashboard__stats anim-fadeInUp anim-delay-1">
          <div className="dashboard__stat-card glass-card">
            <span className="dashboard__stat-num">{rates.length}</span>
            <span className="dashboard__stat-lbl">States Configured</span>
          </div>
          <div className="dashboard__stat-card glass-card">
            <span className="dashboard__stat-num">
              {rates.length ? `₹${Math.min(...rates.map(r => r.baseRate)).toLocaleString('en-IN')}` : '—'}
            </span>
            <span className="dashboard__stat-lbl">Lowest Rate / sq ft</span>
          </div>
          <div className="dashboard__stat-card glass-card">
            <span className="dashboard__stat-num">
              {rates.length ? `₹${Math.max(...rates.map(r => r.baseRate)).toLocaleString('en-IN')}` : '—'}
            </span>
            <span className="dashboard__stat-lbl">Highest Rate / sq ft</span>
          </div>
          <div className="dashboard__stat-card glass-card">
            <span className="dashboard__stat-num">
              {rates.length
                ? `₹${Math.round(rates.reduce((a, r) => a + r.baseRate, 0) / rates.length).toLocaleString('en-IN')}`
                : '—'}
            </span>
            <span className="dashboard__stat-lbl">Average Rate / sq ft</span>
          </div>
        </div>

        {/* Rates table */}
        <div className="dashboard__table-wrapper glass-card anim-fadeInUp anim-delay-2">
          <div className="dashboard__table-header">
            <h2 className="dashboard__table-title">State-wise Base Rates</h2>
            <span className="badge badge-teal">{rates.length} states</span>
          </div>

          {loading ? (
            <div className="dashboard__loading">
              <div className="adminlogin__spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
              <span>Loading rates…</span>
            </div>
          ) : rates.length === 0 ? (
            <p className="dashboard__empty">No rates configured yet. Add one below.</p>
          ) : (
            <div className="dashboard__table-scroll">
              <table className="data-table" aria-label="State-wise rates">
                <thead>
                  <tr>
                    <th>State</th>
                    <th>Base Rate</th>
                    <th>1 BHK (270 sq ft) Min.</th>
                    <th>2 BHK (450 sq ft) Min.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map(rate => (
                    <RateRow key={rate.id} rate={rate} onSave={handleSaveRate} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add new rate */}
        <AddRateForm
          existingStates={rates.map(r => r.state)}
          onAdd={handleAddRate}
        />

        {/* API info */}
        <div className="dashboard__api-info glass-card">
          <h3 className="dashboard__api-title">🔌 API Endpoints Used</h3>
          <div className="dashboard__api-list">
            {[
              { method: 'GET', path: '/api/rates', desc: 'Fetch all rates' },
              { method: 'PUT', path: '/api/rates/:id', desc: 'Update a rate' },
              { method: 'POST', path: '/api/rates', desc: 'Create a new rate' },
            ].map(({ method, path, desc }) => (
              <div key={path} className="dashboard__api-row">
                <span className={`dashboard__method dashboard__method--${method.toLowerCase()}`}>{method}</span>
                <code className="dashboard__path">{path}</code>
                <span className="dashboard__api-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
