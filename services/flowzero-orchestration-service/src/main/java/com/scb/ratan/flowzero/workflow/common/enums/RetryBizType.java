package com.scb.ratan.flowzero.workflow.common.enums;

/**
 * Business type discriminator for records in {@code t_retry_task}.
 * Add new values here when integrating additional external systems that require retry.
 */
public enum RetryBizType {
    /** iCDMS document metadata binding triggered on workflow request completion. */
    ICDMS_SYNC,
    /** iCDMS case creation triggered via API — retried on failure. */
    ICDMS_CREATE,
    /** Email notification retry (reserved for future use). */
    EMAIL_NOTIFY,
    /** Webhook callback retry (reserved for future use). */
    WEBHOOK
}
