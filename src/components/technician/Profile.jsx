import { useState, useMemo, useCallback, useEffect } from 'react';
import { color, motion } from 'framer-motion';
import { useAuth } from '../../App';
import './TechnicianHeader.css';

const SKILLS = ['', 'HVAC', 'Electrical', 'Network', 'Mechanical', 'Generator', 'Fire Safety'];
const REGIONS = ['', 'North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];

const ProfileInput = ({ label, name, value, onChange, disabled, type = 'text', showPassword, onTogglePassword }) => {
  const inputStyle = useMemo(() => ({
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--color-border-medium)',
    borderRadius: '8px',
    background: disabled ? 'var(--color-body-bg)' : 'var(--color-white)'
  }), [disabled]);
  
  return (
    <div className="form-group">
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: name==="password" ? 'red' : 'var(--color-text-dark)' }}>
        {label} *
      </label>
      <div style={{ position: 'relative' }}>
        <input 
          name={name} 
          type={name === 'password' ? (showPassword ? 'text' : 'password') : type} 
          value={value} 
          onChange={onChange} 
          disabled={disabled} 
          style={inputStyle} 
        />
        {name === 'password' && (
          <button
            type="button"
            onClick={onTogglePassword}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        )}
      </div>
    </div>
  );
};

const ProfileSelect = ({ label, name, value, onChange, disabled, options }) => {
  const selectStyle = useMemo(() => ({
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--color-border-medium)',
    borderRadius: '8px',
    background: disabled ? 'var(--color-body-bg)' : 'var(--color-white)'
  }), [disabled]);
  
  return (
    <div className="form-group">
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
        {label} *
      </label>
      <select name={name} value={value} onChange={onChange} disabled={disabled} style={selectStyle}>
        {options.map(option => (
          <option key={option} value={option}>
            {option || `Select ${name}`}
          </option>
        ))}
      </select>
    </div>
  );
};

const TechnicianProfile = ({ setApiCallMade }) => {
  const { user: technician, updateUser } = useAuth();
  const initialFormState = useMemo(() => ({
    id: technician?.id || '',
    name: technician?.name || '',
    email: technician?.email || '',
    password: '',
    phno: technician?.phno || '',
    region: technician?.region || '',
    pincode: technician?.pincode || '',
    location: technician?.location || '',
    skill: technician?.skill || '',
    role: technician?.role || 'technician'
  }), [technician]);

  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sync form with updated user data
  useEffect(() => {
    if (technician && !isEditing) {
      setForm({
        id: technician.id || '',
        name: technician.name || '',
        email: technician.email || '',
        password: '',
        phno: technician.phno || '',
        region: technician.region || '',
        pincode: technician.pincode || '',
        location: technician.location || '',
        skill: technician.skill || '',
        role: technician.role || 'technician'
      });
    }
  }, [technician, isEditing]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phno' ? value.replace(/\D/g, '') : value;
    setForm(prev => ({ ...prev, [name]: nextValue }));
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.skill || !form.region || !form.id || !form.email || !form.password || !form.pincode) {
      alert('Please fill all required fields');
      return;
    }
    if (!/^\d{7,15}$/.test(form.phno || '')) {
      alert('Phone number must be between 7 and 15 digits');
      return;
    }
    console.log(form);
    try {
      setApiCallMade(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      const response = await fetch(`http://localhost:9092/user/update/${form.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication error: Invalid token.');
          alert('Your session has expired. Please log in again.');
        }
        throw new Error('Failed to update profile');
      }
      // Update context with the form data since backend update succeeded
      updateUser(form);
      // Reset form to show updated data
      setForm({ ...form, password: '' }); // Clear password field
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.log("Error in updating technician profile", error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  const handleToggleEdit = useCallback(() => {
    if (!isEditing) setIsEditing(true);
  }, [isEditing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h2 style={{ color: 'var(--color-text-dark)', margin: 0 }}>My Profile</h2>
        {!isEditing && (
          <button
            className="btn btn-primary"
            style={{ padding: '10px 16px', fontWeight: 600 }}
            onClick={handleToggleEdit}
          >
            Edit
          </button>
        )}
      </div>

      <form
        style={{ width: '100%' }}
        onSubmit={(e) => {
          e.preventDefault();
          if (isEditing) handleSave();
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <ProfileInput label="Name" name="name" value={form.name} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Phone" name="phno" type="tel" value={form.phno} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Location" name="location" value={form.location} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} disabled={!isEditing} />
          <ProfileSelect label="Skill" name="skill" value={form.skill} onChange={handleChange} disabled={!isEditing} options={SKILLS} />
          <ProfileSelect label="Region" name="region" value={form.region} onChange={handleChange} disabled={!isEditing} options={REGIONS} />
          <ProfileInput 
            label="Please Enter Password to update the profile" 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            disabled={!isEditing}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        </div>

        {isEditing && (
          <div style={{ textAlign: 'right' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 16px', fontWeight: 600 }}
            >
              Save
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default TechnicianProfile;
