import { useState, useEffect } from 'react';
import Sidebar from './UserSidebar';
import UserHeader from './UserHeader';
import AssetInfo from './AssetInfo';
import AssetRequestForm from './AssetRequestForm';
import AssetHistory from './AssetHistory';
import axios from 'axios';

const UserDashboard = () => {
  const [user,setUser] = useState({
    id:1,
    name:"Ravi Kumar",
    email:"ravi@example.com",
    password:"pass123",
    phno:"9876543210",
    region:"South",
    pincode:"600001",
    location:"Chennai",
    skill:"Inspection",
    role:"User"
  });
  const [assets,setAssets] = useState([]);
  const [activeTab, setActiveTab] = useState('assetInfo');
  const [workorder, setWorkOrder] = useState({
    planId : null,
    userId : null,
    techId : null,
    assetId : null,
    description : null,
    requestedDate : null,
    status : "Not Assigned",
    frequency : null
  });
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
        // console.log(userHistory);
      } catch (error) {
        console.error("Error fetching assets:", error);
        // Optionally show a user-friendly message
      }
    };

    fetchAssets();
    fetchHistory();
    return () => clearTimeout(scrollTimer);

  }, []); {/*activeTab*/}

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'assetInfo':
        return <AssetInfo assets={assets}/>;
      case 'assetRequest':
        return (
          <AssetRequestForm
            assets = {assets}
            workorder={workorder}
            setWorkOrder={setWorkOrder}
          />
        );
      case 'assetHistory':
        return <AssetHistory userHistory={userHistory} />;
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