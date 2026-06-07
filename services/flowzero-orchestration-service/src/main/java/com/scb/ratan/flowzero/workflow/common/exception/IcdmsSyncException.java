package com.scb.ratan.flowzero.workflow.common.exception;

import com.scb.ratan.flowzero.workflow.common.enums.IcdmsErrorCode;

/**
 * Service-level iCDMS exception: HTTP 5xx, timeout, circuit-breaker OPEN, rate-limit exceeded.
 *
 * <p><strong>Resilience4j role — RECORDED exception.</strong><br>
 * Listed under {@code circuitbreaker.instances.icdmsClient.recordExceptions} in
 * {@code application.yml}.  Every instance of this exception contributes to the
 * circuit-breaker's failure rate and may eventually cause it to transition to OPEN.
 *
 * <p><strong>Retry-task outcome — SUSPENDED.</strong><br>
 * The retry count is <em>not</em> incremented on service errors, because the failure
 * is transient and not caused by bad data.  {@code IcdmsSyncServiceImpl} will retry
 * immediately on the next scheduler run.
 *
 * <p><strong>Do not rename this class</strong> — its fully-qualified name is hard-coded
 * in {@code application.yml}.
 */
public class IcdmsSyncException extends IcdmsException {

    private static final long serialVersionUID = 3820149238017429374L;

    public IcdmsSyncException(IcdmsErrorCode errorCode, String message) {
        super(errorCode, message);
    }

    public IcdmsSyncException(IcdmsErrorCode errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }

    @Override
    public boolean isClientError() {
        return false;
    }

}
