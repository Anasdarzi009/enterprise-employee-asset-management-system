import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/dashboard/StatCard';
import { DepartmentDistributionChart } from '../components/dashboard/DepartmentDistributionChart';
import { AssetStatusDistribution } from '../components/dashboard/AssetStatusDistribution';
import { RecentAssignmentsTable } from '../components/dashboard/RecentAssignmentsTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { dashboardService } from '../services/dashboardService';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, assignmentsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentAssignments(),
      ]);

      setStats(statsData);
      setRecentAssignments(assignmentsData);
    } catch (err) {
      showToast('Unable to load dashboard data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Dashboard" />
      <div className="content-body">
        {loading ? (
          <LoadingSpinner text="Loading dashboard data..." />
        ) : (
          <>
            <div>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Overview
              </h2>
              <div className="stats-grid">
                <StatCard label="Total Employees" value={stats?.totalEmployees} />
                <StatCard label="Active Employees" value={stats?.activeEmployees} />
                <StatCard label="Total Assets" value={stats?.totalAssets} />
                <StatCard label="Available Assets" value={stats?.availableAssets} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              <DepartmentDistributionChart distribution={stats?.departmentDistribution} />
              <AssetStatusDistribution distribution={stats?.assetStatusDistribution} />
            </div>

            <RecentAssignmentsTable assignments={recentAssignments} />
          </>
        )}
      </div>
    </>
  );
};
