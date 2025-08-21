import { motion } from 'framer-motion';

const AssetInfo = () => {
  const getAllAvailableAssets = () => [
    {
      id: 'AST-001',
      name: 'Main Distribution Panel',
      location: 'Building A - Ground Floor',
      status: 'Available',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15'
    },
    {
      id: 'AST-002', 
      name: 'HVAC System Unit 1',
      location: 'Building B - Rooftop',
      status: 'Available',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10'
    },
    {
      id: 'AST-003',
      name: 'Emergency Generator',
      location: 'Building C - Basement',
      status: 'Not Available',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-04-20'
    },
    {
      id: 'AST-004',
      name: 'Water Pump System',
      location: 'Building D - Utility Room',
      status: 'Available',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-03-15'
    },
    {
      id: 'AST-005',
      name: 'Fire Safety System',
      location: 'Building A - All Floors',
      status: 'Available',
      lastMaintenance: '2023-12-20',
      nextMaintenance: '2024-03-20'
    },
    {
      id: 'AST-006',
      name: 'Transformer Unit T-101',
      location: 'Substation A - East Wing',
      status: 'Available',
      lastMaintenance: '2024-01-25',
      nextMaintenance: '2024-04-25'
    },
    {
      id: 'AST-007',
      name: 'Cooling Tower System',
      location: 'Building B - North Side',
      status: 'Not Available',
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-05-01'
    },
    {
      id: 'AST-008',
      name: 'Backup Power Unit',
      location: 'Building C - Level B2',
      status: 'Available',
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-04-12'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 style={{ color: 'var(--color-text-dark)' }}>All Available Assets</h2>
      <p style={{ 
        color: 'var(--color-text-medium)',
        fontSize: '1rem',
        marginBottom: '30px'
      }}>
        Browse all assets available for request and monitoring
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {getAllAvailableAssets().map((asset) => {
          return (
            <div
              key={asset.id}
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border-light)',
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ 
                  margin: '0', 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text-dark)'
                }}>
                  {asset.name}
                </h3>
              </div>
              
              {[
                { label: 'Asset ID', value: asset.id },
                { label: 'Location', value: asset.location },
                { label: 'Last Maintenance', value: asset.lastMaintenance },
                { label: 'Next Maintenance', value: asset.nextMaintenance }
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '8px', width: '100%' }}>
                  <span style={{ 
                    fontSize: '11px',
                    fontWeight: '500',
                    color: 'var(--color-text-medium)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '2px'
                  }}>
                    {label}
                  </span>
                  <span style={{ 
                    fontSize: '14px',
                    fontWeight: '400',
                    color: 'var(--color-text-dark)',
                    lineHeight: '1.4'
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AssetInfo; 