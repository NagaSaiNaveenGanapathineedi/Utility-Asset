import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext.jsx';
import { useAuth } from '../../App';

// Technician Profile Component
const TechnicianProfile = () => {
  const { technicians, setTechnicians } = useAppData();
  const { user, login } = useAuth();
  const techId = user?.employeeId || user?.technicianId || '';
  const existing = technicians.find(t => t.technicianId === techId);
  const technicianIdValue = existing?.technicianId || user?.technicianId || user?.employeeId || '';
  const [form, setForm] = useState({
    name: existing?.name || user?.name || '',
    skill: existing?.skill || '',
    region: existing?.region || '',
    phone: existing?.phone || user?.phone || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const email = user?.email || 'technician@example.com';
  const department = user?.department || 'Maintenance';
  const skills = ['', 'HVAC', 'Electrical', 'Network', 'Mechanical', 'Generator', 'Fire Safety'];
  const regions = ['', 'North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = name === 'phone' ? value.replace(/\D/g, '') : value;
    setForm(prev => ({ ...prev, [name]: next }));
  };
  const handleSave = () => {
    if (!form.name || !form.skill || !form.region || !techId) {
      alert('Please fill all fields');
      return;
    }
    if (!/^\d{7,15}$/.test(form.phone || '')) {
      alert('Phone must be numbers only (7-15 digits)');
      return;
    }
    setTechnicians(prev => {
      const idx = prev.findIndex(t => t.technicianId === techId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], name: form.name, skill: form.skill, region: form.region, phone: form.phone };
        return copy;
      }
      return [...prev, { technicianId: techId, name: form.name, skill: form.skill, region: form.region, phone: form.phone }];
    });
    if (user) login({ ...user, name: form.name, phone: form.phone });
    setIsEditing(false);
    alert('Profile updated');
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ color: 'var(--color-text-dark)', margin: 0 }}>My Profile</h2>
        <button
          className="btn btn-primary"
          style={{ padding: '10px 16px', fontWeight: 600 }}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <form style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Phone Number *</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', background: !isEditing ? 'var(--color-body-bg)' : 'var(--color-white)' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Name *</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', background: !isEditing ? 'var(--color-body-bg)' : 'var(--color-white)' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Skill *</label>
            <select name="skill" value={form.skill} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', background: !isEditing ? 'var(--color-body-bg)' : 'var(--color-white)' }}>
              {skills.map(s => (<option key={s} value={s}>{s || 'Select skill'}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>Region *</label>
            <select name="region" value={form.region} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border-medium)', borderRadius: '8px', background: !isEditing ? 'var(--color-body-bg)' : 'var(--color-white)' }}>
              {regions.map(r => (<option key={r} value={r}>{r || 'Select region'}</option>))}
            </select>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default TechnicianProfile;
