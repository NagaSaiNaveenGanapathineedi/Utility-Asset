import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft 
} from 'lucide-react';
import Modal from '../components/Modal';
import TermsContent from '../components/TermsContent';
import PrivacyContent from '../components/PrivacyContent';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setEmail('');
    setErrors({});
  };

  // Success state
  if (submitted) {
    return (
      <div className="auth-layout">
        <div className="auth-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="auth-card"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <motion.div 
                className="auth-logo"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-success-btn) 0%, #22c55e 100%)',
                  margin: '0 auto 24px auto'
                }}
              >
                <CheckCircle size={36} className="text-white" />
              </motion.div>
              
              <h1 className="auth-title">Check Your Email</h1>
              <p className="auth-subtitle" style={{ marginBottom: '32px' }}>
                We've sent password reset instructions to:
                <br />
                <strong style={{ color: 'var(--color-success-btn)' }}>{email}</strong>
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="alert alert-success"
                style={{ marginBottom: '32px' }}
              >
                <CheckCircle size={20} />
                <div>
                  <p className="font-semibold mb-1">Instructions Sent!</p>
                  <p className="text-sm">
                    Please check your email and follow the link to reset your password. 
                    The reset link will expire in 1 hour for security reasons.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}
              >
                <Link to="/login" className="btn btn-primary btn-full">
                  Back to Login
                </Link>
                
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '16px' }}>
                  Didn't receive the email?{' '}
                  <button
                    onClick={handleTryAgain}
                    className="link"
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    try again
                  </button>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="auth-header"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="auth-logo"
              style={{ background: 'linear-gradient(135deg, var(--color-dark-primary) 0%, var(--color-light-primary) 100%)' }}
            >
              <Zap size={36} className="text-white" />
            </motion.div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </motion.div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="form-group"
            >
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-group">
                <Mail size={20} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="form-error"
                >
                  <AlertCircle size={16} />
                  {errors.email}
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Sending Instructions...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </motion.button>

            {/* Back to Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-center"
            >
              <Link 
                to="/login" 
                className="link"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '0.95rem'
                }}
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </motion.div>
          </form>
        </motion.div>

        {/* Help Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="alert alert-info"
        >
          <Mail size={20} />
          <div>
            <p className="font-semibold mb-1">Need Help?</p>
            <p className="text-sm">
              If you're having trouble accessing your account, please contact your system administrator 
              or IT support team for assistance.
            </p>
          </div>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            For security reasons, reset links expire after 1 hour
          </p>
        </motion.div>

        {/* Legal Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center mt-4"
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="link"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              Terms & Conditions
            </button>
            {' • '}
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="link"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              Privacy Policy
            </button>
          </p>
        </motion.div>
      </div>

      {/* Terms Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms & Conditions"
      >
        <TermsContent />
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <PrivacyContent />
      </Modal>
    </div>
  );
};

export default ForgotPasswordPage; 