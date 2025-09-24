import { motion } from 'framer-motion';

// Maintenance Plans list
export const MaintenancePlans = ({ maintenancePlans }) => {
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