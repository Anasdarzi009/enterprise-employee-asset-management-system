package com.enterprise.management.controller;

import com.enterprise.management.dto.ApiResponse;
import com.enterprise.management.dto.AssignmentRequestDto;
import com.enterprise.management.dto.AssignmentResponseDto;
import com.enterprise.management.dto.ReturnAssetDto;
import com.enterprise.management.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentResponseDto>>> getAllAssignments() {
        List<AssignmentResponseDto> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(ApiResponse.ok(assignments));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<AssignmentResponseDto>> assignAsset(@Valid @RequestBody AssignmentRequestDto requestDto) {
        AssignmentResponseDto assignment = assignmentService.assignAsset(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Asset assigned successfully.", assignment));
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<AssignmentResponseDto>> returnAsset(
            @PathVariable Long id,
            @RequestBody(required = false) ReturnAssetDto returnDto) {
        AssignmentResponseDto returned = assignmentService.returnAsset(id, returnDto);
        return ResponseEntity.ok(ApiResponse.ok("Asset returned successfully.", returned));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponseDto>>> getAssignmentsByEmployee(@PathVariable Long employeeId) {
        List<AssignmentResponseDto> assignments = assignmentService.getAssignmentsByEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(assignments));
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponseDto>>> getAssignmentsByAsset(@PathVariable Long assetId) {
        List<AssignmentResponseDto> assignments = assignmentService.getAssignmentsByAsset(assetId);
        return ResponseEntity.ok(ApiResponse.ok(assignments));
    }
}
