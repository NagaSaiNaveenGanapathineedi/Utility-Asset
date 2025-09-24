import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useMemo } from 'react';

const getFrequencyString = (days) => {
  switch (days) {
    case 30:
      return 'Monthly';
    case 90:
      return 'Quarterly';
    case 365:
      return 'Yearly';
    default:
      return days ? `${days} days` : 'N/A';
  }
};

const AssetHistory = ({ userHistory }) => {
  const records = userHistory || [];
  console.log(userHistory);
  const presentRecords = useMemo(() => 
    records.filter(r => r.status === 'Not Assigned'),
    [records]
  );

  const pastRecords = useMemo(() => 
    records.filter(r => r.status !== 'Not Assigned'),
    [records]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 style={{ color: 'var(--color-text-dark)' }}>Asset History</h2>
      <p style={{ 
        color: 'var(--color-text-medium)',
        fontSize: '1rem',
        marginBottom: '30px'
      }}>
        Your asset requests and past assignment history
      </p>

      {/* User Asset Requests - Show first */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '1.2rem',
          fontWeight: '600',
          color: 'var(--color-text-dark)'
        }}>
          Your Asset Requests
        </h3>
        {presentRecords.length === 0 ? (
          <div style={{ 
            textAlign: 'center',
            padding: '40px',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px'
          }}>
            <FileText size={48} style={{ marginBottom: '16px', color: 'var(--color-text-medium)' }} />
            <p style={{ 
              margin: '0', 
              fontSize: '1rem',
              fontWeight: '400',
              color: 'var(--color-text-medium)'
            }}>
              No active asset requests found.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {presentRecords.map((request) => (
              <div key={request.workId} style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border-light)',
                borderRadius: '8px',
                padding: '20px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ width: '100%' }}>
                  {/* For asset name and status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ 
                      margin: '0', 
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--color-text-dark)'
                    }}>
                      {request.assetId?.name || 'N/A'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: 'var(--status-in-progress-bg)',
                        color: 'var(--status-in-progress-text)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {[
                      { label: 'Asset ID', value: `AST-${request.assetId?.id}` || 'N/A' },
                      { label: 'Frequency Plan', value: getFrequencyString(request.frequency) || 'N/A' },
                      { label: 'Status', value: request.status || 'N/A' },
                      { label: 'Submitted', value: request.requestedDate || 'N/A' },
                      { label: 'Submitted By', value: request.userId?.name || 'N/A' },
                      { label: 'Due Date', value: request.planId?.nextMaintenanceDate || 'N/A' }
                    ].map(({ label, value }) => (
                      <div key={label}>
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
                    ))}
                  </div>
                  
                  {request.desc && (
                    <div style={{ 
                      marginTop: '12px', 
                      paddingTop: '12px', 
                      borderTop: '1px solid var(--color-border-light)' 
                    }}>
                      <span style={{ 
                        fontSize: '11px',
                        fontWeight: '500',
                        color: 'var(--color-text-medium)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        Description
                      </span>
                      <p style={{ 
                        margin: '0', 
                        fontSize: '14px',
                        color: 'var(--color-text-dark)',
                        lineHeight: '1.4'
                      }}>
                        {request.desc}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Past Asset Records - Only section */}
      <div>
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '1.2rem',
          fontWeight: '600',
          color: 'var(--color-text-dark)'
        }}>
          Your Past Asset Records
        </h3>
        {pastRecords.length === 0 ? (
           <div style={{ 
            textAlign: 'center',
            padding: '40px',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px'
          }}>
            <FileText size={48} style={{ marginBottom: '16px', color: 'var(--color-text-medium)' }} />
            <p style={{ 
              margin: '0', 
              fontSize: '1rem',
              fontWeight: '400',
              color: 'var(--color-text-medium)'
            }}>
              No past asset records found.
            </p>
          </div>
        ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {pastRecords.map((asset) => (
            <div key={asset.workId} style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border-light)',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ 
                    margin: '0', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--color-text-dark)'
                  }}>
                    {asset.assetId?.name || 'N/A'}
                  </h4>
                  <span style={{
                    padding: '4px 8px',
                    background: asset.status === 'Done' ? 'var(--status-completed-bg)' : 'var(--color-border-light)',
                    color: asset.status === 'Done' ? 'var(--status-completed-text)' : 'var(--color-text-medium)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    {asset.status}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '12px' 
                }}>
                  {[
                    { label: 'Asset Name', value: `AST-${asset.assetId?.name}` || 'N/A' },
                    { label: 'Asset Type', value: asset.assetId?.type || 'N/A' },
                    { label: 'Status', value: asset.status || 'N/A' },
                    { label: 'Requested Date', value: asset.requestedDate || 'N/A' },
                    { label: 'Technician', value: asset.techId?.name || 'N/A' },
                    { label: 'Maintenance Date', value: asset.planId?.nextMaintenanceDate || 'N/A' },
                  ].map(({ label, value }) => (
                    <div key={label}>
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
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssetHistory; 