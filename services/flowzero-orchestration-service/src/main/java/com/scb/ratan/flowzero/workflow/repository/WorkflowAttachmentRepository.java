package com.scb.ratan.flowzero.workflow.repository;

import com.scb.ratan.flowzero.workflow.common.enums.AttachmentStatus;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowAttachment;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowAttachmentRepository extends JpaRepository<WorkflowAttachment, String> {

    List<WorkflowAttachment> findByWorkflowInstanceIdAndStatus(
        String workflowInstanceId, AttachmentStatus status);

    Optional<WorkflowAttachment> findByIdAndStatus(String id, AttachmentStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM WorkflowAttachment a WHERE a.id = :id")
    Optional<WorkflowAttachment> findByIdForUpdate(@Param("id") String id);

    /**
     * Finds PENDING records that are older than {@code cutoff} and have a non-null storage_ref
     * (i.e. the upload started but the ACTIVE update never completed).
     */
    @Query("SELECT a FROM WorkflowAttachment a WHERE a.status = 'PENDING' " +
        "AND a.createdAt < :cutoff AND a.storageRef IS NOT NULL")
    List<WorkflowAttachment> findStalePendingWithStorage(@Param("cutoff") LocalDateTime cutoff);

    /**
     * Finds PENDING records older than {@code cutoff} with no storage reference yet.
     */
    @Query("SELECT a FROM WorkflowAttachment a WHERE a.status = 'PENDING' " +
        "AND a.createdAt < :cutoff AND a.storageRef IS NULL")
    List<WorkflowAttachment> findStalePendingWithoutStorage(@Param("cutoff") LocalDateTime cutoff);

    /**
     * Atomically soft-deletes a record only if it is still ACTIVE.
     * Returns the number of rows updated (1 = success, 0 = already claimed by another thread).
     * Used by perf-test concurrent delete to ensure each record is processed exactly once.
     */
    @Modifying
    @Transactional
    @Query("UPDATE WorkflowAttachment a SET a.status = 'DELETED', a.deletedBy = :deletedBy, " +
        "a.deletedAt = :deletedAt, a.updatedBy = :deletedBy " +
        "WHERE a.id = :id AND a.status = 'ACTIVE'")
    int markDeletedIfActive(@Param("id") String id,
        @Param("deletedBy") String deletedBy,
        @Param("deletedAt") LocalDateTime deletedAt);

}
