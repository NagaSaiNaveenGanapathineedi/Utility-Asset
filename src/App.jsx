import { useState, useEffect, createContext, useContext } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserDashboard from './components/user/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import SupervisorDashboard from './components/supervisor/SupervisorDashboard';
import TechnicianDashboard from './components/technician/TechnicianDashboard';
import ScrollToTop from './components/ScrollToTop';
import { AppDataProvider } from './context/AppDataContext.jsx';

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function roleToPath(role) {
  if (role === 'admin') return '/admin-dashboard';
  if (role === 'supervisor') return '/supervisor-dashboard';
  if (role === 'technician') return '/technician-dashboard';
  return '/dashboard';
}

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

// Public route wrapper: if already authenticated, redirect based on role
export function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={roleToPath(user?.role)} replace />;
  }
  return children;
}

// Protected route wrapper: requires authenticated user
export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Role-based wrapper
export function RequireRole({ role, children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== role) return <Navigate to={roleToPath(user?.role)} replace />;
  return children;
}

// Root layout used by data router
export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <AppDataProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </AppDataProvider>
    </>
  );
}

// Export pages to ease imports elsewhere if desired
export {
  LandingPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  UserDashboard,
  AdminDashboard,
  SupervisorDashboard,
  TechnicianDashboard
}; 