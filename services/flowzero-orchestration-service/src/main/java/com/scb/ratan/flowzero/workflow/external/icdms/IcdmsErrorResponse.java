package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.Data;

/**
 * Top-level error response returned by iCDMS for 4xx / 5xx status codes.
 *
 * <pre>
 * {
 *   "success": false,
 *   "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] },
 *   "metadata": { "timestamp": "...", "requestId": "..." }
 * }
 * </pre>
 *
 * <p>Reusable across all iCDMS endpoints that follow this error contract.
 */
@Data
public class IcdmsErrorResponse {

    /** Always {@code false} for error responses. */
    private Boolean success;

    /** Error envelope containing code, message, and per-field details. */
    private IcdmsApiError error;

    /** Response metadata (timestamp, requestId). */
    private IcdmsMetadata metadata;

}
