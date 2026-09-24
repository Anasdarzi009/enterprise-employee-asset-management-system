package com.enterprise.management.controller;

import com.enterprise.management.dto.ApiResponse;
import com.enterprise.management.dto.AssetDto;
import com.enterprise.management.entity.AssetStatus;
import com.enterprise.management.entity.AssetType;
import com.enterprise.management.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetDto>>> getAllAssets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AssetType type,
            @RequestParam(required = false) AssetStatus status) {
        List<AssetDto> assets = assetService.getAllAssets(search, type, status);
        return ResponseEntity.ok(ApiResponse.ok(assets));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<AssetDto>>> getAvailableAssets() {
        List<AssetDto> assets = assetService.getAvailableAssets();
        return ResponseEntity.ok(ApiResponse.ok(assets));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<AssetDto>>> getAssetsByEmployee(@PathVariable Long employeeId) {
        List<AssetDto> assets = assetService.getAssetsByEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(assets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetDto>> getAssetById(@PathVariable Long id) {
        AssetDto asset = assetService.getAssetById(id);
        return ResponseEntity.ok(ApiResponse.ok(asset));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<AssetDto>> createAsset(@Valid @RequestBody AssetDto dto) {
        AssetDto created = assetService.createAsset(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Asset created successfully.", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<AssetDto>> updateAsset(
            @PathVariable Long id,
            @Valid @RequestBody AssetDto dto) {
        AssetDto updated = assetService.updateAsset(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Asset updated successfully.", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(ApiResponse.ok("Asset deleted successfully.", null));
    }
}
