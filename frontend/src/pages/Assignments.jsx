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
import { Plus } from 'lucide-react';
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
  const pageSize = 10;

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
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

  const handleOpenAssignModal = () => {
    loadFormData();
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await assignmentService.assign(formData);
      showToast('Asset assigned successfully.', 'success');
      setIsAssignModalOpen(false);
      loadAssignments();
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
      <Header title="Assignments" />
      <div className="content-body">
        <div className="filter-bar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search assignments..."
          />
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="RETURNED">Returned</option>
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
            <Button variant="primary" icon={Plus} onClick={handleOpenAssignModal}>
              Assign Asset
            </Button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading assignments..." />
        ) : filteredAssignments.length === 0 ? (
          <EmptyState
            title="No assignments found"
            description="No assignments match the specified query."
            actionText={canManage ? 'Assign Asset' : undefined}
            onAction={canManage ? handleOpenAssignModal : undefined}
          />
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Assigned Date</th>
                    <th>Returned Date</th>
                    <th>Status</th>
                    {canManage && <th style={{ textAlign: 'right' }}>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedAssignments.map((asg) => (
                    <tr key={asg.id}>
                      <td>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{asg.assetName}</span>
                        <span className="code-badge" style={{ marginLeft: '6px' }}>{asg.assetTag}</span>
                      </td>
                      <td>
                        <Link to={`/employees/${asg.employeeId}`}>
                          {asg.employeeName}
                        </Link>
                      </td>
                      <td>{asg.departmentName}</td>
                      <td>{asg.assignedDate}</td>
                      <td>{asg.returnedDate || '—'}</td>
                      <td>
                        <Badge status={asg.status} />
                      </td>
                      {canManage && (
                        <td style={{ textAlign: 'right' }}>
                          {asg.status === 'ACTIVE' && (
                            <Button
                              variant="secondary"
                              size="sm"
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

      <AssignAssetModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSubmit}
        availableAssets={availableAssets}
        employees={employees}
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
