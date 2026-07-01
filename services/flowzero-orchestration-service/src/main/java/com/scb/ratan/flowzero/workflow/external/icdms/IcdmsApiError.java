package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.Data;

import java.util.List;

@Data
public class IcdmsApiError {

    /**
     * Machine-readable error code.
     * Known values: {@code VALIDATION_ERROR}, {@code DUPLICATE_CASE},
     * {@code INSUFFICIENT_PERMISSIONS}, {@code INTERNAL_ERROR}.
     */
    private String code;

    /** Human-readable error summary. */
    private String message;

    /** Per-field validation details; may be empty for non-validation errors. */
    private List<Detail> details;

    /**
     * Single field-level validation failure detail.
     */
    @Data
    public static class Detail {

        /** The field that failed validation. */
        private String field;

        /** Reason for the failure, e.g. {@code Field is required}. */
        private String issue;

        /**
         * The value that was submitted; may be {@code null}, {@link String}, or
         * {@link Boolean}.
         */
        private Object value;

    }

}
