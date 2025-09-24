import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { styles } from './SupervisorDashboard';

export const ViewAssignments = ({ workOrders, selectedTechnician, onClearFilter }) => {
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

// Register Technician Component
export const RegisterTechnician = ({ technicians, setTechnicians }) => {
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
export const SearchTechnicians = ({ technicians, onViewAssignments }) => {
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