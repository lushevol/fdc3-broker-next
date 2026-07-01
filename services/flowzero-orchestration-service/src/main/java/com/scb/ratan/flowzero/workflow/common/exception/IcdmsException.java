package com.scb.ratan.flowzero.workflow.common.exception;

import com.scb.ratan.flowzero.workflow.common.enums.IcdmsErrorCode;

/**
 * Abstract base class for all iCDMS integration exceptions.
 *
 * <p>Provides a common root so callers can catch any iCDMS error with a single
 * {@code catch (IcdmsException e)} when the distinction between client-level and
 * service-level does not matter.
 *
 * <h3>Class hierarchy</h3>
 * <pre>
 * IcdmsException  (this class — abstract)
 * ├── IcdmsSyncException    — service-level: 5xx / timeout / CB_OPEN / rate-limit
 * │     Resilience4j role: RECORDED → counts toward CB failure rate → may open CB
 * │     Retry outcome:     SUSPENDED (retry count NOT incremented)
 * └── IcdmsClientException  — client-level: 4xx / validation / permission / duplicate
 *       Resilience4j role: IGNORED  → does NOT count toward CB failure rate
 *       Retry outcome:     FAILED   (retry count IS incremented)
 * </pre>
 *
 * <p><strong>Important:</strong> the two concrete subclasses are referenced by their
 * fully-qualified class name in {@code application.yml} under Resilience4j's
 * {@code recordExceptions} / {@code ignoreExceptions}.  Their class names must
 * <em>never</em> be changed or the circuit-breaker configuration will break silently.
 */
public abstract class IcdmsException extends RuntimeException {

    private static final long serialVersionUID = -7284937201836471052L;

    private final IcdmsErrorCode errorCode;

    protected IcdmsException(IcdmsErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    protected IcdmsException(IcdmsErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * Returns the fine-grained error code that describes the specific failure scenario.
     * Use this for detailed logging, metrics tagging, or conditional retry logic.
     */
    public IcdmsErrorCode getErrorCode() {
        return errorCode;
    }

    /**
     * Returns {@code true} if this is a client-data error (4xx) that should
     * <em>not</em> open the circuit breaker, {@code false} for service-level errors.
     */
    public abstract boolean isClientError();

}
