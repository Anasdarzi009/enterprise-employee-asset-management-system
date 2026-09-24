package com.enterprise.management.service.impl;

import com.enterprise.management.dto.AssignmentRequestDto;
import com.enterprise.management.dto.AssignmentResponseDto;
import com.enterprise.management.dto.ReturnAssetDto;
import com.enterprise.management.entity.*;
import com.enterprise.management.exception.BadRequestException;
import com.enterprise.management.exception.ResourceNotFoundException;
import com.enterprise.management.repository.AssetAssignmentRepository;
import com.enterprise.management.repository.AssetRepository;
import com.enterprise.management.repository.EmployeeRepository;
import com.enterprise.management.repository.UserRepository;
import com.enterprise.management.security.UserDetailsImpl;
import com.enterprise.management.service.AssignmentService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    private final AssetAssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public AssignmentServiceImpl(AssetAssignmentRepository assignmentRepository,
                                 AssetRepository assetRepository,
                                 EmployeeRepository employeeRepository,
                                 UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.assetRepository = assetRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponseDto> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AssignmentResponseDto assignAsset(AssignmentRequestDto requestDto) {
        Asset asset = assetRepository.findById(requestDto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + requestDto.getAssetId()));

        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new BadRequestException("Asset '" + asset.getName() + "' is not available for assignment. Current status: " + asset.getStatus());
        }

        Employee employee = employeeRepository.findById(requestDto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + requestDto.getEmployeeId()));

        if (employee.getStatus() != EmploymentStatus.ACTIVE) {
            throw new BadRequestException("Cannot assign asset to inactive employee: " + employee.getFirstName() + " " + employee.getLastName());
        }

        User currentUser = getCurrentUser();

        AssetAssignment assignment = new AssetAssignment();
        assignment.setAsset(asset);
        assignment.setEmployee(employee);
        assignment.setAssignedDate(requestDto.getAssignedDate() != null ? requestDto.getAssignedDate() : LocalDate.now());
        assignment.setNotes(requestDto.getNotes());
        assignment.setAssignedBy(currentUser);
        assignment.setStatus(AssignmentStatus.ACTIVE);

        // Update asset state
        asset.setStatus(AssetStatus.ASSIGNED);
        asset.setCurrentEmployee(employee);
        assetRepository.save(asset);

        AssetAssignment saved = assignmentRepository.save(assignment);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public AssignmentResponseDto returnAsset(Long assignmentId, ReturnAssetDto returnDto) {
        AssetAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        if (assignment.getStatus() == AssignmentStatus.RETURNED) {
            throw new BadRequestException("Assignment has already been returned");
        }

        LocalDate returnDate = (returnDto != null && returnDto.getReturnDate() != null)
                ? returnDto.getReturnDate()
                : LocalDate.now();

        assignment.setReturnedDate(returnDate);
        assignment.setStatus(AssignmentStatus.RETURNED);

        if (returnDto != null && returnDto.getReturnNotes() != null && !returnDto.getReturnNotes().trim().isEmpty()) {
            String existingNotes = assignment.getNotes() != null ? assignment.getNotes() : "";
            assignment.setNotes(existingNotes + " [Return notes: " + returnDto.getReturnNotes().trim() + "]");
        }

        // Update asset
        Asset asset = assignment.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);
        asset.setCurrentEmployee(null);
        assetRepository.save(asset);

        AssetAssignment saved = assignmentRepository.save(assignment);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponseDto> getAssignmentsByEmployee(Long employeeId) {
        return assignmentRepository.findByEmployeeIdOrderByAssignedDateDesc(employeeId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponseDto> getAssignmentsByAsset(Long assetId) {
        return assignmentRepository.findByAssetIdOrderByAssignedDateDesc(assetId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl userPrincipal) {
            return userRepository.findByEmail(userPrincipal.getUsername()).orElse(null);
        }
        return null;
    }

    private AssignmentResponseDto mapToDto(AssetAssignment a) {
        AssignmentResponseDto dto = new AssignmentResponseDto();
        dto.setId(a.getId());
        if (a.getAsset() != null) {
            dto.setAssetId(a.getAsset().getId());
            dto.setAssetTag(a.getAsset().getAssetTag());
            dto.setAssetName(a.getAsset().getName());
            dto.setAssetType(a.getAsset().getType());
            dto.setSerialNumber(a.getAsset().getSerialNumber());
        }
        if (a.getEmployee() != null) {
            dto.setEmployeeId(a.getEmployee().getId());
            dto.setEmployeeCode(a.getEmployee().getEmployeeId());
            dto.setEmployeeName(a.getEmployee().getFirstName() + " " + a.getEmployee().getLastName());
            dto.setEmployeeEmail(a.getEmployee().getEmail());
            if (a.getEmployee().getDepartment() != null) {
                dto.setDepartmentName(a.getEmployee().getDepartment().getName());
            }
        }
        dto.setAssignedDate(a.getAssignedDate());
        dto.setReturnedDate(a.getReturnedDate());
        dto.setStatus(a.getStatus());
        dto.setNotes(a.getNotes());
        if (a.getAssignedBy() != null) {
            dto.setAssignedByName(a.getAssignedBy().getFullName());
        }
        return dto;
    }
}
