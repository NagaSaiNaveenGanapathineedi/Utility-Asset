import { motion } from 'framer-motion';
import { useState, useMemo, useRef } from 'react';
import { assetsData } from '../../data/assets';

const AssetRequestForm = ({ assetRequests, setAssetRequests, assetRequestForm, setAssetRequestForm }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssetRequestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectAsset = (asset) => {
    setAssetRequestForm(prev => ({
      ...prev,
      assetId: asset.assetId,
      assetName: asset.assetName,
      location: asset.location,
      region: asset.region,
      siteCode: asset.siteCode
    }));
    setShowSuggestions(false);
  };

  const filteredSuggestions = useMemo(() => {
    const query = (assetRequestForm.assetName || '').trim().toLowerCase();
    if (!query) return [];
    return assetsData.filter(a => a.assetName.toLowerCase().includes(query)).slice(0, 8);
  }, [assetRequestForm.assetName]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!assetRequestForm.assetId || !assetRequestForm.assetName || !assetRequestForm.location || !assetRequestForm.region || !assetRequestForm.siteCode || !assetRequestForm.frequencyPlan) {
      alert('Please select an asset from suggestions and fill required fields');
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      ...assetRequestForm,
      status: 'Pending',
      submittedAt: new Date().toLocaleDateString(),
      submittedBy: 'Demo User'
    };

    const updated = [...assetRequests, newRequest];
    setAssetRequests(updated);

    setAssetRequestForm({
      assetId: '',
      assetName: '',
      location: '',
      region: '',
      siteCode: '',
      frequencyPlan: '',
      description: ''
    });

    alert('Asset request submitted successfully!');
  };

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
              name="assetName"
              value={assetRequestForm.assetName}
              onChange={(e) => { handleInputChange(e); setShowSuggestions(true); }}
              placeholder="Type to search and select asset name"
              style={inputStyle}
              onFocus={() => setShowSuggestions(true)}
              onBlur={(e) => {
                // Delay to allow click on suggestion
                requestAnimationFrame(() => setShowSuggestions(false));
              }}
              required
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
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
                    key={a.assetId}
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
                    <span style={{ color: 'var(--color-text-dark)', fontWeight: 600 }}>{a.assetName}</span>
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
              value={assetRequestForm.assetId}
              onChange={handleInputChange}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={assetRequestForm.location}
              onChange={handleInputChange}
              placeholder="Auto-filled after selecting asset"
              style={inputStyle}
              required
            />
          </div>

          {/* Region */}
          <div>
            <label style={labelStyle}>
              Region *
            </label>
            <input
              type="text"
              name="region"
              value={assetRequestForm.region}
              onChange={handleInputChange}
              placeholder="Auto-filled after selecting asset"
              style={inputStyle}
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
              value={assetRequestForm.siteCode}
              onChange={handleInputChange}
              placeholder="Auto-filled after selecting asset"
              style={inputStyle}
              required
            />
          </div>

          {/* Frequency Plan */}
          <div>
            <label style={labelStyle}>
              Frequency Plan *
            </label>
            <select
              name="frequencyPlan"
              value={assetRequestForm.frequencyPlan}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
              <option value="">Select frequency</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
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
            value={assetRequestForm.description}
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