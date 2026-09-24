import React from 'react';

export const StatCard = ({ label, value }) => {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? 0}</div>
    </div>
  );
};
