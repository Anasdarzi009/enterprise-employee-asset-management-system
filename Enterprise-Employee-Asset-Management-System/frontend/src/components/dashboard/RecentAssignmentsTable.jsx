import React from 'react';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';

export const RecentAssignmentsTable = ({ assignments = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Assignments</h3>
        <Link to="/assignments" style={{ fontSize: '0.8rem' }}>View all</Link>
      </div>

      <div className="table-container" style={{ border: 'none' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Assigned To</th>
              <th>Department</th>
              <th>Assigned Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#6b7280' }}>
                  No recent assignments
                </td>
              </tr>
            ) : (
              assignments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{item.assetName}</span>
                    <span className="code-badge" style={{ marginLeft: '6px' }}>{item.assetTag}</span>
                  </td>
                  <td>{item.employeeName}</td>
                  <td>{item.departmentName}</td>
                  <td>{item.assignedDate}</td>
                  <td><Badge status={item.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
