import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function parsePrice(price) {
  const digits = String(price).replace(/[^\d.]/g, '')
  return digits ? parseFloat(digits) : 0
}

function formatNaira(number) {
  return `₦${Math.round(number).toLocaleString()}`
}

function SuperAdminOverview() {
  const { api, user } = useAuth()
  const [branches, setBranches] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api('/branches'), api('/admin/orders')])
      .then(([branchData, orderData]) => {
        setBranches(Array.isArray(branchData) ? branchData : [])
        setOrders(Array.isArray(orderData) ? orderData : [])
      })
      .catch(() => {
        setBranches([])
        setOrders([])
      })
      .finally(() => setLoading(false))
  }, [api])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const staff = branches.reduce((sum, b) => sum + (b.stats?.staff || 0), 0)
  const products = branches.reduce((sum, b) => sum + (b.stats?.products || 0), 0)
  const customers = new Set(orders.map((o) => o.user_email).filter(Boolean)).size
  const revenue = orders.reduce((sum, o) => sum + parsePrice(o.total), 0)

  const recent = [...orders]
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    .slice(0, 8)

  const cards = [
    { label: 'Branches', value: branches.length, color: '#2D5A27' },
    { label: 'Staff', value: staff, color: '#C9A84C' },
    { label: 'Customers', value: customers, color: '#2D5A27' },
    { label: 'Products', value: products, color: '#C9A84C' },
    { label: 'Orders', value: orders.length, color: '#2D5A27' },
    { label: 'Revenue', value: formatNaira(revenue), color: '#C9A84C' },
  ]

  return (
    <div>
      <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">
        Super Admin <span className="text-[#2D5A27]">Dashboard</span>
      </h1>
      <p className="text-[#9CA3AF] text-[14px] mt-2">Welcome, {user?.name}. Platform-wide overview.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-[0.12em]">{card.label}</p>
            <p className="text-[1.3rem] font-bold mt-1" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {/* Branch breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[#1A1A1A]">Branches</h2>
            <Link to="/super-admin/branches" className="text-[12px] font-semibold text-[#2D5A27] hover:underline">View all</Link>
          </div>
          {branches.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF] px-6 py-8">No branches yet.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-3">Branch</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-4 py-3">Staff</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-4 py-3">Customers</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-4 py-3">Orders</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {branches.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <Link to={`/super-admin/branches/${b.id}`} className="text-[13px] font-semibold text-[#1A1A1A] hover:text-[#2D5A27]">{b.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#4A4A4A]">{b.stats?.staff ?? 0}</td>
                    <td className="px-4 py-3 text-[13px] text-[#4A4A4A]">{b.stats?.customers ?? 0}</td>
                    <td className="px-4 py-3 text-[13px] text-[#4A4A4A]">{b.stats?.orders ?? 0}</td>
                    <td className="px-6 py-3 text-[13px] font-semibold text-[#2D5A27]">{b.stats?.revenue ?? '₦0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-[14px] font-bold text-[#1A1A1A]">Recent Orders</h2>
          </div>
          {recent.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF] px-6 py-8">No orders yet.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-3">Customer</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-4 py-3">Branch</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-4 py-3">Total</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="text-[13px] font-semibold text-[#1A1A1A]">{o.user_name || 'Unknown'}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{o.user_email}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#4A4A4A] capitalize">{String(o.branch_id || '').replace(/-/g, ' ') || '-'}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#2D5A27]">{o.total}</td>
                    <td className="px-6 py-3">
                      <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                        o.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : o.status === 'Cancelled'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminOverview
