import React from 'react';

export const EmployeeFilter = ({
  departmentId,
  status,
  departments = [],
  onDepartmentChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <select
        className="form-select"
        style={{ width: 'auto', minWidth: '180px' }}
        value={departmentId}
        onChange={(e) => onDepartmentChange(e.target.value)}
      >
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <select
        className="form-select"
        style={{ width: 'auto', minWidth: '150px' }}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
        <option value="ON_LEAVE">ON_LEAVE</option>
      </select>

      {(departmentId || status) && (
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
