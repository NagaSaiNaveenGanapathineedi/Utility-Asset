import { useState, useEffect, useRef } from 'react';
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
import { useAppData } from '../../context/AppDataContext.jsx';
import { useAuth } from '../../App';

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
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'profile', label: 'Profile', icon: User }
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
  const { workOrders, setWorkOrders } = useAppData();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [confirmStatusById, setConfirmStatusById] = useState({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const seededRef = useRef(false);

  useEffect(() => {
    const techId = user?.employeeId || user?.technicianId;
    const techName = user?.name;
    const mine = workOrders.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName));
    if (!seededRef.current && mine.length === 0 && (techId || techName)) {
      const baseId = (techId || techName || 'TECH').toString().replace(/[^A-Za-z0-9]/g, '').slice(-6) || 'TECH';
      const dummies = [
        { workId: `HWO-${baseId}-01`, description: 'Inspect rooftop ventilation system', priority: 'High', status: 'Assigned', scheduledDate: '2025-08-10', requestedBy: 'System', requestedById: 'SYS-001', assignedToId: techId || '', assignedTo: techName || '' },
        { workId: `HWO-${baseId}-02`, description: 'Test backup generator auto-start', priority: 'Medium', status: 'Open', scheduledDate: '2025-08-12', requestedBy: 'Operations', requestedById: 'OPS-002', assignedToId: techId || '', assignedTo: techName || '' },
        { workId: `HWO-${baseId}-03`, description: 'Replace server room air filter', priority: 'Low', status: 'Assigned', scheduledDate: '2025-08-15', requestedBy: 'IT Dept', requestedById: 'IT-003', assignedToId: techId || '', assignedTo: techName || '' }
      ];
      setWorkOrders(prev => {
        const ids = new Set(prev.map(o => o.workId));
        const toAdd = dummies.filter(d => !ids.has(d.workId));
        return toAdd.length ? [...prev, ...toAdd] : prev;
      });
      seededRef.current = true;
    }
    setOrders(mine);
  }, [workOrders, user]);

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

    setWorkOrders(prev => prev.map(o => o.workId === id ? { ...o, status: selected, completedAt: selected === 'Done' ? new Date().toISOString() : o.completedAt } : o));
    setConfirmStatusById(prev => { const { [id]: _, ...rest } = prev; return rest; });
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
  const { workOrders } = useAppData();
  const { user } = useAuth();
  const techId = user?.employeeId || user?.technicianId;
  const techName = user?.name;
  const mine = workOrders.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName));
  const pendingCount = mine.filter(o => o.status === 'Open' || o.status === 'Assigned').length;
  const inProgressCount = mine.filter(o => o.status === 'In Progress').length;
  const doneTodayCount = mine.filter(o => o.status === 'Done').length; // simplistic
  const stats = [
    { icon: Clock, label: 'Yet to Start', value: String(pendingCount), color: 'var(--status-open-text)' },
    { icon: Wrench, label: 'In Progress', value: String(inProgressCount), color: 'var(--status-in-progress-text)' },
    { icon: CheckCircle, label: 'Completed', value: String(doneTodayCount), color: 'var(--status-completed-text)' }
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
  const { workOrders } = useAppData();
  const { user } = useAuth();
  const techId = user?.employeeId || user?.technicianId;
  const techName = user?.name;
  const completed = workOrders.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName)).filter(o => o.status === 'Done');

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
const TechnicianProfile = () => {
  const { technicians, setTechnicians } = useAppData();
  const { user, login } = useAuth();
  const techId = user?.employeeId || user?.technicianId || '';
  const existing = technicians.find(t => t.technicianId === techId);
  const technicianIdValue = existing?.technicianId || user?.technicianId || user?.employeeId || '';
  const [form, setForm] = useState({
    name: existing?.name || user?.name || '',
    skill: existing?.skill || '',
    region: existing?.region || '',
    phone: existing?.phone || user?.phone || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const email = user?.email || 'technician@example.com';
  const department = user?.department || 'Maintenance';
  const skills = ['', 'HVAC', 'Electrical', 'Network', 'Mechanical', 'Generator', 'Fire Safety'];
  const regions = ['', 'North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSave = () => {
    if (!form.name || !form.skill || !form.region || !techId) {
      alert('Please fill all fields');
      return;
    }
    setTechnicians(prev => {
      const idx = prev.findIndex(t => t.technicianId === techId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], name: form.name, skill: form.skill, region: form.region, phone: form.phone };
        return copy;
      }
      return [...prev, { technicianId: techId, name: form.name, skill: form.skill, region: form.region, phone: form.phone }];
    });
    if (user) login({ ...user, name: form.name, phone: form.phone });
    setIsEditing(false);
    alert('Profile updated');
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ color: 'var(--color-text-dark)', margin: 0 }}>My Profile</h2>
        <button
          className="btn btn-primary"
          style={{ padding: '10px 16px', fontWeight: 600 }}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <form style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Phone Number *</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', background: !isEditing ? 'var(--color-body-bg)' : 'var(--color-white)' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Name *</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', background: !isEditing ? 'var(--color-body-bg)' : 'var(--color-white)' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Skill *</label>
            <select name="skill" value={form.skill} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', background: !isEditing ? 'var(--color-body-bg)' : 'var(--color-white)' }}>
              {skills.map(s => (<option key={s} value={s}>{s || 'Select skill'}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Region *</label>
            <select name="region" value={form.region} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', background: !isEditing ? 'var(--color-body-bg)' : 'var(--color-white)' }}>
              {regions.map(r => (<option key={r} value={r}>{r || 'Select region'}</option>))}
            </select>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default TechnicianDashboard; 