package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request body for the iCDMS document metadata query API (POST /documents/query).
 *
 * <p>The optional {@link DocClassification} list allows filtering by one or more
 * category/type combinations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IcdmsQueryRequest {

    /** Pagination parameters. Defaults to page 1, size 20 when omitted. */
    private IcdmsPagination pagination;

    /** Document classification filter; {@code null} means no filter. */
    private List<DocClassification> docClassification;

    /** Legal Entity ID filter. */
    private String leId;

    /** Document status filter, e.g. {@code Executed}. */
    private String docStatus;

    /**
     * Document category/type filter pair used in the {@code docClassification} list.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocClassification {

        /** Document category, e.g. {@code Client Onboarding}. */
        private String docCategory;

        /** Document type, e.g. {@code Loan Agreement}. */
        private String docType;

    }

}
