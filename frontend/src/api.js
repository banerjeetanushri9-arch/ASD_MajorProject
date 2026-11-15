
// src/api.js — Centralized API configuration

const BASE = '/api';

// Centralized API request helper
// Admin JWT is attached ONLY when requireAdmin is true.
async function request(path, options = {}, requireAdmin = false) {
  const token = requireAdmin
    ? localStorage.getItem('ghardrishya_admin_token')
    : null;

  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data;
}

// House types
export const getHouseTypes = () =>
  request('/house-types');

// Materials
export const getMaterials = () =>
  request('/materials');

// Rates — Read-only access for everyone
export const getRates = (state = '') =>
  request(`/rates${state ? `?state=${encodeURIComponent(state)}` : ''}`);

// Add a state rate — Admin only
export const createRate = (body) =>
  request(
    '/rates',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    true
  );

// Update a state rate — Admin only
export const updateRate = (id, body) =>
  request(
    `/rates/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
    true
  );

// Estimate
export const postEstimate = (body) =>
  request('/estimate', {
    method: 'POST',
    body: JSON.stringify(body),
  });

// Admin login
export const adminLogin = (body) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });

// Common user registration
export const userRegister = (body) =>
  fetch(BASE + '/user-auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  });

// Common user login
export const userLogin = (body) =>
  fetch(BASE + '/user-auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  });
