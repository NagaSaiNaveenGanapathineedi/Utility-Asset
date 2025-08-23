import { useState, useEffect } from 'react';
import Sidebar from './UserSidebar';
import UserHeader from './UserHeader';
import AssetInfo from './AssetInfo';
import AssetRequestForm from './AssetRequestForm';
import AssetHistory from './AssetHistory';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('assetInfo');
  const [assetRequests, setAssetRequests] = useState([
    {
      id: 'REQ-001',
      assetId: 'AST-001',
      assetName: 'Main Distribution Panel',
      location: 'Building A - Ground Floor',
      region: 'North Zone',
      siteCode: 'BLD-A-001',
      frequencyPlan: 'Monthly',
      description: 'Routine check for distribution panel breakers',
      status: 'Pending',
      submittedAt: '2025-08-01',
      submittedBy: 'Demo User'
    },
    {
      id: 'REQ-002',
      assetId: 'AST-003',
      assetName: 'Emergency Generator',
      location: 'Building C - Basement',
      region: 'South Zone',
      siteCode: 'BLD-C-003',
      frequencyPlan: 'Quarterly',
      description: 'Noise during startup, requires inspection',
      status: 'Pending',
      submittedAt: '2025-08-02',
      submittedBy: 'Demo User'
    },
    {
      id: 'REQ-003',
      assetId: 'AST-005',
      assetName: 'Fire Safety System',
      location: 'Building A - All Floors',
      region: 'North Zone',
      siteCode: 'BLD-A-005',
      frequencyPlan: 'Yearly',
      description: 'Annual compliance testing',
      status: 'Pending',
      submittedAt: '2025-08-03',
      submittedBy: 'Demo User'
    },
    {
      id: 'REQ-004',
      assetId: 'AST-006',
      assetName: 'Transformer Unit T-101',
      location: 'Substation A - East Wing',
      region: 'West Zone',
      siteCode: 'SUB-A-006',
      frequencyPlan: 'Monthly',
      description: 'Temperature monitoring irregularity',
      status: 'Pending',
      submittedAt: '2025-08-04',
      submittedBy: 'Demo User'
    },
    {
      id: 'REQ-005',
      assetId: 'AST-007',
      assetName: 'Cooling Tower System',
      location: 'Building B - North Side',
      region: 'Central Zone',
      siteCode: 'BLD-B-007',
      frequencyPlan: 'Monthly',
      description: 'Vibration detected in fan assembly',
      status: 'Pending',
      submittedAt: '2025-08-05',
      submittedBy: 'Demo User'
    }
  ]);
  const [assetRequestForm, setAssetRequestForm] = useState({
    assetId: '',
    assetName: '',
    location: '',
    region: '',
    siteCode: '',
    frequencyPlan: '',
    description: ''
  });

  // Scroll to top when tab changes
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      const dashboardContent = document.getElementById('user-dashboard-content');
      if (dashboardContent) {
        dashboardContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      const mainContent = document.querySelector('.main-content-area');
      if (mainContent && !dashboardContent) {
        mainContent.scrollTo({
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
      case 'assetInfo':
        return <AssetInfo />;
      case 'assetRequest':
        return (
          <AssetRequestForm
            assetRequests={assetRequests}
            setAssetRequests={setAssetRequests}
            assetRequestForm={assetRequestForm}
            setAssetRequestForm={setAssetRequestForm}
          />
        );
      case 'assetHistory':
        return <AssetHistory assetRequests={assetRequests} setAssetRequests={setAssetRequests} />;
      default:
        return <AssetInfo />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      <div className="main-content-wrapper">
        <UserHeader />
        
        <main className="main-content-area" id="user-dashboard-content">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 