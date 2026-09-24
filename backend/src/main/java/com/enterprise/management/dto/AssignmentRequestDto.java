package com.enterprise.management.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AssignmentRequestDto {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Assignment date is required")
    private LocalDate assignedDate;

    private String notes;

    public AssignmentRequestDto() {}

    public Long getAssetId() { return assetId; }
    public void setAssetId(Long assetId) { this.assetId = assetId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public LocalDate getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDate assignedDate) { this.assignedDate = assignedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
