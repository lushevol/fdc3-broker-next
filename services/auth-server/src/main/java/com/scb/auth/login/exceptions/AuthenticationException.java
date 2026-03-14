package com.scb.auth.login.exceptions;

import com.scb.ratan.common.lib.ResponseCode;
import com.scb.ratan.commons.RatanError;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class AuthenticationException extends RuntimeException implements RatanError {

    private ResponseCode responseCode;
    private String errorMessage;
    private HttpStatus httpStatus;

    public AuthenticationException(HttpStatus httpStatus, ResponseCode responseCode, String errorMessage) {
        super(errorMessage);
        this.httpStatus = httpStatus;
        this.responseCode = responseCode;
        this.errorMessage = errorMessage;
    }

    public AuthenticationException(String errorMessage) {
        super(errorMessage);
        this.errorMessage = errorMessage;
    }

    @Override
    public String getErrorCode() {
        return null;
    }

    @Override
    public int getStatus() {
        return 0;
    }

}
