package com.scb.ratan.flowzero.workflow.entity.dbo;

import com.scb.ratan.flowzero.workflow.common.enums.SyncStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Tracks iCDMS synchronisation state for each workflow attachment.
 *
 * <p>Status lifecycle: {@code PENDING → SYNCED | FAILED → SYNCED | SKIPPED (alert)}
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "t_workflow_attachment_icdms_sync")
public class WorkflowAttachmentIcdmsSync extends AuditMetadata {

    @Column(name = "attachment_id", nullable = false, length = 20)
    private String attachmentId;

    @Column(name = "workflow_instance_id", nullable = false, length = 100)
    private String workflowInstanceId;

    @Column(name = "leid", length = 100)
    private String leid;

    // ── Sync state ───────────────────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private SyncStatus status = SyncStatus.PENDING;

    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private int retryCount = 0;

    @Column(name = "max_retry", nullable = false)
    @Builder.Default
    private int maxRetry = 3;

    @Column(name = "last_error", columnDefinition = "text")
    private String lastError;

    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;

    @Column(name = "synced_at")
    private LocalDateTime syncedAt;

}
