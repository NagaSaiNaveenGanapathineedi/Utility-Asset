import { STATUS_TYPES } from '../constants';

const StatusBadge = ({ status, variant = 'default' }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      [STATUS_TYPES.COMPLETED]: 'status-completed',
      [STATUS_TYPES.IN_PROGRESS]: 'status-in-progress', 
      [STATUS_TYPES.PENDING]: 'status-pending',
      [STATUS_TYPES.NOT_ASSIGNED]: 'status-not-assigned'
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <span className={`status-badge ${getStatusClass(status)} ${variant}`}>
      {status}
    </span>
  );
};

export default StatusBadge;