import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const API_URL = 'http://127.0.0.1:8000'

function Navbar() {
  const { isAuthenticated, isAdmin, isSuperAdmin, isBranchAdmin, isWorker, logout } = useAuth()
  const { count, branchId, setBranchId } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [branches, setBranches] = useState([])
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    fetch(`${API_URL}/shop/branches`)
      .then((res) => res.json())
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]))
  }, [])

  const handleBranchChange = (id) => {
    if (id === branchId) return
    if (count > 0 && !confirm('Switching branch will clear your cart. Continue?')) return
    setBranchId(id)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const dashboardPath = isSuperAdmin ? '/super-admin' : isBranchAdmin ? '/branch-admin' : isWorker ? '/worker' : '/dashboard'

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-white shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
            : 'bg-white'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-[60px] ">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 ">
              <div className="w-[42px] h-[42px] px-2 bg-[#2D5A27] rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-105 shadow-sm">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 12C17.5 14.5 15.5 16.5 13 16.5H11C8.5 16.5 6.5 14.5 6.5 12V6C6.5 3.5 8.5 1.5 11 1.5H13C15.5 1.5 17.5 3.5 17.5 6V12Z"/>
                  <path d="M12 16.5V22.5"/>
                  <path d="M8 22.5H16"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[14px] text-[#1A1A1A] leading-tight tracking-tight">GreenFields</span>
                <span className="text-[#C9A84C] text-[9px] font-bold tracking-[0.2em] uppercase mt-0.5">Premium Poultry</span>
              </div>
            </Link>

            {/* Center Nav Links */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[15px] font-medium transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-[#2D5A27] font-semibold'
                      : 'text-[#4A4A4A] hover:text-[#2D5A27]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-[#1E3D1A] text-white text-[14px] font-semibold  rounded-xl w-25 h-9"
              >
                Shop Now
              </Link>

              {/* Branch Switcher */}
              {branches.length > 0 && (
                <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-gray-200 px-2.5 h-9">
                  <svg className="w-4 h-4 text-[#2D5A27] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <select
                    value={branchId || ''}
                    onChange={(e) => handleBranchChange(e.target.value)}
                    className="bg-transparent text-[13px] font-medium text-[#1A1A1A] outline-none cursor-pointer max-w-[130px]"
                  >
                    {!branchId && <option value="">Select branch</option>}
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Cart Icon */}
              <Link to={isAuthenticated ? '/dashboard/cart' : '/signin'} className="ml-2 text-[#4A4A4A] hover:text-[#2D5A27] transition-colors duration-300 p-2 relative">
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C9A84C] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link
                      to={dashboardPath}
                      className="text-[14px] font-medium text-[#C9A84C] hover:text-[#B8943A] transition-colors duration-300 px-4"
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      to={dashboardPath}
                      className="text-[14px] font-medium text-[#4A4A4A] hover:text-[#2D5A27] transition-colors duration-300 px-4"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className=" rounded-xl text-[13px] text-[#4A4A4A] border border-gray-200 px-4 h-9 inline-flex items-center justify-center hover:border-red-300 hover:text-red-600 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-[14px] font-medium text-[#4A4A4A] hover:text-[#2D5A27] transition-colors duration-300 px-6"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className=" rounded-xl text-[13px]  text-[#2D5A27] border-[1px] border-[#2D5A27] w-18 h-10 inline-flex items-center justify-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-[#1A1A1A] p-2 -mr-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="mobile-menu-enter absolute top-[60px] left-0 right-0 bg-white shadow-2xl">
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-[15px] font-medium py-3.5 px-5 rounded-xl transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-[#2D5A27] bg-[#2D5A27]/5'
                      : 'text-[#4A4A4A] hover:text-[#2D5A27] hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-5">
                <Link
                  to="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="block bg-[#2D5A27] text-white px-6 py-3.5 rounded-xl text-[14px] font-semibold text-center shadow-sm tracking-wide hover:bg-[#1E3D1A] transition-all duration-300"
                >
                  Shop Now
                </Link>
              </div>
              {branches.length > 0 && (
                <div className="pt-4 px-5">
                  <label className="block text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.15em] mb-2">Your Branch</label>
                  <select
                    value={branchId || ''}
                    onChange={(e) => handleBranchChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  >
                    {!branchId && <option value="">Select branch</option>}
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex items-center gap-6 pt-4 px-5">
                {isAuthenticated ? (
                  <>
                    <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="text-[14px] font-semibold text-[#2D5A27]">Dashboard</Link>
                    <button onClick={() => { logout(); setMobileOpen(false) }} className="text-[14px] font-medium text-red-500">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setMobileOpen(false)} className="text-[14px] font-medium text-[#4A4A4A]">Sign In</Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-[14px] font-semibold text-[#2D5A27]">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
