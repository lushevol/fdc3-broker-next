package com.scb.ratan.flowzero.workflow.common.enums;

/**
 * Lifecycle status of a workflow attachment record.
 */
public enum AttachmentStatus {
    /** FileNet upload in progress; record created before upload. */
    PENDING,
    /** File successfully uploaded; visible to all stakeholders. */
    ACTIVE,
    /** Soft-deleted; retained for audit. */
    DELETED
}
