import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminHeader from './AdminHeader';
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  Database, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  UserCheck,
  Wrench
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top when tab changes
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      const dashboardContent = document.getElementById('admin-dashboard-content');
      if (dashboardContent) {
        dashboardContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50);

    return () => clearTimeout(scrollTimer);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'assets':
        return <AssetManagement />;
      case 'reports':
        return <SystemReports />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="app-container">
      {/* Admin Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ 
            color: 'var(--status-completed-text)', 
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0
          }}>
            Admin Panel
          </h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {[
              { id: 'overview', label: 'System Overview', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'assets', label: 'Asset Management', icon: Database },
              { id: 'reports', label: 'System Reports', icon: TrendingUp },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => handleTabChange(id)}
                  className={activeTab === id ? 'active' : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} />
                    {label}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content-wrapper">
        <AdminHeader />
        
        <main className="main-content-area" id="admin-dashboard-content">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>System Overview</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Administrative dashboard for system monitoring and management
    </p>

    {/* Stats Grid */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '40px'
    }}>
      {[
        { icon: Users, label: 'Total Users', value: '284', color: 'var(--color-light-primary)' },
        { icon: Database, label: 'Total Assets', value: '1,247', color: 'var(--status-completed-text)' },
        { icon: AlertTriangle, label: 'Pending Requests', value: '23', color: 'var(--status-in-progress-text)' },
        { icon: CheckCircle, label: 'Completed Today', value: '156', color: 'var(--status-completed-text)' }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <stat.icon size={32} style={{ color: stat.color, marginBottom: '12px' }} />
          <h3 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--color-text-dark)', 
            margin: '0 0 8px 0' 
          }}>
            {stat.value}
          </h3>
          <p style={{ 
            color: 'var(--color-text-medium)', 
            margin: 0, 
            fontSize: '0.9rem' 
          }}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>

    {/* Recent Activity */}
    <h3 style={{ 
      color: 'var(--color-text-dark)', 
      marginBottom: '20px',
      fontSize: '1.3rem'
    }}>
      Recent System Activity
    </h3>
    <div style={{ 
      background: 'var(--color-white)', 
      border: '1px solid var(--color-border-light)', 
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {[
        { action: 'New user registered', user: 'john.doe@company.com', time: '2 minutes ago', icon: UserCheck },
        { action: 'Asset maintenance completed', user: 'Pump System #PS-001', time: '15 minutes ago', icon: Wrench },
        { action: 'System backup completed', user: 'Automated Task', time: '1 hour ago', icon: Shield },
        { action: 'New asset request submitted', user: 'sarah.wilson@company.com', time: '2 hours ago', icon: Clock }
      ].map((activity, index) => (
        <div 
          key={index}
          style={{
            padding: '16px 20px',
            borderBottom: index < 3 ? '1px solid var(--color-border-light)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <activity.icon size={20} style={{ color: 'var(--status-completed-text)' }} />
          <div style={{ flex: 1 }}>
            <p style={{ 
              margin: 0, 
              fontWeight: '500', 
              color: 'var(--color-text-dark)' 
            }}>
              {activity.action}
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem', 
              color: 'var(--color-text-medium)' 
            }}>
              {activity.user}
            </p>
          </div>
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'var(--color-text-light)' 
          }}>
            {activity.time}
          </span>
        </div>
      ))}
    </div>
  </motion.div>
);

// User Management Component
const UserManagement = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>User Management</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Manage system users, roles, and permissions
    </p>

    <div style={{ 
      background: 'var(--color-white)', 
      border: '1px solid var(--color-border-light)', 
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <Users size={48} style={{ color: 'var(--color-text-medium)', marginBottom: '16px' }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>User Management Features</h3>
      <p style={{ color: 'var(--color-text-medium)' }}>
        Advanced user management capabilities would be implemented here, including user creation, role assignment, and permission management.
      </p>
    </div>
  </motion.div>
);

// Asset Management Component
const AssetManagement = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Asset Management</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      System-wide asset monitoring and management tools
    </p>

    <div style={{ 
      background: 'var(--color-white)', 
      border: '1px solid var(--color-border-light)', 
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <Database size={48} style={{ color: 'var(--color-text-medium)', marginBottom: '16px' }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Asset Management Tools</h3>
      <p style={{ color: 'var(--color-text-medium)' }}>
        Comprehensive asset management features including inventory tracking, maintenance scheduling, and lifecycle management.
      </p>
    </div>
  </motion.div>
);

// System Reports Component
const SystemReports = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>System Reports</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Advanced analytics and reporting dashboard
    </p>

    <div style={{ 
      background: 'var(--color-white)', 
      border: '1px solid var(--color-border-light)', 
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <TrendingUp size={48} style={{ color: 'var(--color-text-medium)', marginBottom: '16px' }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Advanced Analytics</h3>
      <p style={{ color: 'var(--color-text-medium)' }}>
        Detailed system reports, performance analytics, and business intelligence dashboards for informed decision-making.
      </p>
    </div>
  </motion.div>
);

// System Settings Component
const SystemSettings = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>System Settings</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Configure system-wide settings and preferences
    </p>

    <div style={{ 
      background: 'var(--color-white)', 
      border: '1px solid var(--color-border-light)', 
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <Settings size={48} style={{ color: 'var(--color-text-medium)', marginBottom: '16px' }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>System Configuration</h3>
      <p style={{ color: 'var(--color-text-medium)' }}>
        System-wide configuration options, security settings, backup management, and integration configurations.
      </p>
    </div>
  </motion.div>
);

export default AdminDashboard; 