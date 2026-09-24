import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SearchBar } from '../components/common/SearchBar';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { AssignAssetModal } from '../components/assignments/AssignAssetModal';
import { ReturnAssetModal } from '../components/assignments/ReturnAssetModal';
import { assignmentService } from '../services/assignmentService';
import { assetService } from '../services/assetService';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, RotateCcw, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Assignments = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [assignments, setAssignments] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
    if (canManage) {
      loadFormData();
    }
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (err) {
      showToast('Unable to load assignments: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const [availAssets, emps] = await Promise.all([
        assetService.getAvailable(),
        employeeService.getAll({ status: 'ACTIVE' }),
      ]);
      setAvailableAssets(availAssets);
      setEmployees(emps);
    } catch {
      // ignore
    }
  };

  const handleAssignSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await assignmentService.assign(formData);
      showToast('Asset assigned successfully.', 'success');
      setIsAssignModalOpen(false);
      loadAssignments();
      loadFormData();
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
      loadAssignments();
      loadFormData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered
  const filteredAssignments = assignments.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      a.assetName?.toLowerCase().includes(q) ||
      a.assetTag?.toLowerCase().includes(q) ||
      a.employeeName?.toLowerCase().includes(q) ||
      a.employeeCode?.toLowerCase().includes(q);

    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAssignments = filteredAssignments.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Header title="Asset Assignment & Audit History" />
      <div className="content-body">
        {/* Filters and Controls */}
        <div className="filter-bar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by asset, tag, or employee..."
          />
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="RETURNED">RETURNED</option>
            </select>

            {statusFilter && (
              <button
                type="button"
                onClick={() => setStatusFilter('')}
                className="btn btn-secondary btn-sm"
              >
                Reset
              </button>
            )}
          </div>

          {canManage && (
            <Button variant="primary" icon={Plus} onClick={() => setIsAssignModalOpen(true)}>
              New Assignment
            </Button>
          )}
        </div>

        {/* History Table */}
        {loading ? (
          <LoadingSpinner text="Retrieving assignment logs..." />
        ) : filteredAssignments.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No assignment records found"
            description="No hardware assignments match the specified query."
            actionText={canManage ? 'Assign Asset' : undefined}
            onAction={canManage ? () => setIsAssignModalOpen(true) : undefined}
          />
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Asset Details</th>
                    <th>Assigned To</th>
                    <th>Assigned Date</th>
                    <th>Returned Date</th>
                    <th>Status</th>
                    <th>Issued By</th>
                    <th>Notes & Remarks</th>
                    {canManage && <th style={{ textAlign: 'right' }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedAssignments.map((asg) => (
                    <tr key={asg.id}>
                      <td>
                        <span className="code-badge">ASG-{asg.id}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{asg.assetName}</div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '2px', alignItems: 'center' }}>
                          <span className="code-badge">{asg.assetTag}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({asg.assetType})</span>
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/employees/${asg.employeeId}`}
                          style={{ fontWeight: 600, color: '#2563eb' }}
                        >
                          {asg.employeeName}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {asg.employeeCode} &bull; {asg.departmentName}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{asg.assignedDate}</td>
                      <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{asg.returnedDate || '—'}</td>
                      <td>
                        <Badge status={asg.status} />
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {asg.assignedByName || 'System'}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569', maxWidth: '240px' }}>
                        {asg.notes || '—'}
                      </td>
                      {canManage && (
                        <td style={{ textAlign: 'right' }}>
                          {asg.status === 'ACTIVE' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={RotateCcw}
                              onClick={() => setReturnTarget(asg)}
                            >
                              Return
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={filteredAssignments.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Assign Modal */}
      <AssignAssetModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSubmit}
        availableAssets={availableAssets}
        employees={employees}
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
