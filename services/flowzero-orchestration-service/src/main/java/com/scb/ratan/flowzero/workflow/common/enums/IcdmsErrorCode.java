package com.scb.ratan.flowzero.workflow.common.enums;

/**
 * Error codes for iCDMS integration exceptions.
 *
 * <p>Codes are divided into two groups that directly map to the two concrete exception
 * classes and their Resilience4j roles:
 *
 * <h3>Service-level codes → {@link com.scb.ratan.flowzero.workflow.common.exception.IcdmsSyncException}</h3>
 * These errors indicate a transient infrastructure problem.  The circuit-breaker
 * <em>counts</em> them toward the failure rate and may open.  The retry-task status
 * is set to {@code SUSPENDED}; retry count is <strong>not</strong> incremented.
 *
 * <h3>Client-level codes → {@link com.scb.ratan.flowzero.workflow.common.exception.IcdmsClientException}</h3>
 * These errors indicate a data or authorisation problem on the caller's side.
 * The circuit-breaker <em>ignores</em> them.  The retry-task status is set to
 * {@code FAILED}; retry count <strong>is</strong> incremented.
 */
public enum IcdmsErrorCode {

    // ── Service-level codes (IcdmsSyncException) ─────────────────────────────

    /** HTTP 5xx returned by iCDMS — transient server-side failure. */
    SERVER_ERROR,

    /** Request exceeded the TimeLimiter threshold (default 8 s). */
    TIMEOUT,

    /** Resilience4j circuit-breaker is in OPEN state; call was short-circuited. */
    CIRCUIT_BREAKER_OPEN,

    /** Resilience4j rate-limiter quota exhausted; call was rejected. */
    RATE_LIMIT_EXCEEDED,

    /** Worker thread was interrupted while waiting for the async result. */
    INTERRUPTED,

    /** {@code t_retry_task.payload} JSON could not be deserialized. */
    PAYLOAD_ERROR,

    /** Catch-all for unexpected exceptions not covered by other codes. */
    UNKNOWN,

    // ── Client-level codes (IcdmsClientException) ─────────────────────────────

    /**
     * iCDMS returned HTTP 4xx with error code {@code VALIDATION_ERROR} —
     * the request payload failed server-side validation.
     */
    VALIDATION_FAILED,

    /**
     * iCDMS returned HTTP 4xx with error code {@code INSUFFICIENT_PERMISSIONS} (403) —
     * the caller does not have the required role or entitlement.
     */
    PERMISSION_DENIED,

    /**
     * iCDMS returned HTTP 4xx with error code {@code DUPLICATE_CASE} (409) —
     * a case for this document already exists.
     */
    DUPLICATE_CASE,

    /**
     * iCDMS returned HTTP 4xx with an unrecognised error code —
     * general client-data error.
     */
    CLIENT_ERROR;

    /** Returns {@code true} if this code belongs to the client-level group. */
    public boolean isClientLevel() {
        return this == VALIDATION_FAILED
            || this == PERMISSION_DENIED
            || this == DUPLICATE_CASE
            || this == CLIENT_ERROR;
    }

}
