import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function WorkerOverview() {
  const { api, user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/worker/stats')
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
    { label: 'Branch Orders', value: stats?.orders ?? 0, color: '#2D5A27' },
    { label: 'Pending', value: stats?.status_counts?.Pending ?? 0, color: '#C9A84C' },
    { label: 'Delivered', value: stats?.status_counts?.Delivered ?? 0, color: '#2D5A27' },
    { label: 'Revenue', value: stats?.revenue ?? '₦0', color: '#C9A84C' },
  ]

  return (
    <div>
      <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">
        Worker <span className="text-[#2D5A27]">Dashboard</span>
      </h1>
      <p className="text-[#9CA3AF] text-[14px] mt-2">
        Welcome, {user?.name}
        {stats?.branch ? ` — ${stats.branch.name}` : ''}. Here are your branch orders.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-[11px] text-[#9CA3AF] font-semibold uppercase tracking-[0.12em]">{card.label}</p>
            <p className="text-[1.4rem] font-bold mt-1" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {stats?.branch && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-3">Your Branch</h2>
          <p className="text-[14px] font-semibold text-[#1A1A1A]">{stats.branch.name}</p>
          <p className="text-[13px] text-[#9CA3AF] mt-1">{stats.branch.address}</p>
          {stats.branch.phone && <p className="text-[13px] text-[#9CA3AF] mt-0.5">{stats.branch.phone}</p>}
        </div>
      )}
    </div>
  )
}

export default WorkerOverview
