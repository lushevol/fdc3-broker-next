package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Attachment item shared by both the iCDMS Case Create request and response.
 *
 * <p>Moved here from {@code service.external.icdms} — model objects belong in the
 * {@code entity.icdms} package alongside the other iCDMS API DTOs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IcdmsCaseAttachment {

    /** Unique reference ID for the attachment. */
    private String attachmentRefId;

    /** Type of attachment, e.g. {@code LEGAL/SUPRT}. */
    private String attachmentType;

    /** Original file name, e.g. {@code filename.pdf}. */
    private String attachmentName;

    /** File size (string representation as returned/sent by iCDMS). */
    private String attachmentSize;

}
