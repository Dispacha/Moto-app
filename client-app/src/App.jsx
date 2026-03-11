import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import RideHistory from './components/RideHistory';
import { initiateSocket, disconnectSocket } from './services/socket';

// Composant de protection de routes
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initier Socket.IO quand l'utilisateur est authentifié
      initiateSocket(user.id);
    } else {
      disconnectSocket();
    }

    return () => {
      // Cleanup Socket.IO lors du démontage ou changement d'authentification
      if (!isAuthenticated) {
        disconnectSocket();
      }
    };
  }, [isAuthenticated, user]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        
        <Routes>
          {/* Routes publiques */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />

          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-neutral py-8 px-4">
                  <RideHistory />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}