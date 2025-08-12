import { motion } from 'framer-motion';

const AssetRequestForm = ({ assetRequests, setAssetRequests, assetRequestForm, setAssetRequestForm }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssetRequestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!assetRequestForm.assetId || !assetRequestForm.assetName || !assetRequestForm.location || !assetRequestForm.region || !assetRequestForm.siteCode || !assetRequestForm.frequencyPlan) {
      alert('Please fill in all required fields');
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      ...assetRequestForm,
      status: 'Pending',
      submittedAt: new Date().toLocaleDateString(),
      submittedBy: 'Demo User'
    };

    setAssetRequests(prev => [...prev, newRequest]);
    
    // Reset form
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
          {/* Asset ID */}
          <div>
            <label style={labelStyle}>
              Asset ID *
            </label>
            <input
              type="text"
              name="assetId"
              value={assetRequestForm.assetId}
              onChange={handleInputChange}
              placeholder="Enter asset ID"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-light-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border-medium)';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Asset Name */}
          <div>
            <label style={labelStyle}>
              Asset Name *
            </label>
            <input
              type="text"
              name="assetName"
              value={assetRequestForm.assetName}
              onChange={handleInputChange}
              placeholder="Enter asset name"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-light-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border-medium)';
                e.target.style.boxShadow = 'none';
              }}
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
              placeholder="Enter location"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-light-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border-medium)';
                e.target.style.boxShadow = 'none';
              }}
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
              placeholder="Enter region"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-light-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border-medium)';
                e.target.style.boxShadow = 'none';
              }}
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
              placeholder="Enter site code"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-light-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border-medium)';
                e.target.style.boxShadow = 'none';
              }}
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
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-light-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border-medium)';
                e.target.style.boxShadow = 'none';
              }}
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
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-light-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border-medium)';
              e.target.style.boxShadow = 'none';
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