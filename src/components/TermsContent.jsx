import { Users, Shield, Lock } from 'lucide-react';

const TermsContent = () => {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '0.9rem' }}>
          Last Updated: {new Date().toLocaleDateString()}
        </p>
        <p style={{ margin: '0 0 16px 0' }}>
          Welcome to the Utility Asset Maintenance Tracker ("Service"). These Terms and Conditions ("Terms") govern your use of our utility asset management platform operated by our company ("we," "us," or "our").
        </p>
      </div>

      {/* Section 1 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Users size={14} />
          1. Acceptance of Terms
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </div>

      {/* Section 2 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Shield size={14} />
          2. Use License
        </h3>
        <p style={{ margin: '0 0 6px 0' }}>
          Permission is granted to temporarily access the Utility Asset Maintenance Tracker for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
          <li>modify or copy the materials</li>
          <li>use the materials for any commercial purpose or for any public display</li>
          <li>attempt to reverse engineer any software contained in the service</li>
          <li>remove any copyright or other proprietary notations from the materials</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Lock size={14} />
          3. Data Security & Privacy
        </h3>
        <p style={{ margin: '0 0 6px 0' }}>
          We are committed to protecting your utility asset data and maintaining the highest security standards:
        </p>
        <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
          <li>All asset data is encrypted in transit and at rest</li>
          <li>Access controls ensure only authorized personnel can view sensitive information</li>
          <li>Regular security audits and penetration testing are conducted</li>
          <li>We comply with industry standards for utility data protection</li>
          <li>User activities are logged for audit and security purposes</li>
        </ul>
      </div>

      {/* Section 4 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          4. User Responsibilities
        </h3>
        <p style={{ margin: '0 0 6px 0' }}>
          As a user of this utility asset management system, you agree to:
        </p>
        <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
          <li>Provide accurate and complete asset information</li>
          <li>Maintain the confidentiality of your login credentials</li>
          <li>Report security incidents or data breaches immediately</li>
          <li>Use the system only for legitimate business purposes</li>
          <li>Comply with all applicable utility regulations and standards</li>
        </ul>
      </div>

      {/* Section 5 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          5. Asset Data Ownership
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          You retain ownership of all utility asset data, maintenance records, and operational information entered into the system. We provide the platform and tools but do not claim ownership of your data. You grant us a limited license to process your data solely for the purpose of providing the service.
        </p>
      </div>

      {/* Section 6 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          6. Service Availability
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          We strive to maintain 99.9% uptime for the service. However, we do not guarantee uninterrupted access and may perform scheduled maintenance. Critical utility operations should not rely solely on this system without proper backup procedures.
        </p>
      </div>

      {/* Section 7 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          7. Limitation of Liability
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the service, even if we have been notified orally or in writing of the possibility of such damage.
        </p>
      </div>

      {/* Section 8 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          8. Modifications
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          We may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service. We will notify users of significant changes via email or system notifications.
        </p>
      </div>

      {/* Contact Info */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          9. Contact Information
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          If you have any questions about these Terms and Conditions, please contact us at:
        </p>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '10px', 
          borderRadius: '6px',
          margin: '6px 0'
        }}>
          <p style={{ margin: '0 0 3px 0', fontSize: '0.8rem' }}>Email: legal@utilitytracker.com</p>
          <p style={{ margin: '0 0 3px 0', fontSize: '0.8rem' }}>Phone: +1 (555) 123-4567</p>
          <p style={{ margin: '0', fontSize: '0.8rem' }}>Address: 123 Utility Drive, Power City, PC 12345</p>
        </div>
      </div>
    </div>
  );
};

export default TermsContent; 