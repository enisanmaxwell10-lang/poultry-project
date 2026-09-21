import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import BranchAdminOverview from './BranchAdminOverview'
import BranchAdminProducts from './BranchAdminProducts'
import BranchAdminOrders from './BranchAdminOrders'
import BranchAdminWorkers from './BranchAdminWorkers'
import BranchAdminUsers from './BranchAdminUsers'

function BranchAdminDashboard() {
  const navItems = [
    { path: '/branch-admin', label: 'Overview', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
    { path: '/branch-admin/products', label: 'Products', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
    { path: '/branch-admin/orders', label: 'Orders', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' },
    { path: '/branch-admin/users', label: 'Users', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
    { path: '/branch-admin/workers', label: 'Workers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg>' },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<BranchAdminOverview />} />
        <Route path="products" element={<BranchAdminProducts />} />
        <Route path="orders" element={<BranchAdminOrders />} />
        <Route path="users" element={<BranchAdminUsers />} />
        <Route path="workers" element={<BranchAdminWorkers />} />
      </Routes>
    </DashboardLayout>
  )
}

export default BranchAdminDashboard
