import { useMemo } from 'react';
import PropTypes from 'prop-types';

const STATUS_STYLES = {
  Completed: {
    background: 'var(--status-completed-bg)',
    color: 'var(--status-completed-text)'
  },
  'In Progress': {
    background: 'var(--status-in-progress-bg)',
    color: 'var(--status-in-progress-text)'
  },
  Assigned: {
    background: 'var(--status-assigned-bg, #cce5ff)',
    color: 'var(--status-assigned-text, #004085)'
  },
  'Not Assigned': {
    background: 'var(--status-open-bg)',
    color: 'var(--status-open-text)'
  },
  Pending: {
    background: 'var(--status-pending-bg, #ffeeba)',
    color: 'var(--status-pending-text, #856404)'
  }
};

const DEFAULT_STYLE = {
  background: 'var(--color-border-light)',
  color: 'var(--color-text-medium)'
};

const StatusBadge = ({ status = 'Unknown' }) => {
  const badgeStyle = useMemo(() => ({
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    display: 'inline-block',
    ...(STATUS_STYLES[status] || DEFAULT_STYLE)
  }), [status]);

  return (
    <span style={badgeStyle}>
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string
};

export default StatusBadge;