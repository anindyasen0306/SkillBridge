/**
 * AuthContext
 * Provides: user, loading, login(), register(), logout()
 * Persists token + user to localStorage for session resumption.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('sb_token')
    const saved = localStorage.getItem('sb_user')
    if (token && saved) {
      try {
        setUser(JSON.parse(saved))
        // Optionally re-verify token with /me
        authApi.me()
          .then(({ data }) => { setUser(data); localStorage.setItem('sb_user', JSON.stringify(data)) })
          .catch(() => { localStorage.removeItem('sb_token'); localStorage.removeItem('sb_user'); setUser(null) })
          .finally(() => setLoading(false))
      } catch {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const persistSession = (token, userData) => {
    localStorage.setItem('sb_token', token)
    localStorage.setItem('sb_user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password })
    persistSession(data.access_token, data.user)
    toast.success(`Welcome back, ${data.user.full_name.split(' ')[0]}!`)
    return data
  }

  const register = async (full_name, email, password) => {
    const { data } = await authApi.register({ full_name, email, password })
    persistSession(data.access_token, data.user)
    toast.success(`Account created! Welcome, ${data.user.full_name.split(' ')[0]}!`)
    return data
  }

  const logout = () => {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_user')
    setUser(null)
    toast.success('Logged out successfully.')
  }

  const updateUser = (updated) => {
    setUser(updated)
    localStorage.setItem('sb_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
