import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FREQUENCY_MAP } from '../../config/constants';
import LoadingSpinner from './LoadingSpinner';

export const MaintenancePlan = ({ plans = [], loading = false, setApiCallMade }) => {
	const getFrequencyLabel = useMemo(() => (frequency) => {
        return FREQUENCY_MAP[frequency] || 'Weekly';
    }, []);
    
    if (loading) {
        return <LoadingSpinner />;
    }
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
			<h2 style={{ color: 'var(--color-text-dark)' }}>Maintenance Plans</h2>
			<p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '20px' }}>Upcoming maintenance based on assignments</p>
			{plans.length === 0 ? (
				<motion.div 
					initial={{ opacity: 0 }} 
					animate={{ opacity: 1 }} 
					style={{ textAlign: 'center', padding: '30px', background: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '8px', color: 'var(--color-text-medium)' }}
				>
					No plans yet. Assign work to generate a maintenance plan.
				</motion.div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
					{plans.map((p, idx) => {
						const planDetails = useMemo(() => [
							{ label: 'Assigned to', value: p.technician?.name || 'N/A' },
							{ label: 'Frequency', value: getFrequencyLabel(p.frequency) },
							{ label: 'Due Date', value: p.nextMaintenanceDate || 'N/A' }
						], [p.technician?.name, p.frequency, p.nextMaintenanceDate]);

						return (
							<motion.div 
								key={`${p.planId}-${idx}`} 
								initial={{ opacity: 0, y: 20 }} 
								animate={{ opacity: 1, y: 0 }} 
								transition={{ delay: idx * 0.1 }}
								style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}
							>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
									<strong style={{ padding: '4px 0px', color: 'var(--color-text-dark)' }}>PLN-{p.planId}</strong>
								</div>
								<div style={{ fontSize: '13px', color: 'var(--color-text-medium)', display: 'grid', gap: '6px' }}>
									{planDetails.map(({ label, value }) => (
										<div key={label}><strong>{label}:</strong> {value}</div>
									))}
									<div style={{ marginTop: '8px', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', background: 'var(--color-body-bg)', color: 'var(--color-text-dark)', fontWeight: 700 }}>
										{p.technician?.skill || 'General'} purpose
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			)}
		</motion.div>
	);
};