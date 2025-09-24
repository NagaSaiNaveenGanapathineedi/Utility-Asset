import { motion } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import axios from 'axios';

// Moved styles outside to prevent recreation on every render
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid var(--color-border-medium)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '400',
  color: 'var(--color-text-dark)',
  backgroundColor: 'var(--color-white)',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
  outline: 'none'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: 'var(--color-text-dark)'
};

const initialFilteredAssetState = {
  id: null,
  name: null,
  description: null,
  count: null,
  regDate: null,
  siteCode: null,
  type: null
};

const AssetRequestForm = ({ assets, workorder, setWorkOrder }) => {
  const [filteredAsset, setFilteredAsset] = useState(initialFilteredAssetState);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "description" || name === "frequency") {
      setWorkOrder(prev => ({
        ...prev,
        [name]: name === 'frequency' ? parseInt(value, 10) || '' : value
      }));
    } else {
      setFilteredAsset(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, [setWorkOrder, setFilteredAsset]);

  const handleSelectAsset = useCallback((asset) => {
    setFilteredAsset(asset);
    setWorkOrder({
      ...workorder,
      assetId: asset.id,
      userId: 1,
      frequency: parseInt(asset.frequency, 10),
      requestedDate: new Date().toLocaleDateString('en-CA'),
      status: "Not Assigned"
    });
    setShowSuggestions(false);
  }, [workorder, setWorkOrder]);

  const filteredSuggestions = useMemo(() => {
    const query = (filteredAsset.name || '').trim().toLowerCase();
    if (!query) return [];
    return assets.filter(a => a.name.toLowerCase().includes(query)).slice(0, 8);
  }, [filteredAsset.name, assets]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    console.log(filteredAsset);
    console.log(workorder);

    if (!workorder.assetId || !workorder.frequency) {
      alert('Please select an asset and a frequency plan.');
      return;
    }

    try {
      const requestPayload = { ...workorder };
      console.log(requestPayload);
      const response = await axios.post('http://localhost:9092/workorder/save', requestPayload);
      if (response.status === 200 || response.status === 201) {
        alert('Asset request submitted successfully!');
        setWorkOrder({
          planId: null,
          userId: null,
          techId: null,
          assetId: null,
          description: null,
          requestedDate: null,
          status: "Not Assigned",
          frequency: null
        });
        setFilteredAsset(initialFilteredAssetState);
      } else {
        alert('Failed to submit asset request.');
      }
    } catch (error) {
      console.error("Error submitting asset request:", error);
      alert('An error occurred while submitting the request.');
    }
  }, [workorder, setWorkOrder, setFilteredAsset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <h2 style={{ color: 'var(--color-text-dark)' }}>Asset Request</h2>
      <p style={{
        color: 'var(--color-text-medium)',
        fontSize: '1rem',
        marginBottom: '30px'
      }}>
        Submit a new asset maintenance request
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Asset Name (Autocomplete) */}
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>
              Asset Name *
            </label>
            <input
              type="text"
              name="name"
              value={filteredAsset.name || ''}
              onChange={(e) => { handleInputChange(e); setShowSuggestions(true); }}
              placeholder="Type to search and select asset name"
              style={inputStyle}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => { setTimeout(() => setShowSuggestions(false), 150); }}
              autoComplete="off"
              required
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--color-white)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  marginTop: '6px',
                  zIndex: 20,
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}
              >
                {filteredSuggestions.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSelectAsset(a); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <span style={{ color: 'var(--color-text-dark)', fontWeight: 600 }}>{a.name}</span>
                    <span style={{ color: 'var(--color-text-medium)', fontSize: '12px' }}>{a.assetId} • {a.location}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Asset ID (autofilled, read-only) */}
          <div>
            <label style={labelStyle}>
              Asset ID *
            </label>
            <input
              type="text"
              name="assetId"
              value={filteredAsset.id ? "AST-" + filteredAsset.id : ''}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </div>

          {/* Type */}
          <div>
            <label style={labelStyle}>
              Type *
            </label>
            <input
              type="text"
              name="type"
              value={filteredAsset.type || ''}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </div>

          {/* Site Code */}
          <div>
            <label style={labelStyle}>
              Site Code *
            </label>
            <input
              type="text"
              name="siteCode"
              value={filteredAsset.siteCode || ''}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </div>

          {/* Requested Date */}
          <div>
            <label style={labelStyle}>
              Requested Date *
            </label>
            <input
              type="text"
              name="requestedDate"
              value={workorder.requestedDate || new Date().toLocaleDateString('en-CA')}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </div>

          {/* Frequency Plan */}
          <div>
            <label style={labelStyle}>
              Frequency Plan *
            </label>
            <select
              name="frequency"
              value={workorder.frequency || ''}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
              <option value="">Select frequency</option>
              <option value={30}>Monthly</option>
              <option value={90}>Quarterly</option>
              <option value={365}>Yearly</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '30px' }}>
          <label style={labelStyle}>
            Description
          </label>
          <textarea
            name="description"
            value={workorder.description || ''}
            onChange={handleInputChange}
            placeholder="Enter additional details or special instructions"
            style={{
              ...inputStyle,
              minHeight: '100px',
              resize: 'vertical'
            }}
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            style={{
              minWidth: '200px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Submit Request
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AssetRequestForm;
 