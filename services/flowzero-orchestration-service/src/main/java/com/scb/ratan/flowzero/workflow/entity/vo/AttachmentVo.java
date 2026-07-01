package com.scb.ratan.flowzero.workflow.entity.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * View object returned to the front end for attachment queries.
 *
 * <h3>Security rule</h3>
 * {@code storageRef} (i.e. {@code fileId}) is annotated with
 * {@link JsonIgnore} and MUST NEVER be serialised in HTTP responses.
 * Front-end interactions use {@code id} (Snowflake ID) only.
 *
 * <h3>FileNet metadata</h3>
 * {@code docCategory}, {@code docType}, {@code docName}, {@code leid} are
 * parsed from {@code storage_ref} JSON for FileNet attachments.
 *
 * <p>API spec reference: {@code GET /api/v1/file-manage/{businessId}/attachments}
 */
@Data
@Builder
public class AttachmentVo {

    /** Attachment unique ID (Snowflake). Used by front-end for all operations. */
    private String id;

    /** Business instance ID (e.g. Workflow process-instance ID). */
    private String businessId;

    // ── File info ─────────────────────────────────────────────────────────────

    private String fileName;
    private Long fileSize;
    private String mimeType;

    // ── Document classification (populated from storage_ref for FileNet) ──────

    private String docCategory;
    private String docType;
    private String docName;
    private String leid;

    // ── Uploader info (from AuditMetadata.createdBy / createdAt) ─────────────

    private String uploadedBy;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'", timezone = "UTC")
    private LocalDateTime uploadedAt;

    // ── Permission flag (computed per-request, never persisted) ───────────────

    /**
     * Whether the currently logged-in user may delete this attachment.
     * True if the user is the original uploader (createdBy).
     */
    private boolean canDelete;

    // ── Internal fields (never serialised to the front end) ───────────────────

    /** Storage backend type. Internal use only. */
    @JsonIgnore
    private StorageType storageType;

    /**
     * Backend-specific storage reference JSON.
     * Contains {@code fileId} for FileNet.
     * MUST NOT be included in API responses.
     */
//    @JsonIgnore
    private String storageRef;

}
