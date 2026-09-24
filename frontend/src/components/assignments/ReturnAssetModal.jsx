import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const ReturnAssetModal = ({
  isOpen,
  onClose,
  onSubmit,
  assignment = null,
  loading = false,
}) => {
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    setReturnDate(new Date().toISOString().split('T')[0]);
    setReturnNotes('');
  }, [isOpen, assignment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      returnDate,
      returnNotes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Return Hardware Asset"
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
            }}
          >
            <div>
              <strong>Asset:</strong> {assignment?.assetName} ({assignment?.assetTag})
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              <strong>Currently with:</strong> {assignment?.employeeName} ({assignment?.employeeCode})
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              <strong>Assigned on:</strong> {assignment?.assignedDate}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Return Date *</label>
            <input
              type="date"
              className="form-input"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Inspection & Condition Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="e.g. Asset returned in good operational condition with all original accessories."
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Confirm Return
          </Button>
        </div>
      </form>
    </Modal>
  );
};
