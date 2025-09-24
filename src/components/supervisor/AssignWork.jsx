import { useState } from 'react';
import { motion } from 'framer-motion';
import { styles } from './SupervisorDashboard';

export const AssignWork = ({ workOrders, setWorkOrders, technicians, setMaintenancePlans }) => {
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