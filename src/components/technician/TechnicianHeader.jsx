import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import Modal from '../Modal';
import { 
  LogOut, 
  User, 
  ChevronDown,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Wrench
} from 'lucide-react';

const TechnicianHeader = () => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    console.log('Technician logout clicked');
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
          {getCurrentTimeGreeting()}, {user?.name || 'Technician'}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.75)',
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Field Technician • {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {/* Technician Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Work Order Status */}
        
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
              background: 'var(--status-completed-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                {user?.name || 'Technician'}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                Field Technician
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
                background: 'var(--status-completed-bg)'
              }}>
                <div style={{ fontWeight: '600', color: 'var(--color-text-dark)' }}>
                  {user?.name || 'Technician'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-medium)' }}>
                  {user?.email || 'technician@example.com'}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--status-completed-text)',
                  fontWeight: '500',
                  marginTop: '4px'
                }}>
                  Field Technician
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '8px 0' }}>
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowProfileDropdown(false);
                  }}
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
                  My Profile
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

      {/* Technician Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="My Profile"
        maxWidth="600px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--status-completed-text), var(--color-light-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'white'
              }}>
                {user?.name || 'Technician Name'}
              </h3>
              <p style={{
                margin: '0 0 4px 0',
                color: 'var(--status-completed-text)',
                fontWeight: '500',
                fontSize: '1rem'
              }}>
                Field Technician
              </p>
              <p style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem'
              }}>
                Employee ID: {user?.employeeId || 'TECH001'}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            {/* Contact Information */}
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Contact Information
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Email</p>
                    <p style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>
                      {user?.email || 'technician@company.com'}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Phone</p>
                    <p style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>
                      {user?.phone || '+1 (555) 234-5678'}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Location</p>
                    <p style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>
                      {user?.location || 'Field Operations'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Work Information
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Wrench size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Department</p>
                    <p style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>
                      {user?.department || 'Field Maintenance'}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Join Date</p>
                    <p style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>
                      {user?.joinDate || 'March 10, 2023'}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={16} style={{ color: 'var(--status-completed-text)' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Service Area</p>
                    <p style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>
                      {user?.serviceArea || 'North Region'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications & Skills */}
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h4 style={{
              margin: '0 0 16px 0',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Certifications & Skills
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {[
                'HVAC Certified',
                'Electrical Systems',
                'Plumbing',
                'Safety Protocols',
                'Equipment Maintenance',
                'Emergency Response'
              ].map((skill, index) => (
                <span key={index} style={{
                  padding: '6px 12px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '16px',
                  color: 'rgb(34, 197, 94)',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </Modal>
    </header>
  );
};

export default TechnicianHeader; 