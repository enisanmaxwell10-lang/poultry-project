import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const scrollY = window.scrollY
      const bg = sectionRef.current.querySelector('.hero-bg')
      if (bg) {
        bg.style.transform = `translateY(${scrollY * 0.25}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 hero-overlay" />

      {/* Glow Orbs */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute top-32 left-20 w-80 h-80 bg-farm-gold rounded-full blur-[100px]" />
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-farm-green rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">

          {/* Left — Text */}
          <div className="flex-1 max-w-2xl space-y-8">

            {/* Badge */}
            <div className="animate-fade-in-up flex items-center ml-12 gap-4">
              <div className="w-8 h-[2px] bg-gradient-to-r from-farm-gold to-farm-gold-light rounded-full" />
              <span className="text-farm-gold text-[12px] font-semibold tracking-[0.28em] uppercase">
                Fresh From Our Farm
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up-delay font-normal ml-12   lg:text-[4.5rem]  text-white leading-[1.05] tracking-[-0.02em] text-shadow-hero">
              Quality Poultry,{' '}
              <span className="text-farm-gold gap-3">Raised With</span>{' '}
              Care.
            </h1>

            {/* Sub */}
            <p className="animate-fade-in-up-delay-2 ml-12 text-white/60 text-lg max-w-lg leading-[1.75]">
              Fresh, healthy and carefully raised poultry delivered from our farm to your doorstep.
            </p>

            {/* Buttons */}
            <div className="animate-fade-in-up-delay-3 flex flex-wrap gap-4 ml-12">
              <Link
                to="/shop"
                className="btn-primary inline-flex items-center justify-center bg-[#C9A84C] text-white px-10 py-[18px] rounded-2xl font-bold text-[15px] tracking-wide shadow-xl shadow-[#C9A84C]/25 hover:shadow-[#C9A84C]/40 hover:bg-[#B8943A] active:scale-[0.97] transition-all duration-300"
              >
                Shop Poultry
              </Link>
              <Link
                to="/about"
                className="btn-outline inline-flex items-center justify-center border-[1.5px] border-white/30 text-white px-10 py-[18px] rounded-2xl font-bold text-[15px] tracking-wide backdrop-blur-sm hover:border-white/50 hover:bg-white/5 active:scale-[0.97] transition-all duration-300"
              >
                Explore Our Farm
              </Link>
            </div>
          </div>

          {/* Right — Stats Card */}
          <div className="animate-scale-in flex-shrink-0">
            <div className="stats-glow glass-card rounded-[22px] p-5 grid grid-cols-2 gap-x-8 gap-y-4 mr-12 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12]">
              {[
                { num: '5+', label: 'Years Experience' },
                { num: '1,200+', label: 'Happy Customers' },
                { num: '3', label: 'Poultry Types' },
                { num: '100%', label: 'Farm Direct' },
              ].map((stat, i) => (
                <div key={i} className="text-center cursor-default py-1">
                  <div className="text-[1.5rem] font-bold text-farm-gold leading-none">
                    {stat.num}
                  </div>
                  <div className="text-white/40 text-[11px] mt-2.5 tracking-[0.06em]  font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center scroll-indicator">
        <div className="text-white/35 text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold">Scroll</div>
        <div className="relative w-[1.5px] h-10 bg-white/15 rounded-full mx-auto overflow-hidden">
          <div className="scroll-line absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </div>
      </div>
    </section>
  )
}

export default Hero
