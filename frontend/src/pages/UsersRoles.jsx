import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';

export const UsersRoles = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      showToast('Unable to load user accounts: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      await userService.updateRole(userId, newRole);
      showToast('User role updated successfully.', 'success');
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      setUpdatingId(userId);
      await userService.toggleStatus(userId);
      showToast('User status updated.', 'success');
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Header title="Users & Roles" />
      <div className="content-body">
        {loading ? (
          <LoadingSpinner text="Loading users..." />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Status</th>
                  <th>Change Role</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span className="code-badge">USR-{u.id}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge status={u.role} label={u.role} />
                    </td>
                    <td>
                      <span className={`badge ${u.active ? 'badge-success' : 'badge-danger'}`}>
                        {u.active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="HR">HR</option>
                        <option value="EMPLOYEE">EMPLOYEE</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={updatingId === u.id}
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        {u.active ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
