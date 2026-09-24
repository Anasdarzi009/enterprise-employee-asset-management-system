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
import { Plus, Edit2, Trash2, Layers, Cpu, Eye, User } from 'lucide-react';
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
  const pageSize = 8;

  // Modals
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Assign Modal
  const [assigningAsset, setAssigningAsset] = useState(null);

  // Details Modal
  const [viewingAsset, setViewingAsset] = useState(null);

  // Delete Confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAssets();
    if (canManage) {
      loadEmployees();
    }
  }, [search, selectedType, selectedStatus]);

  const loadEmployees = async () => {
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
      <Header title="Hardware & Asset Inventory" />
      <div className="content-body">
        {/* Filters and Actions */}
        <div className="filter-bar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by asset tag, model name or serial number..."
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

        {/* Assets Table */}
        {loading ? (
          <LoadingSpinner text="Loading hardware assets..." />
        ) : assets.length === 0 ? (
          <EmptyState
            icon={Cpu}
            title="No assets found"
            description={search || selectedType || selectedStatus ? 'No asset matches your filter criteria.' : 'No assets registered in inventory.'}
            actionText={canManage ? 'Add New Asset' : undefined}
            onAction={canManage ? handleOpenAdd : undefined}
          />
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset Tag</th>
                    <th>Asset Model / Name</th>
                    <th>Type</th>
                    <th>Serial Number</th>
                    <th>Purchase Date</th>
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
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{ast.name}</div>
                      </td>
                      <td>
                        <Badge type={ast.type} />
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{ast.serialNumber}</td>
                      <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{ast.purchaseDate}</td>
                      <td>
                        <Badge status={ast.status} />
                      </td>
                      <td>
                        {ast.currentEmployeeName ? (
                          <Link
                            to={`/employees/${ast.currentEmployeeId}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              color: '#2563eb',
                              fontWeight: 600,
                              fontSize: '0.84rem',
                            }}
                          >
                            <User size={14} />
                            {ast.currentEmployeeName}
                          </Link>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>— Unassigned —</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            title="View Asset Details"
                            className="btn-icon"
                            onClick={() => setViewingAsset(ast)}
                          >
                            <Eye size={16} />
                          </button>

                          {canManage && ast.status === 'AVAILABLE' && (
                            <button
                              title="Assign to Employee"
                              className="btn-icon"
                              style={{ color: '#2563eb' }}
                              onClick={() => setAssigningAsset(ast)}
                            >
                              <Layers size={16} />
                            </button>
                          )}

                          {canManage && (
                            <button
                              title="Edit Asset"
                              className="btn-icon"
                              onClick={() => handleOpenEdit(ast)}
                            >
                              <Edit2 size={16} />
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              title="Delete Asset"
                              className="btn-icon"
                              style={{ color: '#ef4444' }}
                              onClick={() => setDeleteTarget(ast)}
                              disabled={ast.status === 'ASSIGNED'}
                            >
                              <Trash2 size={16} />
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

      {/* Asset Add/Edit Modal */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSubmit={handleFormSubmit}
        asset={editingAsset}
        loading={isSubmitting}
      />

      {/* Quick Assign Modal */}
      <AssignAssetModal
        isOpen={Boolean(assigningAsset)}
        onClose={() => setAssigningAsset(null)}
        onSubmit={handleAssignSubmit}
        availableAssets={assigningAsset ? [assigningAsset] : []}
        employees={employees}
        preselectedAssetId={assigningAsset?.id}
        loading={isSubmitting}
      />

      {/* View Asset Details Modal */}
      <Modal
        isOpen={Boolean(viewingAsset)}
        onClose={() => setViewingAsset(null)}
        title="Asset Specification Dossier"
        maxWidth="500px"
      >
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>ASSET IDENTIFIER</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{viewingAsset?.name}</div>
            <div className="code-badge" style={{ display: 'inline-block', marginTop: '4px' }}>
              {viewingAsset?.assetTag}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hardware Type</div>
              <div style={{ marginTop: '3px' }}><Badge type={viewingAsset?.type} /></div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Operational Status</div>
              <div style={{ marginTop: '3px' }}><Badge status={viewingAsset?.status} /></div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Serial Number</div>
              <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{viewingAsset?.serialNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Purchase Date</div>
              <div style={{ fontWeight: 600 }}>{viewingAsset?.purchaseDate}</div>
            </div>
          </div>

          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Current Assignment</div>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>
              {viewingAsset?.currentEmployeeName ? (
                <span>{viewingAsset.currentEmployeeName} ({viewingAsset.currentEmployeeCode})</span>
              ) : (
                <span style={{ color: '#94a3b8' }}>Unassigned (In IT Warehouse)</span>
              )}
            </div>
          </div>

          {viewingAsset?.description && (
            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hardware Specifications</div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '3px', lineHeight: 1.5 }}>
                {viewingAsset.description}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setViewingAsset(null)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Hardware Asset"
        message={`Are you sure you want to delete ${deleteTarget?.name} (${deleteTarget?.assetTag})?`}
        loading={isDeleting}
      />
    </>
  );
};
