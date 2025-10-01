import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import '../styles/components.css';

const EmptyState = () => (
  <div className="empty-state">
    <BarChart3 size={48} className="empty-icon" />
    <h3 className="empty-title">No completed work orders</h3>
    <p className="empty-message">Completed items will appear here after you mark them as Done.</p>
  </div>
);

const WorkOrderCard = ({ order }) => (
  <div className="work-order-card">
    <div className="card-header">
      <h3 className="card-title">{order.assetId.name} Request</h3>
    </div>
    <div className="card-details">
      <p><strong>Requested By:</strong> {order.userId.name}</p>
      <p><strong>Due On:</strong> {order.planId.nextMaintenanceDate}</p>
      <p><strong>Maintenance for:</strong> {order.frequency} days</p>
      <p><strong>Issue:</strong> {order.desc}</p>
    </div>
  </div>
);

const WorkHistory = ({ workorders = [], plans = [] }) => {
  const completedOrders = useMemo(() => 
    workorders.filter(order => order.status === "Completed"), 
    [workorders]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 className="section-title">Work History</h2>
      <p className="section-subtitle">
        <span className="status-badge completed">Completed</span> work orders
      </p>

      {completedOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="work-orders-grid">
          {completedOrders.map(order => (
            <WorkOrderCard key={order.workId} order={order} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WorkHistory;