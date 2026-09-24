import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Outlet />
      </div>
    </div>
  );
};
