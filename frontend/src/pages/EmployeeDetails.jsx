import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AssignAssetModal } from '../components/assignments/AssignAssetModal';
import { ReturnAssetModal } from '../components/assignments/ReturnAssetModal';
import { employeeService } from '../services/employeeService';
import { assetService } from '../services/assetService';
import { assignmentService } from '../services/assignmentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Briefcase,
  Layers,
  PlusCircle,
  RotateCcw,
  Cpu,
} from 'lucide-react';

export const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [employee, setEmployee] = useState(null);
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [empData, assetsData, historyData, availAssets] = await Promise.all([
        employeeService.getById(id),
        assetService.getByEmployee(id),
        assignmentService.getByEmployee(id),
        assetService.getAvailable(),
      ]);

      setEmployee(empData);
      setAssignedAssets(assetsData);
      setAssignmentHistory(historyData);
      setAvailableAssets(availAssets);
    } catch (err) {
      showToast('Error loading profile: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubmit = async (assignData) => {
    try {
      setSubmitting(true);
      await assignmentService.assign(assignData);
      showToast('Asset assigned successfully.', 'success');
      setIsAssignModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnSubmit = async (returnData) => {
    if (!returnTarget) return;
    try {
      setSubmitting(true);
      await assignmentService.returnAsset(returnTarget.id, returnData);
      showToast('Asset returned successfully.', 'success');
      setReturnTarget(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Employee Dossier & Assets" />
      <div className="content-body">
        <div style={{ marginBottom: '0.5rem' }}>
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/employees')}>
            Back to Directory
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving employee profile and asset allocations..." />
        ) : !employee ? (
          <div className="card">Employee record not found.</div>
        ) : (
          <>
            {/* Employee Dossier Header Card */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    {employee.firstName?.[0]}{employee.lastName?.[0]}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                        {employee.firstName} {employee.lastName}
                      </h2>
                      <Badge status={employee.status} />
                    </div>
                    <div style={{ color: '#475569', fontWeight: 600, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{employee.designation}</span>
                      <span>&bull;</span>
                      <span className="code-badge">{employee.employeeId}</span>
                    </div>
                  </div>
                </div>

                {canManage && (
                  <Button
                    variant="primary"
                    icon={PlusCircle}
                    onClick={() => setIsAssignModalOpen(true)}
                    disabled={employee.status !== 'ACTIVE'}
                  >
                    Assign New Asset
                  </Button>
                )}
              </div>

              {/* Dossier Grid Details */}
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
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} /> Corporate Email
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>{employee.email}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} /> Contact Phone
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>{employee.phone || 'N/A'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building size={14} /> Department
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>
                    {employee.departmentName} ({employee.departmentCode})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} /> Joining Date
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>{employee.joiningDate}</div>
                </div>
              </div>
            </div>

            {/* Currently Assigned Assets Card */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Currently Assigned Hardware Equipment</h3>
                  <p className="card-subtitle">Active company assets checked out by this employee</p>
                </div>
                <span className="code-badge">{assignedAssets.length} Active Items</span>
              </div>

              {assignedAssets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                  <Cpu size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                  <div>No hardware assets currently assigned to this employee.</div>
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
                        <th>Purchase Date</th>
                        <th>Status</th>
                        {canManage && <th style={{ textAlign: 'right' }}>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {assignedAssets.map((asset) => {
                        // Find matching active assignment
                        const activeAssignment = assignmentHistory.find(
                          (h) => h.assetId === asset.id && h.status === 'ACTIVE'
                        );

                        return (
                          <tr key={asset.id}>
                            <td>
                              <span className="code-badge">{asset.assetTag}</span>
                            </td>
                            <td style={{ fontWeight: 600, color: '#0f172a' }}>{asset.name}</td>
                            <td>
                              <Badge type={asset.type} />
                            </td>
                            <td style={{ fontFamily: 'monospace' }}>{asset.serialNumber}</td>
                            <td>{asset.purchaseDate}</td>
                            <td>
                              <Badge status={asset.status} />
                            </td>
                            {canManage && (
                              <td style={{ textAlign: 'right' }}>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  icon={RotateCcw}
                                  onClick={() => setReturnTarget(activeAssignment)}
                                >
                                  Return Asset
                                </Button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Complete Assignment Lifecycle History */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Asset Assignment Audit Trail</h3>
                  <p className="card-subtitle">Complete historical equipment issuance & return records</p>
                </div>
              </div>

              <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Asset</th>
                      <th>Assigned Date</th>
                      <th>Returned Date</th>
                      <th>Lifecycle Status</th>
                      <th>Notes & Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentHistory.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          No historical assignment logs
                        </td>
                      </tr>
                    ) : (
                      assignmentHistory.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <span className="code-badge">ASG-{item.id}</span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.assetName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.assetTag}</div>
                          </td>
                          <td>{item.assignedDate}</td>
                          <td>{item.returnedDate || '—'}</td>
                          <td>
                            <Badge status={item.status} />
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#475569', maxWidth: '300px' }}>
                            {item.notes || '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Assign Modal */}
      <AssignAssetModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSubmit}
        availableAssets={availableAssets}
        employees={employee ? [employee] : []}
        preselectedEmployeeId={employee?.id}
        loading={submitting}
      />

      {/* Return Modal */}
      <ReturnAssetModal
        isOpen={Boolean(returnTarget)}
        onClose={() => setReturnTarget(null)}
        onSubmit={handleReturnSubmit}
        assignment={returnTarget}
        loading={submitting}
      />
    </>
  );
};
