import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function AdminOverview() {
  const { api, user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/admin/stats')
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [api])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cards = [
    { label: 'Users', value: stats?.users ?? 0, color: '#2D5A27', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
    { label: 'Products', value: stats?.products ?? 0, color: '#C9A84C', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
    { label: 'Orders', value: stats?.orders ?? 0, color: '#2D5A27', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' },
    { label: 'Revenue', value: stats?.revenue ?? '₦0', color: '#C9A84C', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
  ]

  return (
    <div>
      <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">
        Admin <span className="text-[#2D5A27]">{user?.role === 'super_admin' ? 'Super Admin' : 'Branch Admin'}</span>
      </h1>
      <p className="text-[#9CA3AF] text-[14px] mt-2">Welcome, {user?.name}. Here's your {user?.role === 'super_admin' ? 'platform' : 'branch'} overview.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}10` }}
              >
                <span className="w-5 h-5" style={{ color: card.color }} dangerouslySetInnerHTML={{ __html: card.icon }} />
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] font-semibold uppercase tracking-[0.12em]">{card.label}</p>
            <p className="text-[1.4rem] font-bold text-[#1A1A1A] mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOverview