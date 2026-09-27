package com.scb.ratan.flowzero.auth.constant;

import com.scb.ratan.commons.RatanError;

/**
 *
 * @author Li, Chris Bo
 * @since 2020-07-02
 *
 */
public enum AuthErrorEnum implements RatanError {

    AUTH_SERVICE_ERROR_BAD_REQUEST(500, "100500010"),
    JSON_PROCESSING_ERROR(500, "100500020"),
    AUTH_SERVICE_UNAVAILABLE(503, "100503010"),
    TOKEN_INVALID_EXPIRED(401, "100401001"),
    TOKEN_NOT_FOUND(401, "100401002"),
    BAD_CREDENTIAL(401, "100401003"),
    ACTION_DENIED(403, "100403001"),
    USER_NOT_FOUND(404, "100404001"),
    DATA_VALIDATION_FAILED(400, "100400001");

    private final int status;
    private final String code;

    AuthErrorEnum(int status, String code) {
        this.status = status;
        this.code = code;
    }

    @Override
    public String getErrorCode() {
        return this.code;
    }

    @Override
    public int getStatus() {
        return this.status;
    }

}
