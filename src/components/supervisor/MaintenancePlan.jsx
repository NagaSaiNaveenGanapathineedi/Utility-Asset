import { motion } from 'framer-motion';

// Maintenance Plans list
export const MaintenancePlan = ({ plans }) => {
	const computeDate = (frequency) => {
        switch (frequency) {
            case 7: return "Weekly";
            case 30: return "Monthly";
            case 90: return "Quarterly";
            case 365: return "Yearly";
            default: return "Weekly";
        }
    };
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Maintenance Plans</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '20px' }}>Upcoming maintenance based on assignments</p>
			{plans.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '30px', background: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '8px', color: 'var(--color-text-medium)' }}>
					No plans yet. Assign work to generate a maintenance plan.
				</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
					{plans.map((p, idx) => (
						<div key={`${p.planId}-${idx}`} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
								<strong style={{ padding: '4px 0px', color: 'var(--color-text-dark)' }}>{"PLN-"+p.planId}</strong>
							</div>
							<div style={{ fontSize: '13px', color: 'var(--color-text-medium)', display: 'grid', gap: '6px' }}>
								<div><strong>Assigned to:</strong> {p.technician.name}</div>
								<div><strong>Frequency:</strong> {computeDate(p.frequency)}</div>
								<div><strong>Due Date:</strong> {p.nextMaintenanceDate}</div>
								<div style={{ marginTop: '8px', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', background: 'var(--color-body-bg)', color: 'var(--color-text-dark)', fontWeight: 700 }}>{p.technician.skill} purpose</div>
							</div>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
};