import React from 'react';

export const DepartmentDistributionChart = ({ distribution = {} }) => {
  const entries = Object.entries(distribution);
  const total = entries.reduce((acc, [, count]) => acc + count, 0);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Employee Distribution</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {entries.length === 0 ? (
          <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>No department data</div>
        ) : (
          entries.map(([dept, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>{dept}</span>
                  <span style={{ color: '#6b7280' }}>{count} ({percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: '#1d4ed8',
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
