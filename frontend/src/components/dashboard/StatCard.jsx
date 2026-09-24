import React from 'react';

export const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg = '#eff6ff',
  iconColor = '#3b82f6',
  trend,
}) => {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value ?? 0}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
      <div
        className="stat-icon-wrapper"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon size={22} />
      </div>
    </div>
  );
};
