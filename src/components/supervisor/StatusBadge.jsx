const statusStyles = {
  Completed: {
    background: '#d4edda',
    color: '#155724'
  },
  'In Progress': {
    background: '#fff3cd',
    color: '#856404'
  },
  Assigned: {
    background: '#cce5ff',
    color: '#004085'
  },
  'Not Assigned': {
    background: '#ff99a3ff',
    color: '#fd0019c3'
  },
  Pending: {
    background: '#ffeeba', // warning yellow
    color: '#856404'       // dark amber text
  }
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || {
    background: '#ff99a3ff',
    color: '#2b2626c3',
  };

  return (
    <span
      style={{
        padding: '4px 8px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        display: 'inline-block',
        ...style
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;