import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function UserProfile() {
  const { api, refreshMe, user } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name || '', age: user?.age || '' })
  const [password, setPassword] = useState({ current_password: '', new_password: '', confirm: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })
    try {
      await api('/me', {
        method: 'PUT',
        body: JSON.stringify({ name: profile.name, age: parseInt(profile.age) }),
      })
      await refreshMe()
      setStatus({ type: 'success', message: 'Profile updated successfully' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (password.new_password !== password.confirm) {
      setStatus({ type: 'error', message: 'Passwords do not match' })
      return
    }
    setLoading(true)
    setStatus({ type: '', message: '' })
    try {
      await api('/me/password', {
        method: 'PUT',
        body: JSON.stringify({ current_password: password.current_password, new_password: password.new_password }),
      })
      setPassword({ current_password: '', new_password: '', confirm: '' })
      setStatus({ type: 'success', message: 'Password changed successfully' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">Profile</h1>
        <p className="text-[#9CA3AF] text-[14px] mt-2">Manage your account details and password.</p>
      </div>

      {status.message && (
        <div
          className={`px-5 py-4 rounded-2xl text-[13px] font-medium flex items-center gap-3 ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              : 'bg-red-50 text-red-700 border border-red-200/60'
          }`}
        >
          <div className={`w-2 h-2 rounded-full shrink-0 ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {status.message}
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-[15px] font-semibold text-[#1A1A1A] mb-6">Account Details</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em]">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em]">Age</label>
              <input
                type="number"
                min="1"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 transition-all duration-200"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2D5A27] text-white text-[13px] font-semibold px-6 py-3 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-[15px] font-semibold text-[#1A1A1A] mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em]">Current Password</label>
            <input
              type="password"
              value={password.current_password}
              onChange={(e) => setPassword({ ...password, current_password: e.target.value })}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 transition-all duration-200"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em]">New Password</label>
              <input
                type="password"
                value={password.new_password}
                onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em]">Confirm Password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-[#1A1A1A] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 transition-all duration-200"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2D5A27] text-white text-[13px] font-semibold px-6 py-3 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserProfile