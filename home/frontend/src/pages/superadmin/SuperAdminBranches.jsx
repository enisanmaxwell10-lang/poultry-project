import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function SuperAdminBranches() {
  const { api } = useAuth()
  const navigate = useNavigate()
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editBranch, setEditBranch] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', phone: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminBranch, setAdminBranch] = useState(null)
  const [adminEmail, setAdminEmail] = useState('')

  const loadBranches = () => {
    api('/branches')
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]))
      .finally(() => setLoading(false))
  }

  useEffect(loadBranches, [api])

  const openCreate = () => {
    setEditBranch(null)
    setForm({ name: '', address: '', phone: '' })
    setShowModal(true)
    setStatus({ type: '', message: '' })
  }

  const openEdit = (b) => {
    setEditBranch(b)
    setForm({ name: b.name, address: b.address, phone: b.phone || '' })
    setShowModal(true)
    setStatus({ type: '', message: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    try {
      if (editBranch) {
        await api(`/branches/${editBranch.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
        setStatus({ type: 'success', message: 'Branch updated' })
      } else {
        await api('/branches', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        setStatus({ type: 'success', message: 'Branch created' })
      }
      setShowModal(false)
      loadBranches()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this branch and all its data?')) return
    try {
      await api(`/branches/${id}`, { method: 'DELETE' })
      loadBranches()
    } catch (err) {
      alert(err.message)
    }
  }

  const openAssignAdmin = (branch) => {
    setAdminBranch(branch)
    setAdminEmail('')
    setShowAdminModal(true)
    setStatus({ type: '', message: '' })
  }

  const handleAssignAdmin = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    try {
      await api(`/branches/${adminBranch.id}/assign-admin`, {
        method: 'POST',
        body: JSON.stringify({ email: adminEmail }),
      })
      setStatus({ type: 'success', message: `Admin assigned to ${adminBranch.name}` })
      setShowAdminModal(false)
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
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
          <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">Branches</h1>
          <p className="text-[#9CA3AF] text-[14px] mt-2">Manage all farm branches.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#2D5A27] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300"
        >
          + Add Branch
        </button>
      </div>

      {status.message && !showModal && !showAdminModal && (
        <div className={`mt-4 px-5 py-4 rounded-2xl text-[13px] font-medium flex items-center gap-3 ${
          status.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
            : 'bg-red-50 text-red-700 border border-red-200/60'
        }`}>
          <div className={`w-2 h-2 rounded-full shrink-0 ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {status.message}
        </div>
      )}

      {branches.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[#9CA3AF] text-[14px]">No branches yet. Click "Add Branch" to create one.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[#1A1A1A]">{b.name}</h3>
                  <p className="text-[12px] text-[#9CA3AF] mt-1">{b.address}</p>
                  {b.phone && <p className="text-[12px] text-[#9CA3AF] mt-0.5">{b.phone}</p>}
                </div>
                <span className="text-[10px] font-bold text-[#2D5A27] uppercase tracking-[0.1em] bg-[#2D5A27]/10 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>

              {b.stats && (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: 'Staff', value: b.stats.staff },
                      { label: 'Customers', value: b.stats.customers },
                      { label: 'Products', value: b.stats.products },
                      { label: 'Orders', value: b.stats.orders },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl bg-gray-50 px-3 py-2">
                        <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-[0.1em]">{s.label}</p>
                        <p className="text-[15px] font-bold text-[#1A1A1A] mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[#2D5A27]/[0.06] px-3 py-2.5">
                    <span className="text-[10px] text-[#2D5A27] font-semibold uppercase tracking-[0.1em]">Revenue</span>
                    <span className="text-[14px] font-bold text-[#2D5A27]">{b.stats.revenue}</span>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-4">
                <button onClick={() => navigate(`/super-admin/branches/${b.id}`)} className="text-[13px] text-[#1A1A1A] font-semibold hover:underline">View</button>
                <button onClick={() => openEdit(b)} className="text-[13px] text-[#2D5A27] font-medium hover:underline">Edit</button>
                <button onClick={() => openAssignAdmin(b)} className="text-[13px] text-[#C9A84C] font-medium hover:underline">Assign Admin</button>
                <button onClick={() => handleDelete(b.id)} className="text-[13px] text-red-500 font-medium hover:underline ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl mx-4">
            <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-6">
              {editBranch ? 'Edit Branch' : 'Add Branch'}
            </h2>

            {status.message && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-[13px] font-medium ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Branch Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Phone (optional)</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="text-[13px] font-medium text-[#9CA3AF] px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-[#2D5A27] text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300">
                  {editBranch ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdminModal(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl mx-4">
            <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-2">
              Assign Branch Admin
            </h2>
            <p className="text-[13px] text-[#9CA3AF] mb-6">Assign an existing user as admin for {adminBranch?.name}</p>

            {status.message && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-[13px] font-medium ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleAssignAdmin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">User Email</label>
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)}
                  className="text-[13px] font-medium text-[#9CA3AF] px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-[#C9A84C] text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#B8943A] transition-all duration-300">
                  Assign Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperAdminBranches
