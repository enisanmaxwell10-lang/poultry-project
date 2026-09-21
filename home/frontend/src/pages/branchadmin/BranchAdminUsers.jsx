import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function BranchAdminUsers() {
  const { api } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api('/admin/users')
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [api])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter)

  const roleStyle = (role) => {
    if (role === 'branch_admin') return 'bg-[#C9A84C]/10 text-[#C9A84C]'
    if (role === 'worker') return 'bg-[#2D5A27]/10 text-[#2D5A27]'
    return 'bg-gray-100 text-[#6B7280]'
  }

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'user', label: 'Customers' },
    { key: 'worker', label: 'Workers' },
    { key: 'branch_admin', label: 'Admins' },
  ]

  return (
    <div>
      <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">Users</h1>
      <p className="text-[#9CA3AF] text-[14px] mt-2">People linked to your branch — admins, workers, and customers who ordered here.</p>

      <div className="flex flex-wrap gap-2 mt-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
              filter === f.key
                ? 'bg-[#2D5A27] text-white'
                : 'border border-gray-200 text-[#6B7280] hover:border-[#2D5A27] hover:text-[#2D5A27]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">User</th>
              <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Email</th>
              <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Age</th>
              <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((u) => (
              <tr key={u.id || u.email} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27] font-semibold text-[13px]">
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="text-[13px] font-semibold text-[#1A1A1A]">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-[#4A4A4A]">{u.email}</td>
                <td className="px-6 py-4 text-[13px] text-[#4A4A4A]">{u.age}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full capitalize ${roleStyle(u.role)}`}>
                    {String(u.role).replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-[#9CA3AF] text-[13px] py-10">No users found.</p>
        )}
      </div>
    </div>
  )
}

export default BranchAdminUsers
