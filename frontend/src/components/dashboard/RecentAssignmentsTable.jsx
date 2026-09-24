import React from 'react';
import { Badge } from '../common/Badge';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentAssignmentsTable = ({ assignments = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Asset Assignments</h3>
          <p className="card-subtitle">Latest hardware check-outs and deployments</p>
        </div>
        <Link to="/assignments" className="btn btn-secondary btn-sm">
          View All <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Assigned To</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No recent assignments recorded
                </td>
              </tr>
            ) : (
              assignments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.assetName}</div>
                    <div className="code-badge" style={{ display: 'inline-block', marginTop: '2px' }}>
                      {item.assetTag}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.employeeName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.departmentName}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{item.assignedDate}</td>
                  <td>
                    <Badge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
