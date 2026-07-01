package com.scb.ratan.flowzero.workflow.external.icdms;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * Top-level response for the iCDMS document metadata query API.
 *
 * <p>Actual iCDMS response shape:
 * <pre>{@code
 * {
 *   "status":      "success",
 *   "code":        "200",
 *   "totalCount":  "494",
 *   "page":        "1 of 1",
 *   "rowsPerPage": "1000",
 *   "data":        [ { ... } ]
 * }
 * }</pre>
 *
 * <p>All numeric fields ({@code totalCount}, {@code rowsPerPage}) are represented as
 * {@link String} in the iCDMS API contract and must be parsed by the caller.
 * The {@code page} field uses "current of total" format (e.g. {@code "1 of 1"}).
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class IcdmsQueryResponse {

    /** Response outcome: {@code "success"} or {@code "failure"}. */
    private String status;

    /** HTTP status code as a string, e.g. {@code "200"}. */
    private String code;

    /** Total number of matching records as a string, e.g. {@code "494"}. */
    private String totalCount;

    /**
     * Current page in "current of total" format, e.g. {@code "1 of 1"}.
     * The first token before {@code " of "} is the current page number.
     */
    private String page;

    /** Page size as a string, e.g. {@code "1000"}. */
    private String rowsPerPage;

    /** Matching document records; may be {@code null} when no documents are found. */
    private List<DocItem> data;

    /**
     * Returns {@code true} when {@link #status} equals {@code "success"}
     * (case-insensitive).
     */
    public boolean isSuccess() {
        return "success".equalsIgnoreCase(status);
    }

    // ── Inner DTO ─────────────────────────────────────────────────────────────

    /**
     * Single document record in the iCDMS metadata query result.
     *
     * <p>Java field names use idiomatic camelCase; {@link JsonProperty} maps each to
     * the exact JSON key returned by iCDMS (e.g. {@code xAtchmntName}).
     * {@code @JsonIgnoreProperties(ignoreUnknown = true)} tolerates future iCDMS
     * schema additions without breaking deserialization.
     */
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DocItem {

        /** Legal Entity ID, e.g. {@code "11000165"}. */
        private String leId;

        /** iCDMS case ID, e.g. {@code "1000158192"}. */
        private String caseId;

        /** Original file name as stored in FileNet, e.g. {@code "11000165_COMM_SCD_20091016.pdf"}. */
        @JsonProperty("xAtchmntName")
        private String attachmentName;

        /** File size in bytes. */
        @JsonProperty("nAtchmntSize")
        private Long attachmentSize;

        /** Attachment classification type, e.g. {@code "LEGAL"}. */
        @JsonProperty("xAtchmntType")
        private String attachmentType;

        /** FileNet document GUID, e.g. {@code "{D663D181-D927-4A6A-B55A-276BEF433C7D}"}. */
        @JsonProperty("xFilenetRefid")
        private String filenetRefId;

        /** Document category, e.g. {@code "Credit"}. */
        private String docCategory;

        /** Document type, e.g. {@code "Letters - Standalone Consent to Disclosure"}. */
        private String docType;

        /** Human-readable document name, e.g. {@code "Disclosure Consent Letter"}. */
        private String docName;

        /** Physical location the document belongs to, e.g. {@code "HONG KONG"}. */
        private String docLocation;

        /** Document lifecycle status, e.g. {@code "Executed"}. */
        private String docStatus;

        /** Document completion date in {@code dd-MM-yyyy} format, e.g. {@code "07-09-2010"}. */
        private String completionDate;

        /** Source system identifier, e.g. {@code "CDMS"}. */
        @JsonProperty("xSystemId")
        private String systemId;

        /** Record creation timestamp in {@code yyyy-MM-dd HH:mm:ss} format. */
        @JsonProperty("dCreate")
        private String createDate;

        /** Agreement effective date; nullable. */
        @JsonProperty("dAgreementDate")
        private String agreementDate;

        /** Agreement expiry date; nullable. */
        @JsonProperty("dAgreementExpiryDate")
        private String agreementExpiryDate;

        /** Creator identifier (user ID or system account). */
        @JsonProperty("xcreate")
        private String createdBy;

    }

}
