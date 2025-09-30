import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { styles } from './supervisorStyles';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { FREQUENCY_MAP } from '../../config/constants';

export const AssignWork = ({ workOrders, technicians, onAssignmentComplete, handleTabChange, onDataChange }) => {
    const initialWorkOrder = useMemo(() => ({
        planId: "",
        userId: "",
        techId: "",
        assetId: null,
        description: "",
        requestedDate: "",
        status: "",
        frequency: "",
        workId: null
    }), []);

    const [workOrder, setWorkOrder] = useState(initialWorkOrder);
    const [assignedWorkOrders, setAssignedWorkOrders] = useState(new Set());
    const [showSuccess, setShowSuccess] = useState(false);
    const [assignedTechName, setAssignedTechName] = useState('');
    const [loading, setLoading] = useState(false);

    const getFrequencyLabel = useCallback((frequency) => {
        return FREQUENCY_MAP[frequency] || 'Weekly';
    }, []);

    const selectTechnician = useCallback((work, techId) => {
        const parsedTechId = parseInt(techId, 10);
        if (isNaN(parsedTechId)) return;
        
        setWorkOrder({
            userId: work.userId?.id,
            techId: parsedTechId,
            assetId: work.assetId?.id,
            description: work.desc,
            requestedDate: work.requestedDate,
            status: "Assigned",
            frequency: work.frequency,
            workId: work.workId,
            planId: -100
        });
    }, []);

    const handleAssign = useCallback(async (workOrderData) => {
        const requiredFields = ['planId', 'userId', 'techId', 'assetId', 'description', 'requestedDate', 'status', 'frequency', 'workId'];
        const missingFields = requiredFields.filter(field => 
            workOrderData[field] === null || workOrderData[field] === undefined || workOrderData[field] === ""
        );

        if (missingFields.length > 0) {
            console.error("Incomplete workOrder data. Missing fields:", missingFields);
            return;
        }
        
        setLoading(true);
        try {
            await axios.put(API_ENDPOINTS.WORKORDER_UPDATE(workOrderData.workId), workOrderData);
            
            const techName = technicians.find(t => t.id === workOrderData.techId)?.name || 'Technician';
            setAssignedTechName(techName);
            setAssignedWorkOrders(prev => new Set([...prev, workOrderData.workId]));
            setShowSuccess(true);
            
            setTimeout(() => setShowSuccess(false), 3000);
            
            onAssignmentComplete?.();
            onDataChange?.();
        } catch (error) {
            console.error("Error updating work order:", error);
        } finally {
            setLoading(false);
        }
    }, [technicians, onAssignmentComplete, onDataChange]);

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
                        {useMemo(() => 
                            workOrders.filter(wo => wo.techId === null && !assignedWorkOrders.has(wo.workId)), 
                            [workOrders, assignedWorkOrders]
                        ).map((wo) => (
                            <tr key={wo.workId}>
                                <td style={styles.td}>WO-{wo.workId}</td>
                                <td style={styles.td}>{wo.assetId?.name || 'N/A'}</td>
                                <td style={styles.td}>{wo.desc || 'N/A'}</td>
                                <td style={styles.td}>{getFrequencyLabel(wo.frequency)}</td>
                                <td style={styles.td}>{wo.assetId?.type || 'N/A'}</td>
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
                                <td style={styles.td}>{wo.userId?.name || 'N/A'}</td>
                                <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ 
                                            padding: '8px 14px', 
                                            fontSize: '0.9rem',
                                            opacity: loading ? 0.7 : 1,
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }}
                                        disabled={!(workOrder.workId === wo.workId && workOrder.techId) || loading}
                                        onClick={() => handleAssign(workOrder)}
                                    >
                                        {loading ? 'Assigning...' : 'Assign'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        background: 'var(--status-completed-bg)',
                        color: 'var(--status-completed-text)',
                        padding: '16px 24px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        fontWeight: '600'
                    }}
                >
                    ✓ Technician {assignedTechName} assigned successfully!
                </motion.div>
            )}
        </motion.div>
    );
};