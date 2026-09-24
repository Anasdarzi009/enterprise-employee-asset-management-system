package com.enterprise.management.service;

import com.enterprise.management.dto.AssignmentRequestDto;
import com.enterprise.management.dto.AssignmentResponseDto;
import com.enterprise.management.dto.ReturnAssetDto;

import java.util.List;

public interface AssignmentService {
    List<AssignmentResponseDto> getAllAssignments();
    AssignmentResponseDto assignAsset(AssignmentRequestDto requestDto);
    AssignmentResponseDto returnAsset(Long assignmentId, ReturnAssetDto returnDto);
    List<AssignmentResponseDto> getAssignmentsByEmployee(Long employeeId);
    List<AssignmentResponseDto> getAssignmentsByAsset(Long assetId);
}
