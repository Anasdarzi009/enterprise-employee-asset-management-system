import React from 'react';
import { Badge } from '../common/Badge';

export const AssetStatusDistribution = ({ distribution = {} }) => {
  const entries = Object.entries(distribution);
  const total = entries.reduce((acc, [, count]) => acc + count, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return '#10b981';
      case 'ASSIGNED': return '#3b82f6';
      case 'MAINTENANCE': return '#f59e0b';
      case 'RETIRED': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Asset Status Breakdown</h3>
          <p className="card-subtitle">Current hardware operational status</p>
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
          Total: {total}
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '14px',
          borderRadius: '7px',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          overflow: 'hidden',
          margin: '1.25rem 0',
        }}
      >
        {entries.map(([status, count]) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div
              key={status}
              title={`${status}: ${count}`}
              style={{
                width: `${pct}%`,
                height: '100%',
                backgroundColor: getStatusColor(status),
                transition: 'width 500ms ease',
              }}
            />
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {entries.map(([status, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div
              key={status}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #f1f5f9',
              }}
            >
              <Badge status={status} label={status} />
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{count}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '4px' }}>({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
