import React from 'react';
import { Badge } from '../common/Badge';

export const AssetStatusDistribution = ({ distribution = {} }) => {
  const entries = Object.entries(distribution);
  const total = entries.reduce((acc, [, count]) => acc + count, 0);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Asset Status</h3>
        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total: {total}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {entries.map(([status, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div
              key={status}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
              }}
            >
              <Badge status={status} label={status} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                {count} <span style={{ color: '#6b7280', fontWeight: 400 }}>({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
