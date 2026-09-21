import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function BranchAdminProducts() {
  const { api } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({ name: '', weight: '', price: '', img: '', category: '', tag: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [seeding, setSeeding] = useState(false)

  const categories = ['Chicken', 'Turkey', 'Chicks', 'Eggs']

  const loadProducts = () => {
    api('/products')
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(loadProducts, [api])

  const openCreate = () => {
    setEditProduct(null)
    setForm({ name: '', weight: '', price: '', img: '', category: '', tag: '' })
    setShowModal(true)
    setStatus({ type: '', message: '' })
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setForm({ name: p.name, weight: p.weight, price: p.price, img: p.img, category: p.category, tag: p.tag || '' })
    setShowModal(true)
    setStatus({ type: '', message: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    try {
      if (editProduct) {
        await api(`/products/${editProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
        setStatus({ type: 'success', message: 'Product updated' })
      } else {
        await api('/products', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        setStatus({ type: 'success', message: 'Product created' })
      }
      setShowModal(false)
      loadProducts()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api(`/products/${id}`, { method: 'DELETE' })
      loadProducts()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const data = await api('/seed-products', { method: 'POST' })
      alert(data.message)
      loadProducts()
    } catch (err) {
      alert(err.message)
    } finally {
      setSeeding(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">Products</h1>
          <p className="text-[#9CA3AF] text-[14px] mt-2">Manage your branch product inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="bg-[#C9A84C] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-[#B8943A] transition-all duration-300 disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : 'Seed Products'}
          </button>
          <button
            onClick={openCreate}
            className="bg-[#2D5A27] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300"
          >
            + Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[#9CA3AF] text-[14px]">No products yet. Click "Seed Products" to add defaults or create one manually.</p>
        </div>
      ) : (
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Product</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Category</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Price</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Tag</th>
                <th className="w-24"></th>
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
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.1em] bg-[#C9A84C]/10 px-3 py-1 rounded-full">
                      {p.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="text-[13px] text-[#2D5A27] font-medium hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-[13px] text-red-500 font-medium hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl mx-4">
            <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-6">
              {editProduct ? 'Edit Product' : 'Add Product'}
            </h2>

            {status.message && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-[13px] font-medium ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Weight</label>
                  <input type="text" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Price</label>
                  <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                    placeholder="₦4,500"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10">
                    <option value="">Select</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Image URL</label>
                <input type="url" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Tag (optional)</label>
                <input type="text" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="Best Seller"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="text-[13px] font-medium text-[#9CA3AF] px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-[#2D5A27] text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300">
                  {editProduct ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BranchAdminProducts
