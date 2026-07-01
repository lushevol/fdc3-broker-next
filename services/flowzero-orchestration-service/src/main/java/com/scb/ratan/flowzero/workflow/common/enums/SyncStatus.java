package com.scb.ratan.flowzero.workflow.common.enums;

/**
 * iCDMS synchronisation status for a workflow attachment.
 */
public enum SyncStatus {
    /** Awaiting first sync attempt. */
    PENDING,
    /** Successfully synced to iCDMS. */
    SYNCED,
    /** Last sync attempt failed; will be retried. */
    FAILED,
    /** Exceeded max retry attempts; requires manual intervention. */
    SKIPPED,
    /** Attachment was deleted before sync completed; no further action needed. */
    CANCELLED
}
