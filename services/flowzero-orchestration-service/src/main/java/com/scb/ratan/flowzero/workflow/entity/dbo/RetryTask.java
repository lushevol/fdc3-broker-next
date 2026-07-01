package com.scb.ratan.flowzero.workflow.entity.dbo;

import com.scb.ratan.flowzero.workflow.common.enums.RetryBizType;
import com.scb.ratan.flowzero.workflow.common.enums.RetryTaskStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

/**
 * Universal third-party retry task record.
 *
 * <p>This table is NOT bound to any specific business. Every scenario that needs to
 * call an external system with automatic retry on failure (iCDMS sync, email notify,
 * Webhook callback, etc.) stores its retry state here, distinguished by {@code biz_type}.
 *
 * <h3>iCDMS_SYNC payload structure example</h3>
 * <pre>
 * {
 *   "attachmentId": "att-uuid-001",
 *   "fileId":       "FN-UUID-abc123",
 *   "leid":         "LE-00123",
 *   "documentCategory": "Contract",
 *   "documentType":     "Signed Contract",
 *   "documentName":     "contract.pdf",
 *   "businessId":       "wf-instance-xyz"
 * }
 * </pre>
 *
 * <h3>On-boarding a new business</h3>
 * Two steps only: (1) write a {@code RetryTask} record with the correct
 * {@code biz_type} + {@code payload} when the call fails;
 * (2) the scheduler picks it up automatically — no extra code needed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "t_retry_task", indexes = {
    @Index(name = "idx_rt_biz_type_status_next", columnList = "biz_type, status, next_retry_at"),
    @Index(name = "idx_rt_biz_id", columnList = "biz_id"),
    @Index(name = "idx_rt_status", columnList = "status")
})
public class RetryTask extends AuditMetadata {

    // ── Business discriminator ─────────────────────────────────────────────────
    /**
     * Business type label; distinguishes different retry scenarios.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "biz_type", nullable = false, length = 50)
    private RetryBizType bizType;
    /**
     * Business record ID referenced by this retry task.
     * For ICDMS_SYNC this equals {@code t_attachments.id}.
     */
    @Column(name = "biz_id", nullable = false, length = 100)
    private String bizId;
    // ── Payload ────────────────────────────────────────────────────────────────
    /**
     * Complete parameters required to perform the external call (JSON).
     * Written at record creation time; used as-is on retry.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", columnDefinition = "jsonb")
    private String payload;
    // ── Retry state ────────────────────────────────────────────────────────────
    /**
     * Current task status.
     *
     * <ul>
     *   <li>PENDING   — not yet attempted</li>
     *   <li>SUCCESS   — external system accepted the call (terminal)</li>
     *   <li>FAILED    — external system rejected the data (4xx); count++</li>
     *   <li>SUSPENDED — external system unreachable (5xx/timeout/CB); count unchanged</li>
     *   <li>SKIPPED   — exceeded max retries; alert required (terminal)</li>
     * </ul>
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private RetryTaskStatus status = RetryTaskStatus.PENDING;
    /**
     * Number of times the call has been attempted due to DATA errors (4xx only).
     * Service errors (5xx/timeout) do NOT increment this counter.
     * First write with FAILED status starts at 1 (the initial failed attempt).
     */
    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private int retryCount = 0;
    /**
     * Maximum number of data-error retries before transitioning to SKIPPED.
     * Default: 3 (matching the design doc).
     */
    @Column(name = "max_retry", nullable = false)
    @Builder.Default
    private int maxRetry = 3;
    /** Human-readable description of the last failure cause (truncated at 2 KB). */
    @Column(name = "last_error", length = 2000)
    private String lastError;
    /**
     * Earliest time at which the scheduler may attempt the next retry.
     * Computed with exponential backoff + Equal Jitter by the service layer.
     * NULL means "retry immediately".
     */
    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;
    /**
     * Timestamp at which the task transitioned to SUCCESS. NULL until then.
     */
    @Column(name = "synced_at")
    private LocalDateTime syncedAt;

}
