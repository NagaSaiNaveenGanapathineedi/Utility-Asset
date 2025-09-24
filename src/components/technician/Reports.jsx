import { motion } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext.jsx';
import { useAuth } from '../../App';
import {
  Wrench,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Reports Overview (moved stats here)
const ReportsOverview = () => {
  const { workOrders } = useAppData();
  const { user } = useAuth();
  const techId = user?.employeeId || user?.technicianId;
  const techName = user?.name;
  const mine = workOrders.filter(o => (o.assignedToId && techId && o.assignedToId === techId) || (o.assignedTo && techName && o.assignedTo === techName));
  const pendingCount = mine.filter(o => o.status === 'Open' || o.status === 'Assigned').length;
  const inProgressCount = mine.filter(o => o.status === 'In Progress').length;
  const doneTodayCount = mine.filter(o => o.status === 'Done').length; // simplistic
  const stats = [
    { icon: Clock, label: 'Yet to Start', value: String(pendingCount), color: 'var(--status-open-text)' },
    { icon: Wrench, label: 'In Progress', value: String(inProgressCount), color: 'var(--status-in-progress-text)' },
    { icon: CheckCircle, label: 'Completed', value: String(doneTodayCount), color: 'var(--status-completed-text)' }
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
      <h2 style={{ color: 'var(--color-text-dark)' }}>Reports & Analytics</h2>
      <p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Overview</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border-light)',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            <stat.icon size={32} style={{ color: stat.color, marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: 'var(--color-text-dark)',
              margin: '0 0 8px 0'
            }}>
              {stat.value}
            </h3>
            <p style={{ color: 'var(--color-text-medium)', margin: 0, fontSize: '0.9rem' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReportsOverview;
