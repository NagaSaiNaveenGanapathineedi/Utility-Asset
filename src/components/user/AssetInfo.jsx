import { motion } from 'framer-motion';
import { ASSET_FIELDS, cardStyle } from './styles';

const AssetInfo = ({ assets = [] }) => {
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
        {assets.map((asset) => (
          <div
            key={asset.id}
            style={cardStyle}
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
                {asset.name || 'Unknown Asset'}
              </h3>
            </div>
            
            {ASSET_FIELDS.map(({ label, key, prefix }) => {
              const value = prefix ? `${prefix}${asset[key] || ''}` : (asset[key] || 'N/A');
              return (
                <div key={label} style={{ marginBottom: '8px', width: '100%' }}>
                  <span style={{ 
                    fontSize: '11px',
                    fontWeight: '500',
                    color: 'var(--color-text-medium)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    margin: '0 0 2px 0'
                  }}>
                    {label}
                  </span>
                  <span style={{ 
                    fontSize: '14px',
                    fontWeight: '400',
                    color: 'var(--color-text-dark)'
                  }}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AssetInfo; 