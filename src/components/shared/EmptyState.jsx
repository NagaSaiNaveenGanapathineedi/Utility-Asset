import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  message, 
  action,
  className = '' 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`empty-state ${className}`}
    >
      {Icon && <Icon size={48} className="empty-icon" />}
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {action && <div className="empty-action">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;