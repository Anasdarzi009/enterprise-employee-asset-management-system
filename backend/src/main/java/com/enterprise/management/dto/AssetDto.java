package com.enterprise.management.dto;

import com.enterprise.management.entity.AssetStatus;
import com.enterprise.management.entity.AssetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AssetDto {
    private Long id;

    @NotBlank(message = "Asset tag is required")
    private String assetTag;

    @NotBlank(message = "Asset name is required")
    private String name;

    @NotNull(message = "Asset type is required")
    private AssetType type;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    private AssetStatus status = AssetStatus.AVAILABLE;
    private Long currentEmployeeId;
    private String currentEmployeeName;
    private String currentEmployeeCode;
    private String description;

    public AssetDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAssetTag() { return assetTag; }
    public void setAssetTag(String assetTag) { this.assetTag = assetTag; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public AssetType getType() { return type; }
    public void setType(AssetType type) { this.type = type; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public AssetStatus getStatus() { return status; }
    public void setStatus(AssetStatus status) { this.status = status; }

    public Long getCurrentEmployeeId() { return currentEmployeeId; }
    public void setCurrentEmployeeId(Long currentEmployeeId) { this.currentEmployeeId = currentEmployeeId; }

    public String getCurrentEmployeeName() { return currentEmployeeName; }
    public void setCurrentEmployeeName(String currentEmployeeName) { this.currentEmployeeName = currentEmployeeName; }

    public String getCurrentEmployeeCode() { return currentEmployeeCode; }
    public void setCurrentEmployeeCode(String currentEmployeeCode) { this.currentEmployeeCode = currentEmployeeCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
