import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import FeaturesBar from '../components/FeaturesBar'

function Home() {
  const revealRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  return (
    <>
      <Hero />
      <FeaturesBar />

      <section className="bg-[#F4F2EA] relative overflow-hidden pt-12 pb-24">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={addRevealRef} className="reveal text-center mb-12">
            <div className="gold-line justify-center mb-2">
              <span className="text-farm-gold text-[11px] font-semibold tracking-[0.28em] uppercase">Our Products</span>
            </div>
            <h2 className="text-3xl lg:text-[2.25rem] font-normal text-farm-dark mt-2 tracking-tight leading-tight">
              Our Poultry Selection
            </h2>
            <p className="text-farm-gray mt-3 max-w-xl mx-auto text-[13px] leading-[1.7]">
              Choose from our carefully raised selection of quality poultry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                category: 'CHICKEN',
                name: 'Farm Chicken',
                img: 'https://images.unsplash.com/photo-1690756628737-558c3b9858b6?w=700&h=600&fit=crop&auto=format',
                desc: 'Healthy, naturally raised chickens from our farm. Available in multiple sizes.',
                price: '₦8,500',
                unit: 'per bird',
                inStock: true,
                tag: 'Best Seller',
              },
              {
                category: 'DUCK',
                name: 'Farm Duck',
                img: 'https://images.unsplash.com/photo-1534627760265-69713192ade4?w=700&h=600&fit=crop&auto=format',
                desc: 'Premium quality ducks raised in clean, natural environments with fresh water access.',
                price: '₦12,000',
                unit: 'per bird',
                inStock: true,
                tag: null,
              },
              {
                category: 'TURKEY',
                name: 'Farm Turkey',
                img: 'https://images.unsplash.com/photo-1686382717797-6058737f1a54?w=700&h=600&fit=crop&auto=format',
                desc: 'Premium farm turkeys, carefully raised for impressive size and outstanding quality.',
                price: '₦25,000',
                unit: 'per bird',
                inStock: true,
                tag: 'Premium',
              },
              {
                category: 'EGGS',
                name: 'Farm Fresh Eggs',
                img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=700&h=600&fit=crop&auto=format',
                desc: 'Fresh eggs collected daily from our free-range hens. Rich in nutrients and flavor.',
                price: '₦3,500',
                unit: 'per crate (30 eggs)',
                inStock: false,
                tag: 'Out of Stock',
              },
            ].map((product, i) => (
              <div
                key={i}
                ref={addRevealRef}
                className="reveal group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!product.inStock ? 'blur-sm' : ''}`}
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/20" />
                  )}
                  {product.tag && (
                    <div className={product.inStock ? 'absolute top-4 left-4' : 'absolute inset-0 flex items-center justify-center'}>
                      <span className={`text-white text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-lg ${product.inStock ? 'bg-[#B8943A]' : 'bg-[#1A2332]'}`}>
                        {product.tag}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <span className="text-[#C9A84C] text-[11px] font-semibold tracking-[0.15em] uppercase">
                    {product.category}
                  </span>
                  <h3 className="text-farm-dark text-lg font-semibold">{product.name}</h3>
                  <p className="text-farm-gray text-[13px] leading-relaxed">{product.desc}</p>
                  <div className="flex items-end justify-between mt-auto pt-2">
                    <div>
                      <span className="text-farm-green text-xl font-bold">{product.price}</span>
                      <span className="text-farm-gray text-[12px] block">{product.unit}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[12px] font-medium ${product.inStock ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {product.inStock ? 'In Stock' : 'Unavailable'}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      disabled={!product.inStock}
                      className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                        product.inStock
                          ? 'bg-farm-green text-white hover:bg-farm-green-dark active:scale-[0.97]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Add to Cart
                    </button>
                    <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-farm-gray hover:border-farm-green hover:text-farm-green transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-farm-green text-farm-green text-[14px] font-medium hover:bg-farm-green hover:text-white transition-all duration-300"
            >
              View All Products
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={addRevealRef} className="reveal-left relative">
              <img
                src="https://images.unsplash.com/photo-1731328966800-b677e4fcda8d?w=700&h=600&fit=crop&auto=format"
                alt="Farm chickens"
                className="w-full rounded-2xl object-cover aspect-[3/3]"
              />
              <div className="absolute bottom-[-20px] right-[-20px] bg-[#1e4c18] rounded-2xl px-5 py-5 text-white shadow-lg min-w-[160px]">
                <span className="text-3xl font-normal block leading-none">5+</span>
                <span className="text-[13px] leading-snug block mt-1">Years of quality<br/>farming</span>
              </div>
            </div>

            <div ref={addRevealRef} className="reveal-right flex flex-col gap-6">
              <div>
                <div className="gold-line gold-line-end-hidden mb-1">
                  <span className="text-farm-gold text-[13px] font-normal tracking-[0.28em] uppercase">Why Choose Us</span>
                </div>
                <h2 className="text-10xl lg:text-[2.40rem] font-normal text-farm-dark mt-2 tracking-tight leading-tight">
                  Why Customers <br /> Choose Us
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-farm-green" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-farm-dark font-normal text-[16px] mb-1">Raised With Care</h3>
                    <p className="text-farm-gray text-[14px] leading-relaxed">Our poultry is raised under proper care and management in a clean environment.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-farm-green" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-farm-dark font-normal text-[16px] mb-1">Quality You Can Trust</h3>
                    <p className="text-farm-gray text-[14px] leading-relaxed">We prioritize healthy and quality farm products at every stage of raising.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-farm-green" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-farm-dark font-normal text-[16px] mb-1">Farm Direct</h3>
                    <p className="text-farm-gray text-[14px] leading-relaxed">Buy directly from the farm without unnecessary middlemen or markups.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-farm-green" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-farm-dark font-normal text-[16px] mb-1">Convenient Ordering</h3>
                    <p className="text-farm-gray text-[14px] leading-relaxed">Order online and choose the payment option that works best for you.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-farm-green font-semibold text-[15px] border-b-2 border-farm-green pb-1 w-fit hover:gap-3 transition-all duration-300"
              >
                Learn More About Our Farm
                <span className="text-lg leading-none">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-farm-green relative overflow-hidden py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div ref={addRevealRef} className="reveal-left">
              <div className="gold-line gold-line-end-hidden gold-line-sm mb-4">
                <span className="text-farm-gold text-[12px] font-normal tracking-[0.28em] uppercase">Our Story</span>
              </div>
              <h2 className="text-white  lg:text-[2.2rem] font-normal leading-[1.15] tracking-tight">
                From Our Farm<br />To Your Table.
              </h2>
              <p className="text-white/85 text-[16px] leading-[1.8] mt-6">
                We started with a simple belief: that everyone deserves access to fresh, quality poultry raised with integrity. Our farm has grown over the years but our commitment to quality has never changed.
              </p>
              <p className="text-white/85 text-[16px] leading-[1.8] mt-6">
                Every chicken, duck, and turkey on our farm is raised in a clean environment, fed a proper diet, and monitored for health. When you order from us, you are buying directly from the people who raised your food.
              </p>

              <div className="flex gap-11 mt-10">
                <div>
                  <div className="text-farm-gold text-[2rem] font-normal leading-none">1,200+</div>
                  <div className="text-white/85 text-[15px] mt-2">Customers Served</div>
                </div>
                <div>
                  <div className="text-farm-gold text-[2rem] font-normal leading-none">99%</div>
                  <div className="text-white/85 text-[15px] mt-2">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            <div ref={addRevealRef} className="reveal-right flex gap-4">
              <div className="flex-1 flex flex-col gap-11">
                <img
                  src="https://images.unsplash.com/photo-1694854038360-56b29a16fb0c?w=400&h=350&fit=crop&auto=format"
                  alt="Baby chicks under a heat lamp"
                  className="rounded-2xl w-full h-[160px] sm:h-[220px] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1611751533601-f8d57715ad75?w=400&h=350&fit=crop&auto=format"
                  alt="Farm ducks"
                  className="rounded-2xl w-full h-[160px] sm:h-[180px] object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-11 mt-8 lg:mt-12">
                <img
                  src="https://images.unsplash.com/photo-1574387313309-7c2292978b8c?w=400&h=350&fit=crop&auto=format"
                  alt="Farm turkey"
                  className="rounded-2xl w-full h-[180px] sm:h-[220px] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1509099381441-ea3c0cf98b94?w=400&h=350&fit=crop&auto=format"
                  alt="Farmer tending crops"
                  className="rounded-2xl w-full h-[140px] sm:h-[170px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f1f1f0] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={addRevealRef} className="reveal text-center ">
            <div className="gold-line justify-center ">
              <span className="text-farm-gold text-[12px] tracking-[0.28em] uppercase">How It Works</span>
            </div>
            <h2 className="text-farm-dark text-[1rem] lg:text-[2.5rem] font-normal tracking-tight">
              Order In 4 Simple Steps
            </h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute inset-x-0 top-[78px] border-t-2 border-dashed border-[#D9D5CA]" />

            <div className="flex flex-wrap py-12 gap-8">
              {[
                {
                  title: 'Choose Your Poultry',
                  desc: 'Browse our available chicken, ducks, and turkey.',
                  icon: (
                    <svg className="w-5 h-5 text-farm-green-dark" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Add To Cart',
                  desc: 'Select your quantity and add products to your cart.',
                  icon: (
                    <svg className="w-5 h-5 text-farm-green-dark" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  ),
                },
                {
                  title: 'Choose Payment',
                  desc: 'Pay on delivery, bank transfer or card.',
                  icon: (
                    <svg className="w-5 h-5 text-farm-green-dark" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  ),
                },
                {
                  title: 'Receive Your Order',
                  desc: 'Our team processes and delivers your order safely.',
                  icon: (
                    <svg className="w-5 h-5 text-farm-green-dark" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  ),
                },
              ].map((step, i) => (
                <div
                  key={i}
                  ref={addRevealRef}
                  className="reveal relative z-10 bg-white rounded-2xl border border-gray-100 px-8 py-10 text-center flex-1 min-w-[220px]"
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div className="relative w-14 h-14 mx-auto rounded-2xl bg-[#E9F2E5] flex items-center justify-center">
                    {step.icon}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-farm-gold text-white text-[10px] font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="text-farm-gold text-[13px] tracking-[0.15em] mt-5">{`0${i + 1}`}</div>
                  <h3 className="text-farm-dark text-[19px] mt-3">{step.title}</h3>
                  <p className="text-farm-gray text-[14px] leading-[1.7] mt-3 max-w-[240px] mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home