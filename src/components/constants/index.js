// Role configurations
export const ROLE_TITLES = {
  user: 'User Panel',
  technician: 'Technician Panel',
  supervisor: 'Supervisor Panel',
  admin: 'Admin Panel'
};

export const ROLE_MESSAGES = {
  user: 'Monitor assets, submit requests, and track maintenance history',
  technician: 'Manage work orders, update maintenance status, and view assigned tasks',
  supervisor: 'Oversee maintenance operations, approve requests, and review team performance',
  admin: 'Full system access - manage users, assets, and system configuration'
};

export const ROLE_EMOJIS = {
  user: '👋',
  technician: '🔧',
  supervisor: '👨💼',
  admin: '⚡'
};

export const ROLE_STYLES = {
  admin: { bg: 'var(--status-open-bg)', color: 'var(--status-open-text)' },
  supervisor: { bg: 'var(--status-in-progress-bg)', color: 'var(--status-in-progress-text)' },
  technician: { bg: 'var(--status-completed-bg)', color: 'var(--status-completed-text)' },
  default: { bg: 'var(--color-border-light)', color: 'var(--color-text-medium)' }
};

// Animation configurations
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }
};

// Status configurations
export const STATUS_TYPES = {
  COMPLETED: 'Completed',
  ASSIGNED: 'Assigned',
  PENDING: 'Pending',
  NOT_ASSIGNED: 'Not Assigned'
};

// Common menu items
export const USER_MENU_ITEMS = [
  { id: 'assetInfo', label: 'Asset Information', icon: 'Info' },
  { id: 'assetRequest', label: 'Asset Request', icon: 'Plus' },
  { id: 'assetHistory', label: 'Asset History', icon: 'Activity' }
];

export const TECHNICIAN_MENU_ITEMS = [
  { id: 'workOrders', label: 'Work Orders', icon: 'ClipboardList' },
  { id: 'history', label: 'Work History', icon: 'FileText' },
  { id: 'reports', label: 'Reports', icon: 'BarChart3' },
  { id: 'profile', label: 'Profile', icon: 'User' }
];

// API endpoints base
export const API_BASE_URL = 'http://localhost:9092';

// Common utility functions
export const getDisplayName = (user) => user?.name || 'Demo User';
export const getDisplayEmail = (user) => user?.email || 'demo@example.com';
export const getRoleStyle = (role) => ROLE_STYLES[role] || ROLE_STYLES.default;