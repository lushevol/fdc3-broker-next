package com.scb.ratan.flowzero.workflow.repository;

import com.scb.ratan.flowzero.workflow.common.enums.SyncStatus;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowAttachmentIcdmsSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowAttachmentIcdmsSyncRepository
    extends JpaRepository<WorkflowAttachmentIcdmsSync, String> {

    /**
     * Finds the sync record for a given attachment (one-to-one relationship).
     */
    Optional<WorkflowAttachmentIcdmsSync> findByAttachmentId(String attachmentId);

    List<WorkflowAttachmentIcdmsSync> findByWorkflowInstanceIdAndStatus(
        String workflowInstanceId, SyncStatus status);

    /**
     * Finds records that are due for retry:
     * status=FAILED, retryCount < maxRetry, nextRetryAt <= now.
     */
    @Query("SELECT s FROM WorkflowAttachmentIcdmsSync s " +
        "WHERE s.status = 'FAILED' AND s.retryCount < s.maxRetry " +
        "AND (s.nextRetryAt IS NULL OR s.nextRetryAt <= :now) " +
        "ORDER BY s.nextRetryAt ASC NULLS FIRST " +
        "LIMIT :batchSize")
    List<WorkflowAttachmentIcdmsSync> findRetryableRecords(
        @Param("now") LocalDateTime now,
        @Param("batchSize") int batchSize);

    /**
     * Finds PENDING records for the given workflow to trigger initial sync.
     */
    List<WorkflowAttachmentIcdmsSync> findByWorkflowInstanceIdAndStatusIn(
        String workflowInstanceId, List<SyncStatus> statuses);

    /**
     * Resets FAILED/SKIPPED records for manual retry via Admin API.
     */
    @Modifying
    @Transactional
    @Query("UPDATE WorkflowAttachmentIcdmsSync s SET s.status = 'FAILED', " +
        "s.retryCount = 0, s.nextRetryAt = :nextRetryAt, s.lastError = NULL " +
        "WHERE s.workflowInstanceId = :workflowInstanceId " +
        "AND s.status IN ('FAILED', 'SKIPPED')")
    int resetForManualRetry(
        @Param("workflowInstanceId") String workflowInstanceId,
        @Param("nextRetryAt") LocalDateTime nextRetryAt);

}
