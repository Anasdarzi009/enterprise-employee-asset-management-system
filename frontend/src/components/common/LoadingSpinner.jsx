import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        gap: '1rem',
        color: '#64748b',
      }}
    >
      <Loader2 size={32} className="animate-spin" color="#3b82f6" />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>
    </div>
  );
};
