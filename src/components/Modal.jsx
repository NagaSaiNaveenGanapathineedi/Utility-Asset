import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback } from 'react';
import './styles/components.css';

const ModalHeader = ({ title, onClose }) => (
  <div className="modal-header">
    <h2 className="modal-title">{title}</h2>
    <button onClick={onClose} className="modal-close-btn">
      <X size={16} />
    </button>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, maxWidth = '550px' }) => {
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const stopPropagation = useCallback((e) => e.stopPropagation(), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="modal-content"
            onClick={stopPropagation}
            style={{ maxWidth }}
          >
            <ModalHeader title={title} onClose={onClose} />
            <div className="modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal; 