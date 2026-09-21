import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function BranchAdminOrders() {
  const { api } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const loadOrders = () => {
    api('/admin/orders')
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(loadOrders, [api])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await api(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })
      loadOrders()
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">Orders</h1>
      <p className="text-[#9CA3AF] text-[14px] mt-2">Orders for your branch.</p>

      {orders.length === 0 ? (
        <div className="mt-16 text-center">
          <svg className="w-16 h-16 text-gray-200 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-[#9CA3AF] text-[14px] mt-4">No orders yet.</p>
        </div>
      ) : (
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Order ID</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Customer</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Items</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Total</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Status</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Date</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-[11px] text-[#4A4A4A] font-mono">#{order.id?.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[13px] font-semibold text-[#1A1A1A]">{order.user_name || 'Unknown'}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{order.user_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#4A4A4A]">
                    {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#2D5A27]">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : order.status === 'Cancelled'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-[#9CA3AF]">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="text-[12px] font-medium rounded-lg border border-gray-200 px-3 py-1.5 outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 disabled:opacity-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BranchAdminOrders
