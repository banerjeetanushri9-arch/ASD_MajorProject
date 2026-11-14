// src/App.jsx — Root component with routing setup.
// Uses React Router v6. Routes: home, overview, how-it-works, materials, admin login/dashboard.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Overview from './pages/Overview'
import HowItWorks from './pages/HowItWorks'
import Materials from './pages/Materials'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Simple session-based auth guard using localStorage
function RequireAuth({ children }) {
  const isAdmin = localStorage.getItem('ghardrishya_admin') === 'true'
  return isAdmin ? children : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/overview"        element={<Overview />} />
          <Route path="/how-it-works"    element={<HowItWorks />} />
          <Route path="/materials"       element={<Materials />} />
          <Route path="/admin"           element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          {/* Catch-all → Home */}
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
