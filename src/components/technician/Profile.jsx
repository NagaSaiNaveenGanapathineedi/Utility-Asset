import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../App';

const SKILLS = ['', 'HVAC', 'Electrical', 'Network', 'Mechanical', 'Generator', 'Fire Safety'];
const REGIONS = ['', 'North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];

const ProfileInput = ({ label, name, value, onChange, disabled, type = 'text' }) => (
  <div className="form-group">
    <label style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 500,
      color: 'var(--color-text-dark)'
    }}>
      {label} *
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: '2px solid var(--color-border-medium)',
        borderRadius: '8px',
        background: disabled ? 'var(--color-body-bg)' : 'var(--color-white)'
      }}
    />
  </div>
);

const ProfileSelect = ({ label, name, value, onChange, disabled, options }) => (
  <div className="form-group">
    <label style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 500,
      color: 'var(--color-text-dark)'
    }}>
      {label} *
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: '2px solid var(--color-border-medium)',
        borderRadius: '8px',
        background: disabled ? 'var(--color-body-bg)' : 'var(--color-white)'
      }}
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option || `Select ${name}`}
        </option>
      ))}
    </select>
  </div>
);

const TechnicianProfile = () => {
  const { user: technician } = useAuth();
  const initialFormState = useMemo(() => ({
    id: technician?.id || '',
    name: technician?.name || '',
    email: technician?.email || '',
    password: technician?.password || '',
    phno: technician?.phno || '',
    region: technician?.region || '',
    pincode: technician?.pincode || '',
    location: technician?.location || '',
    skill: technician?.skill || '',
    role: technician?.role || 'technician'
  }), [technician]);

  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phno' ? value.replace(/\D/g, '') : value;
    setForm(prev => ({ ...prev, [name]: nextValue }));
  };

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
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.log("Error in updating technician profile", error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  const handleToggleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <ProfileInput label="Name" name="name" value={form.name} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Password" name="password" value={form.password} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Phone" name="phno" type="tel" value={form.phno} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Location" name="location" value={form.location} onChange={handleChange} disabled={!isEditing} />
          <ProfileInput label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} disabled={!isEditing} />
          <ProfileSelect label="Skill" name="skill" value={form.skill} onChange={handleChange} disabled={!isEditing} options={SKILLS} />
          <ProfileSelect label="Region" name="region" value={form.region} onChange={handleChange} disabled={!isEditing} options={REGIONS} />
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
