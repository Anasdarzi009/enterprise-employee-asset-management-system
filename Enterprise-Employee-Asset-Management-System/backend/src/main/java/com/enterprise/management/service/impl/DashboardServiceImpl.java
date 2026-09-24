package com.enterprise.management.service.impl;

import com.enterprise.management.dto.AssignmentResponseDto;
import com.enterprise.management.dto.DashboardStatsDto;
import com.enterprise.management.dto.EmployeeDto;
import com.enterprise.management.entity.AssetStatus;
import com.enterprise.management.entity.AssetType;
import com.enterprise.management.entity.EmploymentStatus;
import com.enterprise.management.repository.AssetAssignmentRepository;
import com.enterprise.management.repository.AssetRepository;
import com.enterprise.management.repository.EmployeeRepository;
import com.enterprise.management.service.AssignmentService;
import com.enterprise.management.service.DashboardService;
import com.enterprise.management.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final AssetRepository assetRepository;
    private final AssetAssignmentRepository assignmentRepository;
    private final AssignmentService assignmentService;
    private final EmployeeService employeeService;

    public DashboardServiceImpl(EmployeeRepository employeeRepository,
                                AssetRepository assetRepository,
                                AssetAssignmentRepository assignmentRepository,
                                AssignmentService assignmentService,
                                EmployeeService employeeService) {
        this.employeeRepository = employeeRepository;
        this.assetRepository = assetRepository;
        this.assignmentRepository = assignmentRepository;
        this.assignmentService = assignmentService;
        this.employeeService = employeeService;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalEmployees(employeeRepository.count());
        stats.setActiveEmployees(employeeRepository.countByStatus(EmploymentStatus.ACTIVE));

        stats.setTotalAssets(assetRepository.count());
        stats.setAvailableAssets(assetRepository.countByStatus(AssetStatus.AVAILABLE));
        stats.setAssignedAssets(assetRepository.countByStatus(AssetStatus.ASSIGNED));
        stats.setMaintenanceAssets(assetRepository.countByStatus(AssetStatus.MAINTENANCE));
        stats.setRetiredAssets(assetRepository.countByStatus(AssetStatus.RETIRED));

        // Department distribution
        Map<String, Long> deptMap = new HashMap<>();
        List<Object[]> deptResults = employeeRepository.countEmployeesByDepartment();
        for (Object[] row : deptResults) {
            deptMap.put((String) row[0], ((Number) row[1]).longValue());
        }
        stats.setDepartmentDistribution(deptMap);

        // Asset status distribution
        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> statusResults = assetRepository.countAssetsByStatus();
        for (Object[] row : statusResults) {
            statusMap.put(row[0].toString(), ((Number) row[1]).longValue());
        }
        stats.setAssetStatusDistribution(statusMap);

        // Asset type distribution
        Map<String, Long> typeMap = new HashMap<>();
        List<Object[]> typeResults = assetRepository.countAssetsByType();
        for (Object[] row : typeResults) {
            typeMap.put(row[0].toString(), ((Number) row[1]).longValue());
        }
        stats.setAssetTypeDistribution(typeMap);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponseDto> getRecentAssignments() {
        return assignmentRepository.findRecentAssignments().stream()
                .limit(5)
                .map(a -> {
                    AssignmentResponseDto dto = new AssignmentResponseDto();
                    dto.setId(a.getId());
                    if (a.getAsset() != null) {
                        dto.setAssetId(a.getAsset().getId());
                        dto.setAssetTag(a.getAsset().getAssetTag());
                        dto.setAssetName(a.getAsset().getName());
                        dto.setAssetType(a.getAsset().getType());
                    }
                    if (a.getEmployee() != null) {
                        dto.setEmployeeId(a.getEmployee().getId());
                        dto.setEmployeeCode(a.getEmployee().getEmployeeId());
                        dto.setEmployeeName(a.getEmployee().getFirstName() + " " + a.getEmployee().getLastName());
                        if (a.getEmployee().getDepartment() != null) {
                            dto.setDepartmentName(a.getEmployee().getDepartment().getName());
                        }
                    }
                    dto.setAssignedDate(a.getAssignedDate());
                    dto.setReturnedDate(a.getReturnedDate());
                    dto.setStatus(a.getStatus());
                    dto.setNotes(a.getNotes());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDto> getRecentEmployees() {
        return employeeService.getAllEmployees(null, null, null).stream()
                .limit(5)
                .collect(Collectors.toList());
    }
}
