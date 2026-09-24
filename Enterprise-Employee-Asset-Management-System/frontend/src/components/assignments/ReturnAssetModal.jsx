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
      title="Return Asset"
      maxWidth="460px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#f9fafb',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              marginBottom: '1rem',
              fontSize: '0.82rem',
            }}
          >
            <div><strong>Asset:</strong> {assignment?.assetName} ({assignment?.assetTag})</div>
            <div style={{ marginTop: '0.2rem' }}><strong>Employee:</strong> {assignment?.employeeName}</div>
            <div style={{ marginTop: '0.2rem' }}><strong>Assigned Date:</strong> {assignment?.assignedDate}</div>
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
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="Return condition or remarks"
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
