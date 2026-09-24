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
import { ArrowLeft, Plus } from 'lucide-react';

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
      <Header title="Employee Details" />
      <div className="content-body">
        <div>
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading employee profile..." />
        ) : !employee ? (
          <div className="card">Employee record not found.</div>
        ) : (
          <>
            {/* Employee Information Card */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <span className="code-badge" style={{ marginTop: '4px', display: 'inline-block' }}>
                    {employee.employeeId}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  <Badge status={employee.status} />
                  {canManage && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Plus}
                      onClick={() => setIsAssignModalOpen(true)}
                      disabled={employee.status !== 'ACTIVE'}
                    >
                      Assign Asset
                    </Button>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Email</div>
                  <div style={{ fontWeight: 600 }}>{employee.email}</div>
                </div>

                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Phone</div>
                  <div style={{ fontWeight: 600 }}>{employee.phone || '—'}</div>
                </div>

                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Department</div>
                  <div style={{ fontWeight: 600 }}>
                    {employee.departmentName} ({employee.departmentCode})
                  </div>
                </div>

                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Designation</div>
                  <div style={{ fontWeight: 600 }}>{employee.designation}</div>
                </div>

                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Joining Date</div>
                  <div style={{ fontWeight: 600 }}>{employee.joiningDate}</div>
                </div>
              </div>
            </div>

            {/* Currently Assigned Assets Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Assigned Assets</h3>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{assignedAssets.length} items</span>
              </div>

              {assignedAssets.length === 0 ? (
                <div style={{ color: '#6b7280', fontSize: '0.85rem', padding: '1rem 0' }}>
                  No assets currently assigned to this employee.
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Asset Tag</th>
                        <th>Asset Name</th>
                        <th>Type</th>
                        <th>Serial Number</th>
                        <th>Status</th>
                        {canManage && <th style={{ textAlign: 'right' }}>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {assignedAssets.map((asset) => {
                        const activeAssignment = assignmentHistory.find(
                          (h) => h.assetId === asset.id && h.status === 'ACTIVE'
                        );

                        return (
                          <tr key={asset.id}>
                            <td>
                              <span className="code-badge">{asset.assetTag}</span>
                            </td>
                            <td style={{ fontWeight: 600, color: '#111827' }}>{asset.name}</td>
                            <td>{asset.type}</td>
                            <td>{asset.serialNumber}</td>
                            <td>
                              <Badge status={asset.status} />
                            </td>
                            {canManage && (
                              <td style={{ textAlign: 'right' }}>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setReturnTarget(activeAssignment)}
                                >
                                  Return
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

            {/* Assignment History */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Assignment History</h3>
              </div>

              <div className="table-container" style={{ border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Assigned Date</th>
                      <th>Returned Date</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentHistory.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ color: '#6b7280', textAlign: 'center' }}>
                          No assignment records
                        </td>
                      </tr>
                    ) : (
                      assignmentHistory.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <span style={{ fontWeight: 600 }}>{item.assetName}</span>
                            <span className="code-badge" style={{ marginLeft: '6px' }}>{item.assetTag}</span>
                          </td>
                          <td>{item.assignedDate}</td>
                          <td>{item.returnedDate || '—'}</td>
                          <td>
                            <Badge status={item.status} />
                          </td>
                          <td style={{ color: '#4b5563' }}>{item.notes || '—'}</td>
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

      <AssignAssetModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSubmit}
        availableAssets={availableAssets}
        employees={employee ? [employee] : []}
        preselectedEmployeeId={employee?.id}
        loading={submitting}
      />

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
