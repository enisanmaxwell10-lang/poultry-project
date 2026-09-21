import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function SuperAdminBranchDetail() {
  const { api } = useAuth()
  const { branchId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api(`/branches/${branchId}/overview`)
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [api, branchId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div>
        <Link to="/super-admin/branches" className="text-[13px] text-[#2D5A27] font-medium hover:underline">← Back to Branches</Link>
        <p className="mt-6 text-red-600 text-[14px]">{error || 'Branch not found.'}</p>
      </div>
    )
  }

  const { branch, stats, status_counts: statusCounts = {}, admins = [], workers = [], products = [], orders = [] } = data

  const cards = [
    { label: 'Staff', value: stats.staff },
    { label: 'Admins', value: stats.admins },
    { label: 'Workers', value: stats.workers },
    { label: 'Customers', value: stats.customers },
    { label: 'Products', value: stats.products },
    { label: 'Orders', value: stats.orders },
    { label: 'Revenue', value: stats.revenue },
  ]

  return (
    <div>
      <Link to="/super-admin/branches" className="text-[13px] text-[#2D5A27] font-medium hover:underline">← Back to Branches</Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight capitalize">{branch.name}</h1>
          <p className="text-[#9CA3AF] text-[14px] mt-2">{branch.address}</p>
          {branch.phone && <p className="text-[#9CA3AF] text-[13px] mt-0.5">{branch.phone}</p>}
        </div>
        <span className="text-[11px] font-bold text-[#2D5A27] uppercase tracking-[0.12em] bg-[#2D5A27]/10 px-4 py-2 rounded-full">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-[0.12em]">{card.label}</p>
            <p className="text-[1.3rem] font-bold text-[#1A1A1A] mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Admins */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Branch Admins</h2>
          {admins.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF]">No admin assigned.</p>
          ) : (
            <ul className="space-y-3">
              {admins.map((a) => (
                <li key={a.id || a.email} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] font-semibold text-[13px]">
                    {a.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">{a.name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{a.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Workers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Workers</h2>
          {workers.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF]">No workers yet.</p>
          ) : (
            <ul className="space-y-3">
              {workers.map((w) => (
                <li key={w.id || w.email} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27] font-semibold text-[13px]">
                    {w.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">{w.name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{w.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Status breakdown */}
      {Object.keys(statusCounts).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
          <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Orders by Status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <span key={status} className="text-[12px] font-semibold px-4 py-2 rounded-full bg-gray-50 text-[#4A4A4A]">
                {status}: <span className="text-[#1A1A1A]">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-[14px] font-bold text-[#1A1A1A]">Products ({products.length})</h2>
        </div>
        {products.length === 0 ? (
          <p className="text-[13px] text-[#9CA3AF] px-6 py-8">No products in this branch.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Product</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Category</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-[13px] font-semibold text-[#1A1A1A]">{p.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{p.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#4A4A4A]">{p.category}</td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-[#2D5A27]">{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent orders */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-[14px] font-bold text-[#1A1A1A]">Recent Orders</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-[13px] text-[#9CA3AF] px-6 py-8">No orders yet.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Order</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Customer</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Total</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Status</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-[11px] text-[#4A4A4A] font-mono">#{String(o.id).slice(-8)}</td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">{o.user_name || 'Unknown'}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{o.user_email}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#2D5A27]">{o.total}</td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-[12px] text-[#9CA3AF]">
                    {o.created_at
                      ? new Date(o.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default SuperAdminBranchDetail
