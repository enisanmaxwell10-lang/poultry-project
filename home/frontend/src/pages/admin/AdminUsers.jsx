import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function AdminUsers() {
  const { api } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div>
      <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">Users</h1>
      <p className="text-[#9CA3AF] text-[14px] mt-2">All registered users on the platform.</p>

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
            {users.map((u) => (
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
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                    u.role === 'admin'
                      ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                      : 'bg-gray-100 text-[#6B7280]'
                  }`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-[#9CA3AF] text-[13px] py-10">No users found.</p>
        )}
      </div>
    </div>
  )
}

export default AdminUsers