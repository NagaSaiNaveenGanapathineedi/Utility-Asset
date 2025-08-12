import { 
  Info,
  Plus,
  Activity
} from 'lucide-react';
import { useAuth } from '../App';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  
  const getSidebarTitle = (role) => {
    const titles = {
      user: 'User Panel',
      technician: 'Technician Panel',
      supervisor: 'Supervisor Panel',
      admin: 'Admin Panel'
    };
    return titles[role] || titles.user;
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h1 style={{ 
          color: 'var(--status-completed-text)', 
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: 0
        }}>
        {getSidebarTitle(user?.role)}
        </h1>
      </div>
      
      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        <ul>
          {[
            { id: 'assetInfo', label: 'Asset Information', icon: Info },
            { id: 'assetRequest', label: 'Asset Request', icon: Plus },
            { id: 'assetHistory', label: 'Asset History', icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => setActiveTab(id)}
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
  );
};

export default Sidebar; 