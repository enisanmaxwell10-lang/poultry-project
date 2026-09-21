import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const FALLBACK_PRODUCTS = [
  { id: 'broiler-chicken', name: 'Broiler Chicken', weight: '1.5 - 2 kg', price: '₦4,500', img: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80', category: 'Chicken', tag: 'Best Seller' },
  { id: 'layer-chicken', name: 'Layer Chicken', weight: '2 - 2.5 kg', price: '₦5,200', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80', category: 'Chicken', tag: 'Popular' },
  { id: 'fresh-turkey', name: 'Fresh Turkey', weight: '4 - 6 kg', price: '₦12,000', img: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=80', category: 'Turkey', tag: 'Premium' },
  { id: 'day-old-chicks', name: 'Day Old Chicks', weight: 'Pack of 50', price: '₦15,000', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80', category: 'Chicks', tag: 'New' },
  { id: 'fresh-eggs', name: 'Fresh Eggs', weight: 'Crate (30)', price: '₦2,800', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80', category: 'Eggs', tag: 'Value' },
  { id: 'organic-chicken', name: 'Organic Chicken', weight: '2 - 3 kg', price: '₦7,000', img: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80', category: 'Chicken', tag: 'Organic' },
]

function Shop() {
  const { api } = useAuth()
  const { addToCart, branchId, setBranchId } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')
  const [products, setProducts] = useState([])
  const [branches, setBranches] = useState([])
  const revealRefs = useRef([])

  useEffect(() => {
    api('/shop/branches')
      .then((data) => {
        if (Array.isArray(data)) {
          setBranches(data)
          setBranchId((current) => current || data[0]?.id || null)
        }
      })
      .catch(() => setBranches([]))
  }, [api, setBranchId])

  useEffect(() => {
    const url = branchId ? `/shop/products?branch_id=${encodeURIComponent(branchId)}` : '/shop/products'
    api(url)
      .then((data) => {
        if (Array.isArray(data) && data.length) setProducts(data)
        else setProducts(FALLBACK_PRODUCTS)
      })
      .catch(() => setProducts(FALLBACK_PRODUCTS))
  }, [api, branchId])

  const categories = ['All', 'Chicken', 'Turkey', 'Chicks', 'Eggs']

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)

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
  }, [filtered])

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  return (
    <div className="pt-[88px] pb-20">
      <div className="page-header py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gold-line justify-center mb-5">
            <span className="text-farm-gold text-[12px] font-semibold tracking-[0.28em] uppercase">Our Products</span>
          </div>
          <h1 className="font-display text-4xl lg:text-[2.75rem] font-bold text-farm-dark mt-5 tracking-tight leading-tight">
            Shop <span className="text-farm-green">Poultry Products</span>
          </h1>
          <p className="text-farm-gray mt-5 max-w-2xl mx-auto text-[15px] leading-[1.7]">
            Browse our selection of farm-fresh poultry products. All raised naturally and delivered fresh.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {branches.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <label className="text-[12px] font-semibold text-farm-gray uppercase tracking-[0.12em]">Ordering from</label>
            <select
              value={branchId || ''}
              onChange={(e) => setBranchId(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-farm-dark outline-none focus:border-farm-green focus:ring-2 focus:ring-farm-green/10"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill px-7 py-2.5 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-350 ${
                activeCategory === cat
                  ? 'bg-farm-green text-white shadow-lg shadow-farm-green/25'
                  : 'border border-gray-200 text-farm-gray hover:border-farm-green hover:text-farm-green hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              ref={addRevealRef}
              className="reveal product-card card-shine bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="relative h-[290px] overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="product-img w-full h-full object-cover"
                />
                <div className="product-overlay absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="tag-badge text-white text-[10px] font-bold tracking-[0.1em] uppercase px-4 py-2 rounded-full">
                    {product.tag}
                  </span>
                </div>
                <div className="product-overlay absolute bottom-4 left-4 right-4">
                  <button className="w-full bg-white/[0.97] backdrop-blur-sm text-farm-dark py-3.5 rounded-2xl text-[13px] font-semibold hover:bg-white transition-colors">
                    Quick View
                  </button>
                </div>
              </div>
              <div className="p-7">
                <span className="text-farm-gold text-[10px] font-bold tracking-[0.2em] uppercase">{product.category}</span>
                <h3 className="font-semibold text-farm-dark text-[17px] mt-1.5">{product.name}</h3>
                <p className="text-farm-gray text-[13px] mt-1.5 tracking-wide">{product.weight}</p>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-farm-green font-bold text-xl tracking-tight">{product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary bg-[#2D5A27] text-white px-6 py-2.5 rounded-xl text-[12px] font-semibold shadow-md shadow-[#2D5A27]/15 tracking-wide hover:bg-[#1E3D1A] transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Shop
