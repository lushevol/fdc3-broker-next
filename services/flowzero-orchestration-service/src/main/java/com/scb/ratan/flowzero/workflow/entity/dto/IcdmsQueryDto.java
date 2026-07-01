package com.scb.ratan.flowzero.workflow.entity.dto;

import lombok.Data;

import java.util.List;

/**
 * Front-end request DTO for querying iCDMS document file metadata.
 *
 * <p>All fields are optional; omitted fields are treated as "no filter"
 * by the underlying iCDMS API.
 */
@Data
public class IcdmsQueryDto {

    /** Legal Entity ID to filter by, e.g. {@code SCB-SG-001}. */
    private String leId;

    /** Document status filter, e.g. {@code Executed}. */
    private String docStatus;

    /**
     * One or more category / type pairs used to narrow the result set.
     * Corresponds to the {@code docClassification} field in the iCDMS request.
     */
    private List<DocClassificationDto> docClassifications;

    /**
     * 1-based page number. Defaults to {@code 1} when omitted.
     */
    private Integer page;

    /**
     * Number of items returned per page. Defaults to {@code 20} when omitted.
     */
    private Integer size;

    /**
     * Document category / type filter pair.
     */
    @Data
    public static class DocClassificationDto {

        /** Document category, e.g. {@code Client Onboarding}. */
        private String docCategory;

        /** Document type, e.g. {@code Loan Agreement}. */
        private String docType;

    }

}
