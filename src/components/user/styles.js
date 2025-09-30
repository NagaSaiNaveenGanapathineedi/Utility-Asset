export const ASSET_FIELDS = [
  { label: 'Asset ID', key: 'id', prefix: 'AST-' },
  { label: 'Type', key: 'type' },
  { label: 'Description', key: 'description' },
  { label: 'Site Code', key: 'siteCode' }
];

export const cardStyle = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-border-light)',
  borderRadius: '8px',
  padding: '20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

export const inputStyle = {
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

export const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: 'var(--color-text-dark)'
};