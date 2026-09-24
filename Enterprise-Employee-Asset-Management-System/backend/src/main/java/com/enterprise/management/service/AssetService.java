package com.enterprise.management.service;

import com.enterprise.management.dto.AssetDto;
import com.enterprise.management.entity.AssetStatus;
import com.enterprise.management.entity.AssetType;

import java.util.List;

public interface AssetService {
    List<AssetDto> getAllAssets(String query, AssetType type, AssetStatus status);
    AssetDto getAssetById(Long id);
    AssetDto createAsset(AssetDto dto);
    AssetDto updateAsset(Long id, AssetDto dto);
    void deleteAsset(Long id);
    List<AssetDto> getAvailableAssets();
    List<AssetDto> getAssetsByEmployee(Long employeeId);
}
