import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../App';
import UserHeader from './UserHeader';
import AssetInfo from './AssetInfo';
import AssetRequestForm from './AssetRequestForm';
import AssetHistory from './AssetHistory';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { Info, Plus, Activity } from 'lucide-react';
import '../styles/components.css';

const MENU_ITEMS = [
  { id: 'assetInfo', label: 'Asset Information', icon: Info },
  { id: 'assetRequest', label: 'Asset Request', icon: Plus },
  { id: 'assetHistory', label: 'Asset History', icon: Activity }
];

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

const UserDashboard = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [activeTab, setActiveTab] = useState('assetInfo');
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiCallMade, setApiCallMade] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [assetsRes, historyRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ASSET_ALL),
        user?.id ? axios.get(API_ENDPOINTS.WORKORDER_USER(user.id)) : Promise.resolve({ data: [] })
      ]);
      
      setAssets(assetsRes.data || []);
      setUserHistory(historyRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAssets([]);
      setUserHistory([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, apiCallMade]);

  const handleTabChange = useCallback((tabId) => setActiveTab(tabId), []);

  const renderActiveTab = useMemo(() => {
    if (loading) return <LoadingSpinner />;
    
    const tabComponents = {
      assetInfo: <AssetInfo assets={assets} user={user} setApiCallMade={setApiCallMade} />,
      assetRequest: <AssetRequestForm assets={assets} user={user} setApiCallMade={setApiCallMade} />,
      assetHistory: <AssetHistory userHistory={userHistory} user={user} setApiCallMade={setApiCallMade} />
    };
    
    return tabComponents[activeTab] || tabComponents.assetInfo;
  }, [activeTab, assets, user, userHistory, loading]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">User Panel</h1>
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
        <UserHeader />
        <main className="main-content-area" id="user-dashboard-content">
          {renderActiveTab}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;