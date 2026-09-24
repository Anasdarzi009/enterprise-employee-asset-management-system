import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Building2, Bell } from 'lucide-react';

export const Header = ({ title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge status={user?.role} label={user?.role} />
          <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
            {user?.email}
          </div>
        </div>
      </div>
    </header>
  );
};
