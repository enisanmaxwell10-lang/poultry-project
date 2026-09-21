import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function BranchAdminWorkers() {
  const { api, user } = useAuth()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', age: '', email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const branchId = user?.branch_id

  const loadWorkers = () => {
    if (!branchId) {
      setLoading(false)
      return
    }
    api(`/branches/${branchId}/workers`)
      .then((data) => setWorkers(Array.isArray(data) ? data : []))
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false))
  }

  useEffect(loadWorkers, [api, branchId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    setSubmitting(true)
    try {
      await api(`/branches/${branchId}/workers`, {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setStatus({ type: 'success', message: 'Worker added' })
      setForm({ name: '', age: '', email: '', password: '' })
      setShowModal(false)
      loadWorkers()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (email) => {
    if (!confirm('Remove this worker?')) return
    try {
      await api(`/branches/${branchId}/workers/${email}`, { method: 'DELETE' })
      loadWorkers()
    } catch (err) {
      alert(err.message)
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
          <h1 className="text-[1.6rem] font-bold text-[#1A1A1A] tracking-tight">Workers</h1>
          <p className="text-[#9CA3AF] text-[14px] mt-2">Manage workers in your branch.</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setStatus({ type: '', message: '' }) }}
          className="bg-[#2D5A27] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300"
        >
          + Add Worker
        </button>
      </div>

      {workers.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[#9CA3AF] text-[14px]">No workers yet.</p>
        </div>
      ) : (
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Name</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Email</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Age</th>
                <th className="text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workers.map((w) => (
                <tr key={w.email} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27] font-semibold text-[13px]">
                        {w.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-[13px] font-semibold text-[#1A1A1A]">{w.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#4A4A4A]">{w.email}</td>
                  <td className="px-6 py-4 text-[13px] text-[#4A4A4A]">{w.age}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleRemove(w.email)} className="text-[13px] text-red-500 font-medium hover:underline">Remove</button>
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
            <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-6">Add Worker</h2>

            {status.message && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-[13px] font-medium ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Age</label>
                  <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.12em]">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="text-[13px] font-medium text-[#9CA3AF] px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="bg-[#2D5A27] text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1E3D1A] transition-all duration-300 disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BranchAdminWorkers
