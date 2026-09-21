import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import SuperAdminOverview from './SuperAdminOverview'
import SuperAdminBranches from './SuperAdminBranches'
import SuperAdminBranchDetail from './SuperAdminBranchDetail'

function SuperAdminDashboard() {
  const navItems = [
    { path: '/super-admin', label: 'Overview', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
    { path: '/super-admin/branches', label: 'Branches', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21V7l9-4 9 4v14"/><path d="M9 21V11h6v10"/></svg>' },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<SuperAdminOverview />} />
        <Route path="branches" element={<SuperAdminBranches />} />
        <Route path="branches/:branchId" element={<SuperAdminBranchDetail />} />
      </Routes>
    </DashboardLayout>
  )
}

export default SuperAdminDashboard
