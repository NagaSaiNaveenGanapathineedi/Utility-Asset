import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import TechnicianHeader from './TechnicianHeader';
import { ClipboardList, FileText, BarChart3, User } from 'lucide-react';
import WorkOrders from './WorkOrder';
import WorkHistory from './WorkHistory';
import ReportsOverview from './Reports';
import TechnicianProfile from './Profile';
import { useAuth } from '../../App';
import '../styles/components.css';

const MENU_ITEMS = [
  { id: 'workOrders', label: 'Work Orders', icon: ClipboardList },
  { id: 'history', label: 'Work History', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User }
];

const API_ENDPOINTS = {
  WORKORDER_TECHNICIAN: (id) => `http://localhost:9092/workorder/technician/${id}`,
  TASKS_ALL: 'http://localhost:9092/task/all'
};

const SidebarNavItem = ({ item, isActive, onClick }) => (
  <li>
    <button
      onClick={() => onClick(item.id)}
      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
    >
      {isActive && <div className="active-indicator" />}
      <item.icon size={18} />
      {item.label}
    </button>
  </li>
);

const LoadingSpinner = () => <div className="loading-spinner">Loading...</div>;

const TechnicianDashboard = () => {
  const [activeTab, setActiveTab] = useState('workOrders');
  const { user: technician } = useAuth();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [apiCallMade, setApiCallMade] = useState(false);

  const fetchData = useCallback(async () => {
    if (!technician?.id) return;
    
    setLoading(true);
    try {
      const [workOrdersRes, tasksRes] = await Promise.all([
        axios.get(API_ENDPOINTS.WORKORDER_TECHNICIAN(technician.id)),
        axios.get(API_ENDPOINTS.TASKS_ALL)
      ]);
      
      setWorkOrders(workOrdersRes.data || []);
      setTasks(tasksRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setWorkOrders([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [technician?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, apiCallMade]);

  const handleTabChange = useCallback((tabId) => setActiveTab(tabId), []);

  const renderActiveTab = useMemo(() => {
    if (loading) return <LoadingSpinner />;
    
    const tabComponents = {
      workOrders: <WorkOrders workorders={workOrders} setApiCallMade={setApiCallMade} />,
      reports: <ReportsOverview workorders={workOrders} />,
      history: <WorkHistory workorders={workOrders} tasks={tasks} />,
      profile: <TechnicianProfile technician={technician} setApiCallMade={setApiCallMade} />
    };
    
    return tabComponents[activeTab] || tabComponents.workOrders;
  }, [activeTab, workOrders, tasks, technician, loading]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Technician Panel</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {MENU_ITEMS.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={handleTabChange}
              />
            ))}
          </ul>
        </nav>
      </aside>

      <div className="main-content-wrapper">
        <TechnicianHeader />
        <main className="main-content-area" id="technician-dashboard-content">
          {renderActiveTab}
        </main>
      </div>
    </div>
  );
};

export default TechnicianDashboard;