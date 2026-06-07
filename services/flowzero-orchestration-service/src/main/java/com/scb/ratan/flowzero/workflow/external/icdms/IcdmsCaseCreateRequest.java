package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request body for iCDMS Case Create API (POST /cases).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IcdmsCaseCreateRequest {

    /** Legal Entity ID. Required. */
    private String leId;

    /** Agreement date in {@code YYYY-MM-DD} format. Required. */
    private String agreementDate;

    /** SCB country code, e.g. {@code US}. */
    private String scbCountry;

    /** SCB entity name, e.g. {@code SCB North America}. */
    private String scbEntity;

    /** Physical document location, e.g. {@code New York Office}. */
    private String docLocation;

    /** Document category, e.g. {@code Client Onboarding}. */
    private String docCategory;

    /** Document type, e.g. {@code Loan Agreement}. */
    private String docType;

    /** Document name. */
    private String docName;

    /** Document status, e.g. {@code Executed}. */
    private String docStatus;

    /** Document priority. Allowed values: {@code Low, Medium, High, Critical}. */
    private String docPriority;

    /** Whether the document may be disclosed. */
    private Boolean consentToDisclose;

    /** Attachment list. */
    private List<IcdmsCaseAttachment> attachments;

    /** Caller-assigned idempotency key for this request. */
    private String requestId;

    /** Originating system identifier, e.g. {@code e-Ops}. */
    private String sourceSystem;

}
