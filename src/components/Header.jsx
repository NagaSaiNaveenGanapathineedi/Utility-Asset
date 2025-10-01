import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../App';
import { LogOut, User, ChevronDown } from 'lucide-react';
import './styles/components.css';

const ProfileButton = ({ user, onClick, isOpen }) => (
  <button onClick={onClick} className="profile-button">
    <div className="profile-avatar">
      <User size={16} />
    </div>
    <div className="profile-info">
      <p className="profile-name">{user?.name || 'Demo User'}</p>
      <p className="profile-role">{user?.role || 'user'}</p>
    </div>
    <ChevronDown size={14} className={`chevron ${isOpen ? 'open' : ''}`} />
  </button>
);

const DropdownMenu = ({ user, onClose, onLogout }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="dropdown-menu"
  >
    <div className="dropdown-header">
      <p className="dropdown-name">{user?.name || 'Demo User'}</p>
      <p className="dropdown-email">{user?.email || 'demo@example.com'}</p>
    </div>
    <button
      onClick={() => {
        onClose();
        alert('Profile settings coming soon!');
      }}
      className="dropdown-item"
    >
      <User size={14} />
      Profile Settings
    </button>
    <button onClick={onLogout} className="dropdown-item logout">
      <LogOut size={14} />
      Sign Out
    </button>
  </motion.div>
);

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = useCallback(() => {
    setShowDropdown(false);
    logout();
  }, [logout]);

  const toggleDropdown = useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <header className="top-header">
      <h1 className="header-title">Welcome to User Dashboard</h1>
      
      <div className="profile-dropdown-container">
        <ProfileButton 
          user={user} 
          onClick={toggleDropdown} 
          isOpen={showDropdown} 
        />
        {showDropdown && (
          <DropdownMenu 
            user={user} 
            onClose={() => setShowDropdown(false)} 
            onLogout={handleLogout} 
          />
        )}
      </div>
    </header>
  );
};

export default Header; 