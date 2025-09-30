import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../App';
import UserHeader from './UserHeader';
import AssetInfo from './AssetInfo';
import AssetRequestForm from './AssetRequestForm';
import AssetHistory from './AssetHistory';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { Info, Plus, Activity } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [activeTab, setActiveTab] = useState('assetInfo');
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.ASSET_ALL);
      setAssets(response.data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get(API_ENDPOINTS.WORKORDER_USER(user.id));
      setUserHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching user history:", error);
      setUserHistory([]);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAssets();
    fetchHistory();
  }, [fetchAssets, fetchHistory]);

  const handleTabChange = useCallback((tabId) => setActiveTab(tabId), []);

  const renderActiveTab = useMemo(() => {
    if (loading) return <div>Loading...</div>;
    
    const tabComponents = {
      'assetInfo': () => <AssetInfo assets={assets} user={user} />,
      'assetRequest': () => <AssetRequestForm assets={assets} user={user} />,
      'assetHistory': () => <AssetHistory userHistory={userHistory} user={user} />
    };
    
    return (tabComponents[activeTab] || tabComponents['assetInfo'])();
  }, [activeTab, assets, user, userHistory, loading]);

  const menuItems = useMemo(() => [
    { id: 'assetInfo', label: 'Asset Information', icon: Info },
    { id: 'assetRequest', label: 'Asset Request', icon: Plus },
    { id: 'assetHistory', label: 'Asset History', icon: Activity }
  ], []);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ color: 'var(--status-completed-text)', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>User Panel</h1>
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
        <UserHeader />
        <main className="main-content-area" id="user-dashboard-content">{renderActiveTab}</main>
      </div>
    </div>
  );
};

export default UserDashboard;