import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  HardDrive,
  ClipboardList,
  ShieldCheck,
  User,
  LogOut,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Building size={18} color="#94a3b8" />
        <span className="brand-title">Enterprise Portal</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Users size={16} />
          <span>Employees</span>
        </NavLink>

        <NavLink
          to="/assets"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <HardDrive size={16} />
          <span>Assets</span>
        </NavLink>

        <NavLink
          to="/assignments"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <ClipboardList size={16} />
          <span>Assignments</span>
        </NavLink>

        {isAdmin && (
          <>
            <div className="nav-section-label">Administration</div>
            <NavLink
              to="/users"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <ShieldCheck size={16} />
              <span>Users & Roles</span>
            </NavLink>
          </>
        )}

        <div className="nav-section-label">My Account</div>
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <User size={16} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-card">
          <div className="user-info">
            <span className="user-name">{user?.fullName || 'User'}</span>
            <span className="user-role-tag">{user?.role || 'Guest'}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
