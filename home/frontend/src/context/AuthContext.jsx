import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'greenfields_token'
const USER_KEY = 'greenfields_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)

    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [token, user])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const api = useCallback(
    async (path, options = {}) => {
      const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
      if (token) headers.Authorization = `Bearer ${token}`

      const res = await fetch(`${API_URL}${path}`, { ...options, headers })

      let data = {}
      try {
        data = await res.json()
      } catch {
        data = {}
      }

      if (!res.ok) {
        const err = new Error(data.message || data.detail || 'Request failed')
        err.status = res.status
        if (res.status === 401 && path !== '/login' && path !== '/register') {
          logout()
        }
        throw err
      }
      return data
    },
    [token, logout]
  )

  const login = useCallback(
    async (email, password) => {
      const data = await api('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(data.access_token)
      setUser(data.user)
      return data
    },
    [api]
  )

  const register = useCallback(
    async (name, age, email, password) => {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, email, password }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const err = new Error(data.message || 'Registration failed')
        err.status = res.status
        throw err
      }

      await login(email, password)
      return data
    },
    [login]
  )

  const refreshMe = useCallback(async () => {
    if (!token) return
    try {
      const me = await api('/me')
      setUser((prev) => ({ ...prev, ...me }))
    } catch {
      // token invalid -> already logged out by api wrapper
    }
  }, [api, token])

  const isSuperAdmin = user?.role === 'super_admin'
  const isBranchAdmin = user?.role === 'branch_admin'
  const isWorker = user?.role === 'worker'
  const isUser = user?.role === 'user'
  const isAdmin = isSuperAdmin || isBranchAdmin

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isAdmin,
    isSuperAdmin,
    isBranchAdmin,
    isWorker,
    isUser,
    api,
    login,
    register,
    logout,
    refreshMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
