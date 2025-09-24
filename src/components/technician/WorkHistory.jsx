import { motion } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext.jsx';
import { useAuth } from '../../App';
import { BarChart3 } from 'lucide-react';

// Work History (moved from Reports content)
const WorkHistory = () => {
  const { workOrders } = useAppData();
  const { user } = useAuth();
  const techId = user?.employeeId || user?.technicianId;
  const techName = user?.name;
  const completed = workOrders.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName)).filter(o => o.status === 'Done');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 style={{ color: 'var(--color-text-dark)' }}>Work History</h2>
      <p style={{
        color: 'var(--color-text-medium)',
        fontSize: '1rem',
        marginBottom: '30px'
      }}>
        Completed work orders
      </p>

      {completed.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--color-text-medium)',
          backgroundColor: 'var(--color-body-bg)',
          borderRadius: '8px'
        }}>
          <BarChart3 size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>No completed work orders</h3>
          <p>Completed items will appear here after you mark them as Done.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {completed.map((order) => (
            <div key={order.workId} style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border-light)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ color: 'var(--color-text-dark)', margin: 0, fontSize: '1rem' }}>{order.description}</h3>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  background: 'var(--status-completed-bg)',
                  color: 'var(--status-completed-text)'
                }}>Done</span>
              </div>
              <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>ID:</strong> {order.workId}</p>
              <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Scheduled:</strong> {order.scheduledDate}</p>
              <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Requested By:</strong> {order.requestedBy} ({order.requestedById})</p>
              {order.completedAt && (
                <p style={{ color: 'var(--color-text-medium)', margin: '4px 0', fontSize: '0.9rem' }}><strong>Completed:</strong> {new Date(order.completedAt).toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WorkHistory;
