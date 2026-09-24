import React from 'react';

export const AssetFilter = ({
  type,
  status,
  onTypeChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <select
        className="form-select"
        style={{ width: 'auto', minWidth: '150px' }}
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="LAPTOP">Laptop</option>
        <option value="DESKTOP">Desktop</option>
        <option value="MONITOR">Monitor</option>
        <option value="KEYBOARD">Keyboard</option>
        <option value="MOUSE">Mouse</option>
        <option value="MOBILE">Mobile</option>
        <option value="TABLET">Tablet</option>
        <option value="PRINTER">Printer</option>
        <option value="OTHER">Other</option>
      </select>

      <select
        className="form-select"
        style={{ width: 'auto', minWidth: '150px' }}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="AVAILABLE">AVAILABLE</option>
        <option value="ASSIGNED">ASSIGNED</option>
        <option value="MAINTENANCE">MAINTENANCE</option>
        <option value="RETIRED">RETIRED</option>
      </select>

      {(type || status) && (
        <button
          type="button"
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          style={{ height: '38px' }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
