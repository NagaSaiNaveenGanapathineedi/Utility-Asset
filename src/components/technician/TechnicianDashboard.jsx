import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TechnicianHeader from './TechnicianHeader';
import Modal from '../Modal';
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

export const  technicians = [
  { technicianId: 'T-001', name: 'Alice Johnson', skill: 'HVAC', region: 'North Zone' },
  { technicianId: 'T-002', name: 'Brian Smith', skill: 'Electrical', region: 'South Zone' },
  { technicianId: 'T-003', name: 'Carla Gomez', skill: 'Network', region: 'Central Zone' },
  { technicianId: 'T-004', name: 'David Lee', skill: 'Mechanical', region: 'East Zone' },
  { technicianId: 'T-005', name: 'Eva Patel', skill: 'HVAC', region: 'West Zone' },
  { technicianId: 'T-006', name: 'Frank Nguyen', skill: 'Generator', region: 'North Zone' },
  { technicianId: 'T-007', name: 'Grace Kim', skill: 'Fire Safety', region: 'Central Zone' },
  { technicianId: 'T-008', name: 'Hassan Ali', skill: 'Electrical', region: 'East Zone' }
];

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
        return <ReportsOverview />;
      case 'history':
        return <WorkHistory />;
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
              { id: 'history', label: 'Work History', icon: FileText },
              { id: 'reports', label: 'Reports', icon: BarChart3 }
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
  // Load assigned work orders from localStorage and filter by logged-in technician
  const [orders, setOrders] = useState([]);
  const [confirmStatusById, setConfirmStatusById] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('techConfirmStatusById') || '{}');
    } catch {
      return {};
    }
  });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    const loadOrders = () => {
      try {
        const all = JSON.parse(localStorage.getItem('assignedWorkOrders') || '[]');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const techId = user?.employeeId || user?.technicianId; // support either field if present
        const techName = user?.name;
        const mine = all.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName));

        // Hardcoded example work orders for this technician
        const hardcoded = techId || techName ? [
          { workId: 'HWO-101', description: 'Inspect rooftop ventilation system', priority: 'High', status: 'Assigned', scheduledDate: '2025-08-10', requestedBy: 'System', requestedById: 'SYS-001', assignedToId: techId || '', assignedTo: techName || '' },
          { workId: 'HWO-102', description: 'Test backup generator auto-start', priority: 'Medium', status: 'Open', scheduledDate: '2025-08-12', requestedBy: 'Operations', requestedById: 'OPS-002', assignedToId: techId || '', assignedTo: techName || '' },
          { workId: 'HWO-103', description: 'Replace server room air filter', priority: 'Low', status: 'Assigned', scheduledDate: '2025-08-15', requestedBy: 'IT Dept', requestedById: 'IT-003', assignedToId: techId || '', assignedTo: techName || '' }
        ] : [];

        // Merge by workId, preferring assigned entries
        const mergedMap = new Map();
        [...hardcoded, ...mine].forEach(o => { mergedMap.set(o.workId, o); });
        setOrders(Array.from(mergedMap.values()));
      } catch {
        setOrders([]);
      }
    };
    loadOrders();
    const handler = () => loadOrders();
    window.addEventListener('workOrdersUpdated', handler);
    return () => window.removeEventListener('workOrdersUpdated', handler);
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem('techConfirmStatusById', JSON.stringify(confirmStatusById)); } catch {}
  }, [confirmStatusById]);

  const handleConfirmSelect = (id, value) => {
    setConfirmStatusById(prev => ({ ...prev, [id]: value }));
  };
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };
  const handleStatusUpdate = (id) => {
    const selected = confirmStatusById[id];
    if (!selected) return;

    const originalOrder = orders.find(o => o.workId === id);

    // If marking as Done, record it under completed work orders
    if (selected === 'Done' && originalOrder) {
      try {
        const completed = JSON.parse(localStorage.getItem('completedWorkOrders') || '[]');
        const completedMap = new Map(completed.map(o => [o.workId, o]));
        completedMap.set(originalOrder.workId, { ...originalOrder, status: 'Done', completedAt: new Date().toISOString() });
        localStorage.setItem('completedWorkOrders', JSON.stringify(Array.from(completedMap.values())));
      } catch {}
    }

    setOrders(prev => prev.map(o => o.workId === id ? { ...o, status: selected } : o));
    // Persist to assignedWorkOrders, creating if missing
    try {
      const list = JSON.parse(localStorage.getItem('assignedWorkOrders') || '[]');
      const idx = list.findIndex(o => o.workId === id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], status: selected };
      } else if (originalOrder) {
        list.push({ ...originalOrder, status: selected });
      }
      localStorage.setItem('assignedWorkOrders', JSON.stringify(list));
    } catch {}
    setConfirmStatusById(prev => { const { [id]: _, ...rest } = prev; return rest; });
    // Notify other components/tabs
    try { window.dispatchEvent(new CustomEvent('workOrdersUpdated')); } catch {}
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress-text)' };
      case 'Pending':
        return { bg: 'var(--status-open-bg)', text: 'var(--status-open-text)' };
      case 'Assigned':
        return { bg: 'var(--status-completed-bg)', text: 'var(--status-completed-text)' };
      case 'Done':
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

  const pendingCount = orders.filter(o => o.status === 'Open' || o.status === 'Assigned').length;
  const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
  const doneTodayCount = 0; // placeholder, no completion timestamps yet

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

      {/* Work Orders List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {orders.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: 'var(--color-text-medium)',
            backgroundColor: 'var(--color-body-bg)',
            borderRadius: '8px'
          }}>
            No assigned work orders yet.
          </div>
        ) : (
          orders.filter(o => o.status !== 'Done').map((order) => (
            <motion.div
              key={order.workId}
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
                  {order.description}
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
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                  <strong>ID:</strong> {order.workId}
                </p>
                <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                  <strong>Scheduled:</strong> {order.scheduledDate}
                </p>
                <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                  <strong>Requested By:</strong> {order.requestedBy} ({order.requestedById})
                </p>
              </div>

              {/* Status update controls */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                <select
                  value={confirmStatusById[order.workId] || ''}
                  onChange={(e) => handleConfirmSelect(order.workId, e.target.value)}
                  style={{ ...{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', fontSize: '14px', fontWeight: '400', color: 'var(--color-text-dark)', backgroundColor: 'var(--color-white)', transition: 'all 0.2s ease', fontFamily: 'inherit', outline: 'none' }, maxWidth: '200px' }}
                >
                  <option value="">--select--</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}
                  disabled={!confirmStatusById[order.workId] || confirmStatusById[order.workId] === order.status}
                  onClick={() => handleStatusUpdate(order.workId)}
                >
                  Update
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '8px 16px', fontSize: '0.9rem' }}
                  onClick={() => handleViewDetails(order)}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        title={`Work Order ${selectedOrder?.workId || ''}`}
        maxWidth="650px"
      >
        {selectedOrder && (
          <div style={{ display: 'grid', gap: '10px' }}>
            <p><strong>Description:</strong> {selectedOrder.description}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Scheduled:</strong> {selectedOrder.scheduledDate}</p>
            <p><strong>Requested By:</strong> {selectedOrder.requestedBy} ({selectedOrder.requestedById})</p>
            {selectedOrder.assignedTo && (
              <p><strong>Assigned To:</strong> {selectedOrder.assignedTo} {selectedOrder.assignedToId ? `(${selectedOrder.assignedToId})` : ''}</p>
            )}
            {selectedOrder.priority && (
              <p><strong>Priority:</strong> {selectedOrder.priority}</p>
            )}
            <p><strong>Work ID:</strong> {selectedOrder.workId}</p>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

// Reports Overview (moved stats here)
const ReportsOverview = () => {
  const [orders, setOrders] = useState([]);
  const [completed, setCompleted] = useState([]);
  useEffect(() => {
    const load = () => {
      try {
        const all = JSON.parse(localStorage.getItem('assignedWorkOrders') || '[]');
        setOrders(Array.isArray(all) ? all : []);
      } catch {
        setOrders([]);
      }
      try {
        const done = JSON.parse(localStorage.getItem('completedWorkOrders') || '[]');
        setCompleted(Array.isArray(done) ? done : []);
      } catch {
        setCompleted([]);
      }
    };
    load();
    const handler = () => load();
    window.addEventListener('workOrdersUpdated', handler);
    return () => window.removeEventListener('workOrdersUpdated', handler);
  }, []);
  // Filter by current technician
  let techId = '';
  let techName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    techId = user?.employeeId || user?.technicianId || '';
    techName = user?.name || '';
  } catch {}
  const mineAssigned = orders.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName));
  const mineCompleted = completed.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName));

  const pendingCount = mineAssigned.filter(o => o.status === 'Open' || o.status === 'Assigned').length;
  const inProgressCount = mineAssigned.filter(o => o.status === 'In Progress').length;
  const totalCompleted = mineCompleted.length;
  const stats = [
    { icon: Clock, label: 'Pending', value: String(pendingCount), color: 'var(--status-open-text)' },
    { icon: Wrench, label: 'In Progress', value: String(inProgressCount), color: 'var(--status-in-progress-text)' },
    { icon: CheckCircle, label: 'Completed', value: String(totalCompleted), color: 'var(--status-completed-text)' }
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
      <h2 style={{ color: 'var(--color-text-dark)' }}>Reports & Analytics</h2>
      <p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Overview</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
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
    </motion.div>
  );
};

// Work History (moved from Reports content)
const WorkHistory = () => {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        const list = JSON.parse(localStorage.getItem('completedWorkOrders') || '[]');
        setCompleted(Array.isArray(list) ? list : []);
      } catch {
        setCompleted([]);
      }
    };
    load();
    const handler = () => load();
    window.addEventListener('workOrdersUpdated', handler);
    return () => window.removeEventListener('workOrdersUpdated', handler);
  }, []);

  if (completed.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 style={{ color: 'var(--color-text-dark)' }}>Work History</h2>
      <p style={{ 
        color: 'var(--color-text-medium)',
        fontSize: '1rem',
        marginBottom: '30px'
      }}>
        Completed work orders
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {completed.map((order) => (
          <div key={order.workId} style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h3 style={{ color: 'var(--color-text-dark)', margin: 0, fontSize: '1rem' }}>{order.description}</h3>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: 'var(--status-completed-bg)',
                color: 'var(--status-completed-text)'
              }}>Done</span>
            </div>
            <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>ID:</strong> {order.workId}</p>
            <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Scheduled:</strong> {order.scheduledDate}</p>
            <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Requested By:</strong> {order.requestedBy} ({order.requestedById})</p>
            {order.completedAt && (
              <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Completed:</strong> {new Date(order.completedAt).toLocaleString()}</p>
            )}
          </div>
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
const TechnicianReports = () => {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('completedWorkOrders') || '[]');
      setCompleted(Array.isArray(list) ? list : []);
    } catch {
      setCompleted([]);
    }
  }, []);

  return (
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
        Completed work orders
      </p>

      {completed.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--color-text-medium)',
          backgroundColor: 'var(--color-body-bg)',
          borderRadius: '8px'
        }}>
          <BarChart3 size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>No completed work orders</h3>
          <p>Completed items will appear here after you mark them as Done.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {completed.map((order) => (
            <div key={order.workId} style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border-light)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ color: 'var(--color-text-dark)', margin: 0, fontSize: '1rem' }}>{order.description}</h3>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  background: 'var(--status-completed-bg)',
                  color: 'var(--status-completed-text)'
                }}>Done</span>
              </div>
              <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>ID:</strong> {order.workId}</p>
              <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Scheduled:</strong> {order.scheduledDate}</p>
              <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Requested By:</strong> {order.requestedBy} ({order.requestedById})</p>
              {order.completedAt && (
                <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Completed:</strong> {new Date(order.completedAt).toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

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