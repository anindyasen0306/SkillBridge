import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import DashboardPage   from './pages/DashboardPage'
import AnalyzePage     from './pages/AnalyzePage'
import HistoryPage     from './pages/HistoryPage'
import AnalysisDetail  from './pages/AnalysisDetailPage'
import ProfilePage     from './pages/ProfilePage'
import DashboardLayout from './components/layout/DashboardLayout'
import Spinner         from './components/ui/Spinner'

// Guard: redirect to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  return user ? children : <Navigate to="/login" replace />
}

// Guard: redirect to /dashboard if already logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  return !user ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected — wrapped in sidebar layout */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index                    element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"         element={<DashboardPage />} />
        <Route path="analyze"           element={<AnalyzePage />} />
        <Route path="history"           element={<HistoryPage />} />
        <Route path="history/:id"       element={<AnalysisDetail />} />
        <Route path="profile"           element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
