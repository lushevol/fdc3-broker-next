package com.scb.ratan.flowzero.workflow.service.impl;

import com.scb.ratan.flowzero.workflow.common.enums.AttachmentErrorCode;
import com.scb.ratan.flowzero.workflow.common.enums.AttachmentStatus;
import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import com.scb.ratan.flowzero.workflow.common.exception.AttachmentException;
import com.scb.ratan.flowzero.workflow.common.exception.StorageUnavailableException;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowAttachment;
import com.scb.ratan.flowzero.workflow.entity.dto.UploadAttachmentDto;
import com.scb.ratan.flowzero.workflow.entity.vo.AttachmentVo;
import com.scb.ratan.flowzero.workflow.repository.WorkflowAttachmentRepository;
import com.scb.ratan.flowzero.workflow.service.IAttachmentService;
import com.scb.ratan.flowzero.workflow.storage.StorageClient;
import com.scb.ratan.flowzero.workflow.storage.StorageClientFactory;
import com.scb.ratan.flowzero.workflow.storage.StorageRef;
import com.scb.ratan.flowzero.workflow.utils.UserInfoUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Core implementation of {@link IAttachmentService}.
 *
 * <h3>DB-first upload design</h3>
 * <ol>
 *   <li>INSERT PENDING record (within {@code @Transactional}) — if DB fails, 500, no storage call.</li>
 *   <li>Upload to storage backend (outside any TX — side-effect not rollable) — if fails,
 *       DELETE PENDING record, return 503.</li>
 *   <li>UPDATE status=ACTIVE + storageRef (within {@code @Transactional}) — if fails, PENDING is
 *       retained and cleaned up by the {@code PendingAttachmentCleanupScheduler}.</li>
 * </ol>
 *
 * <h3>FileNet metadata</h3>
 * {@code docCategory}, {@code docType}, {@code docName}, {@code leid} are stored in
 * {@code storage_ref} JSONB column as part of the FileNet reference. They are parsed
 * back from {@code storage_ref} when constructing the VO.
 *
 * <h3>iCDMS sync</h3>
 * iCDMS binding is NOT triggered on upload. It is triggered exclusively when the
 * Workflow Request completes (see {@link com.scb.ratan.flowzero.workflow.listener.GlobalProcessEndListener}).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements IAttachmentService {

    // ── Constants ─────────────────────────────────────────────────────────────

    /** Maximum allowed file size: 10 MB. */
    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024;

    /** Maximum number of files per batch upload. */
    private static final int MAX_BATCH_COUNT = 10;

    /** MIME types that can be displayed inline in the browser. */
    private static final Set<String> PREVIEWABLE_TYPES = Set.of(
        "application/pdf",
        "image/jpeg", "image/jpg", "image/png", "image/tiff",
        "text/plain", "text/html");

    /** Allowed file extensions (lower-case). */
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
        "xls", "xlsx", "pdf", "zip", "ppt", "pptx", "rtf",
        "jpeg", "jpg", "png", "doc", "docx", "msg", "tiff");

    // ── Dependencies ──────────────────────────────────────────────────────────

    private final WorkflowAttachmentRepository attachmentRepository;
    private final StorageClientFactory storageClientFactory;

    // ── Upload ────────────────────────────────────────────────────────────────

    @Override
    public AttachmentVo upload(String workflowInstanceId, UploadAttachmentDto dto) {
        MultipartFile file = dto.getFile();

        // ① Validate ──────────────────────────────────────────────────────────
        validateFile(file);
        StorageType storageType = dto.getStorageType() != null ? dto.getStorageType() : StorageType.FILENET;
        if (StorageType.FILENET.equals(storageType)) {
            validateFileNetRequiredFields(dto);
        }
        validateBatchCount(workflowInstanceId);

        String currentUserId = UserInfoUtils.getUserId();

        // ② Write PENDING record (within @Transactional) ───────────────────────
        WorkflowAttachment attachment = createPendingRecord(
            workflowInstanceId, dto, file, storageType, currentUserId);

        // ③ Upload to storage (outside any TX — side-effect not rollable) ───────
        StorageClient storageClient = storageClientFactory.get(storageType);
        String propertyValues = buildFileNetPropertyValues(file, dto, currentUserId);
        StorageRef storageRef;
        try {
            storageRef = storageClient.upload(file, workflowInstanceId, null, propertyValues);
            // Enrich FileNet StorageRef with document metadata so full info is persisted in
            // storage_ref JSON
            if (StorageType.FILENET.equals(storageType)) {
                storageRef = StorageRef.ofFileNet(
                    storageRef.getFileId(),
                    dto.getDocCategory(),
                    dto.getDocType(),
                    dto.getDocName(),
                    dto.getLeid());
            }
        } catch (StorageUnavailableException e) {
            log.error("[ATTACHMENT] Storage upload failed, cleaning up PENDING record id={}", attachment.getId(), e);
            cleanupPendingRecord(attachment);
            throw e;
        } catch (Exception e) {
            log.error("[ATTACHMENT] Storage upload unexpected error, cleaning up PENDING id={}", attachment.getId(), e);
            cleanupPendingRecord(attachment);
            throw new StorageUnavailableException(
                "Upload failed: " + e.getMessage(), storageType, e);
        }

        // ④ UPDATE status=ACTIVE + storageRef (within @Transactional) ───────────
        activateAttachment(attachment, storageRef, currentUserId);

        log.info("[ATTACHMENT] Upload success id={} businessId={}", attachment.getId(), workflowInstanceId);
        return toVo(attachment, currentUserId);
    }

    @Transactional
    protected WorkflowAttachment createPendingRecord(
        String workflowInstanceId, UploadAttachmentDto dto,
        MultipartFile file, StorageType storageType, String currentUserId) {

        String bucket = StringUtils.defaultIfBlank(dto.getBucket(),
            StorageType.FILENET.equals(storageType) ? "/" : "/attachments");

        WorkflowAttachment attachment = WorkflowAttachment.builder()
            .workflowInstanceId(workflowInstanceId)
            .fileName(file.getOriginalFilename())
            .fileSize(file.getSize())
            .mimeType(file.getContentType())
            .storageType(storageType)
            .bucket(bucket)
            .status(AttachmentStatus.PENDING)
            .build();
        attachment.setCreatedBy(currentUserId);
        attachment.setUpdatedBy(currentUserId);
        return attachmentRepository.save(attachment);
    }

    @Transactional
    protected void activateAttachment(WorkflowAttachment attachment, StorageRef storageRef,
        String currentUserId) {
        attachment.setStatus(AttachmentStatus.ACTIVE);
        attachment.setStorageRef(storageRef.toJson());
        attachment.setUpdatedBy(currentUserId);
        attachmentRepository.save(attachment);
    }

    @Transactional
    protected void cleanupPendingRecord(WorkflowAttachment attachment) {
        try {
            attachmentRepository.deleteById(attachment.getId());
        } catch (Exception ex) {
            log.error("[ATTACHMENT] Failed to clean up PENDING record id={}: {}",
                attachment.getId(), ex.getMessage());
        }
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    /**
     * Soft-deletes an attachment.
     *
     * <h3>Concurrency safety</h3>
     * Uses a pessimistic write lock ({@code SELECT ... FOR UPDATE}) on the initial
     * record read. Concurrent delete requests for the same attachment are serialised
     * at the DB level.
     */
    @Override
    @Transactional
    public void delete(String workflowInstanceId, String attachmentId) {
        // ① Acquire row-level lock — serialises concurrent deletes
        WorkflowAttachment attachment = attachmentRepository.findByIdForUpdate(attachmentId)
            .orElseThrow(() -> new AttachmentException(
                AttachmentErrorCode.NOT_FOUND, "Attachment not found: " + attachmentId));

        if (AttachmentStatus.DELETED.equals(attachment.getStatus())) {
            throw new AttachmentException(
                AttachmentErrorCode.ALREADY_DELETED, "Attachment already deleted: " + attachmentId);
        }
        if (!AttachmentStatus.ACTIVE.equals(attachment.getStatus())) {
            throw new AttachmentException(
                AttachmentErrorCode.NOT_FOUND, "Attachment not found: " + attachmentId);
        }

        // ② Permission check — uploader is tracked via createdBy (AuditMetadata)
        String currentUserId = UserInfoUtils.getUserId();
        if (!canDelete(currentUserId, attachment)) {
            log.warn("[ATTACHMENT] Permission denied: userId={} tried to delete attachmentId={}", currentUserId, attachmentId);
            throw new AttachmentException(AttachmentErrorCode.FORBIDDEN,
                "User " + currentUserId + " has no permission to delete attachment " + attachmentId);
        }

        // ③ Delete from storage backend
        StorageClient storageClient = storageClientFactory.get(attachment.getStorageType());
        StorageRef storageRef = StorageRef.fromJson(attachment.getStorageRef(), attachment.getStorageType());
        storageClient.delete(storageRef); // 404 treated as idempotent in FileNetStorageClient

        // ④ Soft-delete in DB
        attachment.setStatus(AttachmentStatus.DELETED);
        attachment.setDeletedBy(currentUserId);
        attachment.setDeletedAt(LocalDateTime.now());
        attachment.setUpdatedBy(currentUserId);
        attachmentRepository.save(attachment);

        log.info("[ATTACHMENT] Deleted id={} by={}", attachmentId, currentUserId);
    }

    // ── List ──────────────────────────────────────────────────────────────────

    @Override
    public List<AttachmentVo> listActive(String workflowInstanceId) {
        String currentUserId = UserInfoUtils.getUserId();
        return attachmentRepository
            .findByWorkflowInstanceIdAndStatus(workflowInstanceId, AttachmentStatus.ACTIVE)
            .stream()
            .map(a -> toVo(a, currentUserId))
            .collect(Collectors.toList());
    }

    // ── Content ───────────────────────────────────────────────────────────────

    @Override
    public InputStream getContent(String workflowInstanceId, String attachmentId) {
        WorkflowAttachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new AttachmentException(
                AttachmentErrorCode.NOT_FOUND, "Attachment not found: " + attachmentId));

        if (!AttachmentStatus.ACTIVE.equals(attachment.getStatus())) {
            throw new AttachmentException(
                AttachmentErrorCode.NOT_FOUND, "Attachment not found: " + attachmentId);
        }

        StorageClient storageClient = storageClientFactory.get(attachment.getStorageType());
        StorageRef storageRef = StorageRef.fromJson(attachment.getStorageRef(), attachment.getStorageType());
        return storageClient.getContent(storageRef);
    }

    // ── FileNet direct retrieve ───────────────────────────────────────────────

    /**
     * Retrieves file content directly from FileNet by docId without needing a
     * local {@link WorkflowAttachment} record.
     *
     * <p>A {@link StorageRef} is constructed on the fly from the supplied docId and
     * delegated to {@link com.scb.ratan.flowzero.workflow.storage.impl.FileNetStorageClient}.
     * All HTTP-level errors surface as {@link StorageUnavailableException}.
     */
    @Override
    public InputStream retrieveByDocId(String docId) {
        if (StringUtils.isBlank(docId)) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED, "docId must not be blank");
        }
        log.info("[ATTACHMENT] retrieveByDocId docId={}", docId);
        StorageClient storageClient = storageClientFactory.get(StorageType.FILENET);
        return storageClient.getContent(StorageRef.ofFileNet(docId));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED, "File must not be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new AttachmentException(AttachmentErrorCode.FILE_TOO_LARGE,
                "File exceeds the 10 MB size limit.");
        }
        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED, "File name is required");
        }
        int dotIdx = originalName.lastIndexOf('.');
        if (dotIdx < 0) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED,
                "File type not supported. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS));
        }
        String ext = originalName.substring(dotIdx + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED,
                "File type not supported. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS));
        }
    }

    /**
     * Validates FileNet-specific required fields (stored in storage_ref JSONB).
     */
    private void validateFileNetRequiredFields(UploadAttachmentDto dto) {
        if (StringUtils.isBlank(dto.getLeid())) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED, "LEID is required");
        }
        if (StringUtils.isBlank(dto.getDocCategory())) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED, "Document Category is required");
        }
        if (StringUtils.isBlank(dto.getDocType())) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED, "Document Type is required");
        }
        if (StringUtils.isBlank(dto.getDocName())) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED, "Document Name is required");
        }
    }

    private void validateBatchCount(String workflowInstanceId) {
        long activeCount = attachmentRepository
            .findByWorkflowInstanceIdAndStatus(workflowInstanceId, AttachmentStatus.ACTIVE)
            .size();
        if (activeCount >= MAX_BATCH_COUNT) {
            throw new AttachmentException(AttachmentErrorCode.VALIDATION_FAILED,
                "Maximum of " + MAX_BATCH_COUNT + " documents per batch reached.");
        }
    }

    /**
     * Checks whether the current user may delete the given attachment.
     * Allowed if the user is the original uploader ({@code createdBy} in AuditMetadata).
     */
    private boolean canDelete(String userId, WorkflowAttachment attachment) {
        return userId != null && userId.equals(attachment.getCreatedBy());
    }

    /**
     * Determines whether the MIME type should use {@code Content-Disposition: inline}.
     */
    public static boolean isPreviewable(String mimeType) {
        return mimeType != null && PREVIEWABLE_TYPES.contains(mimeType.toLowerCase());
    }

    /**
     * Builds the FileNet {@code propertyValues} JSON for the upload API.
     */
    private String buildFileNetPropertyValues(MultipartFile file, UploadAttachmentDto dto,
        String userId) {
        return String.format(
            "{\"DocTitle\":\"%s\",\"LEID\":\"%s\",\"Location\":\"%s\"," +
                "\"DocCategory\":\"%s\",\"Status\":\"Active\"," +
                "\"LegalEntityName\":\"%s\",\"CounterpartyName\":\"%s\",\"UserID\":\"%s\"}",
            escape(file.getOriginalFilename()),
            escape(dto.getLeid()),
            escape(dto.getLocation()),
            escape(dto.getDocCategory()),
            escape(dto.getLegalEntityName()),
            escape(dto.getCounterpartyName()),
            escape(userId));
    }

    private String escape(String s) {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    /**
     * Converts a {@link WorkflowAttachment} entity to a VO.
     * For FileNet attachments, document metadata (docCategory, docType, docName, leid)
     * is parsed back from the {@code storage_ref} JSONB column.
     * Uploader identity comes from {@code createdBy} / {@code createdAt} (AuditMetadata).
     */
    private AttachmentVo toVo(WorkflowAttachment a, String currentUserId) {
        // Parse FileNet metadata from storage_ref
        StorageRef ref = StorageRef.fromJson(a.getStorageRef(), a.getStorageType());

        return AttachmentVo.builder()
            .id(a.getId())
            .businessId(a.getWorkflowInstanceId())
            .fileName(a.getFileName())
            .fileSize(a.getFileSize())
            .mimeType(a.getMimeType())
            .storageType(a.getStorageType())
            .storageRef(a.getStorageRef()) // @JsonIgnore — not serialised to client
            .docCategory(ref.getDocCategory())
            .docType(ref.getDocType())
            .docName(ref.getDocName())
            .leid(ref.getLeid())
            .uploadedBy(a.getCreatedBy())
            .uploadedAt(a.getCreatedAt())
            .canDelete(canDelete(currentUserId, a))
            .build();
    }

}
