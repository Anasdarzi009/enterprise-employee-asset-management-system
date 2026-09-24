import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export const Header = ({ title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>{user?.email}</span>
          <Badge status={user?.role} label={user?.role} />
        </div>
      </div>
    </header>
  );
};
