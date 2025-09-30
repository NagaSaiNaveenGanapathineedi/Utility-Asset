import { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import Sidebar from './UserSidebar';
import UserHeader from './UserHeader';
import AssetInfo from './AssetInfo';
import AssetRequestForm from './AssetRequestForm';
import AssetHistory from './AssetHistory';
import axios from 'axios';

const UserDashboard = () => {
  const { user } = useAuth();
  //console.log(user);

  const [assets,setAssets] = useState([]);
  const [activeTab, setActiveTab] = useState('assetInfo');
  const [userHistory, setuserHistory] = useState([]);

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
    });

    const fetchAssets = async () => {
      try {
        const response = await axios.get("http://localhost:9092/asset/all");
        if (!response) throw new Error("Unable to fetch the data");
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
        // Optionally show a user-friendly message
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:9092/workorder/user/"+user.id);
        if (!response) throw new Error("Unable to fetch the data");
        setuserHistory(response.data);
        // console.log(response.data);
        // console.log(userHistory);
      } catch (error) {
        console.error("Error fetching assets:", error);
        // Optionally show a user-friendly message
      }
    };

    fetchAssets();
    fetchHistory();
    return () => clearTimeout(scrollTimer);

  }, [activeTab, user.id]); {/*activeTab*/}

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'assetInfo':
        return <AssetInfo assets={assets} user={user} />;
      case 'assetRequest':
        return (
          <AssetRequestForm
            assets = {assets}
            user={user}
          />
        );
      case 'assetHistory':
        return <AssetHistory userHistory={userHistory} user={user} />;
      default:
        return <AssetInfo />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange}/>
      
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