import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [demoAccounts, setDemoAccounts] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/demo-accounts`)
      .then((res) => res.json())
      .then((data) => setDemoAccounts(Array.isArray(data) ? data : []))
      .catch(() => setDemoAccounts([]))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const redirectByRole = (role) => {
    if (role === 'super_admin') navigate('/super-admin', { replace: true })
    else if (role === 'branch_admin') navigate('/branch-admin', { replace: true })
    else if (role === 'worker') navigate('/worker', { replace: true })
    else if (role === 'admin') navigate('/admin', { replace: true })
    else navigate('/dashboard', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const data = await login(form.email, form.password)
      setStatus({ type: 'success', message: 'Login successful' })
      redirectByRole(data.role)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Login failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (account) => {
    setForm({ email: account.email, password: account.password })
    setLoading(true)
    setStatus({ type: '', message: '' })
    try {
      const data = await login(account.email, account.password)
      setStatus({ type: 'success', message: `Signed in as ${account.role}` })
      redirectByRole(data.role)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Demo login failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">

      {/* ─── Left Panel — Visual ─── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&q=80')` }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 via-[#1A1A1A]/60 to-[#2D5A27]/40" />
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-11 h-11 bg-[#2D5A27] rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 12C17.5 14.5 15.5 16.5 13 16.5H11C8.5 16.5 6.5 14.5 6.5 12V6C6.5 3.5 8.5 1.5 11 1.5H13C15.5 1.5 17.5 3.5 17.5 6V12Z"/>
                <path d="M12 16.5V22.5"/>
                <path d="M8 22.5H16"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white leading-tight">GreenFields</span>
              <span className="text-[#C9A84C] text-[9px] font-bold tracking-[0.2em] uppercase mt-0.5">Premium Poultry</span>
            </div>
          </Link>

          {/* Center Content */}
          <div className="space-y-6 max-w-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#C9A84C] to-[#D4BC6A] rounded-full" />
              <span className="text-[#C9A84C] text-[11px] font-semibold tracking-[0.3em] uppercase">
                Welcome Back
              </span>
            </div>
            <h2 className="font-display text-[3.2rem] font-bold text-white leading-[1.05] tracking-tight">
              Farm Fresh,<br />
              <span className="text-[#C9A84C]">Always Delicious</span>
            </h2>
            <p className="text-white/45 text-[15px] leading-[1.8] max-w-md">
              Log in to your account and explore our range of premium poultry products raised with care on sustainable farms.
            </p>
          </div>

          {/* Bottom */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="flex gap-12">
              {[
                { num: '1,200+', label: 'Happy Customers' },
                { num: '100%', label: 'Organic Feed' },
                { num: '5★', label: 'Farm Rating' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-[#C9A84C] text-[1.6rem] font-bold">{stat.num}</div>
                  <div className="text-white/30 text-[10px] tracking-[0.15em] uppercase mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            {/* Quote */}
            <div className="border-l-2 border-[#C9A84C]/30 pl-6">
              <p className="text-white/30 text-[13px] italic leading-[1.7]">
                "The secret to great food starts with knowing where it comes from."
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Right Panel — Form ─── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#2D5A27] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 12C17.5 14.5 15.5 16.5 13 16.5H11C8.5 16.5 6.5 14.5 6.5 12V6C6.5 3.5 8.5 1.5 11 1.5H13C15.5 1.5 17.5 3.5 17.5 6V12Z"/>
                <path d="M12 16.5V22.5"/>
                <path d="M8 22.5H16"/>
              </svg>
            </div>
            <span className="font-bold text-sm text-[#1A1A1A]">GreenFields</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="w-12 h-[3px] bg-[#2D5A27] rounded-full mb-6" />
            <h1 className="font-display text-[2rem] font-bold text-[#1A1A1A] tracking-tight leading-tight">
              Welcome Back
            </h1>
            <p className="text-[#9CA3AF] text-[14px] mt-3 leading-relaxed">
              Sign in to access your orders and account.
            </p>
          </div>

          {/* Status */}
          {status.message && (
            <div
              className={`mb-7 px-5 py-4 rounded-2xl text-[13px] font-medium flex items-center gap-3 ${
                status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-red-50 text-red-700 border border-red-200/60'
              }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {status.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em]">
                Email Address
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all duration-300 hover:border-gray-300 focus-within:border-[#2D5A27] focus-within:ring-4 focus-within:ring-[#2D5A27]/[0.06]">
                <svg className="w-[18px] h-[18px] text-gray-300 shrink-0 transition-colors duration-300 focus-within:text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent text-[14px] text-[#1A1A1A] placeholder-gray-400 outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em]">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all duration-300 hover:border-gray-300 focus-within:border-[#2D5A27] focus-within:ring-4 focus-within:ring-[#2D5A27]/[0.06]">
                <svg className="w-[18px] h-[18px] text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent text-[14px] text-[#1A1A1A] placeholder-gray-400 outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-300 hover:text-[#2D5A27] transition-colors duration-200 shrink-0"
                >
                  {showPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <span className="text-[12px] text-[#2D5A27] font-semibold hover:underline underline-offset-2 cursor-pointer transition-colors duration-200">
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#2D5A27] text-white text-[14px] font-bold tracking-wide shadow-lg shadow-[#2D5A27]/25 hover:bg-[#1E3D1A] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <svg className="w-[18px] h-[18px] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>

          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[#D1D5DB] text-[11px] font-semibold tracking-[0.15em] uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Demo Accounts */}
          {demoAccounts.length > 0 && (
            <div className="mb-8 rounded-2xl border border-dashed border-[#2D5A27]/30 bg-[#2D5A27]/[0.03] p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                <span className="text-[11px] font-bold text-[#2D5A27] uppercase tracking-[0.15em]">Demo Accounts</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleDemoLogin(account)}
                    disabled={loading}
                    className="text-left rounded-xl border border-gray-200 bg-white px-3.5 py-3 hover:border-[#2D5A27] hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="block text-[12px] font-semibold text-[#1A1A1A] truncate">
                      {account.name || account.role?.replace('_', ' ')}
                    </span>
                    <span className="block text-[10px] text-[#9CA3AF] truncate mt-0.5">{account.email}</span>
                    {account.branch_id && (
                      <span className="block text-[9px] text-[#C9A84C] uppercase tracking-[0.1em] mt-1 truncate">
                        {account.branch_id.replace(/-/g, ' ')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-[#9CA3AF] text-[13px]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#2D5A27] font-semibold hover:underline underline-offset-2">
              Create one
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default SignIn
