import { Shield, Eye, Database, Settings } from 'lucide-react';

const PrivacyContent = () => {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '0.9rem' }}>
          Effective Date: {new Date().toLocaleDateString()}
        </p>
        <p style={{ margin: '0 0 16px 0' }}>
          This Privacy Policy describes how the Utility Asset Maintenance Tracker ("we," "us," or "our") collects, uses, and protects your information when you use our utility asset management platform.
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
          <Database size={14} />
          1. Information We Collect
        </h3>
        <p style={{ margin: '0 0 6px 0' }}>
          We collect information necessary to provide utility asset management services:
        </p>
        <div style={{ marginLeft: '12px' }}>
          <h4 style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '10px 0 6px 0', fontSize: '0.9rem' }}>
            Personal Information:
          </h4>
          <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
            <li>Name, email address, phone number</li>
            <li>Job title and role information</li>
            <li>User permissions and access levels</li>
            <li>Authentication credentials</li>
          </ul>
          
          <h4 style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '10px 0 6px 0', fontSize: '0.9rem' }}>
            Asset Data:
          </h4>
          <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
            <li>Transformer specifications and locations</li>
            <li>Maintenance records and schedules</li>
            <li>Inspection reports and test results</li>
            <li>Work order history and technician assignments</li>
            <li>Operational performance metrics</li>
          </ul>

          <h4 style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '10px 0 6px 0', fontSize: '0.9rem' }}>
            System Data:
          </h4>
          <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
            <li>Login times and access logs</li>
            <li>IP addresses and device information</li>
            <li>Usage patterns and feature utilization</li>
            <li>Error logs and system performance data</li>
          </ul>
        </div>
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
          <Eye size={14} />
          2. How We Use Your Information
        </h3>
        <p style={{ margin: '0 0 6px 0' }}>
          We use the collected information to:
        </p>
        <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
          <li>Provide utility asset management and tracking services</li>
          <li>Generate maintenance reports and compliance documentation</li>
          <li>Send notifications about asset conditions and scheduled maintenance</li>
          <li>Ensure system security and prevent unauthorized access</li>
          <li>Improve service functionality and user experience</li>
          <li>Provide technical support and customer service</li>
          <li>Comply with utility industry regulations and standards</li>
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
          <Shield size={14} />
          3. Data Protection & Security
        </h3>
        <p style={{ margin: '0 0 6px 0' }}>
          We implement comprehensive security measures to protect your utility data:
        </p>
        <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
          <li><strong>Encryption:</strong> All data is encrypted using AES-256 encryption in transit and at rest</li>
          <li><strong>Access Controls:</strong> Role-based permissions ensure users only access authorized information</li>
          <li><strong>Network Security:</strong> Firewalls, intrusion detection, and secure VPN access</li>
          <li><strong>Regular Audits:</strong> Security assessments and penetration testing every 6 months</li>
          <li><strong>Backup & Recovery:</strong> Automated backups with disaster recovery procedures</li>
          <li><strong>Compliance:</strong> SOC 2 Type II certified data centers</li>
        </ul>
      </div>

      {/* Section 4 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          4. Data Sharing & Disclosure
        </h3>
        <p style={{ margin: '0 0 6px 0' }}>
          We do not sell, trade, or rent your utility asset data. We may share information only in these limited circumstances:
        </p>
        <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
          <li><strong>With Your Consent:</strong> When you explicitly authorize data sharing</li>
          <li><strong>Service Providers:</strong> Trusted partners who assist in service delivery (under strict NDAs)</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authorities</li>
          <li><strong>Safety & Security:</strong> To prevent harm or protect critical infrastructure</li>
          <li><strong>Business Transfers:</strong> In the event of merger or acquisition (with continued protection)</li>
        </ul>
      </div>

      {/* Section 5 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Settings size={14} />
          5. Your Rights & Choices
        </h3>
        <p style={{ margin: '0 0 6px 0' }}>
          You have the following rights regarding your data:
        </p>
        <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
          <li><strong>Portability:</strong> Export your asset data in a standard format</li>
          <li><strong>Restriction:</strong> Limit how we process your information</li>
          <li><strong>Objection:</strong> Object to certain types of data processing</li>
        </ul>
      </div>

      {/* Section 6 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          6. Data Retention
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          We retain your data in accordance with utility industry standards:
        </p>
        <ul style={{ margin: '0 0 10px 16px', paddingLeft: '12px' }}>
          <li><strong>Asset Data:</strong> Retained for the operational life of the asset plus 7 years</li>
          <li><strong>Maintenance Records:</strong> Minimum 10 years for compliance purposes</li>
          <li><strong>User Account Data:</strong> Retained while account is active plus 3 years</li>
          <li><strong>System Logs:</strong> Retained for 2 years for security and audit purposes</li>
        </ul>
      </div>

      {/* Section 7 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          7. International Data Transfers
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place, including standard contractual clauses and adequacy decisions, to protect your data during international transfers.
        </p>
      </div>

      {/* Contact Info */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: 'var(--color-success-btn)', 
          margin: '0 0 10px 0', 
          fontSize: '1rem'
        }}>
          8. Contact Us
        </h3>
        <p style={{ margin: '0 0 10px 0' }}>
          For privacy-related questions, concerns, or to exercise your rights, contact us:
        </p>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '10px', 
          borderRadius: '6px',
          margin: '6px 0'
        }}>
          <p style={{ margin: '0 0 3px 0', fontSize: '0.8rem' }}>Data Protection Officer: privacy@utilitytracker.com</p>
          <p style={{ margin: '0 0 3px 0', fontSize: '0.8rem' }}>Phone: +1 (555) 123-4567</p>
          <p style={{ margin: '0', fontSize: '0.8rem' }}>Address: 123 Utility Drive, Power City, PC 12345</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyContent; 