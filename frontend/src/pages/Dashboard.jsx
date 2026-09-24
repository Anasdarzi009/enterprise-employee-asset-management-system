import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/dashboard/StatCard';
import { DepartmentDistributionChart } from '../components/dashboard/DepartmentDistributionChart';
import { AssetStatusDistribution } from '../components/dashboard/AssetStatusDistribution';
import { RecentAssignmentsTable } from '../components/dashboard/RecentAssignmentsTable';
import { RecentEmployeesList } from '../components/dashboard/RecentEmployeesList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { dashboardService } from '../services/dashboardService';
import { useToast } from '../context/ToastContext';
import { Users, UserCheck, Cpu, CheckCircle2, Layers, AlertTriangle } from 'lucide-react';

export const Dashboard = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, assignmentsData, employeesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentAssignments(),
        dashboardService.getRecentEmployees(),
      ]);

      setStats(statsData);
      setRecentAssignments(assignmentsData);
      setRecentEmployees(employeesData);
    } catch (err) {
      showToast('Unable to load dashboard metrics: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Enterprise Operations Dashboard" />
      <div className="content-body">
        {loading ? (
          <LoadingSpinner text="Aggregating enterprise telemetry and asset statuses..." />
        ) : (
          <>
            {/* KPI Cards Row */}
            <div className="stats-grid">
              <StatCard
                label="Total Employees"
                value={stats?.totalEmployees}
                icon={Users}
                iconBg="#eff6ff"
                iconColor="#2563eb"
                trend="Total headcount registered"
              />
              <StatCard
                label="Active Employees"
                value={stats?.activeEmployees}
                icon={UserCheck}
                iconBg="#ecfdf5"
                iconColor="#10b981"
                trend="Onboarding & verified"
              />
              <StatCard
                label="Total Assets"
                value={stats?.totalAssets}
                icon={Cpu}
                iconBg="#f5f3ff"
                iconColor="#8b5cf6"
                trend="Hardware & peripherals"
              />
              <StatCard
                label="Available Assets"
                value={stats?.availableAssets}
                icon={CheckCircle2}
                iconBg="#ecfdf5"
                iconColor="#059669"
                trend="Ready for assignment"
              />
              <StatCard
                label="Assigned Assets"
                value={stats?.assignedAssets}
                icon={Layers}
                iconBg="#f0f9ff"
                iconColor="#0284c7"
                trend="Active employee deployments"
              />
              <StatCard
                label="Under Maintenance"
                value={stats?.maintenanceAssets}
                icon={AlertTriangle}
                iconBg="#fffbeb"
                iconColor="#f59e0b"
                trend="Repairs & servicing"
              />
            </div>

            {/* Distribution Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              <DepartmentDistributionChart distribution={stats?.departmentDistribution} />
              <AssetStatusDistribution distribution={stats?.assetStatusDistribution} />
            </div>

            {/* Recent Activity Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <RecentAssignmentsTable assignments={recentAssignments} />
              <RecentEmployeesList employees={recentEmployees} />
            </div>
          </>
        )}
      </div>
    </>
  );
};
