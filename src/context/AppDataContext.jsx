import { createContext, useContext, useState } from 'react';

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
	const [technicians, setTechnicians] = useState([
		{ technicianId: 'T-001', name: 'Alice Johnson', skill: 'HVAC', region: 'North Zone' },
		{ technicianId: 'T-002', name: 'Brian Smith', skill: 'Electrical', region: 'South Zone' },
		{ technicianId: 'T-003', name: 'Carla Gomez', skill: 'Network', region: 'Central Zone' },
		{ technicianId: 'T-004', name: 'David Lee', skill: 'Mechanical', region: 'East Zone' },
		{ technicianId: 'T-005', name: 'Eva Patel', skill: 'HVAC', region: 'West Zone' }
	]);

	const [workOrders, setWorkOrders] = useState([
		{ workId: 'WO001', planId: 'PLN-101', scheduledDate: '2025-07-30', status: 'Open', description: 'Fix faulty AC unit in Server Room', requestedBy: 'Bob Smith', maintenancePlan: 'Monthly', requestedById: 'USR-001', assignedTo: '', assignedToId: '' },
		{ workId: 'WO002', planId: 'PLN-102', scheduledDate: '2025-08-05', status: 'Open', description: 'Install new network switch in Office 302', requestedBy: 'David Lee', maintenancePlan: 'Weekly', requestedById: 'USR-002', assignedTo: '', assignedToId: '' },
		{ workId: 'WO003', planId: 'PLN-103', scheduledDate: '2025-07-25', status: 'Open', description: 'Routine maintenance of HVAC system', requestedBy: 'Eve White', maintenancePlan: 'Monthly', requestedById: 'USR-003', assignedTo: '', assignedToId: '' },
		{ workId: 'WO004', planId: 'PLN-104', scheduledDate: '2025-07-31', status: 'Open', description: 'Troubleshoot printer in HR department', requestedBy: 'Grace Hall', maintenancePlan: 'Quarterly', requestedById: 'USR-004', assignedTo: '', assignedToId: '' },
		{ workId: 'WO005', planId: 'PLN-105', scheduledDate: '2025-08-02', status: 'Open', description: 'Replace broken monitor in Conference Room A', requestedBy: 'Helen Clark', maintenancePlan: 'Yearly', requestedById: 'USR-005', assignedTo: '', assignedToId: '' }
	]);

	return (
		<AppDataContext.Provider value={{ technicians, setTechnicians, workOrders, setWorkOrders }}>
			{children}
		</AppDataContext.Provider>
	);
};

export const useAppData = () => {
	const ctx = useContext(AppDataContext);
	if (!ctx) throw new Error('useAppData must be used within an AppDataProvider');
	return ctx;
}; 