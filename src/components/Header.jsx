import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  LogOut, 
  User, 
  ChevronDown
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    console.log('Logout button clicked');
    
    // Close dropdown immediately
    setShowProfileDropdown(false);
    
    // Call logout function directly
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  return (
    <header className="top-header" style={{ width: '100%' }}>
      <h1 className="header-title">Welcome to User Dashboard</h1>
      
      {/* Profile Section */}
      <div className="profile-dropdown-container" style={{ position: 'relative' }}>
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: 'var(--color-text-on-dark)'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--color-light-primary)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={16} style={{ color: 'white' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ 
              margin: 0, 
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--color-text-on-dark)'
            }}>
              {user?.name || 'Demo User'}
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '400'
            }}>
              {user?.role || 'user'}
            </p>
          </div>
          <ChevronDown size={14} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
        </button>

        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              minWidth: '200px',
              zIndex: 1000,
              padding: '16px',
              background: 'transparent',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div style={{
              padding: '12px 0',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              marginBottom: '8px'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-text-dark)'
              }}>
                {user?.name || 'Demo User'}
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: '11px',
                color: 'var(--color-text-medium)',
                fontWeight: '400'
              }}>
                {user?.email || 'demo@example.com'}
              </p>
            </div>
            <button
              onClick={() => {
                setShowProfileDropdown(false);
                alert('Profile settings coming soon!');
              }}
              style={{
                width: '100%',
                marginBottom: '8px',
                justifyContent: 'flex-start',
                padding: '8px 12px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                color: 'var(--color-text-dark)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <User size={14} />
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '8px 12px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                color: '#dc2626'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 