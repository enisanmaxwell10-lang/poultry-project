import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import UserOverview from './UserOverview'
import UserProfile from './UserProfile'
import UserOrders from './UserOrders'
import UserCart from './UserCart'
import { useCart } from '../../context/CartContext'

function UserDashboard() {
  const { count } = useCart()

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
    { path: '/dashboard/profile', label: 'Profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
    { path: '/dashboard/orders', label: 'Orders', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
    { path: '/dashboard/cart', label: 'Cart', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>', badge: count },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<UserOverview />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="cart" element={<UserCart />} />
      </Routes>
    </DashboardLayout>
  )
}

export default UserDashboard