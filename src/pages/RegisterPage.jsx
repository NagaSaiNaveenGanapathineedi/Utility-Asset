import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle
} from 'lucide-react';
import Modal from '../components/Modal';
import TermsContent from '../components/TermsContent';
import PrivacyContent from '../components/PrivacyContent';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  const getRolePermissions = (role) => {
    const permissions = {
      admin: ['user_management', 'asset_management', 'work_orders', 'reports', 'system_config', 'technician_oversight'],
      supervisor: ['asset_management', 'work_orders', 'reports', 'technician_oversight'],
      technician: ['work_orders', 'view_reports'],
      user: ['view_reports']
    };
    return permissions[role] || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Simulate registration API call - automatically set role to "user"
    setTimeout(() => {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: 'user', // Always set to user
        permissions: getRolePermissions('user')
      };
      
      login(userData);
      navigate('/dashboard');
    }, 2000);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    const labels = ['', 'weak', 'fair', 'good', 'strong'];
    const colors = ['', 'strength-weak', 'strength-fair', 'strength-good', 'strength-strong'];
    
    return {
      strength,
      label: labels[strength],
      color: colors[strength]
    };
  };

  const getPasswordStrengthLabel = (strength) => {
    const config = {
      1: { label: 'Weak', className: 'strength-weak' },
      2: { label: 'Fair', className: 'strength-fair' },
      3: { label: 'Good', className: 'strength-good' },
      4: { label: 'Strong', className: 'strength-strong' }
    };
    return config[strength] || { label: '', className: '' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
            >
              <UserPlus size={36} className="text-white" />
            </motion.div>
            <h1 className="auth-title">Create User Account</h1>
            <p className="auth-subtitle">
              Join the Utility Asset Management System
            </p>
          </motion.div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="grid grid-cols-2 gap-4"
              style={{ marginBottom: '25px' }}
            >
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input input-with-icon ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="form-error"
                  >
                    <AlertCircle size={16} />
                    {errors.firstName}
                  </motion.div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '0' }}>
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input input-with-icon ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="form-error"
                  >
                    <AlertCircle size={16} />
                    {errors.lastName}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="example@gmail.com"
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

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="form-group"
            >
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <Lock size={20} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input input-with-icon input-with-icon-right ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '4px', 
                    marginBottom: '4px' 
                  }}>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        style={{
                          height: '4px',
                          flex: 1,
                          backgroundColor: passwordStrength.strength >= level 
                            ? (level === 1 ? '#ef4444' : level === 2 ? '#f59e0b' : level === 3 ? '#3b82f6' : '#22c55e')
                            : 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '2px',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                  {passwordStrength.strength > 0 && (
                    <p style={{ 
                      fontSize: '0.8rem', 
                      margin: '0',
                      color: passwordStrength.strength === 1 ? '#ef4444' : 
                             passwordStrength.strength === 2 ? '#f59e0b' : 
                             passwordStrength.strength === 3 ? '#3b82f6' : '#22c55e'
                    }}>
                      Password strength: {getPasswordStrengthLabel(passwordStrength.strength).label}
                    </p>
                  )}
                </div>
              )}

              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="form-error"
                >
                  <AlertCircle size={16} />
                  {errors.password}
                </motion.div>
              )}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="form-group"
            >
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-group">
                <Lock size={20} className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input input-with-icon input-with-icon-right ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="input-icon-right"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="form-error"
                >
                  <AlertCircle size={16} />
                  {errors.confirmPassword}
                </motion.div>
              )}
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="form-group"
            >
              <label className="checkbox-group">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  className={`checkbox ${errors.terms ? 'border-error' : ''}`}
                />
                <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="link"
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="link"
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.terms && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="form-error"
                >
                  <AlertCircle size={16} />
                  {errors.terms}
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="text-center"
            >
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                Already have an account?{' '}
                <Link to="/login" className="link">
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>

        {/* Account Type Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="alert alert-info"
        >
          <User size={20} />
          <div>
            <p className="font-semibold mb-1">User Account</p>
            <p className="text-sm">
              You're creating a standard user account with access to view reports, monitor system performance, 
              and basic dashboard functionality. Contact your administrator for elevated permissions.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            Asset Monitoring • Report Access • Dashboard Views • System Updates
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

export default RegisterPage; 