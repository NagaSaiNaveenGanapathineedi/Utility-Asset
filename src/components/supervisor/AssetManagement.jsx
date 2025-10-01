import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2 } from 'lucide-react';
import Modal from '../Modal';
import { styles } from './supervisorStyles';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { ASSET_TYPES } from '../../config/constants';
import LoadingSpinner from './LoadingSpinner';

const AssetCard = ({ asset, compact = false, onEdit, onDelete }) => {
    const cardStyle = useMemo(() => ({
        background: 'var(--color-white)',
        border: '1px solid var(--color-border-light)',
        borderRadius: compact ? '12px' : '8px',
        padding: '20px',
        boxShadow: compact ? '0 4px 12px rgba(0,0,0,0.06)' : '0 2px 4px rgba(0,0,0,0.1)'
    }), [compact]);

    const assetDetails = useMemo(() => [
        { label: 'Site Code', value: asset.siteCode },
        { label: 'Registered', value: asset.regDate }
    ], [asset.siteCode, asset.regDate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: compact ? 10 : 0, scale: compact ? 1 : 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            style={cardStyle}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-dark)' }}>{asset.name}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '4px 8px', border: '1px solid var(--color-border-light)', borderRadius: '999px', fontSize: '12px', color: 'var(--color-text-medium)', background: 'var(--color-body-bg)' }}>{asset.type}</span>
                    </div>
                </div>
                <span style={{ padding: '6px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>ID: AST-{asset.id}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px 16px', marginBottom: '12px' }}>
                {assetDetails.map(({ label, value }) => (
                    <div key={label} style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{label}</div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-dark)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
                    </div>
                ))}
            </div>
            {asset.description && (
                <div style={{ padding: '12px', border: '1px dashed var(--color-border-light)', borderRadius: '8px', background: 'var(--color-body-bg)', color: 'var(--color-text-dark)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-medium)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Description</div>
                    <div style={{ fontSize: '14px', lineHeight: 1.5 }}>{asset.description}</div>
                </div>
            )}
            {(onEdit || onDelete) && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    {onEdit && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onEdit(asset.id)} style={{ flex: 1, padding: '10px 16px', backgroundColor: 'var(--color-light-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Edit size={16} /> Update
                        </motion.button>
                    )}
                    {onDelete && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onDelete(asset.id)} style={{ flex: 1, padding: '10px 16px', backgroundColor: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Trash2 size={16} /> Delete
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export const AssetRegistration = ({ handleTabChange, onDataChange, setApiCallMade }) => {
    const initialFormData = useMemo(() => ({
        id: 0,
        name: "",
        type: "",
        siteCode: "",
        description: "",
        count: 0,
        regDate: new Date().toLocaleDateString('en-CA')
    }), []);

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    
    const handleChange = useCallback((e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);
    
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        const requiredFields = ['name', 'type', 'siteCode', 'description', 'count', 'regDate'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            console.error('Validation failed: Missing required fields:', missingFields);
            return;
        }
        
        const count = parseInt(formData.count, 10);
        if (isNaN(count) || count <= 0) {
            console.error('Invalid count value');
            return;
        }
        
        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                type: formData.type,
                siteCode: formData.siteCode,
                description: formData.description,
                count,
                regDate: formData.regDate
            };
            
            await axios.post(API_ENDPOINTS.ASSET_SAVE, payload);
            
            setFormData(initialFormData);
            onDataChange?.();
            setApiCallMade?.(prev => !prev);
            handleTabChange("search-assets");
        } catch (error) {
            console.error('Error registering asset:', error);
        } finally {
            setLoading(false);
        }
    }, [formData, handleTabChange, onDataChange, initialFormData]);
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
            <h2 style={{ color: 'var(--color-text-dark)' }}>Asset Registration</h2>
            <p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Register new assets in the system with complete information</p>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    {useMemo(() => [
                        { name: 'name', label: 'Asset Name *', type: 'text', placeholder: 'Enter asset name' },
                        { name: 'type', label: 'Type *', type: 'select', options: ASSET_TYPES },
                        { name: 'description', label: 'Description *', type: 'text', placeholder: 'Enter description' },
                        { name: 'count', label: 'Count *', type: 'number', placeholder: 'Enter count' },
                        { name: 'regDate', label: 'Registration Date *', type: 'text', placeholder: 'Enter registration date', value: new Date().toISOString(), disabled: true },
                        { name: 'siteCode', label: 'Site Code *', type: 'text', placeholder: 'Enter site code' }
                    ], []).map((f) => (
                        <div key={f.name} className="form-group">
                            <label style={styles.label}>{f.label}</label>
                            {f.type === 'select' ? (
                                <select name={f.name} value={formData[f.name]} onChange={handleChange} style={styles.input}>
                                    <option value="">Select type</option>
                                    {f.options.map((o) => (<option key={o} value={o}>{o}</option>))}
                                </select>
                            ) : (
                                <input name={f.name} type="text" value={formData[f.name] === 0 ? '' : formData[f.name]} onChange={handleChange} style={styles.input} placeholder={f.placeholder} />
                            )}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.button 
                        whileHover={{ scale: loading ? 1 : 1.02 }} 
                        whileTap={{ scale: loading ? 1 : 0.98 }} 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary" 
                        style={{ 
                            minWidth: '200px', 
                            padding: '12px 24px', 
                            fontSize: '16px', 
                            fontWeight: '600',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Registering...' : 'Register Asset'}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export const SearchAssets = ({ assets = [], onDataChange, setApiCallMade }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const initialEditForm = useMemo(() => ({
        id: 0,
        name: '',
        type: '',
        count: 0,
        regDate: new Date().toLocaleDateString('en-CA'),
        siteCode: '',
        description: ''
    }), []);
    
    const [editForm, setEditForm] = useState(initialEditForm);
    
    const filteredAssets = useMemo(() => {
        let list = [...assets];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter(a => 
                [a.id, a.name, a.type, a.count, a.regDate, a.siteCode]
                    .some(v => v && String(v).toLowerCase().includes(term))
            );
        }
        if (selectedType) list = list.filter(a => a.type === selectedType);
        return list;
    }, [assets, searchTerm, selectedType]);
    
    const assetTypes = useMemo(() => Array.from(new Set(assets.map(a => a.type))), [assets]);
    
    const handleEditChange = useCallback((asset) => {
        setEditForm({
            id: asset.id,
            name: asset.name,
            type: asset.type,
            count: asset.count,
            regDate: asset.regDate,
            siteCode: asset.siteCode,
            description: asset.description
        });
        setIsEditOpen(true);
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSaveEdit = useCallback(async (e) => {
        e?.preventDefault?.();
        
        const requiredFields = ['id', 'name', 'type', 'count', 'regDate', 'siteCode', 'description'];
        const missingFields = requiredFields.filter(field => !editForm[field]);
        
        if (missingFields.length > 0) {
            console.error('Validation failed: Missing required fields:', missingFields);
            return;
        }
        
        setLoading(true);
        try {
            await axios.put(API_ENDPOINTS.ASSET_UPDATE(editForm.id), editForm);
            setIsEditOpen(false);
            onDataChange?.();
            setApiCallMade?.(prev => !prev);
        } catch (error) {
            console.error('Error updating asset:', error);
        } finally {
            setLoading(false);
        }
    }, [editForm, onDataChange]);

    const handleDeleteAsset = useCallback(async (id) => {
        if (!window.confirm('Are you sure you want to delete this asset?')) return;
        
        try {
            await axios.delete(API_ENDPOINTS.ASSET_DELETE(id));
            if (onDataChange) onDataChange();
            setApiCallMade?.(prev => !prev);
        } catch (error) {
            console.error('Error deleting asset:', error);
        }
    }, [onDataChange]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card">
            <h2 style={{ color: 'var(--color-text-dark)' }}>Search Assets</h2>
            <p style={{ color: 'var(--color-text-medium)', fontSize: '1rem', marginBottom: '30px' }}>Find and filter assets using advanced search criteria</p>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', backgroundColor: 'var(--color-body-bg)', border: '1px solid var(--color-border-light)', borderRadius: '10px', padding: '16px' }}>
                <input type="text" placeholder="Search by ID, name, type, count..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input} />
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ ...styles.input, maxWidth: '240px' }}>
                    <option value="">All Types</option>
                    {assetTypes.map(t => (<option key={t} value={t}>{t}</option>))}
                </select>
            </div>
            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'var(--color-body-bg)', borderRadius: '8px', border: '1px solid var(--color-border-light)' }}>
                <p style={{ margin: 0, color: 'var(--color-text-medium)', fontSize: '0.9rem' }}>
                    {searchTerm || selectedType ? (
                        <>
                            <strong style={{ color: 'var(--color-text-dark)' }}>{filteredAssets.length}</strong> asset{filteredAssets.length !== 1 ? 's' : ''} found
                            {searchTerm && <span> matching &quot;<strong>{searchTerm}</strong>&quot;</span>}
                            {selectedType && <span> of type &quot;<strong>{selectedType}</strong>&quot;</span>}
                        </>
                    ) : (
                        <>
                            <strong style={{ color: 'var(--color-text-dark)' }}>{assets.length}</strong> total assets available
                        </>
                    )}
                </p>
            </div>
            {filteredAssets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-medium)', backgroundColor: 'var(--color-body-bg)', borderRadius: '8px' }}>
                    <Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '8px' }}>No Assets Found</h3>
                    <p>Try adjusting your search criteria or register new assets.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                    {filteredAssets.map(asset => (
                        <AssetCard 
                            key={asset.id} 
                            asset={asset} 
                            compact 
                            onEdit={() => handleEditChange(asset)} 
                            onDelete={handleDeleteAsset} 
                        />
                    ))}
                </div>
            )}
            
            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Asset" maxWidth="700px">
                <form onSubmit={handleSaveEdit} style={{ width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        {useMemo(() => [
                            { name: 'id', label: 'Asset ID *', type: 'text', placeholder: 'Enter asset ID' },
                            { name: 'name', label: 'Asset Name *', type: 'text', placeholder: 'Enter asset name' },
                            { name: 'type', label: 'Type *', type: 'select', options: ['', ...ASSET_TYPES] },
                            { name: 'count', label: 'Count *', type: 'text', placeholder: 'Enter count' },
                            { name: 'siteCode', label: 'Site Code *', type: 'text', placeholder: 'Enter site code' }
                        ], []).map((f) => (
                            <div key={f.name} className="form-group">
                                <label style={styles.label}>{f.label}</label>
                                {f.type === 'select' ? (
                                <select name={f.name} value={editForm[f.name]} onChange={handleInputChange} style={styles.input}>
                                    {f.options.map((o) => (
                                    <option key={o} value={o}>{o || 'Select type'}</option>
                                    ))}
                                </select>
                                ) : (
                                <input
                                    name={f.name}
                                    type="text"
                                    value={editForm[f.name]}
                                    onChange={f.name === 'id' ? undefined : handleInputChange}
                                    style={styles.input}
                                    placeholder={f.placeholder}
                                    readOnly={f.name === 'id'}
                                />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label style={styles.label}>Description</label>
                        <textarea name="description" value={editForm.description} onChange={handleInputChange} placeholder="Enter asset description..." style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }} rows="4" />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn" onClick={() => setIsEditOpen(false)} disabled={loading} style={{ padding: '10px 16px' }}>Cancel</button>
                        <motion.button 
                            whileHover={{ scale: loading ? 1 : 1.02 }} 
                            whileTap={{ scale: loading ? 1 : 0.98 }} 
                            type="submit" 
                            disabled={loading}
                            className="btn btn-primary" 
                            style={{ 
                                padding: '10px 16px', 
                                fontWeight: '600',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};