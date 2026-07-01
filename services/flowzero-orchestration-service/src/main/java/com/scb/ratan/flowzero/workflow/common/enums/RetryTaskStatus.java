package com.scb.ratan.flowzero.workflow.common.enums;

/**
 * Status values for records in {@code t_retry_task}.
 *
 * <p>State machine:
 * <pre>
 *   PENDING --[success]----------> SUCCESS  (terminal)
 *   PENDING --[4xx data error]---> FAILED  --[retry >= max]--> SKIPPED (terminal, alert)
 *                                          --[retry < max]---> schedule retry
 *   PENDING --[5xx/timeout/CB]---> SUSPENDED --[service ok]--> schedule retry (no count++)
 * </pre>
 */
public enum RetryTaskStatus {
    /** Initial state; awaiting first execution. */
    PENDING,
    /** External system accepted the call. Terminal success state. */
    SUCCESS,
    /** External system rejected the data (4xx); retry count incremented. */
    FAILED,
    /** External system is unreachable (5xx/timeout/CB OPEN); retry count NOT incremented. */
    SUSPENDED,
    /** Exceeded max retries; requires manual intervention. Terminal error state. */
    SKIPPED
}
