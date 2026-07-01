package com.scb.ratan.flowzero.workflow.entity.dbo;

import com.scb.ratan.flowzero.workflow.common.enums.AttachmentStatus;
import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

/**
 * Represents a file attachment bound to a business instance (e.g. Workflow, Order).
 *
 * <h3>Key design decisions</h3>
 * <ul>
 *   <li>{@code business_id} is the generic identifier linking this attachment to any
 *       business entity. For Workflow usage it equals the process-instance ID.</li>
 *   <li>{@code storage_ref} is a JSONB column whose structure depends on
 *       {@code storage_type}: FileNet stores {@code fileId + docCategory + docType +
 *       docName + leid}; MinIO stores {@code objectKey}; NAS stores {@code filePath}.</li>
 *   <li>{@code fileId} / {@code storage_ref} are NEVER exposed to the front end —
 *       use the VO layer ({@link com.scb.ratan.flowzero.workflow.entity.vo.AttachmentVo})
 *       which intentionally omits these fields.</li>
 *   <li>Uploader identity is tracked via {@code created_by} in {@link AuditMetadata}.</li>
 * </ul>
 *
 * <h3>Status lifecycle</h3>
 * {@code PENDING → ACTIVE → DELETED (soft)}
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "t_attachments", indexes = {
    @Index(name = "idx_att_business_id_status", columnList = "business_id, status"),
    @Index(name = "idx_att_status", columnList = "status")
})
public class WorkflowAttachment extends AuditMetadata {

    // ── Business context ──────────────────────────────────────────────────────

    /**
     * Generic business entity ID (workflow instance ID, order ID, etc.).
     * Corresponds to {@code business_id} column in {@code t_attachments}.
     */
    @Column(name = "business_id", nullable = false, length = 100)
    private String workflowInstanceId;

    // ── File metadata ─────────────────────────────────────────────────────────

    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    // ── Storage (backend-agnostic) ────────────────────────────────────────────

    /**
     * Storage backend type: FILENET / MINIO / NAS.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "storage_type", nullable = false, length = 20)
    private StorageType storageType;

    /**
     * Storage directory path.
     * <ul>
     *   <li>MINIO / NAS: actual directory path (e.g. {@code /attachments/2026/05/})</li>
     *   <li>FILENET: fixed {@code "/"}</li>
     * </ul>
     */
    @Column(name = "bucket", nullable = false, length = 500)
    @Builder.Default
    private String bucket = "/";

    /**
     * Backend-specific JSON reference stored in a {@code jsonb} column.
     *
     * <ul>
     *   <li>FileNet: {@code {"fileId":"FN-UUID","docCategory":"...","docType":"...","docName":"...","leid":"..."}}</li>
     *   <li>MinIO:   {@code {"objectKey":"attachments/2026/05/file.pdf"}}</li>
     *   <li>NAS:     {@code {"filePath":"/data/attachments/2026/05/file.pdf"}}</li>
     * </ul>
     * NULL while {@code status = PENDING} (upload not yet completed).
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "storage_ref", columnDefinition = "jsonb")
    private String storageRef;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private AttachmentStatus status = AttachmentStatus.PENDING;

    @Column(name = "deleted_by", length = 100)
    private String deletedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

}
