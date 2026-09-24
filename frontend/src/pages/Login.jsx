import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';
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
      showToast('Welcome back! Signed in successfully.', 'success');
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
        backgroundColor: '#0f172a',
        backgroundImage: 'radial-gradient(at 0% 0%, #1e293b 0, transparent 50%), radial-gradient(at 100% 100%, #1e1b4b 0, transparent 50%)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Brand Banner */}
        <div
          style={{
            padding: '2.25rem 2rem 1.5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)',
              marginBottom: '1rem',
            }}
          >
            <Building2 size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Enterprise Asset Ops
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Enterprise Employee & Asset Management System
          </p>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div
          style={{
            margin: '0 2rem',
            padding: '0.85rem',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            Quick Demo Accounts (1-Click Fill):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@company.com', 'Admin@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={14} color="#2563eb" /> Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('hr@company.com', 'Hr@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
            >
              <Briefcase size={14} color="#f59e0b" /> HR
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('employee@company.com', 'Employee@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
            >
              <UserCheck size={14} color="#10b981" /> Employee
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2.25rem 2rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#991b1b',
                fontSize: '0.82rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Corporate Email</label>
            <div className="search-input-wrapper">
              <Mail className="search-icon" size={16} />
              <input
                type="email"
                className="form-input search-input"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Password</label>
            <div className="search-input-wrapper">
              <Lock className="search-icon" size={16} />
              <input
                type="password"
                className="form-input search-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
          >
            Authenticate & Access <ArrowRight size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};
