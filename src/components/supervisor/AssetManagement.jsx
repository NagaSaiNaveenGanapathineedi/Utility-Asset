import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Modal from '../Modal';
import { styles, AssetCard } from './SupervisorDashboard';

export const AssetRegistration = ({ registeredAssets, setRegisteredAssets }) => {
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

export const SearchAssets = ({ registeredAssets, setRegisteredAssets }) => {
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

	const handleSaveEdit = async(e) => {
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