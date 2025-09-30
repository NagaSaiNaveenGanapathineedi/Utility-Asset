import { useState, useEffect } from 'react';
import TechnicianHeader from './TechnicianHeader';
import {
  ClipboardList,
  FileText,
  BarChart3,
  User
} from 'lucide-react';
import WorkOrders from './WorkOrder';
import WorkHistory from './WorkHistory';
import ReportsOverview from './Reports';
import TechnicianProfile from './Profile';
import axios from 'axios';
import { useAuth } from '../../App';


const TechnicianDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const { user: technician } = useAuth();
  console.log(technician.id);
  const [workorder, setworkorder] = useState([]);

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

    const fetchTechnicianRecords = async () =>{
      try {
        const response = await axios.get("http://localhost:9092/workorder/technician/"+technician.id);
        if(response.status !== 200) return new Error("Failed to fetch technician records");
        console.log(response.data);
        setworkorder([...response.data]);
      } catch (error) {
        console.log("Erro in fetching technician work records",error);
      }
    }

    fetchTechnicianRecords();
    return () => clearTimeout(scrollTimer);
  }, [activeTab, technician.id]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'workOrders':
        return <WorkOrders workorders={workorder} />;
      case 'reports':
        return <ReportsOverview workorders={workorder} />;
      case 'history':
        return <WorkHistory workorders={workorder} />;
      case 'profile':
        return <TechnicianProfile technician={technician} />;
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

export default TechnicianDashboard;