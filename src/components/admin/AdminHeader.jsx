import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { 
  LogOut, 
  User, 
  ChevronDown
} from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    console.log('Admin logout clicked');
    setShowProfileDropdown(false);
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

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="top-header" style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}>
        <div style={{
          fontSize: '1.3rem',
          fontWeight: '600',
          color: 'white',
          letterSpacing: '0.5px'
        }}>
          {getCurrentTimeGreeting()}, {user?.name || 'Administrator'}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.75)',
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          System Administrator • {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {/* Admin Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
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
              padding: '8px 16px',
              color: 'var(--color-text-on-dark)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--status-open-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                System Admin
              </div>
            </div>
            <ChevronDown size={16} style={{
              transform: showProfileDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} />
          </button>

          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--color-white)',
                border: '1px solid var(--color-border-light)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                minWidth: '220px',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              {/* User Info */}
              <div style={{
                padding: '16px',
                borderBottom: '1px solid var(--color-border-light)',
                background: 'var(--status-open-bg)'
              }}>
                <div style={{ fontWeight: '600', color: 'var(--color-text-dark)' }}>
                  {user?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-medium)' }}>
                  {user?.email || 'admin@example.com'}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--status-open-text)',
                  fontWeight: '500',
                  marginTop: '4px'
                }}>
                  System Administrator
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '8px 0' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--color-text-dark)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-body-bg)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <User size={16} />
                  Admin Profile
                </button>

                <div style={{ 
                  height: '1px', 
                  background: 'var(--color-border-light)', 
                  margin: '8px 0' 
                }} />

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--status-open-text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--status-open-bg)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 