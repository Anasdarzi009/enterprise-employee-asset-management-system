import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Cpu,
  Layers,
  ShieldCheck,
  UserCircle,
  LogOut,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Assets', path: '/assets', icon: Cpu },
    { name: 'Assignments', path: '/assignments', icon: Layers },
    { name: 'My Profile', path: '/profile', icon: UserCircle },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Users & Roles', path: '/users', icon: ShieldCheck });
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Building2 size={20} />
        </div>
        <div className="brand-title">Enterprise Ops</div>
        <span className="brand-badge">PRO</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-card">
          <div className="user-avatar">{getInitials(user?.fullName)}</div>
          <div className="user-info">
            <span className="user-name">{user?.fullName || 'User'}</span>
            <span className="user-role-tag">{user?.role || 'Guest'}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
