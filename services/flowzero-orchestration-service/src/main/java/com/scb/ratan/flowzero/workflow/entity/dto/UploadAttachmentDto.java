package com.scb.ratan.flowzero.workflow.entity.dto;

import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * DTO for the file upload endpoint.
 * Fields marked with * are mandatory for FileNet uploads (stored in storage_ref JSONB).
 */
@Data
public class UploadAttachmentDto {

    /** The file to upload. */
    private MultipartFile file;

    /** LEID for iCDMS binding. Required for FileNet. */
    private String leid;

    /** Document Category. Required for FileNet. */
    private String docCategory;

    /** Document Type. Required for FileNet. */
    private String docType;

    /** Document Name. Required for FileNet. */
    private String docName;

    /** Storage backend; defaults to FILENET. */
    private StorageType storageType = StorageType.FILENET;

    /**
     * Storage directory path override (optional).
     * MINIO/NAS: actual path; FILENET: defaults to "/".
     */
    private String bucket;

    // ── FileNet document properties ───────────────────────────────────────────

    /**
     * FileNet document storage location code (optional).
     * Maps to the {@code Location} property in FileNet.
     */
    private String location;

    /**
     * Full name of the legal entity (optional).
     * Maps to the {@code LegalEntityName} property in FileNet.
     */
    private String legalEntityName;

    /**
     * Name of the counterparty organisation (optional).
     * Maps to the {@code CounterpartyName} property in FileNet.
     */
    private String counterpartyName;

}
