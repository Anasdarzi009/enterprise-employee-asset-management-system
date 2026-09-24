package com.enterprise.management.controller;

import com.enterprise.management.dto.ApiResponse;
import com.enterprise.management.dto.AssignmentResponseDto;
import com.enterprise.management.dto.DashboardStatsDto;
import com.enterprise.management.dto.EmployeeDto;
import com.enterprise.management.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        DashboardStatsDto stats = dashboardService.getStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/recent-assignments")
    public ResponseEntity<ApiResponse<List<AssignmentResponseDto>>> getRecentAssignments() {
        List<AssignmentResponseDto> list = dashboardService.getRecentAssignments();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/recent-employees")
    public ResponseEntity<ApiResponse<List<EmployeeDto>>> getRecentEmployees() {
        List<EmployeeDto> list = dashboardService.getRecentEmployees();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
