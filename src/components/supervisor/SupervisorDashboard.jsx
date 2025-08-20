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
	UserCheck,
	TrendingUp,
	FileText,
	Eye,
	Trash2
} from 'lucide-react';
import Modal from '../Modal';
import { technicians } from '../technician/TechnicianDashboard';

// Shared styles/utilities
const styles = {
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

const getStatusColor = (status) => {
	switch (status) {
		case 'Available': return { bg: 'var(--status-completed-bg)', text: 'var(--status-completed-text)' };
		case 'Not Available': return { bg: 'var(--status-open-bg)', text: 'var(--status-open-text)' };
		case 'Maintenance': return { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress-text)' };
		default: return { bg: 'var(--color-border-light)', text: 'var(--color-text-medium)' };
	}
};

// Reusable cards
const SimpleCard = ({ icon: Icon, title, lead, body }) => (
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

const AssetCard = ({ asset, compact = false, onEdit, onDelete }) => {
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
	// Shared work orders across tabs
	const [workOrders, setWorkOrders] = useState([
		{ workId: 'WO001', planId: 'PLN-101', scheduledDate: '2025-07-30', status: 'Open', description: 'Fix faulty AC unit in Server Room', priority: 'High', requestedBy: 'Bob Smith', requestedById: 'USR-001', assignedTo: '', assignedToId: '' },
		{ workId: 'WO002', planId: 'PLN-102', scheduledDate: '2025-08-05', status: 'Open', description: 'Install new network switch in Office 302', priority: 'Medium', requestedBy: 'David Lee', requestedById: 'USR-002', assignedTo: '', assignedToId: '' },
		{ workId: 'WO003', planId: 'PLN-103', scheduledDate: '2025-07-25', status: 'Open', description: 'Routine maintenance of HVAC system', priority: 'Low', requestedBy: 'Eve White', requestedById: 'USR-003', assignedTo: '', assignedToId: '' },
		{ workId: 'WO004', planId: 'PLN-104', scheduledDate: '2025-07-31', status: 'Open', description: 'Troubleshoot printer in HR department', priority: 'High', requestedBy: 'Grace Hall', requestedById: 'USR-004', assignedTo: '', assignedToId: '' },
		{ workId: 'WO005', planId: 'PLN-105', scheduledDate: '2025-08-02', status: 'Open', description: 'Replace broken monitor in Conference Room A', priority: 'Medium', requestedBy: 'Helen Clark', requestedById: 'USR-005', assignedTo: '', assignedToId: '' }
	]);

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
		{ key: 'maintenance', label: 'Maintenance Plan', icon: Calendar, items: [ { id: 'plan-creation', label: 'Plan Creation', icon: Plus }, { id: 'view-plan', label: 'View Plan', icon: FileText }, { id: 'update-plan', label: 'Update Plan', icon: Edit } ] },
		{ key: 'workOrder', label: 'Work Order', icon: Clipboard, items: [ { id: 'assign-work', label: 'Assign Work', icon: UserCheck } ] },
		{ key: 'technician', label: 'Technician', icon: Users, items: [ { id: 'search-technician', label: 'Search Technician', icon: Search }, { id: 'view-assignments', label: 'View Assignments', icon: FileText } ] },
		{ key: 'reports', label: 'Reports', icon: BarChart3, items: [ { id: 'asset-history', label: 'Asset History', icon: FileText }, { id: 'technician-summary', label: 'Technician Summary', icon: TrendingUp } ] }
	];

	const simpleTabConfig = {
		'plan-creation': { icon: Plus, title: 'Plan Creation', lead: 'Create comprehensive maintenance plans for assets', body: { title: 'Maintenance Planning', text: 'Create detailed maintenance schedules and procedures for your assets.' } },
		'view-plan': { icon: Eye, title: 'View Plans', lead: 'Review and monitor existing maintenance plans', body: { title: 'Plan Overview', text: 'View all maintenance plans, schedules, and upcoming activities.' } },
		'update-plan': { icon: Edit, title: 'Update Plans', lead: 'Modify existing maintenance plans and schedules', body: { title: 'Plan Modification', text: 'Update maintenance schedules, procedures, and plan details.' } },
		// technician group uses functional view for assignments; keep search as simple card
		'search-technician': { icon: Search, title: 'Search Technician', lead: 'Find technicians by skills, availability, and location', body: { title: 'Technician Directory', text: 'Search by name, skills, department, or availability status.' } }
	};

	const renderActiveTab = () => {
		if (simpleTabConfig[activeTab]) return <SimpleCard {...simpleTabConfig[activeTab]} />;
		switch (activeTab) {
			case 'asset-registration':
				return <AssetRegistration registeredAssets={registeredAssets} setRegisteredAssets={setRegisteredAssets} />;
			case 'search-assets':
				return <SearchAssets registeredAssets={registeredAssets} setRegisteredAssets={setRegisteredAssets} />;
			case 'assign-work':
				return <AssignWork workOrders={workOrders} setWorkOrders={setWorkOrders} />;
			case 'view-assignments':
				return <ViewAssignments workOrders={workOrders} />;
			case 'asset-history':
				return <AssetHistory workOrders={workOrders} />;
			case 'technician-summary':
				return <TechnicianSummary workOrders={workOrders} />;
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

const AssetRegistration = ({ registeredAssets, setRegisteredAssets }) => {
	const [formData, setFormData] = useState({ assetId: '', assetName: '', type: '', status: 'Available', location: '', region: '', siteCode: '', description: '' });
	const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.assetId || !formData.assetName || !formData.type || !formData.location || !formData.region || !formData.siteCode) return alert('Please fill in all required fields');
		const newId = Math.max(...registeredAssets.map(a => a.id)) + 1;
		setRegisteredAssets(prev => [...prev, { id: newId, ...formData, registrationDate: new Date().toISOString() }]);
		alert('Asset registered successfully!');
		setFormData({ assetId: '', assetName: '', type: '', status: 'Available', location: '', region: '', siteCode: '', description: '' });
	};
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Asset Registration</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Register new assets in the system with complete information</p>
			<form onSubmit={handleSubmit} style={{ width: '100%' }}>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
					{[
						{ name: 'assetId', label: 'Asset ID *', type: 'text', placeholder: 'Enter asset ID' },
						{ name: 'assetName', label: 'Asset Name *', type: 'text', placeholder: 'Enter asset name' },
						{ name: 'type', label: 'Type *', type: 'select', options: ['', 'Server', 'HVAC', 'Printer', 'Network Equipment', 'Generator'] },
						{ name: 'location', label: 'Location *', type: 'text', placeholder: 'Enter location' },
						{ name: 'region', label: 'Region *', type: 'text', placeholder: 'Enter region' },
						{ name: 'siteCode', label: 'Site Code *', type: 'text', placeholder: 'Enter site code' }
					].map((f) => (
						<div key={f.name} className="form-group">
							<label style={styles.label}>{f.label}</label>
							{f.type === 'select' ? (
								<select name={f.name} value={formData[f.name]} onChange={handleChange} style={styles.input}>
									{f.options.map((o) => (<option key={o} value={o}>{o ? o : 'Select type'}</option>))}
								</select>
							) : (
								<input name={f.name} type="text" value={formData[f.name]} onChange={handleChange} style={styles.input} placeholder={f.placeholder} />
							)}
						</div>
					))}
				</div>
				<div className="form-group" style={{ marginBottom: '30px' }}>
					<label style={styles.label}>Description</label>
					<textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter asset description..." style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }} rows="4" />
				</div>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ minWidth: '200px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}>Register Asset</motion.button>
				</div>
			</form>
		</motion.div>
	);
};

const SearchAssets = ({ registeredAssets, setRegisteredAssets }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedType, setSelectedType] = useState('');
	const [filteredAssets, setFilteredAssets] = useState(registeredAssets);
	useEffect(() => {
		let list = [...registeredAssets];
		if (searchTerm) list = list.filter(a => [a.assetId, a.assetName, a.type, a.location, a.region, a.siteCode].some(v => v.toLowerCase().includes(searchTerm.toLowerCase())));
		if (selectedType) list = list.filter(a => a.type === selectedType);
		setFilteredAssets(list);
	}, [registeredAssets, searchTerm, selectedType]);
	const assetTypes = Array.from(new Set(registeredAssets.map(a => a.type)));
	const handleEditAsset = (assetId) => alert(`Edit functionality for asset ${assetId} would open an edit modal here.`);
	const handleDeleteAsset = (assetId) => { if (window.confirm('Are you sure you want to delete this asset?')) { setRegisteredAssets(prev => prev.filter(a => a.id !== assetId)); alert('Asset deleted successfully!'); } };
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Search Assets</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Find and filter assets using advanced search criteria</p>
			<div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', backgroundColor: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '10px', padding: '16px' }}>
				<input type="text" placeholder="Search by ID, name, type, location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input} />
				<select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ ...styles.input, maxWidth: '240px' }}>
					<option value="">All Types</option>
					{assetTypes.map(t => (<option key={t} value={t}>{t}</option>))}
				</select>
			</div>
			<div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'var(--color-body-bg)', borderRadius: '8px', border: '1px solid var(--color-border-light)' }}>
				<p style={{ margin: 0, color: 'var(--color-text-medium)', fontSize: '0.9rem' }}>
					{searchTerm || selectedType ? (
						<>
							<strong style={{ color: 'var(--color-text-dark)' }}>{filteredAssets.length}</strong> asset{filteredAssets.length !== 1 ? 's' : ''} found
							{searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
							{selectedType && <span> of type "<strong>{selectedType}</strong>"</span>}
						</>
					) : (
						<>
							<strong style={{ color: 'var(--color-text-dark)' }}>{registeredAssets.length}</strong> total assets available
						</>
					)}
				</p>
			</div>
			{filteredAssets.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-medium)', backgroundColor: 'var(--color-body-bg)', borderRadius: '8px' }}>
					<Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
					<h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>No Assets Found</h3>
					<p>Try adjusting your search criteria or register new assets.</p>
				</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
					{filteredAssets.map(asset => (
						<AssetCard key={asset.id} asset={asset} compact onEdit={handleEditAsset} onDelete={handleDeleteAsset} />
					))}
				</div>
			)}
		</motion.div>
	);
};

const AssignWork = ({ workOrders, setWorkOrders }) => {
	const [pendingAssigneeByWorkId, setPendingAssigneeByWorkId] = useState({});
	const handleAssigneeSelect = (workId, techName) => {
		setPendingAssigneeByWorkId(prev => ({ ...prev, [workId]: techName }));
	};
	const handleAssign = (workId) => {
		const techName = pendingAssigneeByWorkId[workId];
		if (!techName) return;
		const tech = technicians.find(t => t.name === techName);
		setWorkOrders(list => {
			const updated = list.map(w => w.workId === workId ? { ...w, assignedTo: techName, assignedToId: tech?.technicianId || '', status: 'Assigned' } : w);
			try {
				const existing = JSON.parse(localStorage.getItem('assignedWorkOrders') || '[]');
				const updatedOrder = updated.find(w => w.workId === workId);
				if (updatedOrder) {
					const idx = existing.findIndex(a => a.workId === workId);
					if (idx >= 0) existing[idx] = updatedOrder; else existing.push(updatedOrder);
					localStorage.setItem('assignedWorkOrders', JSON.stringify(existing));
				}
			} catch {}
			return updated;
		});
		setPendingAssigneeByWorkId(prev => { const { [workId]: _, ...rest } = prev; return rest; });
	};
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)', marginBottom: '16px' }}>Assign Work</h2>
			<div style={{ overflowX: 'auto' }}>
				<table style={styles.table}>
					<thead>
						<tr>
							<th style={styles.th}>ID</th>
							<th style={styles.th}>Description</th>
							<th style={styles.th}>Priority</th>
							<th style={styles.th}>Assign Technician</th>
							<th style={styles.th}>Requested By</th>
							<th style={styles.th}>Action</th>
						</tr>
					</thead>
											<tbody>
							{workOrders.filter(wo => !wo.assignedTo).map((wo) => (
								<tr key={wo.workId}>
									<td style={styles.td}>{wo.workId}</td>
									<td style={styles.td}>{wo.description}</td>
									<td style={styles.td}>{wo.priority}</td>
																	<td style={styles.td}>
									<select value={pendingAssigneeByWorkId[wo.workId] || ''} onChange={(e) => handleAssigneeSelect(wo.workId, e.target.value)} style={{ ...styles.input, maxWidth: '260px' }}>
										<option value="">Select technician</option>
										{technicians.map(t => (<option key={t.technicianId} value={t.name}>{t.name} ({t.skill})</option>))}
									</select>
								</td>
								<td style={styles.td}>{wo.requestedBy} <span style={{ opacity: 0.6 }}>({wo.requestedById})</span></td>
								<td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
									<button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.9rem' }} disabled={!pendingAssigneeByWorkId[wo.workId]} onClick={() => handleAssign(wo.workId)}>Assign</button>
								</td>
							</tr>
							))}
						</tbody>
				</table>
			</div>
		</motion.div>
	);
};

const ViewAssignments = ({ workOrders }) => {
	const assigned = workOrders.filter(w => w.assignedTo);
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Technician Assignments</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '20px' }}>Current assignments and their status</p>
			{assigned.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '30px', background: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '8px', color: 'var(--color-text-medium)' }}>
					No assignments yet. Assign tasks in the Assign Work tab.
				</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
					{assigned.map((w) => (
						<div key={w.workId} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
								<strong style={{ color: 'var(--color-text-dark)' }}>{w.workId}</strong>
								<span style={{ padding: '4px 8px', borderRadius: '999px', background: w.status === 'Done' ? 'var(--status-completed-bg)' : 'var(--status-in-progress-bg)', color: w.status === 'Done' ? 'var(--status-completed-text)' : 'var(--status-in-progress-text)', fontSize: '12px', fontWeight: 600 }}>{w.status === 'Done' ? 'Task Completed' : 'In Progress'}</span>
							</div>
							<div style={{ marginBottom: '6px', color: 'var(--color-text-dark)' }}>{w.description}</div>
							<div style={{ fontSize: '13px', color: 'var(--color-text-medium)' }}>
								<div><strong>Technician:</strong> {w.assignedTo} <span style={{ opacity: 0.6 }}>({w.assignedToId || '—'})</span></div>
								<div><strong>Requested By:</strong> {w.requestedBy} <span style={{ opacity: 0.6 }}>({w.requestedById})</span></div>
							</div>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
};

const AssetHistory = ({ workOrders }) => {
	const history = workOrders.map(w => ({
		id: w.workId,
		description: w.description,
		requestedById: w.requestedById,
		assignedToId: w.assignedToId,
		status: w.status,
		scheduledDate: w.scheduledDate
	}));
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Asset History</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '20px' }}>Logs of requests and assignments</p>
			{history.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '30px', background: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '8px', color: 'var(--color-text-medium)' }}>
					No history yet.
				</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
					{history.map((h) => (
						<div key={h.id} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
								<strong style={{ color: 'var(--color-text-dark)' }}>{h.id}</strong>
								<span style={{ padding: '4px 8px', borderRadius: '999px', background: h.status === 'Done' ? 'var(--status-completed-bg)' : 'var(--status-in-progress-bg)', color: h.status === 'Done' ? 'var(--status-completed-text)' : 'var(--status-in-progress-text)', fontSize: '12px', fontWeight: 600 }}>{h.status}</span>
							</div>
							<div style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>{h.description}</div>
							<div style={{ fontSize: '13px', color: 'var(--color-text-medium)', display: 'grid', gap: '4px' }}>
								<div><strong>Requested User ID:</strong> {h.requestedById}</div>
								<div><strong>Assigned Technician ID:</strong> {h.assignedToId || '—'}</div>
								<div><strong>Scheduled:</strong> {h.scheduledDate}</div>
							</div>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
};

const TechnicianSummary = ({ workOrders }) => {
	const summary = workOrders.reduce((acc, w) => {
		if (!w.assignedTo && !w.assignedToId) return acc;
		const key = w.assignedToId || w.assignedTo;
		if (!acc[key]) acc[key] = { assignedTo: w.assignedTo, assignedToId: w.assignedToId || '', total: 0, inProgress: 0, done: 0 };
		acc[key].total += 1;
		if (w.status === 'Done') acc[key].done += 1; else acc[key].inProgress += 1;
		return acc;
	}, {});
	const entries = Object.values(summary);
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Technician Summary</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '20px' }}>Assigned tasks overview by technician</p>
			{entries.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '30px', background: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '8px', color: 'var(--color-text-medium)' }}>
					No technician assignments yet.
				</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
					{entries.map((e, idx) => (
						<div key={idx} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}>
							<div style={{ marginBottom: '8px', color: 'var(--color-text-dark)', fontWeight: 700 }}>{e.assignedTo} <span style={{ opacity: 0.6, fontWeight: 500 }}>({e.assignedToId || '—'})</span></div>
							<div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--color-text-medium)' }}>
								<div><strong>Total:</strong> {e.total}</div>
								<div><strong>In Progress:</strong> {e.inProgress}</div>
								<div><strong>Completed:</strong> {e.done}</div>
							</div>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
};

export default SupervisorDashboard; 