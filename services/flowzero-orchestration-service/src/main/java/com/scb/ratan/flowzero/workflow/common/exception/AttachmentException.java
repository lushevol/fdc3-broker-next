package com.scb.ratan.flowzero.workflow.common.exception;

import com.scb.ratan.flowzero.workflow.common.enums.AttachmentErrorCode;

public class AttachmentException extends RuntimeException {

    private static final long serialVersionUID = 3714920583620194871L;

    private final AttachmentErrorCode errorCode;

    public AttachmentException(AttachmentErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public AttachmentException(AttachmentErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /** Returns the error code that determines the HTTP response status. */
    public AttachmentErrorCode getErrorCode() {
        return errorCode;
    }

}
