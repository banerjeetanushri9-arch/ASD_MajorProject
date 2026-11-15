
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Overview from './pages/Overview'
import HowItWorks from './pages/HowItWorks'
import Materials from './pages/Materials'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserAuth from './pages/UserAuth'

// Common-user authentication guard
function RequireUser({ children }) {
  const token = localStorage.getItem('ghardrishya_user_token')
  return token ? children : <Navigate to="/" replace />
}

// Admin authentication guard
function RequireAuth({ children }) {
  const token = localStorage.getItem('ghardrishya_admin_token')
  return token ? children : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          {/* Common user login/signup */}
          <Route path="/" element={<UserAuth />} />

          {/* Existing main dashboard — Home.jsx remains unchanged */}
          <Route
            path="/dashboard"
            element={
              <RequireUser>
                <Home />
              </RequireUser>
            }
          />

          {/* Existing dashboard pages */}
          <Route path="/overview" element={<RequireUser><Overview /></RequireUser>} />
          <Route path="/how-it-works" element={<RequireUser><HowItWorks /></RequireUser>} />
          <Route path="/materials" element={<RequireUser><Materials /></RequireUser>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
