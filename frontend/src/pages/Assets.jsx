import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/common/SearchBar';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Modal } from '../components/common/Modal';
import { AssetModal } from '../components/assets/AssetModal';
import { AssetFilter } from '../components/assets/AssetFilter';
import { AssignAssetModal } from '../components/assignments/AssignAssetModal';
import { assetService } from '../services/assetService';
import { employeeService } from '../services/employeeService';
import { assignmentService } from '../services/assignmentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Assets = () => {
  const { canManage, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assign Modal
  const [assigningAsset, setAssigningAsset] = useState(null);

  // View Details Modal
  const [viewingAsset, setViewingAsset] = useState(null);

  // Delete Confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAssets();
  }, [search, selectedType, selectedStatus]);

  const loadEmployeesForAssign = async () => {
    try {
      const data = await employeeService.getAll({ status: 'ACTIVE' });
      setEmployees(data);
    } catch {
      // ignore
    }
  };

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await assetService.getAll({
        search,
        type: selectedType || undefined,
        status: selectedStatus || undefined,
      });
      setAssets(data);
    } catch (err) {
      showToast('Unable to load assets: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingAsset(null);
    setIsAssetModalOpen(true);
  };

  const handleOpenEdit = (ast) => {
    setEditingAsset(ast);
    setIsAssetModalOpen(true);
  };

  const handleOpenAssign = (ast) => {
    setAssigningAsset(ast);
    loadEmployeesForAssign();
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingAsset) {
        await assetService.update(editingAsset.id, formData);
        showToast('Asset updated successfully.', 'success');
      } else {
        await assetService.create(formData);
        showToast('Asset created successfully.', 'success');
      }
      setIsAssetModalOpen(false);
      loadAssets();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await assignmentService.assign(data);
      showToast('Asset assigned successfully.', 'success');
      setAssigningAsset(null);
      loadAssets();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await assetService.delete(deleteTarget.id);
      showToast('Asset deleted successfully.', 'success');
      setDeleteTarget(null);
      loadAssets();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAssets = assets.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Header title="Assets" />
      <div className="content-body">
        <div className="filter-bar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search assets..."
          />
          <AssetFilter
            type={selectedType}
            status={selectedStatus}
            onTypeChange={setSelectedType}
            onStatusChange={setSelectedStatus}
            onReset={() => {
              setSelectedType('');
              setSelectedStatus('');
              setSearch('');
            }}
          />
          {canManage && (
            <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
              Add Asset
            </Button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading assets..." />
        ) : assets.length === 0 ? (
          <EmptyState
            title="No assets found"
            description="No asset records match the specified query."
            actionText={canManage ? 'Add Asset' : undefined}
            onAction={canManage ? handleOpenAdd : undefined}
          />
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset Tag</th>
                    <th>Asset</th>
                    <th>Type</th>
                    <th>Serial Number</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAssets.map((ast) => (
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
                      <td>
                        {ast.currentEmployeeName ? (
                          <Link to={`/employees/${ast.currentEmployeeId}`}>
                            {ast.currentEmployeeName}
                          </Link>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setViewingAsset(ast)}
                          >
                            View
                          </button>

                          {canManage && ast.status === 'AVAILABLE' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleOpenAssign(ast)}
                            >
                              Assign
                            </button>
                          )}

                          {canManage && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEdit(ast)}
                            >
                              Edit
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteTarget(ast)}
                              disabled={ast.status === 'ASSIGNED'}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={assets.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSubmit={handleFormSubmit}
        asset={editingAsset}
        loading={isSubmitting}
      />

      <AssignAssetModal
        isOpen={Boolean(assigningAsset)}
        onClose={() => setAssigningAsset(null)}
        onSubmit={handleAssignSubmit}
        availableAssets={assigningAsset ? [assigningAsset] : []}
        employees={employees}
        preselectedAssetId={assigningAsset?.id}
        loading={isSubmitting}
      />

      <Modal
        isOpen={Boolean(viewingAsset)}
        onClose={() => setViewingAsset(null)}
        title="Asset Details"
        maxWidth="480px"
      >
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Asset Tag</div>
            <div style={{ fontWeight: 600 }}>{viewingAsset?.assetTag}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Name</div>
            <div style={{ fontWeight: 600 }}>{viewingAsset?.name}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Type</div>
              <div>{viewingAsset?.type}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Status</div>
              <div style={{ marginTop: '2px' }}><Badge status={viewingAsset?.status} /></div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Serial Number</div>
              <div>{viewingAsset?.serialNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Purchase Date</div>
              <div>{viewingAsset?.purchaseDate}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Assigned To</div>
            <div>{viewingAsset?.currentEmployeeName || 'Unassigned'}</div>
          </div>
          {viewingAsset?.description && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Description</div>
              <div style={{ fontSize: '0.85rem', color: '#374151' }}>{viewingAsset.description}</div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setViewingAsset(null)}>
            Close
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Asset"
        message={`Are you sure you want to delete ${deleteTarget?.name} (${deleteTarget?.assetTag})?`}
        loading={isDeleting}
      />
    </>
  );
};
