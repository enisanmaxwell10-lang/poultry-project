import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function DashboardLayout({ children, navItems }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2D5A27] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 12C17.5 14.5 15.5 16.5 13 16.5H11C8.5 16.5 6.5 14.5 6.5 12V6C6.5 3.5 8.5 1.5 11 1.5H13C15.5 1.5 17.5 3.5 17.5 6V12Z"/>
                <path d="M12 16.5V22.5"/>
                <path d="M8 22.5H16"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[13px] text-[#1A1A1A] leading-tight">GreenFields</span>
              <span className="text-[#C9A84C] text-[8px] font-bold tracking-[0.2em] uppercase mt-0.5">Premium Poultry</span>
            </div>
          </Link>
          <button
            className="lg:hidden text-[#6B7280] p-1"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27] font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#9CA3AF] truncate capitalize">{user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'branch_admin' ? 'Branch Admin' : user?.role === 'worker' ? 'Worker' : 'Member'}</p>
              {user?.branch_id && <p className="text-[10px] text-[#C9A84C] truncate">{user.branch_id.replace(/-/g, ' ')}</p>}
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[#2D5A27] text-white shadow-md shadow-[#2D5A27]/15'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1A1A1A]'
                }`}
              >
                <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <span>{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="ml-auto bg-[#C9A84C] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7280] hover:bg-gray-50 hover:text-[#1A1A1A] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7280] hover:bg-red-50 hover:text-red-500 w-full transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 bg-[#FAF8F5]/85 backdrop-blur border-b border-gray-100">
          <div className="flex items-center justify-between px-4 sm:px-8 py-3">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-[#1A1A1A] p-2 -ml-2"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[#6B7280] hover:text-[#2D5A27] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to website</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2D5A27] hover:gap-3 transition-all duration-200"
            >
              Visit shop
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
