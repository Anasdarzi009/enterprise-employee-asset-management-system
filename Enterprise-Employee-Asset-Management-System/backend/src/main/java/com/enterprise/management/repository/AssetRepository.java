package com.enterprise.management.repository;

import com.enterprise.management.entity.Asset;
import com.enterprise.management.entity.AssetStatus;
import com.enterprise.management.entity.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetTag(String assetTag);
    Optional<Asset> findBySerialNumber(String serialNumber);
    boolean existsByAssetTag(String assetTag);
    boolean existsBySerialNumber(String serialNumber);

    List<Asset> findByStatus(AssetStatus status);
    List<Asset> findByCurrentEmployeeId(Long employeeId);

    @Query("SELECT a FROM Asset a WHERE " +
           "(:query IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.assetTag) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.serialNumber) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:type IS NULL OR a.type = :type) AND " +
           "(:status IS NULL OR a.status = :status) " +
           "ORDER BY a.id DESC")
    List<Asset> searchAssets(@Param("query") String query,
                            @Param("type") AssetType type,
                            @Param("status") AssetStatus status);

    long countByStatus(AssetStatus status);

    @Query("SELECT a.status, COUNT(a) FROM Asset a GROUP BY a.status")
    List<Object[]> countAssetsByStatus();

    @Query("SELECT a.type, COUNT(a) FROM Asset a GROUP BY a.type")
    List<Object[]> countAssetsByType();
}
