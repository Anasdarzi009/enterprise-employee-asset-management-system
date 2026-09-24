import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const AssignAssetModal = ({
  isOpen,
  onClose,
  onSubmit,
  availableAssets = [],
  employees = [],
  preselectedAssetId = null,
  preselectedEmployeeId = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    assetId: '',
    employeeId: '',
    assignedDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      assetId: preselectedAssetId ? String(preselectedAssetId) : availableAssets[0]?.id ? String(availableAssets[0].id) : '',
      employeeId: preselectedEmployeeId ? String(preselectedEmployeeId) : employees[0]?.id ? String(employees[0].id) : '',
      assignedDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setErrors({});
  }, [isOpen, preselectedAssetId, preselectedEmployeeId, availableAssets, employees]);

  const validate = () => {
    const errs = {};
    if (!formData.assetId) errs.assetId = 'Please select an available asset';
    if (!formData.employeeId) errs.employeeId = 'Please select an employee';
    if (!formData.assignedDate) errs.assignedDate = 'Assignment date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      assetId: Number(formData.assetId),
      employeeId: Number(formData.employeeId),
      assignedDate: formData.assignedDate,
      notes: formData.notes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Enterprise Hardware Asset"
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Select Available Asset *</label>
            <select
              className="form-select"
              value={formData.assetId}
              onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
              disabled={Boolean(preselectedAssetId)}
            >
              <option value="">Choose an available asset...</option>
              {availableAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  [{asset.assetTag}] {asset.name} ({asset.type})
                </option>
              ))}
            </select>
            {errors.assetId && <span className="form-error">{errors.assetId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Assign To Employee *</label>
            <select
              className="form-select"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              disabled={Boolean(preselectedEmployeeId)}
            >
              <option value="">Choose an employee...</option>
              {employees
                .filter((emp) => emp.status === 'ACTIVE')
                .map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    [{emp.employeeId}] {emp.firstName} {emp.lastName} &bull; {emp.departmentName} ({emp.designation})
                  </option>
                ))}
            </select>
            {errors.employeeId && <span className="form-error">{errors.employeeId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Assignment Date *</label>
            <input
              type="date"
              className="form-input"
              value={formData.assignedDate}
              onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
            />
            {errors.assignedDate && <span className="form-error">{errors.assignedDate}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Assignment Remarks / Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="e.g. Assigned for remote workstation setup; includes charger and protective case"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Confirm Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
