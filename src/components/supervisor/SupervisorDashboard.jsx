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
import { useAppData } from '../../context/AppDataContext.jsx';

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

	const simpleTabConfig = {
		// keep for future simple cards
	};

	const renderActiveTab = () => {
		if (simpleTabConfig[activeTab]) return <SimpleCard {...simpleTabConfig[activeTab]} />;
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
	// Edit modal state
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingAsset, setEditingAsset] = useState(null);
	const [editForm, setEditForm] = useState({ assetId: '', assetName: '', type: '', status: 'Available', location: '', region: '', siteCode: '', description: '' });
	useEffect(() => {
		let list = [...registeredAssets];
		if (searchTerm) list = list.filter(a => [a.assetId, a.assetName, a.type, a.location, a.region, a.siteCode].some(v => v.toLowerCase().includes(searchTerm.toLowerCase())));
		if (selectedType) list = list.filter(a => a.type === selectedType);
		setFilteredAssets(list);
	}, [registeredAssets, searchTerm, selectedType]);
	const assetTypes = Array.from(new Set(registeredAssets.map(a => a.type)));
	// Open edit modal with selected asset data
	const handleEditAsset = (assetId) => {
		const asset = registeredAssets.find(a => a.assetId === assetId);
		if (!asset) return;
		setEditingAsset(asset);
		setEditForm({
			assetId: asset.assetId || '',
			assetName: asset.assetName || '',
			type: asset.type || '',
			status: asset.status || 'Available',
			location: asset.location || '',
			region: asset.region || '',
			siteCode: asset.siteCode || '',
			description: asset.description || ''
		});
		setIsEditOpen(true);
	};
	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditForm(prev => ({ ...prev, [name]: value }));
	};
	const handleSaveEdit = (e) => {
		e?.preventDefault?.();
		if (!editingAsset) return;
		if (!editForm.assetId || !editForm.assetName || !editForm.type || !editForm.location || !editForm.region || !editForm.siteCode) {
			alert('Please fill in all required fields');
			return;
		}
		setRegisteredAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...a, ...editForm } : a));
		setIsEditOpen(false);
		setEditingAsset(null);
	};
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
			<Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Asset" maxWidth="700px">
				<form onSubmit={handleSaveEdit} style={{ width: '100%' }}>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
						{[
							{ name: 'assetId', label: 'Asset ID *', type: 'text', placeholder: 'Enter asset ID' },
							{ name: 'assetName', label: 'Asset Name *', type: 'text', placeholder: 'Enter asset name' },
							{ name: 'type', label: 'Type *', type: 'select', options: ['', 'Server', 'HVAC', 'Printer', 'Network Equipment', 'Generator'] },
							{ name: 'status', label: 'Status *', type: 'select', options: ['Available', 'Not Available', 'Maintenance'] },
							{ name: 'location', label: 'Location *', type: 'text', placeholder: 'Enter location' },
							{ name: 'region', label: 'Region *', type: 'text', placeholder: 'Enter region' },
							{ name: 'siteCode', label: 'Site Code *', type: 'text', placeholder: 'Enter site code' }
						].map((f) => (
							<div key={f.name} className="form-group">
								<label style={styles.label}>{f.label}</label>
								{f.type === 'select' ? (
									<select name={f.name} value={editForm[f.name]} onChange={handleEditChange} style={styles.input}>
										{f.options.map((o) => (<option key={o} value={o}>{o ? o : 'Select type'}</option>))}
									</select>
								) : (
									<input name={f.name} type="text" value={editForm[f.name]} onChange={handleEditChange} style={styles.input} placeholder={f.placeholder} />
								)}
							</div>
						))}
					</div>
					<div className="form-group" style={{ marginBottom: '16px' }}>
						<label style={styles.label}>Description</label>
						<textarea name="description" value={editForm.description} onChange={handleEditChange} placeholder="Enter asset description..." style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }} rows="4" />
					</div>
					<div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
						<button type="button" className="btn" onClick={() => setIsEditOpen(false)} style={{ padding: '10px 16px' }}>Cancel</button>
						<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ padding: '10px 16px', fontWeight: '600' }}>Save Changes</motion.button>
					</div>
				</form>
			</Modal>
		</motion.div>
	);
};

const AssignWork = ({ workOrders, setWorkOrders, technicians, setMaintenancePlans }) => {
	const [pendingAssigneeByWorkId, setPendingAssigneeByWorkId] = useState({});
	const handleAssigneeSelect = (workId, techName) => {
		setPendingAssigneeByWorkId(prev => ({ ...prev, [workId]: techName }));
	};
	const addDays = (date, days) => {
		const d = new Date(date);
		d.setDate(d.getDate() + days);
		return d;
	};
	const computeNextDate = (frequency) => {
		const base = new Date(); // always from current date
		switch (frequency) {
			case 'Weekly': return addDays(base, 7);
			case 'Monthly': return addDays(base, 30);
			case 'Quarterly': return addDays(base, 90);
			case 'Yearly': return addDays(base, 365);
			default: return addDays(base, 14);
		}
	};
	const handleAssign = (workId) => {
		const techName = pendingAssigneeByWorkId[workId];
		if (!techName) return;
		const tech = technicians.find(t => t.name === techName);
		let assignedWorkOrder = null;
		setWorkOrders(list => {
			const updated = list.map(w => {
				if (w.workId === workId) {
					assignedWorkOrder = { ...w, assignedTo: techName, assignedToId: tech?.technicianId || '', status: 'Assigned' };
					return assignedWorkOrder;
				}
				return w;
			});
			return updated;
		});
		if (assignedWorkOrder) {
			const nextDate = computeNextDate(assignedWorkOrder.maintenancePlan);
			const plan = {
				planId: `PLN-${Math.floor(100 + Math.random()*900)}`,
				workOrderId: assignedWorkOrder.workId,
				technicianName: techName,
				userName: assignedWorkOrder.requestedBy,
				frequency: assignedWorkOrder.maintenancePlan,
				message: `Your maintenance will be done on ${nextDate.toLocaleDateString()}`
			};
			setMaintenancePlans(prev => [...prev, plan]);
		}
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
							<th style={styles.th}>Frequency</th>
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
								<td style={styles.td}>{wo.maintenancePlan}</td>
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

const ViewAssignments = ({ workOrders, selectedTechnician, onClearFilter }) => {
	let assigned = workOrders.filter(w => w.assignedTo);
	if (selectedTechnician) {
		assigned = assigned.filter(w => (w.assignedToId && w.assignedToId === selectedTechnician.technicianId) || (w.assignedTo && w.assignedTo === selectedTechnician.name));
	}
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Technician Assignments</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '20px' }}>Current assignments and their status</p>
			{selectedTechnician && (
				<div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
					<div style={{ padding: '8px 12px', background: 'var(--color-body-bg)', borderRadius: '8px', border: '1px solid var(--color-border-light)', color: 'var(--color-text-dark)' }}>
						<strong>Filtered by:</strong> {selectedTechnician.name} <span style={{ opacity: 0.6 }}>({selectedTechnician.technicianId})</span>
					</div>
					<button className="btn" style={{ padding: '8px 12px' }} onClick={onClearFilter}>Clear Filter</button>
				</div>
			)}
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

// Maintenance Plans list
const MaintenancePlans = ({ maintenancePlans }) => {
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Maintenance Plans</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '20px' }}>Upcoming maintenance based on assignments</p>
			{maintenancePlans.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '30px', background: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '8px', color: 'var(--color-text-medium)' }}>
					No plans yet. Assign work to generate a maintenance plan.
				</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
					{maintenancePlans.map((p, idx) => (
						<div key={`${p.planId}-${idx}`} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
								<strong style={{ color: 'var(--color-text-dark)' }}>{p.planId}</strong>
								<span style={{ padding: '4px 8px', borderRadius: '999px', background: 'var(--status-in-progress-bg)', color: 'var(--status-in-progress-text)', fontSize: '12px', fontWeight: 600 }}>Planned</span>
							</div>
							<div style={{ fontSize: '13px', color: 'var(--color-text-medium)', display: 'grid', gap: '6px' }}>
								<div><strong>Work Order:</strong> {p.workOrderId}</div>
								<div><strong>Technician:</strong> {p.technicianName}</div>
								<div><strong>User:</strong> {p.userName}</div>
								<div><strong>Frequency:</strong> {p.frequency}</div>
								<div style={{ marginTop: '8px', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', background: 'var(--color-body-bg)', color: 'var(--color-text-dark)', fontWeight: 700 }}>{p.message}</div>
							</div>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
};

// Register Technician Component
const RegisterTechnician = ({ technicians, setTechnicians }) => {
	const [form, setForm] = useState({ name: '', skill: '', region: '' });
	const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
	const computeNextId = (list) => {
		const maxNum = list.reduce((max, t) => {
			const match = String(t.technicianId || '').match(/T-(\d+)/i);
			const num = match ? parseInt(match[1], 10) : 0;
			return Math.max(max, num);
		}, 0);
		const next = maxNum + 1;
		return `T-${String(next).padStart(3, '0')}`;
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.name || !form.skill || !form.region) {
			alert('Please fill in all fields');
			return;
		}
		const nextId = computeNextId(technicians);
		setTechnicians(prev => [...prev, { technicianId: nextId, name: form.name, skill: form.skill, region: form.region }]);
		alert(`Technician registered successfully with ID ${nextId}`);
		setForm({ name: '', skill: '', region: '' });
	};
	const skills = ['', 'HVAC', 'Electrical', 'Network', 'Mechanical', 'Generator', 'Fire Safety'];
	const regions = ['', 'North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
	const nextIdPreview = computeNextId(technicians);
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Register Technician</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Add a new technician to the system</p>
			<form onSubmit={handleSubmit} style={{ width: '100%' }}>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
					<div className="form-group">
						<label style={styles.label}>Generated Technician ID</label>
						<input type="text" value={nextIdPreview} readOnly style={{ ...styles.input, opacity: 0.8, cursor: 'not-allowed' }} />
					</div>
					<div className="form-group">
						<label style={styles.label}>Name *</label>
						<input name="name" type="text" value={form.name} onChange={handleChange} style={styles.input} placeholder="Enter full name" />
					</div>
					<div className="form-group">
						<label style={styles.label}>Skill *</label>
						<select name="skill" value={form.skill} onChange={handleChange} style={styles.input}>
							{skills.map(s => (<option key={s} value={s}>{s || 'Select skill'}</option>))}
						</select>
					</div>
					<div className="form-group">
						<label style={styles.label}>Region *</label>
						<select name="region" value={form.region} onChange={handleChange} style={styles.input}>
							{regions.map(r => (<option key={r} value={r}>{r || 'Select region'}</option>))}
						</select>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ minWidth: '200px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}>Register</motion.button>
				</div>
			</form>
		</motion.div>
	);
};

// Technician Search (similar to SearchAssets)
const SearchTechnicians = ({ technicians, onViewAssignments }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filtered, setFiltered] = useState(technicians);
	useEffect(() => {
		let list = [...technicians];
		if (searchTerm) list = list.filter(t => [t.technicianId, t.name, t.skill, t.region].some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase())));
		setFiltered(list);
	}, [searchTerm, technicians]);
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Search Technicians</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Find technicians and view their assignments</p>
			<div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', backgroundColor: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '10px', padding: '16px' }}>
				<input type="text" placeholder="Search by ID, name, skill, region..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input} />
			</div>
			<div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'var(--color-body-bg)', borderRadius: '8px', border: '1px solid var(--color-border-light)' }}>
				<p style={{ margin: 0, color: 'var(--color-text-medium)', fontSize: '0.9rem' }}>
					{searchTerm ? (
						<>
							<strong style={{ color: 'var(--color-text-dark)' }}>{filtered.length}</strong> technician{filtered.length !== 1 ? 's' : ''} found matching "<strong>{searchTerm}</strong>"
						</>
					) : (
						<>
							<strong style={{ color: 'var(--color-text-dark)' }}>{technicians.length}</strong> total technicians available
						</>
					)}
				</p>
			</div>
			{filtered.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-medium)', backgroundColor: 'var(--color-body-bg)', borderRadius: '8px' }}>
					<Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
					<h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>No Technicians Found</h3>
					<p>Try adjusting your search query.</p>
				</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
					{filtered.map(t => (
						<motion.div
							key={t.technicianId}
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.25 }}
							style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
								<div>
									<h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-dark)' }}>{t.name}</h3>
									<div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
										<span style={{ padding: '4px 8px', border: '1px solid var(--color-border-light)', borderRadius: '999px', fontSize: '12px', color: 'var(--color-text-medium)', background: 'var(--color-body-bg)' }}>ID: {t.technicianId}</span>
										<span style={{ padding: '4px 8px', border: '1px solid var(--color-border-light)', borderRadius: '999px', fontSize: '12px', color: 'var(--color-text-medium)', background: 'var(--color-body-bg)' }}>{t.skill}</span>
									</div>
								</div>
								<span style={{ padding: '6px 10px', background: 'var(--color-body-bg)', color: 'var(--color-text-medium)', borderRadius: '999px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t.region}</span>
							</div>
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px 16px', marginBottom: '12px' }}>
								{[
									{ label: 'Technician ID', value: t.technicianId },
									{ label: 'Skill', value: t.skill },
									{ label: 'Region', value: t.region }
								].map(({ label, value }) => (
									<div key={label} style={{ minWidth: 0 }}>
										<div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{label}</div>
										<div style={{ fontSize: '14px', color: 'var(--color-text-dark)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
									</div>
								))}
							</div>
							<div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
								<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem' }} onClick={() => onViewAssignments(t)}>View Assignments</motion.button>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</motion.div>
	);
};

export default SupervisorDashboard; 