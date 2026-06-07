package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.Data;

/**
 * Pagination descriptor shared by iCDMS query request and response.
 */
@Data
public class IcdmsPagination {

    /** 1-based page number. */
    private Integer page;

    /** Number of items per page. */
    private Integer size;

    /** Total number of matching records. */
    private Long total;

    /** Total number of pages. */
    private Integer totalPages;

}
