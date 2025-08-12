import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SupervisorHeader from './SupervisorHeader';
import { 
  ChevronDown,
  ChevronRight,
  Database,
  Calendar,
  Clipboard,
  Users,
  BarChart3,
  Plus,
  Edit,
  Search,
  Settings,
  UserCheck,
  ClipboardCheck,
  TrendingUp,
  FileText,
  Filter,
  Eye,
  Wrench
} from 'lucide-react';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('asset-registration');
  const [expandedMenus, setExpandedMenus] = useState({
    assets: true,
    maintenance: false,
    workOrder: false,
    technician: false,
    reports: false
  });

  // Scroll to top when tab changes
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      const dashboardContent = document.getElementById('supervisor-dashboard-content');
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

    return () => clearTimeout(scrollTimer);
  }, [activeTab]);

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => {
      const isCurrentlyExpanded = prev[menuKey];
      
      if (isCurrentlyExpanded) {
        // If the clicked menu is currently open, just close it
        return {
          ...prev,
          [menuKey]: false
        };
      } else {
        // If the clicked menu is currently closed, close all others and open this one
        const newState = {};
        Object.keys(prev).forEach(key => {
          newState[key] = key === menuKey;
        });
        return newState;
      }
    });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const menuItems = [
    {
      key: 'assets',
      label: 'Assets',
      icon: Database,
      items: [
        { id: 'asset-registration', label: 'Asset Registration', icon: Plus },
        { id: 'update-delete-assets', label: 'Update/Delete Assets', icon: Edit },
        { id: 'search-assets', label: 'Search Assets', icon: Search }
      ]
    },
    {
      key: 'maintenance',
      label: 'Maintenance Plan',
      icon: Calendar,
      items: [
        { id: 'plan-creation', label: 'Plan Creation', icon: Plus },
        { id: 'view-plan', label: 'View Plan', icon: FileText },
        { id: 'update-plan', label: 'Update Plan', icon: Edit }
      ]
    },
    {
      key: 'workOrder',
      label: 'Work Order',
      icon: Clipboard,
      items: [
        { id: 'assign-work', label: 'Assign Work', icon: UserCheck },
        { id: 'filter-work', label: 'Filter Work', icon: Search },
        { id: 'update-status', label: 'Update Status', icon: ClipboardCheck }
      ]
    },
    {
      key: 'technician',
      label: 'Technician',
      icon: Users,
      items: [
        { id: 'assign-work-technician', label: 'Assign Work', icon: UserCheck },
        { id: 'search-technician', label: 'Search Technician', icon: Search },
        { id: 'view-assignments', label: 'View Assignments', icon: FileText }
      ]
    },
    {
      key: 'reports',
      label: 'Reports',
      icon: BarChart3,
      items: [
        { id: 'asset-history', label: 'Asset History', icon: FileText },
        { id: 'technician-performance', label: 'Technician Performance', icon: TrendingUp },
        { id: 'future-plans', label: 'Future Plans', icon: Calendar }
      ]
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'asset-registration':
        return <AssetRegistration />;
      case 'update-delete-assets':
        return <UpdateDeleteAssets />;
      case 'search-assets':
        return <SearchAssets />;
      case 'plan-creation':
        return <PlanCreation />;
      case 'view-plan':
        return <ViewPlan />;
      case 'update-plan':
        return <UpdatePlan />;
      case 'assign-work':
        return <AssignWork />;
      case 'filter-work':
        return <FilterWork />;
      case 'update-status':
        return <UpdateStatus />;
      case 'assign-work-technician':
        return <AssignWorkTechnician />;
      case 'search-technician':
        return <SearchTechnician />;
      case 'view-assignments':
        return <ViewAssignments />;
      case 'asset-history':
        return <AssetHistory />;
      case 'technician-performance':
        return <TechnicianPerformance />;
      case 'future-plans':
        return <FuturePlans />;
      default:
        return <AssetRegistration />;
    }
  };

  return (
    <div className="app-container">
      {/* Supervisor Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ 
            color: 'var(--status-completed-text)', 
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0
          }}>
            Supervisor Panel
          </h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((menu) => (
              <li key={menu.key} style={{ marginBottom: '0' }}>
                {/* Menu Header */}
                <button
                  onClick={() => toggleMenu(menu.key)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-on-dark)',
                    border: 'none',
                    padding: '16px 25px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontWeight: '500',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '15px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover-dark-bg)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <menu.icon size={18} />
                    {menu.label}
                  </div>
                  {expandedMenus[menu.key] ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                  }
                </button>

                {/* Menu Items */}
                <AnimatePresence>
                  {expandedMenus[menu.key] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {menu.items.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => handleTabChange(item.id)}
                              className={activeTab === item.id ? 'active' : ''}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                backgroundColor: activeTab === item.id ? 'var(--color-active-dark-bg)' : 'transparent',
                                color: 'var(--color-text-on-dark)',
                                border: 'none',
                                padding: '12px 25px 12px 45px',
                                cursor: 'pointer',
                                fontSize: '0.9em',
                                fontWeight: activeTab === item.id ? '600' : '400',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                position: 'relative'
                              }}
                              onMouseEnter={(e) => {
                                if (activeTab !== item.id) {
                                  e.target.style.backgroundColor = 'var(--color-hover-dark-bg)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (activeTab !== item.id) {
                                  e.target.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {activeTab === item.id && (
                                <div style={{
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: '4px',
                                  backgroundColor: 'var(--color-light-primary)'
                                }} />
                              )}
                              <item.icon size={16} />
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content-wrapper">
        <SupervisorHeader />
        
        <main className="main-content-area" id="supervisor-dashboard-content">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

// Asset Registration Component
const AssetRegistration = () => {
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    type: '',
    status: 'Available',
    location: '',
    region: '',
    siteCode: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Asset registered successfully!');
    setFormData({
      assetId: '',
      assetName: '',
      type: '',
      status: 'Available',
      location: '',
      region: '',
      siteCode: '',
      description: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 style={{ color: 'var(--color-text-dark)' }}>Asset Registration</h2>
      <p style={{ 
        color: 'var(--color-text-medium)',
        fontSize: '1rem',
        marginBottom: '30px'
      }}>
        Register new assets in the system with complete information
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className="form-group">
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: 'var(--color-text-dark)' 
            }}>
              Asset ID
            </label>
            <input
              name="assetId"
              type="text"
              value={formData.assetId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--color-border-medium)',
                borderRadius: '6px',
                fontSize: '1rem',
                color: 'var(--color-text-dark)',
                backgroundColor: 'var(--color-white)'
              }}
              placeholder="Enter Asset ID"
            />
          </div>

          <div className="form-group">
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: 'var(--color-text-dark)' 
            }}>
              Asset Name
            </label>
            <input
              name="assetName"
              type="text"
              value={formData.assetName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--color-border-medium)',
                borderRadius: '6px',
                fontSize: '1rem',
                color: 'var(--color-text-dark)',
                backgroundColor: 'var(--color-white)'
              }}
              placeholder="Enter Asset Name"
            />
          </div>

          <div className="form-group">
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: 'var(--color-text-dark)' 
            }}>
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--color-border-medium)',
                borderRadius: '6px',
                fontSize: '1rem',
                color: 'var(--color-text-dark)',
                backgroundColor: 'var(--color-white)'
              }}
            >
              <option value="">Select Type</option>
              <option value="Server">Server</option>
              <option value="HVAC">HVAC</option>
              <option value="Printer">Printer</option>
              <option value="Network Equipment">Network Equipment</option>
              <option value="Generator">Generator</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: 'var(--color-text-dark)' 
            }}>
              Location
            </label>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--color-border-medium)',
                borderRadius: '6px',
                fontSize: '1rem',
                color: 'var(--color-text-dark)',
                backgroundColor: 'var(--color-white)'
              }}
              placeholder="Enter Location"
            />
          </div>

          <div className="form-group">
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: 'var(--color-text-dark)' 
            }}>
              Region
            </label>
            <input
              name="region"
              type="text"
              value={formData.region}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--color-border-medium)',
                borderRadius: '6px',
                fontSize: '1rem',
                color: 'var(--color-text-dark)',
                backgroundColor: 'var(--color-white)'
              }}
              placeholder="Enter Region"
            />
          </div>

          <div className="form-group">
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: 'var(--color-text-dark)' 
            }}>
              Site Code
            </label>
            <input
              name="siteCode"
              type="text"
              value={formData.siteCode}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--color-border-medium)',
                borderRadius: '6px',
                fontSize: '1rem',
                color: 'var(--color-text-dark)',
                backgroundColor: 'var(--color-white)'
              }}
              placeholder="Enter Site Code"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: 'var(--color-text-dark)' 
          }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--color-border-medium)',
              borderRadius: '6px',
              fontSize: '1rem',
              color: 'var(--color-text-dark)',
              backgroundColor: 'var(--color-white)',
              resize: 'vertical'
            }}
            placeholder="Enter asset description..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn btn-primary"
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Register Asset
        </motion.button>
      </form>
    </motion.div>
  );
};

// All other components using the same card structure
const UpdateDeleteAssets = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Update/Delete Assets</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Modify or remove existing assets from the system
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Edit size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Asset Management Interface</h3>
      <p>Update asset information or remove assets from the system database.</p>
    </div>
  </motion.div>
);

const SearchAssets = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Search Assets</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Find and filter assets using advanced search criteria
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Advanced Asset Search</h3>
      <p>Search assets by ID, name, type, location, status and other parameters.</p>
    </div>
  </motion.div>
);

const PlanCreation = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Plan Creation</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Create comprehensive maintenance plans for assets
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Plus size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Maintenance Planning</h3>
      <p>Create detailed maintenance schedules and procedures for your assets.</p>
    </div>
  </motion.div>
);

const ViewPlan = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>View Plans</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Review and monitor existing maintenance plans
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Eye size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Plan Overview</h3>
      <p>View all maintenance plans, schedules, and upcoming activities.</p>
    </div>
  </motion.div>
);

const UpdatePlan = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Update Plans</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Modify existing maintenance plans and schedules
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Edit size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Plan Modification</h3>
      <p>Update maintenance schedules, procedures, and plan details.</p>
    </div>
  </motion.div>
);

const AssignWork = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Assign Work</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Create and assign work orders to technicians
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <UserCheck size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Work Assignment</h3>
      <p>Assign maintenance tasks and work orders to available technicians.</p>
    </div>
  </motion.div>
);

const FilterWork = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Filter Work</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Search and filter work orders by various criteria
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Filter size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Work Order Filtering</h3>
      <p>Filter work orders by status, priority, technician, date range and more.</p>
    </div>
  </motion.div>
);

const UpdateStatus = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Update Status</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Update work order status and progress tracking
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <ClipboardCheck size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Status Management</h3>
      <p>Update work order status, progress notes, and completion details.</p>
    </div>
  </motion.div>
);

const AssignWorkTechnician = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Assign Work to Technicians</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Assign specific tasks and work orders to technicians
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <UserCheck size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Technician Assignment</h3>
      <p>Assign work to technicians based on skills, availability and workload.</p>
    </div>
  </motion.div>
);

const SearchTechnician = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Search Technician</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Find technicians by skills, availability, and location
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Technician Directory</h3>
      <p>Search for technicians by name, skills, department, or availability status.</p>
    </div>
  </motion.div>
);

const ViewAssignments = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>View Assignments</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Monitor technician assignments and workload distribution
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Assignment Overview</h3>
      <p>View current and upcoming assignments for all technicians.</p>
    </div>
  </motion.div>
);

const AssetHistory = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Asset History</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Comprehensive history and lifecycle tracking for assets
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Asset Lifecycle</h3>
      <p>Track asset maintenance history, repairs, upgrades and performance metrics.</p>
    </div>
  </motion.div>
);

const TechnicianPerformance = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Technician Performance</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Analyze technician productivity and performance metrics
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <TrendingUp size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Performance Analytics</h3>
      <p>Track completion rates, response times, quality scores and KPIs.</p>
    </div>
  </motion.div>
);

const FuturePlans = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card"
  >
    <h2 style={{ color: 'var(--color-text-dark)' }}>Future Plans</h2>
    <p style={{ 
      color: 'var(--color-text-medium)',
      fontSize: '1rem',
      marginBottom: '30px'
    }}>
      Strategic planning and forecasting for maintenance activities
    </p>
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: 'var(--color-text-medium)',
      backgroundColor: 'var(--color-body-bg)',
      borderRadius: '8px'
    }}>
      <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>Strategic Planning</h3>
      <p>Plan future maintenance schedules and resource allocation strategies.</p>
    </div>
  </motion.div>
);

export default SupervisorDashboard; 