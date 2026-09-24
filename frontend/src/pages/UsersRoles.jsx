import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';

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
      showToast('User active status toggled.', 'success');
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Header title="Users & Role-Based Access Control" />
      <div className="content-body">
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <ShieldCheck size={24} color="#2563eb" />
            <div>
              <h4 style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.95rem' }}>Enterprise RBAC Matrix</h4>
              <p style={{ fontSize: '0.82rem', color: '#1e40af' }}>
                ADMINs hold full system control including deletion; HR holds staff & asset assignment rights; EMPLOYEEs have profile & self-service access.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading system credentials..." />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Corporate Email</th>
                  <th>Current Role</th>
                  <th>Account Status</th>
                  <th>Role Assignment</th>
                  <th style={{ textAlign: 'right' }}>Status Toggle</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span className="code-badge">USR-{u.id}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{u.fullName}</td>
                    <td style={{ color: '#334155' }}>{u.email}</td>
                    <td>
                      <Badge status={u.role} label={u.role} />
                    </td>
                    <td>
                      <span
                        className={`badge ${u.active ? 'badge-success' : 'badge-danger'}`}
                      >
                        <span className="badge-dot" />
                        {u.active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
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
                        variant={u.active ? 'secondary' : 'primary'}
                        size="sm"
                        disabled={updatingId === u.id}
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        {u.active ? 'Deactivate' : 'Activate'}
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
