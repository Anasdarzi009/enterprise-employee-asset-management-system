package com.enterprise.management.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalEmployees;
    private long activeEmployees;
    private long totalAssets;
    private long availableAssets;
    private long assignedAssets;
    private long maintenanceAssets;
    private long retiredAssets;

    private Map<String, Long> departmentDistribution;
    private Map<String, Long> assetStatusDistribution;
    private Map<String, Long> assetTypeDistribution;

    public DashboardStatsDto() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public long getTotalAssets() { return totalAssets; }
    public void setTotalAssets(long totalAssets) { this.totalAssets = totalAssets; }

    public long getAvailableAssets() { return availableAssets; }
    public void setAvailableAssets(long availableAssets) { this.availableAssets = availableAssets; }

    public long getAssignedAssets() { return assignedAssets; }
    public void setAssignedAssets(long assignedAssets) { this.assignedAssets = assignedAssets; }

    public long getMaintenanceAssets() { return maintenanceAssets; }
    public void setMaintenanceAssets(long maintenanceAssets) { this.maintenanceAssets = maintenanceAssets; }

    public long getRetiredAssets() { return retiredAssets; }
    public void setRetiredAssets(long retiredAssets) { this.retiredAssets = retiredAssets; }

    public Map<String, Long> getDepartmentDistribution() { return departmentDistribution; }
    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) { this.departmentDistribution = departmentDistribution; }

    public Map<String, Long> getAssetStatusDistribution() { return assetStatusDistribution; }
    public void setAssetStatusDistribution(Map<String, Long> assetStatusDistribution) { this.assetStatusDistribution = assetStatusDistribution; }

    public Map<String, Long> getAssetTypeDistribution() { return assetTypeDistribution; }
    public void setAssetTypeDistribution(Map<String, Long> assetTypeDistribution) { this.assetTypeDistribution = assetTypeDistribution; }
}
