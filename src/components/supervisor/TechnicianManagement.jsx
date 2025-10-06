import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { styles } from './supervisorStyles';
import StatusBadge from './StatusBadge';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { SKILLS, REGIONS, LOCATIONS, DEFAULT_PASSWORD } from '../../config/constants';
import LoadingSpinner from './LoadingSpinner';

export const ViewAssignments = ({ workOrders = [], loading = false, setApiCallMade }) => {
	const assigned = useMemo(() => workOrders.filter(w => w.techId != null), [workOrders]);
	
	if (loading) {
		return <LoadingSpinner />;
	}
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
					{assigned.map((w) => {
						const assignmentDetails = [
							{ label: 'Asset', value: w.assetId?.name || 'N/A' },
							{ label: 'Technician', value: w.techId?.name || 'N/A' },
							{ label: 'Requested By', value: w.userId?.name || 'N/A' },
							{ label: 'Plan', value: `PLN-${w.planId.planId}` },
							{ label: 'Maintenance (days)', value: w.frequency }
						];

						return (
							<div key={w.workId} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
									<strong style={{ color: 'var(--color-text-dark)' }}>WO-{w.workId}</strong>
									<StatusBadge status={w.status} />
								</div>
								<div style={{ marginBottom: '6px', color: 'var(--color-text-dark)' }}>{w.desc}</div>
								<div style={{ fontSize: '13px', color: 'var(--color-text-medium)' }}>
									{assignmentDetails.map(({ label, value }) => (
										<div key={label}><strong>{label}:</strong> {value}</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</motion.div>
	);
};

export const RegisterTechnician = ({ handleTabChange, onDataChange, setApiCallMade }) => {
	const initialForm = useMemo(() => ({
		name: '',
		email: '',
		password: DEFAULT_PASSWORD,
		phno: '',
		region: '',
		pincode: '',
		location: '',
		skill: '',
		role: 'technician'
	}), []);

	const [form, setForm] = useState(initialForm);
	const [loading, setLoading] = useState(false);
	
	const handleChange = useCallback((e) => {
		setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
	}, []);
	
	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();
		
		if (!form.name || !form.email || !form.phno || !form.skill || !form.region || !form.location) {
			console.error('Validation failed: Missing required fields');
			return;
		}
		
		const phoneNumber = parseInt(form.phno, 10);
		if (isNaN(phoneNumber)) {
			console.error('Invalid phone number');
			return;
		}
		
		setLoading(true);
		try {
			const payload = { ...form, phno: phoneNumber };
			await axios.post(API_ENDPOINTS.USER_SAVE, payload);
			
			setForm(initialForm);
			onDataChange?.();
			setApiCallMade?.(prev => !prev);
			handleTabChange('search-technician');
		} catch (error) {
			console.error('Error registering technician:', error);
		} finally {
			setLoading(false);
		}
	}, [form, handleTabChange, onDataChange, initialForm]);

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Register Technician</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Add a new technician to the system</p>
			<form onSubmit={handleSubmit} style={{ width: '100%' }}>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
					<div className="form-group">
						<label style={styles.label}>Name *</label>
						<input name="name" type="text" value={form.name} onChange={handleChange} style={styles.input} placeholder="Enter full name" />
					</div>
					<div className="form-group">
						<label style={styles.label}>Email *</label>
						<input name="email" type="text" value={form.email} onChange={handleChange} style={styles.input} placeholder="Enter email" />
						{!/^[^\s@]+@[^\s@]+\.(com)$/.test(form.email) && form.email && ( <small style={{ color: 'red' }}>Please enter a valid email address</small> )}
					</div>
					<div className="form-group">
						<label style={styles.label}>Phone Number *</label>
						<input name="phno" type="text" value={form.phno} onChange={handleChange} style={styles.input} placeholder="Enter phone number" />
						{!/^[6-9]\d{9}$/.test(form.phno) && form.phno && ( <small style={{ color: 'red' }}>Please enter a valid 10-digit phone number starting with 6-9</small> )}
					</div>
					<div className="form-group">
						<label style={styles.label}>Skill *</label>
						<select name="skill" value={form.skill} onChange={handleChange} style={styles.input}>
							<option value="">Select skill</option>
							{SKILLS.map(s => (<option key={s} value={s}>{s}</option>))}
						</select>
					</div>
					<div className="form-group">
						<label style={styles.label}>Location *</label>
						<select name="location" value={form.location} onChange={handleChange} style={styles.input}>
							<option value="">Select location</option>
							{LOCATIONS.map(s => (<option key={s} value={s}>{s}</option>))}
						</select>
					</div>
					<div className="form-group">
						<label style={styles.label}>Region *</label>
						<select name="region" value={form.region} onChange={handleChange} style={styles.input}>
							<option value="">Select region</option>
							{REGIONS.map(r => (<option key={r} value={r}>{r}</option>))}
						</select>
					</div>
					<div className="form-group">
						<label style={styles.label}>Pincode *</label>
						<input name="pincode" type="text" value={form.pincode} onChange={handleChange} style={styles.input} placeholder="Enter pincode" />
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<motion.button 
						whileHover={{ scale: loading ? 1 : 1.02 }} 
						whileTap={{ scale: loading ? 1 : 0.98 }} 
						type="submit" 
						disabled={loading}
						className="btn btn-primary" 
						style={{ 
							minWidth: '200px', 
							padding: '12px 24px', 
							fontSize: '16px', 
							fontWeight: '600',
							opacity: loading ? 0.7 : 1,
							cursor: loading ? 'not-allowed' : 'pointer'
						}}
					>
						{loading ? 'Registering...' : 'Register'}
					</motion.button>
				</div>
			</form>
		</motion.div>
	);
};

export const SearchTechnicians = ({ technicians = [], handleTabChange, loading = false, setApiCallMade }) => {
	const [searchTerm, setSearchTerm] = useState('');
	
	const filtered = useMemo(() => {
		let list = [...technicians];
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			list = list.filter(t => 
				[t.id, t.name, t.skill, t.region]
					.some(v => v && String(v).toLowerCase().includes(term))
			);
		}
		return list;
	}, [searchTerm, technicians]);
	
	if (loading) {
		return <LoadingSpinner />;
	}
	
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
							<strong style={{ color: 'var(--color-text-dark)' }}>{filtered.length}</strong> technician{filtered.length !== 1 ? 's' : ''} found matching &quot;<strong>{searchTerm}</strong>&quot;
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
					{filtered.map(t => {
						const technicianDetails = [
							{ label: 'Technician ID', value: `TEC-${t.id}` },
							{ label: 'Location', value: t.location },
							{ label: 'Region', value: t.region }
						];

						return (
							<motion.div
								key={t.id}
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{ duration: 0.25 }}
								style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
							>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
									<div>
										<h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-dark)' }}>{t.name}</h3>
										<div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
											<span style={{ padding: '4px 8px', border: '1px solid var(--color-border-light)', borderRadius: '999px', fontSize: '12px', color: 'var(--color-text-medium)', background: 'var(--color-body-bg)' }}>ID: {t.id}</span>
											<span style={{ padding: '4px 8px', border: '1px solid var(--color-border-light)', borderRadius: '999px', fontSize: '12px', color: 'var(--color-text-medium)', background: 'var(--color-body-bg)' }}>{t.skill}</span>
										</div>
									</div>
									<span style={{ padding: '6px 10px', background: 'var(--color-body-bg)', color: 'var(--color-text-medium)', borderRadius: '999px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t.region}</span>
								</div>
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px 16px', marginBottom: '12px' }}>
									{technicianDetails.map(({ label, value }) => (
										<div key={label} style={{ minWidth: 0 }}>
											<div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{label}</div>
											<div style={{ fontSize: '14px', color: 'var(--color-text-dark)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
										</div>
									))}
								</div>
								<div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
									<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem' }} onClick={() => handleTabChange("view-assignments")}>View Assignments</motion.button>
								</div>
							</motion.div>
						);
					})}
				</div>
			)}
		</motion.div>
	);
};