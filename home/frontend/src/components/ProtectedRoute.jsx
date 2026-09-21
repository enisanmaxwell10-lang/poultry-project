import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ role, roles, children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  const userRole = user?.role
  const allowedRoles = roles || (role ? [role] : null)

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const home =
      userRole === 'super_admin' ? '/super-admin' :
      userRole === 'branch_admin' ? '/branch-admin' :
      userRole === 'worker' ? '/worker' :
      '/dashboard'
    return <Navigate to={home} replace />
  }

  return children
}

export default ProtectedRoute
