package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.Data;

import java.util.List;

@Data
public class IcdmsCaseCreateResponse {

    /** HTTP status code echoed in the body, e.g. {@code 201}. */
    private Integer status;

    /** Human-readable result message. */
    private String message;

    /** Created case data. */
    private CaseData data;

    /** Response metadata (timestamp, requestId). */
    private IcdmsMetadata metadata;

    /**
     * Payload of the newly created iCDMS case, nested inside a {@code 201} response.
     */
    @Data
    public static class CaseData {

        /** System-generated case ID, e.g. {@code CASE-2026-00789}. */
        private String caseId;

        /** System-generated case reference UUID. */
        private String caseRefId;

        private String leId;
        private String agreementDate;
        private String scbCountry;
        private String scbEntity;
        private String docLocation;
        private String docCategory;
        private String docType;
        private String docName;
        private String docStatus;
        private String docPriority;
        private Boolean consentToDisclose;

        /** Attachments included in the created case. */
        private List<IcdmsCaseAttachment> attachments;

        private String sourceSystem;

        /** User who created the case. */
        private String createdBy;

        /** ISO-8601 creation timestamp. */
        private String createdDate;

        /** User who last modified the case. */
        private String modifiedBy;

        /** ISO-8601 last-modified timestamp. */
        private String modifiedDate;

    }

}
