import { useEffect, useRef, useState } from 'react'

function Contact() {
  const revealRefs = useRef([])
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    revealRefs.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })
    try {
      const res = await fetch('http://127.0.0.1:8000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to send message')
      setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-[88px] pb-20">
      <div className="page-header py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gold-line justify-center mb-5">
            <span className="text-farm-gold text-[12px] font-semibold tracking-[0.28em] uppercase">Get In Touch</span>
          </div>
          <h1 className="font-display text-4xl lg:text-[2.75rem] font-bold text-farm-dark mt-5 tracking-tight leading-tight">
            Contact <span className="text-farm-green">Us</span>
          </h1>
          <p className="text-farm-gray mt-5 max-w-2xl mx-auto text-[15px] leading-[1.7]">
            Have questions about our products or want to place a bulk order? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div ref={addRevealRef} className="reveal-left lg:col-span-3 bg-white rounded-[28px] p-9 lg:p-11 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-farm-dark text-xl mb-9 tracking-tight">Send us a message</h2>

            {status.message && (
              <div className={`mb-6 px-5 py-4 rounded-2xl text-[13px] font-medium flex items-center gap-3 ${
                status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-red-50 text-red-700 border border-red-200/60'
              }`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-3">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-6 py-[18px] rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none border border-gray-200 bg-gray-50/50 transition-all duration-300 hover:border-gray-300 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-3">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-6 py-[18px] rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none border border-gray-200 bg-gray-50/50 transition-all duration-300 hover:border-gray-300 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 focus:bg-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-3">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-6 py-[18px] rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none border border-gray-200 bg-gray-50/50 transition-all duration-300 hover:border-gray-300 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 focus:bg-white"
                  placeholder="Bulk order inquiry"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-3">Message</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-6 py-[18px] rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none border border-gray-200 bg-gray-50/50 transition-all duration-300 hover:border-gray-300 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/10 focus:bg-white resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full bg-[#2D5A27] text-white py-4 rounded-xl text-[15px] font-bold shadow-lg shadow-[#2D5A27]/25 tracking-wide hover:bg-[#1E3D1A] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div ref={addRevealRef} className="reveal-right lg:col-span-2 space-y-6">
            <div className="bg-farm-warm rounded-[28px] p-9 border border-gray-100/80">
              <h3 className="font-semibold text-farm-dark text-lg mb-7 tracking-tight">Contact Information</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    label: 'Address',
                    value: '123 Farm Road, Green Valley, Country',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                    label: 'Phone',
                    value: '+1 (234) 567-890',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: 'Email',
                    value: 'info@greenfieldspoultry.com',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: 'Working Hours',
                    value: 'Mon - Sat: 7:00 AM - 6:00 PM',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-farm-green/[0.07] rounded-[14px] flex items-center justify-center shrink-0">
                      <div className="text-farm-green">{item.icon}</div>
                    </div>
                    <div>
                      <p className="font-medium text-farm-dark text-[11px] tracking-[0.08em] uppercase">{item.label}</p>
                      <p className="text-farm-gray text-[14px] mt-1 leading-[1.5]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="map-container h-64">
              <iframe
                title="Farm Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0!2d0.0!3d0.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAwJzAwLjAiTiAwwrAwMCcwMC4wIkU!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
