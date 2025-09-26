import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';


export const AssetHistory = ({ workOrders }) => {
	const history = workOrders.filter(wo=>wo.techId!=null);
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
						<div key={h.workId} style={{ border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
								<strong>{h.assetId.name}</strong>
								<StatusBadge status={h.status} />
							</div>
							{/* <div style={{ color: 'var(--color-text-dark)', marginBottom: '8px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
								{h.description}
							</div> */}
							<div style={{ fontSize: '13px', color: 'var(--color-text-medium)', display: 'grid', gap: '4px' }}>
								<div><strong>Requested User :</strong> {h.userId.name}</div>
								<div><strong>Assigned Technician :</strong> {h.techId.name || 'Un Assigned'}</div>
								<div><strong>Maintenance till :</strong> {h.planId.nextMaintenanceDate}</div>
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
		if (!w.techId) return acc;
		const key = w.techId.id || w.techId.name;
		if (!acc[key]) {
			acc[key] = {
				assignedTo: w.techId.name,
				assignedToId: w.techId.id || '',
				total: 0,
				inProgress: 0,
				done: 0,
				details: [],
			};
		}
		acc[key].total += 1;
		if (w.status === 'Done') {
			acc[key].done += 1;
		} else {
			acc[key].inProgress += 1;
		}

		const detail = {};
		if (w.assetId && w.assetId.name && w.userId && w.userId.name) {
			detail.asset = w.assetId.name;
			detail.user = w.userId.name;
		}

		if (detail.asset ) {
			const exists = acc[key].details.some(d => d.asset === detail.asset && d.user === detail.user);
			if (!exists) {
				acc[key].details.push(detail);
			}
		}
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
							<div style={{ marginBottom: '8px', color: 'var(--color-text-dark)', fontWeight: 700 }}>{e.assignedTo} <span style={{ opacity: 0.6, fontWeight: 500 }}>({"TEC-"+e.assignedToId || '—'})</span></div>
							<div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--color-text-medium)' }}>
								<div><strong>Total:</strong> {e.total}</div>
								<div><strong>In Progress:</strong> {e.inProgress}</div>
								<div><strong>Completed:</strong> {e.done}</div>
							</div>
							<div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--color-text-medium)' }}>
								<strong>Details:<br/></strong>
								{
									e.details.map((detail, i) => (
										<div key={i}>
											{detail.asset && <span>{detail.asset}<strong> requested by </strong>{detail.user}</span>}
										</div>
									))
								}
							</div>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
};