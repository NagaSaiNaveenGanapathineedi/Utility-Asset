import { motion } from 'framer-motion';
import { useAuth } from '../App';
import { User } from 'lucide-react';

const WelcomeMessage = () => {
  const { user } = useAuth();

  // Role-specific messages
  const getRoleMessage = (role) => {
    const messages = {
      user: 'Monitor assets, submit requests, and track maintenance history',
      technician: 'Manage work orders, update maintenance status, and view assigned tasks',
      supervisor: 'Oversee maintenance operations, approve requests, and review team performance',
      admin: 'Full system access - manage users, assets, and system configuration'
    };
    return messages[role] || messages.user;
  };

  const getRoleEmoji = (role) => {
    const emojis = {
      user: '👋',
      technician: '🔧', 
      supervisor: '👨‍💼',
      admin: '⚡'
    };
    return emojis[role] || emojis.user;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
      style={{ marginBottom: '30px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="auth-logo" style={{ margin: 0, width: '60px', height: '60px' }}>
          <User size={24} style={{ color: 'white' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--color-text-dark)',
            border: 'none',
            padding: 0
          }}>
            Welcome back, {user?.name || 'Demo User'}! {getRoleEmoji(user?.role)}
          </h2>
          <p style={{ 
            margin: '0 0 4px 0', 
            color: 'var(--color-text-medium)', 
            fontSize: '1rem'
          }}>
            {getRoleMessage(user?.role)}
          </p>
          {user?.role && (
            <span style={{
              display: 'inline-block',
              padding: '4px 8px',
              background: user?.role === 'admin' ? 'var(--status-open-bg)' : 
                         user?.role === 'supervisor' ? 'var(--status-in-progress-bg)' :
                         user?.role === 'technician' ? 'var(--status-completed-bg)' : 'var(--color-border-light)',
              color: user?.role === 'admin' ? 'var(--status-open-text)' : 
                     user?.role === 'supervisor' ? 'var(--status-in-progress-text)' :
                     user?.role === 'technician' ? 'var(--status-completed-text)' : 'var(--color-text-medium)',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {user.role}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage; 