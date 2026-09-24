import React from 'react';

export const DepartmentDistributionChart = ({ distribution = {} }) => {
  const entries = Object.entries(distribution);
  const total = entries.reduce((acc, [, count]) => acc + count, 0);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Department Distribution</h3>
          <p className="card-subtitle">Workforce headcount across business units</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {entries.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
            No department data available
          </div>
        ) : (
          entries.map(([dept, count], idx) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const color = colors[idx % colors.length];

            return (
              <div key={dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{dept}</span>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>
                    {count} employees ({percentage}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: color,
                      borderRadius: '4px',
                      transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
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
