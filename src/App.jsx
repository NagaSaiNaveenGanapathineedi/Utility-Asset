import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserDashboard from './components/user/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import SupervisorDashboard from './components/supervisor/SupervisorDashboard';
import TechnicianDashboard from './components/technician/TechnicianDashboard';
import ScrollToTop from './components/ScrollToTop';


// Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// App Content Component (inside Router)
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check localStorage on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Persist to localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('Logout function called - clearing authentication');
    setIsAuthenticated(false);
    setUser(null);
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    // Navigate to landing page
    navigate('/', { replace: true });
    console.log('Logout completed - user redirected to landing page');
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasPermission }}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : 
            user?.role === 'admin' ? <Navigate to="/admin-dashboard" /> :
            user?.role === 'supervisor' ? <Navigate to="/supervisor-dashboard" /> :
            user?.role === 'technician' ? <Navigate to="/technician-dashboard" /> :
            <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <RegisterPage /> : 
            user?.role === 'admin' ? <Navigate to="/admin-dashboard" /> :
            user?.role === 'supervisor' ? <Navigate to="/supervisor-dashboard" /> :
            user?.role === 'technician' ? <Navigate to="/technician-dashboard" /> :
            <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/forgot-password" 
          element={!isAuthenticated ? <ForgotPasswordPage /> : 
            user?.role === 'admin' ? <Navigate to="/admin-dashboard" /> :
            user?.role === 'supervisor' ? <Navigate to="/supervisor-dashboard" /> :
            user?.role === 'technician' ? <Navigate to="/technician-dashboard" /> :
            <Navigate to="/dashboard" />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <UserDashboard /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/admin-dashboard" 
          element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/supervisor-dashboard" 
          element={isAuthenticated && user?.role === 'supervisor' ? <SupervisorDashboard /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/technician-dashboard" 
          element={isAuthenticated && user?.role === 'technician' ? <TechnicianDashboard /> : <Navigate to="/" replace />} 
        />

        
        {/* Default Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? 
            user?.role === 'admin' ? <Navigate to="/admin-dashboard" /> :
            user?.role === 'supervisor' ? <Navigate to="/supervisor-dashboard" /> :
            user?.role === 'technician' ? <Navigate to="/technician-dashboard" /> :
            <Navigate to="/dashboard" /> : 
            <LandingPage />} 
        />
        <Route 
          path="*" 
          element={isAuthenticated ? 
            user?.role === 'admin' ? <Navigate to="/admin-dashboard" /> :
            user?.role === 'supervisor' ? <Navigate to="/supervisor-dashboard" /> :
            user?.role === 'technician' ? <Navigate to="/technician-dashboard" /> :
            <Navigate to="/dashboard" /> : 
            <Navigate to="/login" />} 
        />
      </Routes>
    </AuthContext.Provider>
  );
}

// Main App Component
export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
} 