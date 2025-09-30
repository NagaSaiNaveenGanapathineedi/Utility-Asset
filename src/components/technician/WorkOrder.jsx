import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../Modal';
import axios from 'axios';

const WorkOrderCard = React.memo(({ order, confirmStatusById, handleConfirmSelect, handleViewDetails, handleUpdate, completionData, handleCompletionDataChange }) => {
  const isCompleted = confirmStatusById[order?.workId] === 'Completed';
  return (
    <motion.div
      key={order?.workId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border-light)',
        borderRadius: '8px',
        padding: '20px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <h3 style={{ color: 'var(--color-text-dark)', margin: 0, fontSize: '1.1rem' }}>
          {order?.desc}
        </h3>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
          <strong>Asset :</strong> {order?.assetId?.name}
        </p>
        <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
          <strong>Requested By:</strong> {order?.userId?.name} ({"USR-"+order?.userId?.id})
        </p>
        <p style={{ color: 'var(--color-text-medium)', margin: '5px 0', fontSize: '0.9rem' }}>
          <strong>Maintenance </strong>(Days): {order?.frequency}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
        <select
          value={confirmStatusById[order?.workId] || ''}
          onChange={(e) => handleConfirmSelect(order, e.target.value)}
          style={{ ...{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', fontSize: '14px', fontWeight: '400', color: 'var(--color-text-dark)', backgroundColor: 'var(--color-white)', transition: 'all 0.2s ease', fontFamily: 'inherit', outline: 'none' }, maxWidth: '200px' }}
        >
          <option value="">--select--</option>
          <option value="Pending">In Progress</option>
          <option value="Completed">Done</option>
        </select>
        <button
          className="btn btn-primary"
          style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}
          disabled={!confirmStatusById[order.workId]}
          onClick={() => handleUpdate(order.workId)}
        >
          Update
        </button>
      </div>

      {isCompleted && (
        <div style={{ marginTop: '15px' }}>
          <input
            type="number"
            placeholder="Estimated Hours"
            value={completionData[order.workId]?.hours || ''}
            onChange={(e) => handleCompletionDataChange(order.workId, 'hours', e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <textarea
            placeholder="Work Description"
            value={completionData[order.workId]?.description || ''}
            onChange={(e) => handleCompletionDataChange(order.workId, 'description', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px' }}
          />
        </div>
      )}

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
  );
});
WorkOrderCard.displayName = 'WorkOrderCard';

const WorkOrderDetailsModal = ({ isOpen, onClose, order }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Work Order ${order?.workId || ''}`} maxWidth="650px">
      {order && (
        <div style={{ display: 'grid', gap: '10px' }}>
          <p><strong>Asset:</strong> {order?.assetId?.name}</p>
          <p><strong>Description:</strong> {order?.desc}</p>
          <p><strong>Status:</strong> {order?.status}</p>
          <p><strong>Due Date:</strong> {order?.planId?.nextMaintenanceDate}</p>
          <p><strong>Requested By:</strong> {order?.userId?.name} ({"USR-"+order?.userId?.id})</p>          <p>{order?.assetId?.name} was requested by {order?.userId?.name} on {order?.requestedDate} for a {order?.frequency} days. The problem is {order?.desc} and it&apos;s type is {order?.assetId?.type}. Complete it by {order?.planId?.nextMaintenanceDate}.</p>
        </div>
      )}
    </Modal>
  );
};

const WorkOrders = ({ workorders }) => {
  const [orders, setOrders] = useState([]);
  const [confirmStatusById, setConfirmStatusById] = useState({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({
    workId: '',
    desc: '',
    status: '',
    assetId: '',
    userId: '',
    planId: '',
    requestedDate: '',
    frequency: ''
  });
  const [completionData, setCompletionData] = useState({});

  useEffect(() => {
    setOrders(workorders.filter(o => o?.status !== 'Completed'));
  }, [workorders]);

  const handleConfirmSelect = (work, value) => {
    setConfirmStatusById((prev) => ({ ...prev, [work.workId]: value }));
    setSelectedOrder({
      workId: work?.workId,
      desc: work?.desc,
      status: value,
      assetId: work?.assetId.id,
      userId: work?.userId.id,
      planId: work?.planId.id,
      requestedDate: work?.requestedDate,
      frequency: work?.frequency
    });
  };

  const handleCompletionDataChange = (workId, field, value) => {
    setCompletionData(prev => ({
        ...prev,
        [workId]: { ...prev[workId], [field]: value }
    }));
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdate = async (workId) => {
    try {
      const orderToUpdate = orders.find(o => o.workId === workId);
      const updatedOrder = {
        ...orderToUpdate,
        status: confirmStatusById[workId],
        estimatedHours: completionData[workId]?.hours,
        description: completionData[workId]?.description,
      };
      console.log(updatedOrder);
      const response = await axios.put(`http://localhost:9092/workorder/updateStatus/${workId}`, updatedOrder);
      if (response.status === 200) {
        setOrders((prev) => prev.filter((o) => o.workId !== workId));
      }
      handleCloseDetails();
      setConfirmStatusById((prev) => {
        const newConfirmStatus = { ...prev };
        delete newConfirmStatus[workId];
        return newConfirmStatus;
      });
      setCompletionData((prev) => {
        const newCompletionData = { ...prev };
        delete newCompletionData[workId];
        return newCompletionData;
      });
      setSelectedOrder(null);
      console.log(response.data);
    } catch (error) {
      console.error('Error updating work order status:', error);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
      <h2 style={{ color: 'var(--color-text-dark)' }}>My Work Orders</h2>
      <p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>
        Manage and update your assigned work orders
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {orders.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--color-text-medium)', backgroundColor: 'var(--color-body-bg)', borderRadius: '8px' }}>
            No assigned work orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <WorkOrderCard
              key={order?.workId}
              order={order}
              confirmStatusById={confirmStatusById}
              handleConfirmSelect={handleConfirmSelect}
              handleUpdate={handleUpdate}
              handleViewDetails={handleViewDetails}
              completionData={completionData}
              handleCompletionDataChange={handleCompletionDataChange}
            />
          ))
        )}
      </div>

      <WorkOrderDetailsModal isOpen={isDetailsOpen} onClose={handleCloseDetails} order={selectedOrder} />
    </motion.div>
  );
};

export default WorkOrders;