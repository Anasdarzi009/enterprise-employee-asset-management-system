package com.enterprise.management.service.impl;

import com.enterprise.management.dto.AssetDto;
import com.enterprise.management.entity.Asset;
import com.enterprise.management.entity.AssetStatus;
import com.enterprise.management.entity.AssetType;
import com.enterprise.management.exception.BadRequestException;
import com.enterprise.management.exception.ResourceNotFoundException;
import com.enterprise.management.repository.AssetRepository;
import com.enterprise.management.repository.EmployeeRepository;
import com.enterprise.management.service.AssetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;

    public AssetServiceImpl(AssetRepository assetRepository, EmployeeRepository employeeRepository) {
        this.assetRepository = assetRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetDto> getAllAssets(String query, AssetType type, AssetStatus status) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        List<Asset> assets = assetRepository.searchAssets(cleanQuery, type, status);
        return assets.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssetDto getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        return mapToDto(asset);
    }

    @Override
    @Transactional
    public AssetDto createAsset(AssetDto dto) {
        if (assetRepository.existsByAssetTag(dto.getAssetTag())) {
            throw new BadRequestException("Asset tag '" + dto.getAssetTag() + "' already exists");
        }
        if (assetRepository.existsBySerialNumber(dto.getSerialNumber())) {
            throw new BadRequestException("Serial number '" + dto.getSerialNumber() + "' already exists");
        }

        Asset asset = new Asset();
        asset.setAssetTag(dto.getAssetTag().toUpperCase().trim());
        asset.setName(dto.getName().trim());
        asset.setType(dto.getType());
        asset.setSerialNumber(dto.getSerialNumber().trim());
        asset.setPurchaseDate(dto.getPurchaseDate());
        asset.setStatus(dto.getStatus() != null ? dto.getStatus() : AssetStatus.AVAILABLE);
        asset.setDescription(dto.getDescription());

        Asset saved = assetRepository.save(asset);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public AssetDto updateAsset(Long id, AssetDto dto) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        if (!asset.getAssetTag().equalsIgnoreCase(dto.getAssetTag()) &&
                assetRepository.existsByAssetTag(dto.getAssetTag())) {
            throw new BadRequestException("Asset tag '" + dto.getAssetTag() + "' already exists");
        }

        if (!asset.getSerialNumber().equalsIgnoreCase(dto.getSerialNumber()) &&
                assetRepository.existsBySerialNumber(dto.getSerialNumber())) {
            throw new BadRequestException("Serial number '" + dto.getSerialNumber() + "' already exists");
        }

        asset.setAssetTag(dto.getAssetTag().toUpperCase().trim());
        asset.setName(dto.getName().trim());
        asset.setType(dto.getType());
        asset.setSerialNumber(dto.getSerialNumber().trim());
        asset.setPurchaseDate(dto.getPurchaseDate());
        if (dto.getStatus() != null) {
            asset.setStatus(dto.getStatus());
        }
        asset.setDescription(dto.getDescription());

        Asset updated = assetRepository.save(asset);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        if (asset.getStatus() == AssetStatus.ASSIGNED) {
            throw new BadRequestException("Cannot delete asset that is currently ASSIGNED. Return asset first.");
        }

        assetRepository.delete(asset);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetDto> getAvailableAssets() {
        return assetRepository.findByStatus(AssetStatus.AVAILABLE)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetDto> getAssetsByEmployee(Long employeeId) {
        return assetRepository.findByCurrentEmployeeId(employeeId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private AssetDto mapToDto(Asset a) {
        AssetDto dto = new AssetDto();
        dto.setId(a.getId());
        dto.setAssetTag(a.getAssetTag());
        dto.setName(a.getName());
        dto.setType(a.getType());
        dto.setSerialNumber(a.getSerialNumber());
        dto.setPurchaseDate(a.getPurchaseDate());
        dto.setStatus(a.getStatus());
        dto.setDescription(a.getDescription());
        if (a.getCurrentEmployee() != null) {
            dto.setCurrentEmployeeId(a.getCurrentEmployee().getId());
            dto.setCurrentEmployeeName(a.getCurrentEmployee().getFirstName() + " " + a.getCurrentEmployee().getLastName());
            dto.setCurrentEmployeeCode(a.getCurrentEmployee().getEmployeeId());
        }
        return dto;
    }
}
