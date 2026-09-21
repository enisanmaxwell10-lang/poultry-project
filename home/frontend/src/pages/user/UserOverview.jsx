import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function UserOverview() {
  const { user, api } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api('/dashboard/stats')
      .then(setStats)
      .catch(() => {})
  }, [api])

  return (
    <div>
      <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">
        Welcome back, <span className="text-[#2D5A27]">{user?.name?.split(' ')[0]}</span>
      </h1>
      <p className="text-[#9CA3AF] text-[14px] mt-2">Here's an overview of your account.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27]/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-[13px] text-[#9CA3AF] font-medium">Total Orders</p>
          <p className="text-[15px] font-semibold text-[#1A1A1A] mt-1">{stats?.total_orders ?? '—'}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[13px] text-[#9CA3AF] font-medium">Total Spent</p>
          <p className="text-[15px] font-semibold text-[#1A1A1A] mt-1">{stats?.total_spent ?? '—'}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[13px] text-[#9CA3AF] font-medium">Pending Orders</p>
          <p className="text-[15px] font-semibold text-[#1A1A1A] mt-1">{stats?.pending_orders ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}

export default UserOverview
