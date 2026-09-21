import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function UserOrders() {
  const { api } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  const fetchOrders = () => {
    api('/orders')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [api])

  const handleCancel = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    setCancelling(orderId)
    try {
      await api(`/orders/${orderId}/cancel`, { method: 'PUT' })
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o))
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setCancelling(null)
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
      <p className="text-[#9CA3AF] text-[14px] mt-2">Your order history.</p>

      {orders.length === 0 ? (
        <div className="mt-16 text-center">
          <svg className="w-16 h-16 text-gray-200 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-[#9CA3AF] text-[14px] mt-4">No orders yet. Start shopping to place your first order.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[13px] text-[#9CA3AF]">Order #{order.id?.slice(-8)}</p>
                  <p className="text-[12px] text-[#9CA3AF] mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700'
                      : order.status === 'Cancelled'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-[15px] font-bold text-[#2D5A27]">{order.total}</span>
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-gray-50 pt-4 space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[13px]">
                      <span className="text-[#4A4A4A]">
                        {item.name} <span className="text-[#9CA3AF]">x{item.quantity}</span>
                      </span>
                      <span className="text-[#1A1A1A] font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-50 pt-4 flex items-center gap-4 mt-2">
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="text-[12px] font-medium text-[#2D5A27] hover:text-[#1E3D1A] transition-colors"
                >
                  {expanded === order.id ? 'Hide Details' : 'View Details'}
                </button>
                {order.status === 'Pending' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={cancelling === order.id}
                    className="text-[12px] font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserOrders
