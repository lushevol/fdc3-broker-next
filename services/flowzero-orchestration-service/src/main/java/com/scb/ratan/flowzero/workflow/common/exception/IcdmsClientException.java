package com.scb.ratan.flowzero.workflow.common.exception;

import com.scb.ratan.flowzero.workflow.common.enums.IcdmsErrorCode;

/**
 * Client-level iCDMS exception: HTTP 4xx — validation failure, permission denied, duplicate case.
 *
 * <p><strong>Resilience4j role — IGNORED exception.</strong><br>
 * Listed under {@code circuitbreaker.instances.icdmsClient.ignoreExceptions} in
 * {@code application.yml}.  Instances of this exception do <em>not</em> contribute to
 * the circuit-breaker's failure rate, because the error originates in bad request data,
 * not a service outage.
 *
 * <p><strong>Retry-task outcome — FAILED.</strong><br>
 * The retry count <em>is</em> incremented on client errors.  Once the count reaches
 * {@code maxRetry}, the task is transitioned to {@code SKIPPED} and an alert is raised.
 * Use {@link #getErrorCode()} to distinguish specific 4xx scenarios (e.g.
 * {@link IcdmsErrorCode#DUPLICATE_CASE} vs {@link IcdmsErrorCode#VALIDATION_FAILED}).
 *
 * <p><strong>Do not rename this class</strong> — its fully-qualified name is hard-coded
 * in {@code application.yml}.
 */
public class IcdmsClientException extends IcdmsException {

    private static final long serialVersionUID = 6173829017463820914L;

    public IcdmsClientException(IcdmsErrorCode errorCode, String message) {
        super(errorCode, message);
    }

    public IcdmsClientException(IcdmsErrorCode errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }

    @Override
    public boolean isClientError() {
        return true;
    }

}
