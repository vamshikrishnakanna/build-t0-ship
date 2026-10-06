/**
 * client/src/App.jsx
 * Root application component.
 * Defines all routes and wraps protected routes with AuthGuard.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './context/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FarmsPage from './pages/FarmsPage';
import NewFarmPage from './pages/NewFarmPage';
import AdvisoryRequestPage from './pages/AdvisoryRequestPage';
import AdvisoryDetailPage from './pages/AdvisoryDetailPage';

// Layout
import AppLayout from './components/Layout/AppLayout';

/**
 * ProtectedRoute — Redirects to /login if the user is not authenticated.
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * PublicRoute — Redirects to /dashboard if the user is already logged in.
 */
function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected routes wrapped in AppLayout (sidebar + navbar) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/farms" element={<FarmsPage />} />
        <Route path="/farms/new" element={<NewFarmPage />} />
        <Route path="/advisory/request" element={<AdvisoryRequestPage />} />
        <Route path="/advisory/:id" element={<AdvisoryDetailPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
