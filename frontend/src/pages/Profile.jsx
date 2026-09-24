import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { assetService } from '../services/assetService';
import { employeeService } from '../services/employeeService';
import { User, Mail, Shield, Building, Cpu, CheckCircle } from 'lucide-react';

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
      <Header title="My Enterprise Profile" />
      <div className="content-body">
        {loading ? (
          <LoadingSpinner text="Retrieving personal profile and assigned assets..." />
        ) : (
          <>
            {/* User Profile Card */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                  }}
                >
                  {user?.fullName?.[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                      {user?.fullName}
                    </h2>
                    <Badge status={user?.role} label={user?.role} />
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                    {user?.email}
                  </div>
                </div>
              </div>

              {employeeDetails && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem',
                    marginTop: '1.75rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Employee Code
                    </div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                      <span className="code-badge">{employeeDetails.employeeId}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Department
                    </div>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
                      {employeeDetails.departmentName}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Designation
                    </div>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
                      {employeeDetails.designation}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Employment Status
                    </div>
                    <div style={{ marginTop: '0.2rem' }}>
                      <Badge status={employeeDetails.status} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* My Hardware Assets */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">My Assigned Equipment</h3>
                  <p className="card-subtitle">Active assets checked out to your custody</p>
                </div>
                <span className="code-badge">{myAssets.length} Items</span>
              </div>

              {myAssets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <Cpu size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                  <div>You have no hardware assets currently checked out.</div>
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Asset Tag</th>
                        <th>Asset Name</th>
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
                          <td style={{ fontWeight: 600, color: '#0f172a' }}>{ast.name}</td>
                          <td>
                            <Badge type={ast.type} />
                          </td>
                          <td style={{ fontFamily: 'monospace' }}>{ast.serialNumber}</td>
                          <td>
                            <Badge status={ast.status} />
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#475569' }}>{ast.description || '—'}</td>
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
