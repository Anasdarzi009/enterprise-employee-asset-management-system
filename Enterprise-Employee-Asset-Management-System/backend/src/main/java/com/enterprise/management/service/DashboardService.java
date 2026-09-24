package com.enterprise.management.service;

import com.enterprise.management.dto.AssignmentResponseDto;
import com.enterprise.management.dto.DashboardStatsDto;
import com.enterprise.management.dto.EmployeeDto;

import java.util.List;

public interface DashboardService {
    DashboardStatsDto getStats();
    List<AssignmentResponseDto> getRecentAssignments();
    List<EmployeeDto> getRecentEmployees();
}
