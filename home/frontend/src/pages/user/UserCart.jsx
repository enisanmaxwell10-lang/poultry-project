import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

function UserCart() {
  const { items, updateQuantity, removeFromCart, totalFormatted, clearCart, branchId } = useCart()
  const { api } = useAuth()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const handlePlaceOrder = async () => {
    if (!items.length) return
    setLoading(true)
    setStatus({ type: '', message: '' })
    try {
      const orderItems = items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        weight: i.weight,
        price: i.price,
        quantity: i.quantity,
      }))
      await api('/orders', {
        method: 'POST',
        body: JSON.stringify({ items: orderItems, total: totalFormatted, branch_id: branchId }),
      })
      clearCart()
      setStatus({ type: 'success', message: 'Order placed successfully!' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">Cart</h1>
      <p className="text-[#9CA3AF] text-[14px] mt-2">Review your items and place your order.</p>

      {branchId && (
        <p className="text-[13px] text-[#2D5A27] font-medium mt-2 capitalize">
          Ordering from: {branchId.replace(/-/g, ' ')}
        </p>
      )}

      {!branchId && items.length > 0 && (
        <div className="mt-6 px-5 py-4 rounded-2xl text-[13px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
          Select a branch on the Shop page before placing an order.
        </div>
      )}

      {status.message && (
        <div
          className={`mt-6 px-5 py-4 rounded-2xl text-[13px] font-medium flex items-center gap-3 ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              : 'bg-red-50 text-red-700 border border-red-200/60'
          }`}
        >
          <div className={`w-2 h-2 rounded-full shrink-0 ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {status.message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <svg className="w-16 h-16 text-gray-200 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p className="text-[#9CA3AF] text-[14px] mt-4">Your cart is empty.</p>
          <Link to="/shop" className="inline-block mt-4 bg-[#2D5A27] text-white text-[13px] font-semibold px-6 py-3 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Product</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Price</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Qty</th>
                  <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Total</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => {
                  const price = parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0
                  return (
                    <tr key={item.product_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#1A1A1A]">{item.name}</p>
                            <p className="text-[11px] text-[#9CA3AF]">{item.weight}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#4A4A4A]">{item.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-[#4A4A4A] hover:border-[#2D5A27] hover:text-[#2D5A27] transition-colors text-[14px]"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-[13px] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-[#4A4A4A] hover:border-[#2D5A27] hover:text-[#2D5A27] transition-colors text-[14px]"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-[#2D5A27]">
                        {"₦" + (price * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={clearCart}
              className="text-[13px] font-medium text-[#9CA3AF] hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-[0.12em] font-semibold">Total</p>
                <p className="text-[1.4rem] font-bold text-[#2D5A27] mt-1">{totalFormatted}</p>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !branchId}
                className="bg-[#2D5A27] text-white text-[13px] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2D5A27]/20"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserCart