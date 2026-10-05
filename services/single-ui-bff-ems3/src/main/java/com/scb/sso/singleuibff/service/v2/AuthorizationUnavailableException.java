package com.scb.sso.singleuibff.service.v2;

public class AuthorizationUnavailableException extends RuntimeException {
    public AuthorizationUnavailableException(String message) {
        super(message);
    }

    public AuthorizationUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
