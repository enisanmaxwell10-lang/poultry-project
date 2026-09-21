import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Contact from './pages/Contact'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import UserDashboard from './pages/user/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import BranchAdminDashboard from './pages/branchadmin/BranchAdminDashboard'
import WorkerDashboard from './pages/worker/WorkerDashboard'

const DASHBOARD_PREFIXES = ['/dashboard', '/admin', '/super-admin', '/branch-admin', '/worker']

function App() {
  const location = useLocation()
  const isDashboard = DASHBOARD_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          {!isDashboard && <Navbar />}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={['super_admin', 'branch_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/*"
                element={
                  <ProtectedRoute role="super_admin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/branch-admin/*"
                element={
                  <ProtectedRoute role="branch_admin">
                    <BranchAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/*"
                element={
                  <ProtectedRoute role="worker">
                    <WorkerDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {!isDashboard && <Footer />}
          {!isDashboard && <WhatsAppButton />}
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
