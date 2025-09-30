import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../App';
import Modal from '../Modal';
import { LogOut, User, ChevronDown, Mail, Calendar, MapPin, Phone, Wrench } from 'lucide-react';
import './TechnicianHeader.css';

const TechnicianHeader = () => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = useCallback(() => {
    setShowProfileDropdown(false);
    logout();
  }, [logout]);

  const toggleDropdown = useCallback(() => setShowProfileDropdown(prev => !prev), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const currentDate = useMemo(() => new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  }), []);

  const userName = user?.name || 'Technician';
  const userEmail = user?.email || 'technician@example.com';
  const userInitial = user?.name?.charAt(0).toUpperCase() || 'T';

  return (
    <header className="top-header technician-header">
      <div className="technician-greeting">
        <div className="technician-greeting-text">
          {greeting}, {userName}
        </div>
        <div className="technician-subtitle">
          Field Technician • {currentDate}
        </div>
      </div>
      
      <div className="technician-actions">
        <div className="profile-dropdown-container">
          <button onClick={toggleDropdown} className="profile-button">
            <div className="profile-avatar">
              {userInitial}
            </div>
            <div className="profile-info">
              <div className="profile-name">{userName}</div>
              <div className="profile-role">Field Technician</div>
            </div>
            <ChevronDown size={16} className={`chevron-icon ${showProfileDropdown ? 'rotated' : ''}`} />
          </button>

          {showProfileDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="dropdown-menu"
            >
              <div className="dropdown-user-info">
                <div className="dropdown-user-name">{userName}</div>
                <div className="dropdown-user-email">{userEmail}</div>
                <div className="dropdown-user-role">Field Technician</div>
              </div>

              <div className="dropdown-menu-items">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowProfileDropdown(false);
                  }}
                  className="dropdown-menu-item"
                >
                  <User size={16} />
                  My Profile
                </button>

                <div className="dropdown-divider" />

                <button onClick={handleLogout} className="dropdown-menu-item logout">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="My Profile"
        maxWidth="600px"
      >
        <div className="modal-content">
          <div className="profile-header">
            <div className="profile-large-avatar">{userInitial}</div>
            <div className="profile-header-info">
              <h3>{user?.name || 'Technician Name'}</h3>
              <p className="profile-header-role">Field Technician</p>
              <p className="profile-header-id">Employee ID: {"TECH-"+user?.id || 'TECH001'}</p>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-section">
              <h4>Contact Information</h4>
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <Mail size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p className="profile-info-label">Email</p>
                    <p className="profile-info-value">{user?.email || 'technician@company.com'}</p>
                  </div>
                </div>
                <div className="profile-info-item">
                  <Phone size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p className="profile-info-label">Phone</p>
                    <p className="profile-info-value">{"+91-"+user?.phno || '+1 (555) 234-5678'}</p>
                  </div>
                </div>
                <div className="profile-info-item">
                  <MapPin size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p className="profile-info-label">Location</p>
                    <p className="profile-info-value">{user?.location || 'Field Operations'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4>Work Information</h4>
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <Wrench size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p className="profile-info-label">Department</p>
                    <p className="profile-info-value">{user?.department || 'Field Maintenance'}</p>
                  </div>
                </div>
                <div className="profile-info-item">
                  <Calendar size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p className="profile-info-label">Skill</p>
                    <p className="profile-info-value">{user?.skill || 'Mechanic'}</p>
                  </div>
                </div>
                <div className="profile-info-item">
                  <MapPin size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p className="profile-info-label">Service Area</p>
                    <p className="profile-info-value">{user?.region+", "+user?.pincode || 'North Region'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default TechnicianHeader; 