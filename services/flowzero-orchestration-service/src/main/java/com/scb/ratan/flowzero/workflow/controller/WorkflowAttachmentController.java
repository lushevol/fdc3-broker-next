package com.scb.ratan.flowzero.workflow.controller;

import com.scb.ratan.flowzero.workflow.common.enums.AttachmentErrorCode;
import com.scb.ratan.flowzero.workflow.common.enums.AttachmentStatus;
import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import com.scb.ratan.flowzero.workflow.common.exception.AttachmentException;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowAttachment;
import com.scb.ratan.flowzero.workflow.entity.dto.UploadAttachmentDto;
import com.scb.ratan.flowzero.workflow.entity.vo.AttachmentVo;
import com.scb.ratan.flowzero.workflow.repository.WorkflowAttachmentRepository;
import com.scb.ratan.flowzero.workflow.service.IAttachmentService;
import com.scb.ratan.flowzero.workflow.service.impl.AttachmentServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * REST API for workflow file-attachment operations.
 *
 * <h3>Base URL</h3>
 * {@code /api/v1/file-manage/{businessId}}
 *
 * <h3>Security note</h3>
 * {@code fileId} / {@code storageRef} are NEVER included in responses.
 * The front-end uses {@code attachmentId} (numeric) for all operations.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/file-manage")
@RequiredArgsConstructor
public class WorkflowAttachmentController {

    private final IAttachmentService attachmentService;
    private final WorkflowAttachmentRepository attachmentRepository;

    // ── Upload ────────────────────────────────────────────────────────────────

    /**
     * Upload a file for a business instance.
     *
     * <pre>POST /api/v1/file-manage/{businessId}/attachments</pre>
     */
    @PostMapping("/{businessId}/attachments")
    public ResponseEntity<AttachmentVo> upload(
        @PathVariable String businessId,
        @RequestParam("file") MultipartFile file,
        @RequestParam("leid") String leid,
        @RequestParam("docCategory") String docCategory,
        @RequestParam("docType") String docType,
        @RequestParam("docName") String docName,
        @RequestParam(value = "bucket", required = false) String bucket,
        @RequestParam(value = "storageType", defaultValue = "FILENET") String storageType) {

        UploadAttachmentDto dto = new UploadAttachmentDto();
        dto.setFile(file);
        dto.setLeid(leid);
        dto.setDocCategory(docCategory);
        dto.setDocType(docType);
        dto.setDocName(docName);
        dto.setBucket(bucket);
        try {
            dto.setStorageType(StorageType.valueOf(storageType.toUpperCase()));
        } catch (IllegalArgumentException ignored) {
            dto.setStorageType(StorageType.FILENET);
        }

        AttachmentVo result = attachmentService.upload(businessId, dto);
        return ResponseEntity.ok(result);
    }

    /**
     * Soft-delete an attachment.
     *
     * <pre>DELETE /api/v1/file-manage/{businessId}/attachments/{attachmentId}</pre>
     */
    @DeleteMapping("/{businessId}/attachments/{attachmentId}")
    public ResponseEntity<Void> delete(
        @PathVariable String businessId,
        @PathVariable String attachmentId) {

        attachmentService.delete(businessId, attachmentId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Query all ACTIVE attachments for a business instance.
     *
     * <pre>GET /api/v1/file-manage/{businessId}/attachments</pre>
     */
    @GetMapping("/{businessId}/attachments")
    public ResponseEntity<List<AttachmentVo>> listAttachments(
        @PathVariable String businessId) {

        return ResponseEntity.ok(attachmentService.listActive(businessId));
    }

    /**
     * Streams file content. Inline for PDF/images; attachment for other types.
     *
     * <pre>GET /api/v1/file-manage/{businessId}/attachments/{attachmentId}/content</pre>
     */
    @GetMapping("/{businessId}/attachments/{attachmentId}/content")
    public void getContent(
        @PathVariable String businessId,
        @PathVariable String attachmentId,
        HttpServletResponse response) {

        WorkflowAttachment attachment = resolveActiveAttachment(businessId, attachmentId);

        String mimeType = StringUtils.defaultIfBlank(attachment.getMimeType(),
            MediaType.APPLICATION_OCTET_STREAM_VALUE);
        String fileName = StringUtils.defaultIfBlank(attachment.getFileName(), "file");

        boolean previewable = AttachmentServiceImpl.isPreviewable(mimeType);
        ContentDisposition disposition = previewable
            ? ContentDisposition.inline().filename(fileName, StandardCharsets.UTF_8).build()
            : ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build();

        response.setContentType(mimeType);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, disposition.toString());
        if (attachment.getFileSize() != null) {
            response.setContentLengthLong(attachment.getFileSize());
        }

        try (InputStream inputStream = attachmentService.getContent(businessId, attachmentId)) {
            inputStream.transferTo(response.getOutputStream());
            response.flushBuffer();
        } catch (org.apache.catalina.connector.ClientAbortException e) {
            // Client disconnected mid-stream — silent (design spec: do not log error)
            log.debug("[ATTACHMENT] Client aborted stream, attachmentId={}", attachmentId);
        } catch (IOException e) {
            log.warn("[ATTACHMENT] IOException streaming content, attachmentId={}: {}",
                attachmentId, e.getMessage());
        }
    }

    /**
     * Streams file content directly from FileNet by its native document ID,
     * without requiring a {@code WorkflowAttachment} record.
     *
     * <p>Typical caller: iCDMS document viewer that has a raw {@code xFilenetRefid}
     * from the iCDMS metadata API and needs to display the file.
     *
     * <pre>GET /api/v1/file-manage/filenet/retrieve?docId={docId}</pre>
     *
     * @param docId FileNet document ID, e.g. {@code {D663D181-D927-4A6A-B55A-276BEF433C7D}}
     */
    @GetMapping("/filenet/retrieve")
    public void retrieveByDocId(
        @RequestParam String docId,
        HttpServletResponse response) {

        log.info("[ATTACHMENT] retrieveByDocId request docId={}", docId);

        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment().filename("file").build().toString());

        try (InputStream inputStream = attachmentService.retrieveByDocId(docId)) {
            inputStream.transferTo(response.getOutputStream());
            response.flushBuffer();
        } catch (org.apache.catalina.connector.ClientAbortException e) {
            log.debug("[ATTACHMENT] Client aborted stream for retrieveByDocId, docId={}", docId);
        } catch (IOException e) {
            log.warn("[ATTACHMENT] IOException streaming content for retrieveByDocId, docId={}: {}",
                docId, e.getMessage());
        }
    }

    private WorkflowAttachment resolveActiveAttachment(String businessId, String attachmentId) {
        WorkflowAttachment att = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new AttachmentException(
                AttachmentErrorCode.NOT_FOUND, "Attachment not found: " + attachmentId));
        if (!AttachmentStatus.ACTIVE.equals(att.getStatus())) {
            throw new AttachmentException(
                AttachmentErrorCode.NOT_FOUND, "Attachment not found: " + attachmentId);
        }
        return att;
    }

}
