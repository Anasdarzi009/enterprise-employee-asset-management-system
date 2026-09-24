import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Employees } from '../pages/Employees';
import { EmployeeDetails } from '../pages/EmployeeDetails';
import { Assets } from '../pages/Assets';
import { Assignments } from '../pages/Assignments';
import { UsersRoles } from '../pages/UsersRoles';
import { Profile } from '../pages/Profile';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Authenticated Workspace */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="assets" element={<Assets />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="profile" element={<Profile />} />

        {/* Admin Protected Routes */}
        <Route
          path="users"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <UsersRoles />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
