import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const EmployeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  employee = null,
  departments = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    designation: '',
    joiningDate: '',
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeId: employee.employeeId || '',
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        departmentId: employee.departmentId || '',
        designation: employee.designation || '',
        joiningDate: employee.joiningDate || '',
        status: employee.status || 'ACTIVE',
      });
    } else {
      setFormData({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        departmentId: departments[0]?.id || '',
        designation: '',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      });
    }
    setErrors({});
  }, [employee, departments, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.employeeId.trim()) errs.employeeId = 'Employee ID is required';
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.departmentId) errs.departmentId = 'Department is required';
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.joiningDate) errs.joiningDate = 'Joining date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      departmentId: Number(formData.departmentId),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Edit Employee Details' : 'Add New Enterprise Employee'}
      maxWidth="650px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Employee ID *</label>
              <input
                type="text"
                placeholder="e.g. EMP-1009"
                className="form-input"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                disabled={Boolean(employee)}
              />
              {errors.employeeId && <span className="form-error">{errors.employeeId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Employment Status *</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                placeholder="Jane"
                className="form-input"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                placeholder="Doe"
                className="form-input"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              {errors.lastName && <span className="form-error">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Corporate Email *</label>
              <input
                type="email"
                placeholder="jane.doe@company.com"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-select"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              >
                <option value="">Select Department...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
              {errors.departmentId && <span className="form-error">{errors.departmentId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Designation / Role *</label>
              <input
                type="text"
                placeholder="e.g. Lead Software Architect"
                className="form-input"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
              {errors.designation && <span className="form-error">{errors.designation}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Joining Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              />
              {errors.joiningDate && <span className="form-error">{errors.joiningDate}</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            {employee ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
