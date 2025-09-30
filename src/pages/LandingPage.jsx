import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { 
  Shield, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  MapPin,
  ArrowRight,
  Wrench,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const footerRef = useRef(null);
  const isFooterInView = useInView(footerRef, { once: true, margin: "-100px" });

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

      {/* Main Content Container */}
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Main Content */}
        <div style={{ 
          paddingTop: '100px',
          flex: 1
        }}>
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
                marginBottom: '80px'
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

        {/* Simple Footer */}
        <footer ref={footerRef} style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px 20px',
          marginTop: 'auto'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFooterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px'
            }}
          >
            {/* About Us */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isFooterInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ textAlign: 'center' }}
            >
              <h3 style={{
                color: 'var(--color-white)',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                About Us
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                We are a leading provider of professional asset management solutions 
                for utility companies worldwide. Our comprehensive tracking system helps 
                organizations streamline maintenance operations, ensure compliance, and 
                optimize infrastructure performance. With years of experience in the industry, 
                we deliver reliable and efficient solutions.
              </p>
            </motion.div>

            {/* Contact Us */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isFooterInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{ textAlign: 'center' }}
            >
              <h3 style={{
                color: 'var(--color-white)',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Contact Us
              </h3>
              <div style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>
                  Get in touch with our team for support, 
                  demos, or partnership opportunities.
                </p>
                <div style={{ marginTop: '12px' }}>
                  <div>📧 support@assettracker.com</div>
                  <div>📞 +1 (555) 123-4567</div>
                  <div>🕒 Mon-Fri, 9AM-6PM EST</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFooterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              marginTop: '30px',
              paddingTop: '20px',
              textAlign: 'center'
            }}
          >
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.8rem',
              margin: 0
            }}>
              © 2025 Asset Tracker. All rights reserved.
            </p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;