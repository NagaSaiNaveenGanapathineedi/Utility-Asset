import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Edit, Trash2, Save, X } from 'lucide-react';

const AssetHistory = ({ assetRequests, setAssetRequests }) => {
  const [editingRequest, setEditingRequest] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getUserPastAssetRecords = () => [
    {
      id: 'AST-004',
      name: 'Water Pump System',
      location: 'Building D - Utility Room',
      status: 'Completed',
      requestedDate: '2023-11-15',
      completedDate: '2023-12-15',
      assignedTo: 'Demo User'
    },
    {
      id: 'AST-005',
      name: 'Fire Safety System',
      location: 'Building A - All Floors', 
      status: 'Completed',
      requestedDate: '2023-11-20',
      completedDate: '2023-12-20',
      assignedTo: 'Demo User'
    },
    {
      id: 'AST-007',
      name: 'Cooling Tower System',
      location: 'Building B - North Side',
      status: 'Returned',
      requestedDate: '2023-10-10',
      completedDate: '2024-01-15',
      assignedTo: 'Demo User'
    }
  ];

  const handleEditRequest = (request) => {
    setEditingRequest(request.id);
    setEditForm({
      assetId: request.assetId,
      assetName: request.assetName,
      location: request.location,
      region: request.region,
      siteCode: request.siteCode,
      frequencyPlan: request.frequencyPlan,
      description: request.description
    });
  };

  const handleSaveEdit = () => {
    setAssetRequests(prev => 
      prev.map(request => 
        request.id === editingRequest 
          ? { ...request, ...editForm }
          : request
      )
    );
    setEditingRequest(null);
    setEditForm({});
    alert('Asset request updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
    setEditForm({});
  };

  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to delete this asset request?')) {
      setAssetRequests(prev => prev.filter(request => request.id !== requestId));
      alert('Asset request deleted successfully!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        {assetRequests.length === 0 ? (
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
              No asset requests found. Submit your first request using the Asset Request tab.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {assetRequests.map((request) => (
              <div key={request.id} style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border-light)',
                borderRadius: '8px',
                padding: '20px',
                transition: 'all 0.2s ease',
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
                      {editingRequest === request.id ? (
                        <input
                          name="assetName"
                          value={editForm.assetName}
                          onChange={handleInputChange}
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: 'var(--color-text-dark)',
                            border: '1px solid var(--color-border-medium)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            background: 'var(--color-white)'
                          }}
                        />
                      ) : (
                        request.assetName
                      )}
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
                      {editingRequest === request.id ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={handleSaveEdit}
                            style={{
                              padding: '4px',
                              background: 'var(--status-completed-bg)',
                              color: 'var(--status-completed-text)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Save changes"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              padding: '4px',
                              background: 'var(--color-border-light)',
                              color: 'var(--color-text-medium)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Cancel editing"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleEditRequest(request)}
                            style={{
                              padding: '4px',
                              background: 'var(--status-in-progress-bg)',
                              color: 'var(--status-in-progress-text)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Edit request"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            style={{
                              padding: '4px',
                              background: 'var(--status-open-bg)',
                              color: 'var(--status-open-text)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Delete request"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {[
                      { label: 'Asset ID', value: request.assetId, name: 'assetId' },
                      { label: 'Location', value: request.location, name: 'location' },
                      { label: 'Region', value: request.region, name: 'region' },
                      { label: 'Site Code', value: request.siteCode, name: 'siteCode' },
                      { label: 'Frequency Plan', value: request.frequencyPlan, name: 'frequencyPlan' },
                      { label: 'Submitted', value: request.submittedAt, name: 'submittedAt', readonly: true },
                      { label: 'Submitted By', value: request.submittedBy, name: 'submittedBy', readonly: true }
                    ].map(({ label, value, name, readonly }) => (
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
                        {editingRequest === request.id && !readonly ? (
                          name === 'frequencyPlan' ? (
                            <select
                              name={name}
                              value={editForm[name]}
                              onChange={handleInputChange}
                              style={{
                                fontSize: '14px',
                                fontWeight: '400',
                                color: 'var(--color-text-dark)',
                                border: '1px solid var(--color-border-medium)',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                background: 'var(--color-white)',
                                width: '100%'
                              }}
                            >
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                              <option value="Yearly">Yearly</option>
                            </select>
                          ) : (
                            <input
                              name={name}
                              value={editForm[name]}
                              onChange={handleInputChange}
                              style={{
                                fontSize: '14px',
                                fontWeight: '400',
                                color: 'var(--color-text-dark)',
                                border: '1px solid var(--color-border-medium)',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                background: 'var(--color-white)',
                                width: '100%'
                              }}
                            />
                          )
                        ) : (
                          <span style={{ 
                            fontSize: '14px',
                            fontWeight: '400',
                            color: 'var(--color-text-dark)'
                          }}>
                            {value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {request.description && (
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
                      {editingRequest === request.id ? (
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            fontSize: '14px',
                            color: 'var(--color-text-dark)',
                            lineHeight: '1.4',
                            border: '1px solid var(--color-border-medium)',
                            borderRadius: '4px',
                            padding: '6px',
                            background: 'var(--color-white)',
                            minHeight: '60px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <p style={{ 
                          margin: '0', 
                          fontSize: '14px',
                          color: 'var(--color-text-dark)',
                          lineHeight: '1.4'
                        }}>
                          {request.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Past Asset Records - Show below */}
      <div>
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '1.2rem',
          fontWeight: '600',
          color: 'var(--color-text-dark)'
        }}>
          Your Past Asset Records
        </h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {getUserPastAssetRecords().map((asset) => (
            <div key={asset.id} style={{
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
                    {asset.name}
                  </h4>
                  <span style={{
                    padding: '4px 8px',
                    background: asset.status === 'Completed' ? 'var(--status-completed-bg)' : 'var(--color-border-light)',
                    color: asset.status === 'Completed' ? 'var(--status-completed-text)' : 'var(--color-text-medium)',
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
                    { label: 'Asset ID', value: asset.id },
                    { label: 'Location', value: asset.location },
                    { label: 'Status', value: asset.status },
                    { label: 'Requested Date', value: asset.requestedDate },
                    { label: 'Completed Date', value: asset.completedDate }
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
      </div>
    </motion.div>
  );
};

export default AssetHistory; 