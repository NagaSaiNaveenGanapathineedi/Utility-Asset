import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../App';
import Modal from '../Modal';
import { LogOut, User, ChevronDown, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import './UserHeader.css';

const UserHeader = () => {
  const { user, logout } = useAuth();
  //console.log(user)
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = useCallback(() => {
    setShowDropdown(false);
    logout();
  }, [logout]);

  const toggleDropdown = useCallback(() => setShowDropdown(prev => !prev), []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const roleDisplay = useMemo(() => {
    const roles = { user: 'User', technician: 'Technical Specialist', supervisor: 'Operations Supervisor', admin: 'System Administrator' };
    return roles[user?.role] || 'User';
  }, [user?.role]);

  return (
    <header className="top-header">
      <div>
        <div className="user-header-greeting">
          {greeting}, {user?.name || 'User'}
        </div>
        <div className="user-header-role">
          {roleDisplay}
        </div>
      </div>
      
      <div className="user-header-dropdown-container">
        <button onClick={toggleDropdown} className="user-header-profile-btn">
          <div className="user-header-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-header-user-info">
            <div className="user-header-name">{user?.name || 'User'}</div>
            <div className="user-header-role-text">{roleDisplay}</div>
          </div>
          <ChevronDown size={16} className={`user-header-chevron ${showDropdown ? 'rotated' : ''}`} />
        </button>

        {showDropdown && (
          <div className="user-header-dropdown">
            <div className="user-header-dropdown-info">
              <div className="user-header-dropdown-name">{user?.name || 'User'}</div>
              <div className="user-header-dropdown-email">{user?.email || 'user@example.com'}</div>
            </div>
            <div className="user-header-dropdown-menu">
              <button onClick={() => { setShowProfile(true); setShowDropdown(false); }} className="user-header-dropdown-btn profile">
                <User size={16} />
                My Profile
              </button>
              <button onClick={handleLogout} className="user-header-dropdown-btn logout">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} title="My Profile" maxWidth="600px">
        <div className="profile-modal-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="profile-name">{user?.name || 'User Name'}</h3>
              <p className="profile-role">{roleDisplay}</p>
              <p className="profile-id">Employee ID: {"USR-"+user?.id || 'EMP001'}</p>
            </div>
          </div>
          <div className="profile-sections">
            <div className="profile-section">
              <h4 className="profile-section-title">Contact Information</h4>
              <div className="profile-items">
                {[{icon: Mail, label: 'Email', value: user?.email || 'user@company.com'}, {icon: Phone, label: 'Phone', value: "+91-"+user?.phno || '+1 (555) 123-4567'}, {icon: MapPin, label: 'Location', value: user?.location || 'N/A'}].map(({icon: Icon, label, value}) => (
                  <div key={label} className="profile-item">
                    <Icon size={16} className="profile-item-icon" />
                    <div><p className="profile-item-label">{label}</p><p className="profile-item-value">{value}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="profile-section">
              <h4 className="profile-section-title">Work Information</h4>
              <div className="profile-items">
                {[{icon: User, label: 'Department', value: user?.department || 'User Operations'}, {icon: Calendar, label: 'Region', value: user?.region || 'Main Building, Floor 5'}, {icon: MapPin, label: 'Pincode', value: user?.pincode || 'Main Building, Floor 5'}].map(({icon: Icon, label, value}) => (
                  <div key={label} className="profile-item">
                    <Icon size={16} className="profile-item-icon" />
                    <div><p className="profile-item-label">{label}</p><p className="profile-item-value">{value}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default UserHeader;