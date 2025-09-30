import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../App';
import Modal from '../Modal';
import { LogOut, User, ChevronDown, Mail, Calendar, MapPin, Phone, Book } from 'lucide-react';
import './SupervisorHeader.css';

const SupervisorHeader = () => {
  const { user, logout } = useAuth();
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

  return (
    <header className="top-header">
      <div>
        <div className="supervisor-header-greeting">
          {greeting}, {user?.name || 'Supervisor'}
        </div>
        <div className="supervisor-header-role">
          Maintenance Supervisor
        </div>
      </div>
      
      <div className="supervisor-header-dropdown-container">
        <button onClick={toggleDropdown} className="supervisor-header-profile-btn">
          <div className="supervisor-header-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="supervisor-header-user-info">
            <div className="supervisor-header-name">{user?.name || 'Supervisor'}</div>
            <div className="supervisor-header-role-text">Maintenance Supervisor</div>
          </div>
          <ChevronDown size={16} className={`supervisor-header-chevron ${showDropdown ? 'rotated' : ''}`} />
        </button>

        {showDropdown && (
          <div className="supervisor-header-dropdown">
            <div className="supervisor-header-dropdown-info">
              <div className="supervisor-header-dropdown-name">{user?.name || 'Supervisor'}</div>
              <div className="supervisor-header-dropdown-email">{user?.email || 'supervisor@example.com'}</div>
              <div className="supervisor-header-dropdown-role">Maintenance Supervisor</div>
            </div>
            <div className="supervisor-header-dropdown-menu">
              <button onClick={() => { setShowProfile(true); setShowDropdown(false); }} className="supervisor-header-dropdown-btn profile">
                <User size={16} />
                My Profile
              </button>
              <div className="supervisor-header-divider" />
              <button onClick={handleLogout} className="supervisor-header-dropdown-btn logout">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} title="Supervisor Profile" maxWidth="600px">
        <div className="supervisor-profile-modal-container">
          <div className="supervisor-profile-header">
            <div className="supervisor-profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h3 className="supervisor-profile-name">{user?.name || 'Supervisor Name'}</h3>
              <p className="supervisor-profile-role">Maintenance Supervisor</p>
              <p className="supervisor-profile-id">Employee ID: {"SUP-"+user?.id || 'SUP001'}</p>
            </div>
          </div>
          <div className="supervisor-profile-sections">
            <div className="supervisor-profile-section">
              <h4 className="supervisor-profile-section-title">Contact Information</h4>
              <div className="supervisor-profile-items">
                {[{icon: Mail, label: 'Email', value: user?.email || 'supervisor@company.com'}, {icon: Phone, label: 'Phone', value: "+91-"+user?.phno || '+1 (555) 234-5678'}, {icon: MapPin, label: 'Location', value: user?.location || 'Operations Center'}].map(({icon: Icon, label, value}) => (
                  <div key={label} className="supervisor-profile-item">
                    <Icon size={16} className="supervisor-profile-item-icon" />
                    <div><p className="supervisor-profile-item-label">{label}</p><p className="supervisor-profile-item-value">{value}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="supervisor-profile-section">
              <h4 className="supervisor-profile-section-title">Work Information</h4>
              <div className="supervisor-profile-items">
                {[{icon: User, label: 'Department', value: user?.department || 'Maintenance Operations'}, {icon: Book, label: 'Skill', value: user?.skill || 'March 10, 2022'}, {icon: MapPin, label: 'Region', value: user?.region+", "+user?.pincode || 'Maintenance Building, Floor 2'}].map(({icon: Icon, label, value}) => (
                  <div key={label} className="supervisor-profile-item">
                    <Icon size={16} className="supervisor-profile-item-icon" />
                    <div><p className="supervisor-profile-item-label">{label}</p><p className="supervisor-profile-item-value">{value}</p></div>
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

export default SupervisorHeader; 