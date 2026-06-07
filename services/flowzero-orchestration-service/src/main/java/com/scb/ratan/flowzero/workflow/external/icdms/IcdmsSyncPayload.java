package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.Builder;
import lombok.Data;

/**
 * Payload sent to iCDMS when binding a file to a LEID.
 */
@Data
@Builder
public class IcdmsSyncPayload {

    private String attachmentId;
    private String fileId;
    private String leid;
    private String documentCategory;
    private String documentType;
    private String documentName;
    /** Additional metadata (e.g. workflow context). */
    private String metadata;

}
