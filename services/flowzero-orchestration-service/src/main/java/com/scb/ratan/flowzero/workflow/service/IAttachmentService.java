package com.scb.ratan.flowzero.workflow.service;

import com.scb.ratan.flowzero.workflow.entity.dto.UploadAttachmentDto;
import com.scb.ratan.flowzero.workflow.entity.vo.AttachmentVo;

import java.io.InputStream;
import java.util.List;

/**
 * Service interface for workflow file attachment operations.
 */
public interface IAttachmentService {

    /**
     * Validates and uploads a single file for the given workflow instance.
     *
     * @return attachment view object (never null)
     */
    AttachmentVo upload(String workflowInstanceId, UploadAttachmentDto dto);

    /**
     * Soft-deletes an attachment.
     * Checks that the current user is the uploader or a member of the owner group.
     */
    void delete(String workflowInstanceId, String attachmentId);

    /**
     * Returns all ACTIVE attachments for a workflow instance,
     * with the {@code canDelete} flag set per the current user.
     */
    List<AttachmentVo> listActive(String workflowInstanceId);

    /**
     * Streams the raw file content for an attachment.
     *
     * @return file content stream (caller must close)
     */
    InputStream getContent(String workflowInstanceId, String attachmentId);

    /**
     * Retrieves file content directly from FileNet by its native document ID,
     * bypassing the attachment business layer.
     *
     * <p>Use this method when the caller holds a raw FileNet {@code docId}
     * (e.g. obtained from iCDMS metadata) and does not have a corresponding
     * {@code WorkflowAttachment} record.
     *
     * @param docId FileNet document ID, e.g. {@code {D663D181-D927-4A6A-B55A-276BEF433C7D}};
     *              must not be blank
     * @return file content stream (caller must close)
     * @throws com.scb.ratan.flowzero.workflow.common.exception.StorageUnavailableException
     *         if FileNet is unreachable or returns a non-2xx status
     */
    InputStream retrieveByDocId(String docId);

}
