import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import WorkerOverview from './WorkerOverview'
import WorkerOrders from './WorkerOrders'

function WorkerDashboard() {
  const navItems = [
    { path: '/worker', label: 'Overview', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
    { path: '/worker/orders', label: 'Orders', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<WorkerOverview />} />
        <Route path="orders" element={<WorkerOrders />} />
      </Routes>
    </DashboardLayout>
  )
}

export default WorkerDashboard
