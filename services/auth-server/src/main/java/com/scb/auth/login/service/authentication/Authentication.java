package com.scb.auth.login.service.authentication;

import com.scb.auth.login.dto.AuthenticationResponseDto;
import com.scb.auth.login.exceptions.AuthServiceError;
import com.scb.ratan.commons.exception.RatanServiceException;

public interface Authentication {

    public AuthenticationResponseDto authenticate();

    public default void response401() {
        throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR);
    }

}
