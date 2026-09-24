import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const AssetModal = ({
  isOpen,
  onClose,
  onSubmit,
  asset = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    assetTag: '',
    name: '',
    type: 'LAPTOP',
    serialNumber: '',
    purchaseDate: '',
    status: 'AVAILABLE',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (asset) {
      setFormData({
        assetTag: asset.assetTag || '',
        name: asset.name || '',
        type: asset.type || 'LAPTOP',
        serialNumber: asset.serialNumber || '',
        purchaseDate: asset.purchaseDate || '',
        status: asset.status || 'AVAILABLE',
        description: asset.description || '',
      });
    } else {
      setFormData({
        assetTag: '',
        name: '',
        type: 'LAPTOP',
        serialNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        status: 'AVAILABLE',
        description: '',
      });
    }
    setErrors({});
  }, [asset, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.assetTag.trim()) errs.assetTag = 'Asset Tag is required';
    if (!formData.name.trim()) errs.name = 'Asset Name is required';
    if (!formData.type) errs.type = 'Asset Type is required';
    if (!formData.serialNumber.trim()) errs.serialNumber = 'Serial Number is required';
    if (!formData.purchaseDate) errs.purchaseDate = 'Purchase Date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={asset ? 'Edit Hardware Asset' : 'Register New Hardware Asset'}
      maxWidth="650px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Asset Tag / Identifier *</label>
              <input
                type="text"
                placeholder="e.g. AST-LAP-005"
                className="form-input"
                value={formData.assetTag}
                onChange={(e) => setFormData({ ...formData, assetTag: e.target.value.toUpperCase() })}
                disabled={Boolean(asset)}
              />
              {errors.assetTag && <span className="form-error">{errors.assetTag}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Asset Type *</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="LAPTOP">Laptop</option>
                <option value="DESKTOP">Desktop</option>
                <option value="MONITOR">Monitor</option>
                <option value="KEYBOARD">Keyboard</option>
                <option value="MOUSE">Mouse</option>
                <option value="MOBILE">Mobile</option>
                <option value="TABLET">Tablet</option>
                <option value="PRINTER">Printer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Asset Name / Model *</label>
              <input
                type="text"
                placeholder="e.g. Apple MacBook Pro 14-inch M3 Pro"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Hardware Serial Number *</label>
              <input
                type="text"
                placeholder="e.g. C02G4589MD6R"
                className="form-input"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
              {errors.serialNumber && <span className="form-error">{errors.serialNumber}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Operational Status *</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={formData.status === 'ASSIGNED'}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="ASSIGNED" disabled>ASSIGNED (Auto-set on assignment)</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="RETIRED">RETIRED</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Purchase Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
              {errors.purchaseDate && <span className="form-error">{errors.purchaseDate}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Specification & Notes</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="e.g. 32GB RAM, 1TB SSD, Space Gray, with AppleCare+ warranty"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            {asset ? 'Save Changes' : 'Register Asset'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
