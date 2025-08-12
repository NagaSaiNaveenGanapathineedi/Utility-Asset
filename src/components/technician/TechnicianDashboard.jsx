import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TechnicianHeader from './TechnicianHeader';
import { 
  Wrench,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  Calendar,
  MapPin,
  User
} from 'lucide-react';

const TechnicianDashboard = () => {
  const [activeTab, setActiveTab] = useState('workOrders');

  // Scroll to top when tab changes
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      const dashboardContent = document.getElementById('technician-dashboard-content');
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
      case 'workOrders':
        return <WorkOrders />;
      case 'maintenance':
        return <MaintenanceSchedule />;
      case 'reports':
        return <TechnicianReports />;
      case 'profile':
        return <TechnicianProfile />;
      default:
        return <WorkOrders />;
    }
  };

  return (
    <div className="app-container">
      {/* Technician Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ 
            color: 'var(--status-completed-text)', 
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0
          }}>
            Technician Panel
          </h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {[
              { id: 'workOrders', label: 'Work Orders', icon: ClipboardList },
              { id: 'maintenance', label: 'Maintenance Schedule', icon: Calendar },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'profile', label: 'My Profile', icon: User }
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
        <TechnicianHeader />
        
        <main className="main-content-area" id="technician-dashboard-content">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

// Work Orders Component
const WorkOrders = () => {
  const workOrders = [
    {
      id: 'WO-001',
      title: 'HVAC System Maintenance',
      priority: 'High',
      status: 'In Progress',
      location: 'Building A - Rooftop',
      dueDate: '2024-02-15',
      estimatedTime: '4 hours'
    },
    {
      id: 'WO-002',
      title: 'Generator Inspection',
      priority: 'Medium',
      status: 'Pending',
      location: 'Building C - Basement',
      dueDate: '2024-02-16',
      estimatedTime: '2 hours'
    },
    {
      id: 'WO-003',
      title: 'Fire Safety System Check',
      priority: 'High',
      status: 'Assigned',
      location: 'Building A - All Floors',
      dueDate: '2024-02-14',
      estimatedTime: '6 hours'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress-text)' };
      case 'Pending':
        return { bg: 'var(--status-open-bg)', text: 'var(--status-open-text)' };
      case 'Assigned':
        return { bg: 'var(--status-completed-bg)', text: 'var(--status-completed-text)' };
      default:
        return { bg: 'var(--color-border-light)', text: 'var(--color-text-medium)' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'var(--status-open-text)';
      case 'Medium':
        return 'var(--status-in-progress-text)';
      case 'Low':
        return 'var(--status-completed-text)';
      default:
        return 'var(--color-text-medium)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 style={{ color: 'var(--color-text-dark)' }}>My Work Orders</h2>
      <p style={{ 
        color: 'var(--color-text-medium)',
        fontSize: '1rem',
        marginBottom: '30px'
      }}>
        Manage and update your assigned work orders
      </p>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[
          { icon: Clock, label: 'Pending', value: '2', color: 'var(--status-open-text)' },
          { icon: Wrench, label: 'In Progress', value: '1', color: 'var(--status-in-progress-text)' },
          { icon: CheckCircle, label: 'Completed Today', value: '3', color: 'var(--status-completed-text)' }
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border-light)',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            <stat.icon size={32} style={{ color: stat.color, marginBottom: '12px' }} />
            <h3 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: 'var(--color-text-dark)', 
              margin: '0 0 8px 0' 
            }}>
              {stat.value}
            </h3>
            <p style={{ color: 'var(--color-text-medium)', margin: 0, fontSize: '0.9rem' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Work Orders List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {workOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border-light)',
              borderRadius: '8px',
              padding: '20px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ color: 'var(--color-text-dark)', margin: 0, fontSize: '1.1rem' }}>
                {order.title}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  ...getStatusColor(order.status),
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {order.status}
                </span>
                <span style={{
                  color: getPriorityColor(order.priority),
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {order.priority}
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                <strong>ID:</strong> {order.id}
              </p>
              <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} />
                {order.location}
              </p>
              <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                <strong>Due:</strong> {order.dueDate}
              </p>
              <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                <strong>Est. Time:</strong> {order.estimatedTime}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '8px 16px', fontSize: '0.9rem' }}
              >
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '8px 16px', fontSize: '0.9rem' }}
              >
                Update Status
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Maintenance Schedule Component
const MaintenanceSchedule = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Maintenance Schedule</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      View upcoming maintenance tasks and schedules
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Maintenance Calendar</h3>
      <p>View scheduled maintenance tasks and preventive maintenance plans.</p>
    </div>
  </motion.div>
);

// Technician Reports Component
const TechnicianReports = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Reports & Analytics</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      View work completion reports and performance metrics
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <BarChart3 size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Performance Reports</h3>
      <p>Track your work completion rates, response times, and performance metrics.</p>
    </div>
  </motion.div>
);

// Technician Profile Component
const TechnicianProfile = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>My Profile</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      View and update your profile information and certifications
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <User size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Technician Profile</h3>
      <p>Manage your personal information, skills, and certifications.</p>
    </div>
  </motion.div>
);

export default TechnicianDashboard; 