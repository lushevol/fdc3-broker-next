package com.scb.ratan.flowzero.workflow.common.enums;

/**
 * Error codes for attachment-domain business exceptions.
 *
 * <p>Each code carries the corresponding HTTP status so that
 * {@link com.scb.ratan.flowzero.workflow.common.exception.GlobalExceptionHandler}
 * can map any {@link com.scb.ratan.flowzero.workflow.common.exception.AttachmentException}
 * to the correct HTTP response with a single {@code @ExceptionHandler}.
 *
 * <pre>
 * throw new AttachmentException(AttachmentErrorCode.NOT_FOUND, "Attachment not found: " + id);
 * </pre>
 */
public enum AttachmentErrorCode {

    /** HTTP 400 — file type / required-field / batch-count validation failure. */
    VALIDATION_FAILED(400),

    /** HTTP 403 — the caller has no permission to operate on this attachment. */
    FORBIDDEN(403),

    /** HTTP 404 — attachment does not exist or is not in ACTIVE status. */
    NOT_FOUND(404),

    /** HTTP 409 — attempt to delete an attachment that is already in DELETED status. */
    ALREADY_DELETED(409),

    /** HTTP 413 — uploaded file exceeds the configured size limit. */
    FILE_TOO_LARGE(413);

    private final int httpStatus;

    AttachmentErrorCode(int httpStatus) {
        this.httpStatus = httpStatus;
    }

    /** Returns the HTTP status code associated with this error. */
    public int getHttpStatus() {
        return httpStatus;
    }
}

