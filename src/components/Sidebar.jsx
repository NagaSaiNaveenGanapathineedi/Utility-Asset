import { Info, Plus, Activity } from 'lucide-react';
import { useAuth } from '../App';
import { useMemo, useCallback } from 'react';
import './styles/components.css';

const ROLE_TITLES = {
  user: 'User Panel',
  technician: 'Technician Panel',
  supervisor: 'Supervisor Panel',
  admin: 'Admin Panel'
};

const MENU_ITEMS = [
  { id: 'assetInfo', label: 'Asset Information', icon: Info },
  { id: 'assetRequest', label: 'Asset Request', icon: Plus },
  { id: 'assetHistory', label: 'Asset History', icon: Activity }
];

const NavItem = ({ item, isActive, onClick }) => {
  const { id, label, icon: Icon } = item;
  
  return (
    <li>
      <button
        onClick={() => onClick(id)}
        className={`nav-item ${isActive ? 'active' : ''}`}
      >
        <Icon size={18} />
        {label}
      </button>
    </li>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  
  const sidebarTitle = useMemo(() => 
    ROLE_TITLES[user?.role] || ROLE_TITLES.user, 
    [user?.role]
  );

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, [setActiveTab]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">{sidebarTitle}</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {MENU_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={handleTabChange}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 