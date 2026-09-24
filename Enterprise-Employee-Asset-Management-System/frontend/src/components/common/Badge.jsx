import React from 'react';

export const Badge = ({ status, type, label }) => {
  const getBadgeClass = () => {
    const val = (status || type || label || '').toUpperCase();
    switch (val) {
      case 'ACTIVE':
      case 'AVAILABLE':
        return 'badge-success';
      case 'ASSIGNED':
      case 'ADMIN':
        return 'badge-info';
      case 'MAINTENANCE':
      case 'ON_LEAVE':
      case 'HR':
        return 'badge-warning';
      case 'RETIRED':
      case 'INACTIVE':
      case 'RETURNED':
        return 'badge-danger';
      default:
        return 'badge-gray';
    }
  };

  const displayText = label || status || type;

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {displayText}
    </span>
  );
};
