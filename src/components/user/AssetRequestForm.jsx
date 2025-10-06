import { motion } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS } from '../../config/api';
import { inputStyle, labelStyle } from './styles';
import { ANIMATION_VARIANTS } from '../constants';
import '../styles/components.css';

const INITIAL_ASSET_STATE = {
  id: null,
  name: null,
  description: null,
  count: null,
  regDate: null,
  siteCode: null,
  type: null
};

const FREQUENCY_OPTIONS = [
  { value: 30, label: 'Monthly' },
  { value: 90, label: 'Quarterly' },
  { value: 365, label: 'Yearly' }
];

const AssetSuggestion = ({ asset, onSelect }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onSelect(asset); }}
    className="asset-suggestion"
  >
    <span className="suggestion-name">{asset.name} <span className="suggestion-details">({asset.type})</span></span>
    
  </button>
);

const FormField = ({ label, children, required = false }) => (
  <div className="form-field">
    <label className="form-label">
      {label} {required && '*'}
    </label>
    {children}
  </div>
);

const AssetRequestForm = ({ assets = [], user, setApiCallMade }) => {
  const { post, loading } = useApi();
  const [workorder, setWorkOrder] = useState({
    planId: null,
    userId: user?.id,
    techId: null,
    assetId: null,
    description: null,
    requestedDate: null,
    status: "Not Assigned",
    frequency: null
  });
  const [filteredAsset, setFilteredAsset] = useState(INITIAL_ASSET_STATE);
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
  }, []);

  const handleSelectAsset = useCallback((asset) => {
    setFilteredAsset(asset);
    setWorkOrder(prev => ({
      ...prev,
      assetId: asset.id,
      frequency: parseInt(asset.frequency, 10),
      requestedDate: new Date().toLocaleDateString('en-CA'),
      status: "Not Assigned"
    }));
    setShowSuggestions(false);
  }, []);

  const filteredSuggestions = useMemo(() => {
    const query = (filteredAsset.name || '').trim().toLowerCase();
    if (!query) return [];
    return assets.filter(a => a.name.toLowerCase().includes(query)).slice(0, 8);
  }, [filteredAsset.name, assets]);

  const resetForm = useCallback(() => {
    setWorkOrder({
      planId: null,
      userId: user?.id,
      techId: null,
      assetId: null,
      description: null,
      requestedDate: null,
      status: "Not Assigned",
      frequency: null
    });
    setFilteredAsset(INITIAL_ASSET_STATE);
  }, [user?.id]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!workorder.assetId || !workorder.frequency || !workorder.description) {
      //console.error('Validation failed: Missing asset or frequency');
      return;
    }

    try {
      await post(API_ENDPOINTS.WORKORDER_SAVE, workorder);
      resetForm();
      setApiCallMade?.(prev => !prev);
    } catch (error) {
      //console.error("Error submitting asset request:", error);
      alert("Error submitting asset request. Please try again later.");
    }
  }, [workorder, post, resetForm, setApiCallMade]);

  return (
    <motion.div {...ANIMATION_VARIANTS.fadeInUp} className="card">
      <h2 className="section-title">Asset Request</h2>
      <p className="section-subtitle">
        Submit a new asset maintenance request
      </p>

      <form onSubmit={handleSubmit} className="asset-request-form">
        <div className="form-grid">
          {/* Asset Name Autocomplete */}
          <div className="autocomplete-container">
            <FormField label="Asset Name" required>
              <input
                type="text"
                name="name"
                value={filteredAsset.name || ''}
                onChange={(e) => { handleInputChange(e); setShowSuggestions(true); }}
                placeholder="Type to search and select asset name"
                style={inputStyle}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
                required
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {filteredSuggestions.map((asset) => (
                    <AssetSuggestion
                      key={asset.id}
                      asset={asset}
                      onSelect={handleSelectAsset}
                    />
                  ))}
                </div>
              )}
            </FormField>
          </div>

          <FormField label="Asset ID" required>
            <input
              type="text"
              value={filteredAsset.id ? `AST-${filteredAsset.id}` : ''}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </FormField>

          <FormField label="Type" required>
            <input
              type="text"
              value={filteredAsset.type || ''}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </FormField>

          <FormField label="Site Code" required>
            <input
              type="text"
              value={filteredAsset.siteCode || ''}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </FormField>

          <FormField label="Requested Date" required>
            <input
              type="text"
              value={workorder.requestedDate || new Date().toLocaleDateString('en-CA')}
              placeholder="Auto-filled after selecting asset"
              style={{ ...inputStyle, backgroundColor: 'var(--color-body-bg)' }}
              readOnly
              required
            />
          </FormField>

          <FormField label="Frequency Plan" required>
            <select
              name="frequency"
              value={workorder.frequency || ''}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
              <option value="">Select frequency</option>
              {FREQUENCY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Description" required>
          <textarea
            name="description"
            value={workorder.description || ''}
            onChange={handleInputChange}
            placeholder="Enter additional details or special instructions"
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            rows="4"
            required
          />
        </FormField>

        <div className="form-submit">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AssetRequestForm;