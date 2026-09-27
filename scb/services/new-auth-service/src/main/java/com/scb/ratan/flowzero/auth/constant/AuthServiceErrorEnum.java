package com.scb.ratan.flowzero.auth.constant;

import com.scb.ratan.commons.RatanError;

public enum AuthServiceErrorEnum implements RatanError {

    INVALID_USERNAME_PWD_ERROR(400, "800400001"),
    INVALID_USERNAME_PWD_FORMAT_ERROR(400, "800400002"),
    ENTITLEMENT_CONFIG_ERROR(412, "800412001"),
    OUD_RELATED_ERROR(400, "800400003"),
    NOT_AUTHORIZED_ERROR(400, "800400004"),
    ENTITLEMENT_FORBIDDEN_ERROR(403, "800403001"),
    INVALID_USER(404, "800404001"),
    INVALID_TOKEN(400, "800400005"),
    AUTHORIZE_ERROR(401, "800401001");

    private final int status;
    private final String code;

    AuthServiceErrorEnum(int status, String code) {
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
