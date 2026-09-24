import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login({ email, password });
      showToast('Login successful.', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      showToast(err.message || 'Invalid credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.75rem 1.75rem 1rem 1.75rem', borderBottom: '1px solid #f3f4f6' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
            Enterprise Portal
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Employee & Asset Management System
          </p>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div style={{ padding: '0.85rem 1.75rem', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Demo Accounts:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@company.com', 'Admin@123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('hr@company.com', 'Hr@123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              HR
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('employee@company.com', 'Employee@123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              Employee
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem' }}>
          {error && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                color: '#991b1b',
                fontSize: '0.8rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
