import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  MapPin,
  ArrowRight,
  Wrench
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  // Simple Starting Logo Component
  const UniqueLogo = ({ size = 24 }) => (
    <Wrench size={size} style={{ color: 'white' }} />
  );

  return (
    <div className="auth-layout">
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(3, 45, 66, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000
      }}>
        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, var(--color-light-primary) 0%, var(--color-success-btn) 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
          }}>
            <UniqueLogo size={24} />
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: 'var(--color-white)',
            margin: 0
          }}>
            Asset Tracker
          </h1>
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              color: 'var(--color-white)',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ paddingTop: '100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-container"
          style={{ maxWidth: '1200px' }}
        >
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div className="auth-logo" style={{ margin: '0 auto 30px', width: '100px', height: '100px' }}>
              <UniqueLogo size={48} />
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                color: 'var(--color-white)',
                marginBottom: '20px',
                lineHeight: '1.1'
              }}
            >
              Professional Asset
              <br />
              <span style={{ color: 'var(--color-success-btn)' }}>Maintenance Tracker</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                fontSize: '1.3rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '40px',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto 40px'
              }}
            >
              Streamline your utility asset maintenance with our comprehensive tracking system. 
              Monitor, manage, and maintain your infrastructure efficiently.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <button
                onClick={() => navigate('/register')}
                className="btn btn-primary"
                style={{
                  padding: '16px 32px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                Get Started <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              marginBottom: '60px'
            }}
          >
            {[
              {
                icon: <Shield size={32} />,
                title: 'Secure Asset Management',
                description: 'Enterprise-grade security for all your asset data with role-based access control and audit trails.'
              },
              {
                icon: <BarChart3 size={32} />,
                title: 'Real-time Analytics',
                description: 'Comprehensive dashboards and reporting tools to track asset performance and maintenance schedules.'
              },
              {
                icon: <Users size={32} />,
                title: 'Team Collaboration',
                description: 'Seamlessly coordinate maintenance tasks across teams with assignment tracking and notifications.'
              },
              {
                icon: <CheckCircle size={32} />,
                title: 'Compliance Ready',
                description: 'Built-in compliance features to meet industry standards and regulatory requirements.'
              },
              {
                icon: <Clock size={32} />,
                title: 'Automated Scheduling',
                description: 'Smart scheduling system for preventive maintenance with customizable frequency plans.'
              },
              {
                icon: <MapPin size={32} />,
                title: 'Location Tracking',
                description: 'Comprehensive location and site management with detailed asset positioning and mapping.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '30px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={{
                  color: 'var(--color-success-btn)',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: 'var(--color-white)',
                  marginBottom: '15px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>


        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage; 