import { useEffect, useRef } from 'react'

function About() {
  const revealRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    revealRefs.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  return (
    <div className="pt-[88px] pb-20">
      <div className="page-header py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gold-line justify-center mb-5">
            <span className="text-farm-gold text-[12px] font-semibold tracking-[0.28em] uppercase">About Us</span>
          </div>
          <h1 className="font-display text-4xl lg:text-[2.75rem] font-bold text-farm-dark mt-5 tracking-tight leading-tight">
            Our <span className="text-farm-green">Story</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={addRevealRef} className="reveal-left space-y-6">
            <span className="text-farm-gold text-[12px] font-semibold tracking-[0.28em] uppercase">Who We Are</span>
            <h2 className="font-display text-[2rem] lg:text-[2.25rem] font-bold text-farm-dark leading-[1.15] tracking-tight">
              Raising Poultry With <span className="text-farm-green">Passion & Care</span>
            </h2>
            <p className="text-farm-gray leading-[1.8] text-[15px]">
              Founded in 2019, GreenFields Poultry Farm started with a simple mission: to provide fresh, healthy, and ethically raised poultry to our community. What began as a small backyard venture has grown into a trusted farm serving over 1,200 happy customers.
            </p>
            <p className="text-farm-gray leading-[1.8] text-[15px]">
              Our chickens roam freely on open pastures, fed with natural grains and raised without antibiotics or growth hormones. We believe in sustainable farming that respects both the animals and the environment.
            </p>
            <div className="flex gap-4 pt-3">
              <a href="/shop" className="btn-primary bg-[#2D5A27] text-white px-8 py-3.5 rounded-xl text-[14px] font-semibold shadow-lg shadow-[#2D5A27]/25 tracking-wide hover:bg-[#1E3D1A] transition-all duration-300">
                Our Products
              </a>
              <a href="/contact" className="btn-outline border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl text-[14px] font-semibold hover:border-[#2D5A27] hover:text-[#2D5A27] tracking-wide transition-all duration-300">
                Get In Touch
              </a>
            </div>
          </div>
          <div ref={addRevealRef} className="reveal-right rounded-[28px] overflow-hidden shadow-2xl shadow-gray-200/60 border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80"
              alt="Our Farm"
              className="w-full h-[520px] object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-28">
          {[
            { num: '5+', label: 'Years Experience', desc: 'Serving the community' },
            { num: '1,200+', label: 'Happy Customers', desc: 'And growing every day' },
            { num: '100%', label: 'Organic Feed', desc: 'No chemicals ever' },
          ].map((stat, i) => (
            <div
              key={i}
              ref={addRevealRef}
              className="reveal feature-card bg-farm-warm rounded-[28px] p-9 text-center border border-gray-100/80"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="text-[2.5rem] font-bold text-farm-green font-display leading-none">{stat.num}</div>
              <div className="text-farm-dark font-semibold mt-3 text-[16px]">{stat.label}</div>
              <div className="text-farm-gray text-[13px] mt-1.5">{stat.desc}</div>
            </div>
          ))}
        </div>

        <div ref={addRevealRef} className="reveal mt-28 text-center">
          <div className="gold-line justify-center mb-5">
            <span className="text-farm-gold text-[12px] font-semibold tracking-[0.28em] uppercase">Our Values</span>
          </div>
          <h2 className="font-display text-[2rem] font-bold text-farm-dark mt-5 mb-14">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Quality First', desc: 'We never compromise on the quality of our poultry products.', icon: '✦' },
              { title: 'Sustainability', desc: 'Our farming practices are designed to be environmentally friendly.', icon: '✦' },
              { title: 'Customer Trust', desc: 'We build lasting relationships through transparency and honesty.', icon: '✦' },
            ].map((val, i) => (
              <div key={i} className="feature-card elegant-border bg-white rounded-[28px] p-9 border border-gray-100">
                <div className="w-14 h-14 bg-farm-gold/[0.08] rounded-[18px] flex items-center justify-center mx-auto mb-6">
                  <span className="text-farm-gold text-xl">{val.icon}</span>
                </div>
                <h3 className="font-semibold text-farm-dark text-[17px] mb-3">{val.title}</h3>
                <p className="text-farm-gray text-[14px] leading-[1.7]">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
