package com.enterprise.management.repository;

import com.enterprise.management.entity.AssetAssignment;
import com.enterprise.management.entity.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long> {
    List<AssetAssignment> findByEmployeeIdOrderByAssignedDateDesc(Long employeeId);
    List<AssetAssignment> findByAssetIdOrderByAssignedDateDesc(Long assetId);
    List<AssetAssignment> findByStatusOrderByAssignedDateDesc(AssignmentStatus status);
    Optional<AssetAssignment> findByAssetIdAndStatus(Long assetId, AssignmentStatus status);

    @Query("SELECT aa FROM AssetAssignment aa ORDER BY aa.assignedDate DESC, aa.id DESC")
    List<AssetAssignment> findRecentAssignments();
}
