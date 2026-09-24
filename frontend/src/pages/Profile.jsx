import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { assetService } from '../services/assetService';
import { employeeService } from '../services/employeeService';

export const Profile = () => {
  const { user } = useAuth();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const employees = await employeeService.getAll({ search: user.email });
      const matched = employees.find((e) => e.email.toLowerCase() === user.email.toLowerCase());

      if (matched) {
        setEmployeeDetails(matched);
        const assets = await assetService.getByEmployee(matched.id);
        setMyAssets(assets);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Profile" />
      <div className="content-body">
        {loading ? (
          <LoadingSpinner text="Loading profile..." />
        ) : (
          <>
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>
                    {user?.fullName}
                  </h2>
                  <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '0.15rem' }}>
                    {user?.email}
                  </div>
                </div>
                <Badge status={user?.role} label={user?.role} />
              </div>

              {employeeDetails && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Employee ID</div>
                    <div style={{ fontWeight: 600, marginTop: '2px' }}>
                      <span className="code-badge">{employeeDetails.employeeId}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Department</div>
                    <div style={{ fontWeight: 600 }}>{employeeDetails.departmentName}</div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Designation</div>
                    <div style={{ fontWeight: 600 }}>{employeeDetails.designation}</div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Status</div>
                    <div style={{ marginTop: '2px' }}>
                      <Badge status={employeeDetails.status} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">My Assigned Assets</h3>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{myAssets.length} items</span>
              </div>

              {myAssets.length === 0 ? (
                <div style={{ color: '#6b7280', padding: '1rem 0' }}>
                  No assets currently assigned to your account.
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Asset Tag</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Serial Number</th>
                        <th>Status</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAssets.map((ast) => (
                        <tr key={ast.id}>
                          <td>
                            <span className="code-badge">{ast.assetTag}</span>
                          </td>
                          <td style={{ fontWeight: 600, color: '#111827' }}>{ast.name}</td>
                          <td>{ast.type}</td>
                          <td>{ast.serialNumber}</td>
                          <td>
                            <Badge status={ast.status} />
                          </td>
                          <td>{ast.description || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
