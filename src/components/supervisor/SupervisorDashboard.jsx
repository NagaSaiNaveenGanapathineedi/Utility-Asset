import { useState, useEffect } from 'react';
import axios from 'axios';
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
	Search,
	UserCheck,
	TrendingUp,
	FileText
} from 'lucide-react';
import { AssetRegistration, SearchAssets } from './AssetManagement';
import { MaintenancePlan } from './MaintenancePlan';
import { AssignWork } from './AssignWork';
import { ViewAssignments, RegisterTechnician, SearchTechnicians } from './TechnicianManagement';
import { AssetHistory, TechnicianSummary } from './Reports';

export const SimpleCard = ({ icon: Icon, title, lead, body }) => (
	<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
		<h2 style={{ color: 'var(--color-text-dark)' }}>{title}</h2>
		<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>{lead}</p>
		<div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-medium)', backgroundColor: 'var(--color-body-bg)', borderRadius: '8px' }}>
			<Icon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
			<h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>{body.title}</h3>
			<p>{body.text}</p>
		</div>
	</motion.div>
);

const SupervisorDashboard = () => {
	const [activeTab, setActiveTab] = useState('asset-history');
	const [assets, setAssets] = useState([]);
	const [technicians, setTechnicians] = useState([]);
	const [workOrders, setWorkOrders] = useState([]);
	const [expandedMenus, setExpandedMenus] = useState({ assets: false, maintenance: false, workOrder: false, technician: true, reports: false });
	const [plans, setplans] = useState([]);

	useEffect(() => {

		const fetchAssets = async () => {
			try {
				const response = await axios.get("http://localhost:9092/asset/all");
				if (!response.status === 200) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				setAssets(response.data);
			} catch (error) {
				console.error("Error fetching assets:", error);
			}
		};

		const fetchTechnicians = async () => {
			try {
				const response = await axios.get("http://localhost:9092/user/role/"+"technician");
				if (!response.status === 200) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				setTechnicians(response.data);
			} catch (error) {
				console.error("Error fetching technicians:", error);
			}
		};

		const fetchWorkOrders = async () => {
			try {
				const response = await axios.get("http://localhost:9092/workorder/all");
				if (!response.status === 200) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				setWorkOrders(response.data);
			} catch (error) {
				console.error("Error fetching work orders:", error);
			}
		};

		const fetchPlans = async () =>{
			try {
				const response = await axios.get("http://localhost:9092/maintenanceplan/all");
				if (!response.status === 200) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				setplans(response.data);
			} catch (error) {
				console.error("Error fetching Plans:", error);
			}
		}

		fetchTechnicians();
		fetchWorkOrders();
		fetchAssets();
		fetchPlans();

	}, [activeTab]);

	const toggleMenu = (menuKey) => {
		setExpandedMenus(prev => {
			const isOpen = prev[menuKey];
			if (isOpen) return { ...prev, [menuKey]: false };
			const next = {};
			Object.keys(prev).forEach(k => { next[k] = k === menuKey; });
			return next;
		});
	};
	const handleTabChange = (tabId) => setActiveTab(tabId);

	const menuItems = [
		{ key: 'assets', label: 'Assets', icon: Database, items: [ { id: 'asset-registration', label: 'Asset Registration', icon: Plus }, { id: 'search-assets', label: 'Search Assets', icon: Search } ] },
		{ key: 'maintenance', label: 'Maintenance Plan', icon: Calendar, items: [ { id: 'maintenance-plan', label: 'View Plan', icon: FileText } ] },
		{ key: 'workOrder', label: 'Work Order', icon: Clipboard, items: [ { id: 'assign-work', label: 'Assign Work', icon: UserCheck } ] },
		{ key: 'technician', label: 'Assigned Technician', icon: Users, items: [ { id: 'search-technician', label: 'Search Technician', icon: Search }, { id: 'view-assignments', label: 'View Assignments', icon: FileText }, { id: 'register-technician', label: 'Register Technician', icon: Plus } ] },
		{ key: 'reports', label: 'Reports', icon: BarChart3, items: [ { id: 'asset-history', label: 'Asset History', icon: FileText }, { id: 'technician-summary', label: 'Technician Summary', icon: TrendingUp } ] }
	];

	const renderActiveTab = () => {
		switch (activeTab) {
			case 'asset-registration':
				return <AssetRegistration handleTabChange={handleTabChange} />;
			case 'search-assets':
				return <SearchAssets assets={assets} handleTabChange={handleTabChange} />;
			case 'assign-work':
				return <AssignWork workOrders={workOrders} technicians={technicians} handleTabChange={handleTabChange} />;
			case 'view-assignments':
				return <ViewAssignments workOrders={workOrders} />;
			case 'asset-history':
				return <AssetHistory workOrders={workOrders} handleTabChange={handleTabChange} />;
			case 'technician-summary':
				return <TechnicianSummary workOrders={workOrders} handleTabChange={handleTabChange} />;
			case 'search-technician':
				return <SearchTechnicians technicians={technicians} handleTabChange={handleTabChange} />;
			case 'register-technician':
				return <RegisterTechnician handleTabChange={handleTabChange} />;
			case 'maintenance-plan':
				return <MaintenancePlan plans={plans} handleTabChange={handleTabChange} />;
			default:
				return <SearchAssets assets={assets} handleTabChange={handleTabChange} />;
		}
	};

	return (
		<div className="app-container">
			<aside className="sidebar">
				<div className="sidebar-header">
					<h1 style={{ color: 'var(--status-completed-text)', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Supervisor Panel</h1>
				</div>
				<nav className="sidebar-nav">
					<ul>
						{menuItems.map((menu) => (
							<li key={menu.key} style={{ marginBottom: '0' }}>
								<button
									onClick={() => toggleMenu(menu.key)}
									style={{ width: '100%', textAlign: 'left', backgroundColor: 'transparent', color: 'var(--color-text-on-dark)', border: 'none', padding: '16px 25px', cursor: 'pointer', fontSize: '1em', fontWeight: '500', transition: 'background-color 0.3s ease, color 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}
									onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-hover-dark-bg)'}
									onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
								>
									<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
										<menu.icon size={18} />
										{menu.label}
									</div>
									{expandedMenus[menu.key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
								</button>
								<AnimatePresence>
									{expandedMenus[menu.key] && (
										<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
											<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
												{menu.items.map((item) => (
													<li key={item.id}>
														<button
															onClick={() => handleTabChange(item.id)}
															className={activeTab === item.id ? 'active' : ''}
															style={{ width: '100%', textAlign: 'left', backgroundColor: activeTab === item.id ? 'var(--color-active-dark-bg)' : 'transparent', color: 'var(--color-text-on-dark)', border: 'none', padding: '12px 25px 12px 45px', cursor: 'pointer', fontSize: '0.9em', fontWeight: activeTab === item.id ? '600' : '400', transition: 'background-color 0.3s ease, color 0.3s ease', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}
															onMouseEnter={(e) => { if (activeTab !== item.id) e.target.style.backgroundColor = 'var(--color-hover-dark-bg)'; }}
															onMouseLeave={(e) => { if (activeTab !== item.id) e.target.style.backgroundColor = 'transparent'; }}
														>
															{activeTab === item.id && (
																<div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: 'var(--color-light-primary)' }} />
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

			<div className="main-content-wrapper">
				<SupervisorHeader />
				<main className="main-content-area" id="supervisor-dashboard-content">{renderActiveTab()}</main>
			</div>
		</div>
	);
};

export default SupervisorDashboard;