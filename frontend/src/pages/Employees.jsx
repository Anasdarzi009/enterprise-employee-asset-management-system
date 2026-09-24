import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/common/SearchBar';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmployeeModal } from '../components/employees/EmployeeModal';
import { EmployeeFilter } from '../components/employees/EmployeeFilter';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus } from 'lucide-react';

export const Employees = () => {
  const navigate = useNavigate();
  const { canManage, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadEmployees();
    setCurrentPage(1);
  }, [search, selectedDept, selectedStatus]);

  const loadDepartments = async () => {
    try {
      const data = await employeeService.getDepartments();
      setDepartments(data);
    } catch {
      showToast('Could not load departments', 'error');
    }
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll({
        search,
        departmentId: selectedDept || undefined,
        status: selectedStatus || undefined,
      });
      setEmployees(data);
    } catch (err) {
      showToast('Unable to load employees: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, formData);
        showToast('Employee updated successfully.', 'success');
      } else {
        await employeeService.create(formData);
        showToast('Employee added successfully.', 'success');
      }
      setIsModalOpen(false);
      loadEmployees();
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
      await employeeService.delete(deleteTarget.id);
      showToast('Employee deleted successfully.', 'success');
      setDeleteTarget(null);
      loadEmployees();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = employees.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Header title="Employees" />
      <div className="content-body">
        <div className="filter-bar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search employees..."
          />
          <EmployeeFilter
            departmentId={selectedDept}
            status={selectedStatus}
            departments={departments}
            onDepartmentChange={setSelectedDept}
            onStatusChange={setSelectedStatus}
            onReset={() => {
              setSelectedDept('');
              setSelectedStatus('');
              setSearch('');
            }}
          />
          {canManage && (
            <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
              Add Employee
            </Button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading employees..." />
        ) : employees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description="No employee records match the selected filter."
            actionText={canManage ? 'Add Employee' : undefined}
            onAction={canManage ? handleOpenAdd : undefined}
          />
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <span className="code-badge">{emp.employeeId}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#111827' }}>
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td>{emp.email}</td>
                      <td>{emp.departmentName}</td>
                      <td>{emp.designation}</td>
                      <td>
                        <Badge status={emp.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/employees/${emp.id}`)}
                          >
                            View
                          </button>
                          {canManage && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEdit(emp)}
                            >
                              Edit
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteTarget(emp)}
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
              totalItems={employees.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
        departments={departments}
        loading={isSubmitting}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName} (${deleteTarget?.employeeId})?`}
        loading={isDeleting}
      />
    </>
  );
};
