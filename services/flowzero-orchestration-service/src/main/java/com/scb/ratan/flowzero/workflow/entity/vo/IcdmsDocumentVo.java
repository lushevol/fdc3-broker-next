package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * View object representing a single document record returned by the iCDMS query API.
 *
 * <p>Fields mirror {@code IcdmsQueryResponse.DocItem}. Only data needed by the
 * front-end is exposed here; internal iCDMS technical identifiers are preserved
 * for traceability.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IcdmsDocumentVo {

    /** Legal Entity ID, e.g. {@code "11000165"}. */
    private String leId;

    /** iCDMS case ID, e.g. {@code "1000158192"}. */
    private String caseId;

    /** Original file name as stored in FileNet. */
    private String attachmentName;

    /** File size in bytes. */
    private Long attachmentSize;

    /** Attachment classification type, e.g. {@code "LEGAL"}. */
    private String attachmentType;

    /** FileNet document GUID, e.g. {@code "{D663D181-D927-4A6A-B55A-276BEF433C7D}"}. */
    private String filenetRefId;

    /** Document category, e.g. {@code "Credit"}. */
    private String docCategory;

    /** Document type, e.g. {@code "Letters - Standalone Consent to Disclosure"}. */
    private String docType;

    /** Human-readable document name. */
    private String docName;

    /** Physical location, e.g. {@code "HONG KONG"}. */
    private String docLocation;

    /** Document lifecycle status, e.g. {@code "Executed"}. */
    private String docStatus;

    /** Completion date in {@code dd-MM-yyyy} format. */
    private String completionDate;

    /** Source system identifier, e.g. {@code "CDMS"}. */
    private String systemId;

    /** Record creation timestamp in {@code yyyy-MM-dd HH:mm:ss} format. */
    private String createDate;

    /** Agreement effective date; may be {@code null}. */
    private String agreementDate;

    /** Agreement expiry date; may be {@code null}. */
    private String agreementExpiryDate;

    /** Creator identifier. */
    private String createdBy;

}
