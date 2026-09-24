import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'No matching data matches your criteria.',
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          marginBottom: '0.5rem',
        }}
      >
        <Icon size={28} />
      </div>
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{title}</h4>
      <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '380px' }}>{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} style={{ marginTop: '0.5rem' }}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
