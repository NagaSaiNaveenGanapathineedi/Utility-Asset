import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Modal from '../Modal';
import { useAppData } from '../../context/AppDataContext.jsx';
import { useAuth } from '../../App';

// Work Orders Component
const WorkOrders = () => {
  const { workOrders, setWorkOrders } = useAppData();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [confirmStatusById, setConfirmStatusById] = useState({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const seededRef = useRef(false);

  useEffect(() => {
    const techId = user?.employeeId || user?.technicianId;
    const techName = user?.name;
    const mine = workOrders.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName));
    if (!seededRef.current && mine.length === 0 && (techId || techName)) {
      const baseId = (techId || techName || 'TECH').toString().replace(/[^A-Za-z0-9]/g, '').slice(-6) || 'TECH';
      const dummies = [
        { workId: `HWO-${baseId}-01`, description: 'Inspect rooftop ventilation system', priority: 'High', status: 'Assigned', scheduledDate: '2025-08-10', requestedBy: 'System', requestedById: 'SYS-001', assignedToId: techId || '', assignedTo: techName || '' },
        { workId: `HWO-${baseId}-02`, description: 'Test backup generator auto-start', priority: 'Medium', status: 'Open', scheduledDate: '2025-08-12', requestedBy: 'Operations', requestedById: 'OPS-002', assignedToId: techId || '', assignedTo: techName || '' },
        { workId: `HWO-${baseId}-03`, description: 'Replace server room air filter', priority: 'Low', status: 'Assigned', scheduledDate: '2025-08-15', requestedBy: 'IT Dept', requestedById: 'IT-003', assignedToId: techId || '', assignedTo: techName || '' }
      ];
      setWorkOrders(prev => {
        const ids = new Set(prev.map(o => o.workId));
        const toAdd = dummies.filter(d => !ids.has(d.workId));
        return toAdd.length ? [...prev, ...toAdd] : prev;
      });
      seededRef.current = true;
    }
    setOrders(mine);
  }, [workOrders, user]);

  const handleConfirmSelect = (id, value) => {
    setConfirmStatusById(prev => ({ ...prev, [id]: value }));
  };
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };
  const handleStatusUpdate = (id) => {
    const selected = confirmStatusById[id];
    if (!selected) return;

    setWorkOrders(prev => prev.map(o => o.workId === id ? { ...o, status: selected, completedAt: selected === 'Done' ? new Date().toISOString() : o.completedAt } : o));
    setConfirmStatusById(prev => { const { [id]: _, ...rest } = prev; return rest; });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress-text)' };
      case 'Pending':
        return { bg: 'var(--status-open-bg)', text: 'var(--status-open-text)' };
      case 'Assigned':
        return { bg: 'var(--status-completed-bg)', text: 'var(--status-completed-text)' };
      case 'Done':
        return { bg: 'var(--status-completed-bg)', text: 'var(--status-completed-text)' };
      default:
        return { bg: 'var(--color-border-light)', text: 'var(--color-text-medium)' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'var(--status-open-text)';
      case 'Medium':
        return 'var(--status-in-progress-text)';
      case 'Low':
        return 'var(--status-completed-text)';
      default:
        return 'var(--color-text-medium)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 style={{ color: 'var(--color-text-dark)' }}>My Work Orders</h2>
      <p style={{
        color: 'var(--color-text-medium)',
        fontSize: '1rem',
        marginBottom: '30px'
      }}>
        Manage and update your assigned work orders
      </p>

      {/* Work Orders List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {orders.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: 'var(--color-text-medium)',
            backgroundColor: 'var(--color-body-bg)',
            borderRadius: '8px'
          }}>
            No assigned work orders yet.
          </div>
        ) : (
          orders.filter(o => o.status !== 'Done').map((order) => (
            <motion.div
              key={order.workId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border-light)',
                borderRadius: '8px',
                padding: '20px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ color: 'var(--color-text-dark)', margin: 0, fontSize: '1.1rem' }}>
                  {order.description}
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    ...getStatusColor(order.status),
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                  <strong>ID:</strong> {order.workId}
                </p>
                <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                  <strong>Scheduled:</strong> {order.scheduledDate}
                </p>
                <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
                  <strong>Requested By:</strong> {order.requestedBy} ({order.requestedById})
                </p>
              </div>

              {/* Status update controls */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                <select
                  value={confirmStatusById[order.workId] || ''}
                  onChange={(e) => handleConfirmSelect(order.workId, e.target.value)}
                  style={{ ...{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', fontSize: '14px', fontWeight: '400', color: 'var(--color-text-dark)', backgroundColor: 'var(--color-white)', transition: 'all 0.2s ease', fontFamily: 'inherit', outline: 'none' }, maxWidth: '200px' }}
                >
                  <option value="">--select--</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}
                  disabled={!confirmStatusById[order.workId] || confirmStatusById[order.workId] === order.status}
                  onClick={() => handleStatusUpdate(order.workId)}
                >
                  Update
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '8px 16px', fontSize: '0.9rem' }}
                  onClick={() => handleViewDetails(order)}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        title={`Work Order ${selectedOrder?.workId || ''}`}
        maxWidth="650px"
      >
        {selectedOrder && (
          <div style={{ display: 'grid', gap: '10px' }}>
            <p><strong>Description:</strong> {selectedOrder.description}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Scheduled:</strong> {selectedOrder.scheduledDate}</p>
            <p><strong>Requested By:</strong> {selectedOrder.requestedBy} ({selectedOrder.requestedById})</p>
            {selectedOrder.assignedTo && (
              <p><strong>Assigned To:</strong> {selectedOrder.assignedTo} {selectedOrder.assignedToId ? `(${selectedOrder.assignedToId})` : ''}</p>
            )}
            {selectedOrder.priority && (
              <p><strong>Priority:</strong> {selectedOrder.priority}</p>
            )}
            <p><strong>Work ID:</strong> {selectedOrder.workId}</p>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default WorkOrders;
