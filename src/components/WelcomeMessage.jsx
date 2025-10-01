import { motion } from 'framer-motion';
import { useAuth } from '../App';
import { User } from 'lucide-react';
import { useMemo } from 'react';
import './styles/components.css';

const ROLE_MESSAGES = {
  user: 'Monitor assets, submit requests, and track maintenance history',
  technician: 'Manage work orders, update maintenance status, and view assigned tasks',
  supervisor: 'Oversee maintenance operations, approve requests, and review team performance',
  admin: 'Full system access - manage users, assets, and system configuration'
};

const ROLE_EMOJIS = {
  user: '👋',
  technician: '🔧',
  supervisor: '👨💼',
  admin: '⚡'
};

const ROLE_STYLES = {
  admin: { bg: 'var(--status-open-bg)', color: 'var(--status-open-text)' },
  supervisor: { bg: 'var(--status-in-progress-bg)', color: 'var(--status-in-progress-text)' },
  technician: { bg: 'var(--status-completed-bg)', color: 'var(--status-completed-text)' },
  default: { bg: 'var(--color-border-light)', color: 'var(--color-text-medium)' }
};

const RoleBadge = ({ role }) => {
  const style = ROLE_STYLES[role] || ROLE_STYLES.default;
  
  return (
    <span 
      className="role-badge"
      style={{
        display: 'inline-block',
        padding: '4px 8px',
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}
    >
      {role}
    </span>
  );
};

const WelcomeMessage = () => {
  const { user } = useAuth();

  const { message, emoji } = useMemo(() => ({
    message: ROLE_MESSAGES[user?.role] || ROLE_MESSAGES.user,
    emoji: ROLE_EMOJIS[user?.role] || ROLE_EMOJIS.user
  }), [user?.role]);

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
            Welcome back, {user?.name || 'Demo User'}! {emoji}
          </h2>
          <p style={{ 
            margin: '0 0 4px 0', 
            color: 'var(--color-text-medium)', 
            fontSize: '1rem'
          }}>
            {message}
          </p>
          {user?.role && <RoleBadge role={user.role} />}
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;