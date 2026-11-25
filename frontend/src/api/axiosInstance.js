/**
 * Axios instance pre-configured with:
 *  - Base URL from environment variable
 *  - Request interceptor: attaches JWT from localStorage
 *  - Response interceptor: redirects to /login on 401
 */

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request: attach JWT ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sb_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response: handle 401 globally ───────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !['/api/auth/login', '/api/auth/register'].includes(error.config?.url)) {
      localStorage.removeItem('sb_token')
      localStorage.removeItem('sb_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
