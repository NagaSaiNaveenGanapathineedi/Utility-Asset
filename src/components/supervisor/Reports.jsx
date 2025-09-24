import { motion } from 'framer-motion';

export const AssetHistory = ({ workOrders }) => {
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

export const TechnicianSummary = ({ workOrders }) => {
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