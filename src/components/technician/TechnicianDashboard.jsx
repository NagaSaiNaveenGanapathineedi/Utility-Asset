import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import TechnicianHeader from './TechnicianHeader';
import { ClipboardList, FileText, BarChart3, User } from 'lucide-react';
import WorkOrders from './WorkOrder';
import WorkHistory from './WorkHistory';
import ReportsOverview from './Reports';
import TechnicianProfile from './Profile';
import { useAuth } from '../../App';

const TechnicianDashboard = () => {
  const [activeTab, setActiveTab] = useState('workOrders');
  const { user: technician } = useAuth();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkOrders = useCallback(async () => {
    if (!technician?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:9092/workorder/technician/${technician.id}`);
      setWorkOrders(response.data);
    } catch (error) {
      console.error("Error fetching technician work records:", error);
    } finally {
      setLoading(false);
    }
  }, [technician?.id]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  const handleTabChange = useCallback((tabId) => setActiveTab(tabId), []);

  const renderActiveTab = useMemo(() => {
    if (loading) return <div>Loading...</div>;
    
    const tabComponents = {
      'workOrders': () => <WorkOrders workorders={workOrders} />,
      'reports': () => <ReportsOverview workorders={workOrders} />,
      'history': () => <WorkHistory workorders={workOrders} />,
      'profile': () => <TechnicianProfile technician={technician} />
    };
    
    return (tabComponents[activeTab] || tabComponents['workOrders'])();
  }, [activeTab, workOrders, technician, loading]);

  const menuItems = useMemo(() => [
    { id: 'workOrders', label: 'Work Orders', icon: ClipboardList },
    { id: 'history', label: 'Work History', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User }
  ], []);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ color: 'var(--status-completed-text)', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Technician Panel</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => handleTabChange(id)}
                  className={activeTab === id ? 'active' : ''}
                  style={{ width: '100%', textAlign: 'left', backgroundColor: activeTab === id ? 'var(--color-active-dark-bg)' : 'transparent', color: 'var(--color-text-on-dark)', border: 'none', padding: '16px 25px', cursor: 'pointer', fontSize: '1em', fontWeight: activeTab === id ? '600' : '500', transition: 'background-color 0.3s ease, color 0.3s ease', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}
                  onMouseEnter={(e) => { if (activeTab !== id) e.target.style.backgroundColor = 'var(--color-hover-dark-bg)'; }}
                  onMouseLeave={(e) => { if (activeTab !== id) e.target.style.backgroundColor = 'transparent'; }}
                >
                  {activeTab === id && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: 'var(--color-light-primary)' }} />
                  )}
                  <Icon size={18} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="main-content-wrapper">
        <TechnicianHeader />
        <main className="main-content-area" id="technician-dashboard-content">{renderActiveTab}</main>
      </div>
    </div>
  );
};

export default TechnicianDashboard;