import React from 'react';
import { Badge } from '../common/Badge';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentEmployeesList = ({ employees = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Recently Added Employees</h3>
          <p className="card-subtitle">Newest members joined the enterprise</p>
        </div>
        <Link to="/employees" className="btn btn-secondary btn-sm">
          View All <ArrowUpRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            No recent employees
          </div>
        ) : (
          employees.map((emp) => (
            <div
              key={emp.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #f1f5f9',
                backgroundColor: '#fcfdfe',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                  }}
                >
                  {emp.firstName?.[0]}{emp.lastName?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>
                    {emp.firstName} {emp.lastName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {emp.designation} &bull; {emp.departmentName}
                  </div>
                </div>
              </div>
              <Badge status={emp.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
