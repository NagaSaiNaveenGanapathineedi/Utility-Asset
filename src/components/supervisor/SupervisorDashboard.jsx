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
	Search,
	UserCheck,
	TrendingUp,
	FileText,
	Edit,
	Trash2,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext.jsx';
import { AssetRegistration, SearchAssets } from './AssetManagement';
import { MaintenancePlans } from './ViewPlan';
import { AssignWork } from './AssignWork';
import { ViewAssignments, RegisterTechnician, SearchTechnicians } from './TechnicianManagement';
import { AssetHistory, TechnicianSummary } from './Reports';

// Shared styles/utilities
export const styles = {
	input: {
		width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px',
		fontSize: '14px', fontWeight: '400', color: 'var(--color-text-dark)', backgroundColor: 'var(--color-white)',
		transition: 'all 0.2s ease', fontFamily: 'inherit', outline: 'none'
	},
	label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-dark)' },
	table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '10px', overflow: 'hidden' },
	th: { textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--color-text-light)', padding: '14px 16px', borderBottom: '1px solid var(--color-border-light)', background: 'var(--color-body-bg)' },
	td: { padding: '14px 16px', borderBottom: '1px solid var(--color-border-light)', color: 'var(--color-text-dark)', fontSize: '14px' }
};

export const getStatusColor = (status) => {
	switch (status) {
		case 'Available': return { bg: 'var(--status-completed-bg)', text: 'var(--status-completed-text)' };
		case 'Not Available': return { bg: 'var(--status-open-bg)', text: 'var(--status-open-text)' };
		case 'Maintenance': return { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress-text)' };
		default: return { bg: 'var(--color-border-light)', text: 'var(--color-text-medium)' };
	}
};

// Reusable cards
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

export const AssetCard = ({ asset, compact = false, onEdit, onDelete }) => {
	const statusColor = getStatusColor(asset.status);
	return (
		<motion.div
			initial={{ opacity: 0, y: compact ? 10 : 0, scale: compact ? 1 : 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.25 }}
			style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: compact ? '12px' : '8px', padding: '20px', boxShadow: compact ? '0 4px 12px rgba(0,0,0,0.06)' : '0 2px 4px rgba(0,0,0,0.1)' }}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
				<div>
					<h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-dark)' }}>{asset.assetName}</h3>
					<div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
						<span style={{ padding: '4px 8px', border: '1px solid var(--color-border-light)', borderRadius: '999px', fontSize: '12px', color: 'var(--color-text-medium)', background: 'var(--color-body-bg)' }}>ID: {asset.assetId}</span>
						<span style={{ padding: '4px 8px', border: '1px solid var(--color-border-light)', borderRadius: '999px', fontSize: '12px', color: 'var(--color-text-medium)', background: 'var(--color-body-bg)' }}>{asset.type}</span>
					</div>
				</div>
				<span style={{ padding: '6px 10px', background: statusColor.bg, color: statusColor.text, borderRadius: '999px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{asset.status}</span>
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px 16px', marginBottom: '12px' }}>
				{[
					{ label: 'Location', value: asset.location },
					{ label: 'Region', value: asset.region },
					{ label: 'Site Code', value: asset.siteCode },
					{ label: 'Registered', value: new Date(asset.registrationDate).toLocaleDateString() }
				].map(({ label, value }) => (
					<div key={label} style={{ minWidth: 0 }}>
						<div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{label}</div>
						<div style={{ fontSize: '14px', color: 'var(--color-text-dark)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
					</div>
				))}
			</div>
			{asset.description && (
				<div style={{ padding: '12px', border: '1px dashed var(--color-border-light)', borderRadius: '8px', background: 'var(--color-body-bg)', color: 'var(--color-text-dark)' }}>
					<div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-medium)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Description</div>
					<div style={{ fontSize: '14px', lineHeight: 1.5 }}>{asset.description}</div>
				</div>
			)}
			{(onEdit || onDelete) && (
				<div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
					{onEdit && (
						<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onEdit(asset.assetId)} style={{ flex: 1, padding: '10px 16px', backgroundColor: 'var(--color-light-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
							<Edit size={16} /> Update
						</motion.button>
					)}
					{onDelete && (
						<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onDelete(asset.id)} style={{ flex: 1, padding: '10px 16px', backgroundColor: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
							<Trash2 size={16} /> Delete
						</motion.button>
					)}
				</div>
			)}
		</motion.div>
	);
};


const SupervisorDashboard = () => {
	const [activeTab, setActiveTab] = useState('asset-registration');
	const [registeredAssets, setRegisteredAssets] = useState([
		{ id: 1, assetId: 'AST-001', assetName: 'Main Distribution Panel', type: 'Generator', status: 'Available', location: 'Building A - Ground Floor', region: 'North Zone', siteCode: 'BLD-A-001', description: 'Primary electrical distribution panel for Building A', registrationDate: '2024-01-15T00:00:00.000Z' },
		{ id: 2, assetId: 'AST-002', assetName: 'HVAC System Unit 1', type: 'HVAC', status: 'Available', location: 'Building B - Rooftop', region: 'Central Zone', siteCode: 'BLD-B-002', description: 'Main heating, ventilation, and air conditioning unit', registrationDate: '2024-01-10T00:00:00.000Z' },
		{ id: 3, assetId: 'AST-003', assetName: 'Emergency Generator', type: 'Generator', status: 'Maintenance', location: 'Building C - Basement', region: 'South Zone', siteCode: 'BLD-C-003', description: 'Backup power generator for emergency situations', registrationDate: '2024-01-20T00:00:00.000Z' },
		{ id: 4, assetId: 'AST-004', assetName: 'Water Pump System', type: 'Network Equipment', status: 'Available', location: 'Building D - Utility Room', region: 'East Zone', siteCode: 'BLD-D-004', description: 'Primary water circulation and pressure system', registrationDate: '2023-12-15T00:00:00.000Z' },
		{ id: 5, assetId: 'AST-005', assetName: 'Fire Safety System', type: 'Server', status: 'Available', location: 'Building A - All Floors', region: 'North Zone', siteCode: 'BLD-A-005', description: 'Comprehensive fire detection and suppression system', registrationDate: '2023-12-20T00:00:00.000Z' },
		{ id: 6, assetId: 'AST-006', assetName: 'Transformer Unit T-101', type: 'Generator', status: 'Available', location: 'Substation A - East Wing', region: 'West Zone', siteCode: 'SUB-A-006', description: 'High voltage transformer for power distribution', registrationDate: '2024-01-25T00:00:00.000Z' },
		{ id: 7, assetId: 'AST-007', assetName: 'Cooling Tower System', type: 'HVAC', status: 'Not Available', location: 'Building B - North Side', region: 'Central Zone', siteCode: 'BLD-B-007', description: 'Industrial cooling system for temperature regulation', registrationDate: '2024-02-01T00:00:00.000Z' }
	]);
	const [expandedMenus, setExpandedMenus] = useState({ assets: true, maintenance: false, workOrder: false, technician: false, reports: false });
	const { technicians, setTechnicians, workOrders, setWorkOrders } = useAppData();
	const [selectedTechnician, setSelectedTechnician] = useState(null);
	const [maintenancePlans, setMaintenancePlans] = useState([]);

	useEffect(() => {
		const t = setTimeout(() => {
			const el = document.getElementById('supervisor-dashboard-content');
			el?.scrollTo({ top: 0, behavior: 'smooth' });
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}, 50);
		return () => clearTimeout(t);
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
		{ key: 'maintenance', label: 'Maintenance Plan', icon: Calendar, items: [ { id: 'view-plan', label: 'View Plan', icon: FileText } ] },
		{ key: 'workOrder', label: 'Work Order', icon: Clipboard, items: [ { id: 'assign-work', label: 'Assign Work', icon: UserCheck } ] },
		{ key: 'technician', label: 'Assigned Technician', icon: Users, items: [ { id: 'search-technician', label: 'Search Technician', icon: Search }, { id: 'register-technician', label: 'Register Technician', icon: Plus }, { id: 'view-assignments', label: 'View Assignments', icon: FileText } ] },
		{ key: 'reports', label: 'Reports', icon: BarChart3, items: [ { id: 'asset-history', label: 'Asset History', icon: FileText }, { id: 'technician-summary', label: 'Technician Summary', icon: TrendingUp } ] }
	];

	const renderActiveTab = () => {
		switch (activeTab) {
			case 'asset-registration':
				return <AssetRegistration registeredAssets={registeredAssets} setRegisteredAssets={setRegisteredAssets} />;
			case 'search-assets':
				return <SearchAssets registeredAssets={registeredAssets} setRegisteredAssets={setRegisteredAssets} />;
			case 'assign-work':
				return <AssignWork workOrders={workOrders} setWorkOrders={setWorkOrders} technicians={technicians} setMaintenancePlans={setMaintenancePlans} />;
			case 'view-assignments':
				return <ViewAssignments workOrders={workOrders} selectedTechnician={selectedTechnician} onClearFilter={() => setSelectedTechnician(null)} />;
			case 'asset-history':
				return <AssetHistory workOrders={workOrders} />;
			case 'technician-summary':
				return <TechnicianSummary workOrders={workOrders} />;
			case 'search-technician':
				return (
					<SearchTechnicians
						technicians={technicians}
						onViewAssignments={(tech) => {
							setSelectedTechnician(tech);
							setActiveTab('view-assignments');
						}}
					/>
				);
			case 'register-technician':
				return <RegisterTechnician technicians={technicians} setTechnicians={setTechnicians} />;
			case 'view-plan':
				return <MaintenancePlans maintenancePlans={maintenancePlans} />;
			default:
				return <AssetRegistration registeredAssets={registeredAssets} setRegisteredAssets={setRegisteredAssets} />;
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