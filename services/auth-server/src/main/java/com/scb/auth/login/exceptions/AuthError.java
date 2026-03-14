package com.scb.auth.login.exceptions;

/**
 * Created by 1604522 on 12/22/2020.
 */

import com.scb.ratan.commons.RatanError;

/**
 * @author Li, Chris Bo
 * @since 2020-07-02
 */
public enum AuthError implements RatanError {

    API_GATEWAY_INTERNAL_ERROR(500, "100500001"),
    AUTH_SERVICE_UNAVAILABLE(503, "100503010"),
    TOKEN_INVALID_EXPIRED(401, "100401001"),
    TOKEN_NOT_FOUND(401, "100401002"),
    BAD_CREDENTIAL(401, "100401003"),
    ACTION_DENIED(403, "100403001"),
    DATA_VALIDATION_FAILED(400, "100400001");

    private int status;
    private String code;

    private AuthError(int status) {
        this.status = status;
        this.code = name();
    }

    private AuthError(int status, String code) {
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