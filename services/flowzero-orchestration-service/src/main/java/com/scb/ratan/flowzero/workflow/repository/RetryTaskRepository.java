package com.scb.ratan.flowzero.workflow.repository;

import com.scb.ratan.flowzero.workflow.common.enums.RetryBizType;
import com.scb.ratan.flowzero.workflow.common.enums.RetryTaskStatus;
import com.scb.ratan.flowzero.workflow.entity.dbo.RetryTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link RetryTask} (table {@code t_retry_task}).
 */
@Repository
public interface RetryTaskRepository extends JpaRepository<RetryTask, String> {

    /**
     * Finds the retry task for a specific business record and business type.
     * Used to check deduplication before creating a new record.
     */
    Optional<RetryTask> findByBizTypeAndBizId(RetryBizType bizType, String bizId);

    /**
     * Finds SUSPENDED records due for retry (no next_retry_at constraint —
     * SUSPENDED tasks are retried as soon as the scheduler runs).
     */
    @Query("SELECT t FROM RetryTask t WHERE t.bizType = :bizType AND t.status = 'SUSPENDED' " +
        "ORDER BY t.updatedAt ASC LIMIT :batchSize")
    List<RetryTask> findSuspendedForRetry(
        @Param("bizType") RetryBizType bizType,
        @Param("batchSize") int batchSize);

    /**
     * Finds FAILED records whose next retry time has arrived and still have retries left.
     */
    @Query("SELECT t FROM RetryTask t WHERE t.bizType = :bizType " +
        "AND t.status = 'FAILED' AND t.retryCount < t.maxRetry " +
        "AND (t.nextRetryAt IS NULL OR t.nextRetryAt <= :now) " +
        "ORDER BY t.nextRetryAt ASC NULLS FIRST LIMIT :batchSize")
    List<RetryTask> findFailedForRetry(
        @Param("bizType") RetryBizType bizType,
        @Param("now") LocalDateTime now,
        @Param("batchSize") int batchSize);

    /**
     * Counts pending/failed/suspended records for monitoring.
     */
    long countByBizTypeAndStatusIn(RetryBizType bizType, List<RetryTaskStatus> statuses);

    /**
     * Resets a SKIPPED/FAILED record for manual admin retry.
     */
    @Modifying
    @Transactional
    @Query("UPDATE RetryTask t SET t.status = 'FAILED', t.retryCount = 0, " +
        "t.nextRetryAt = NULL, t.lastError = NULL " +
        "WHERE t.id = :id AND t.status IN ('FAILED', 'SKIPPED', 'SUSPENDED')")
    int resetForManualRetry(@Param("id") String id);

}
