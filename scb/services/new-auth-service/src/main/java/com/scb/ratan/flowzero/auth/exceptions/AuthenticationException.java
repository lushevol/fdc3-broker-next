package com.scb.ratan.flowzero.auth.exceptions;

import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.flowzero.auth.constant.AuthErrorEnum;

/**
 * 
 * @author Li, Chris Bo
 * @since 2020-06-29
 *
 */
public class AuthenticationException extends RatanServiceException {

    private static final long serialVersionUID = -2657482636649533630L;

    public AuthenticationException(AuthErrorEnum error) {
        super(error, error.name());
    }

}
