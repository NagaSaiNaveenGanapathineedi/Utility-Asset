import { useState } from 'react';
import { motion } from 'framer-motion';
import { styles } from './supervisorStyles';
import axios from 'axios';

export const AssignWork = ({ workOrders, technicians, setLoad, handleTabChange }) => {
    const [workOrder, setworkOrder] = useState({
        planId: "",
        userId: "",
        techId: "",
        assetId: null,
        description: "",
        requestedDate: "",
        status: "",
        frequency: "",
        workId: null
    });

    const computeDate = (frequency) => {
        switch (frequency) {
            case 7: return "Weekly";
            case 30: return "Monthly";
            case 90: return "Quarterly";
            case 365: return "Yearly";
            default: return "Weekly";
        }
    };

    const selectTechnician = (work, techId) => {
        setworkOrder({
            userId: work.userId.id,
            techId: parseInt(techId),
            assetId: work.assetId.id,
            description: work.desc,
            requestedDate: work.requestedDate,
            status: "Assigned",
            frequency: work.frequency,
            workId: work.workId,
			planId: -100
        });
    };

    const handleAssign = async (workOrder) => {
		const requiredFields = [
			workOrder.planId,
			workOrder.userId,
			workOrder.techId,
			workOrder.assetId,
			workOrder.description,
			workOrder.requestedDate,
			workOrder.status,
			workOrder.frequency,
			workOrder.workId
		];

		const allFieldsPresent = requiredFields.every(field => field !== null && field !== undefined && field !== "");

		if (!allFieldsPresent) {
			console.warn("Incomplete workOrder data:", workOrder);
			return;
		}
		try {
			const response =await axios.put("http://localhost:9092/workorder/update/"+workOrder.workId,workOrder);
            ()=>{setLoad(prev=>!prev)}
			console.log(response);
            handleTabChange("assign-work");
		} catch (error) {
			console.error("Error in updating data",error);
		}
	};

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
            <h2 style={{ color: 'var(--color-text-dark)', marginBottom: '16px' }}>Assign Work</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Requested Asset</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Frequency</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Assign Technician</th>
                            <th style={styles.th}>Requested By</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workOrders.filter(wo => wo.techId === null).map((wo) => (
                            <tr key={wo.workId}>
                                <td style={styles.td}>{"WO-" + wo.workId}</td>
                                <td style={styles.td}>{wo.assetId.name}</td>
                                <td style={styles.td}>{wo.desc}</td>
                                <td style={styles.td}>{computeDate(wo.frequency)}</td>
                                <td style={styles.td}>{wo.assetId.type}</td>
                                <td style={styles.td}>
                                    <select
                                        value={workOrder.workId === wo.workId ? workOrder.techId : ''}
                                        onChange={(e) => selectTechnician(wo, e.target.value)}
                                        style={{ ...styles.input, maxWidth: '260px' }}
                                    >
                                        <option value="">Select technician</option>
                                        {technicians.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.name} ({t.skill})
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td style={styles.td}>{wo.userId.name}</td>
                                <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '8px 14px', fontSize: '0.9rem' }}
                                        disabled={!(workOrder.workId === wo.workId && workOrder.techId)}
                                        onClick={()=>handleAssign(workOrder)}
                                    >
                                        Assign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};