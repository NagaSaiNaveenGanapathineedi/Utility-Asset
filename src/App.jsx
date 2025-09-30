import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
 
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
 
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/', { replace: true });
  }, [navigate]);

  // Setup axios interceptor for 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout();
        }
        return Promise.reject(error);
      }
    );
 
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);
 
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
     
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
        }
      }
    };
   
    initializeAuth();
  }, []);
 
  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
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
 
  UserDashboard,
  AdminDashboard,
  SupervisorDashboard,
  TechnicianDashboard
};