package com.scb.ratan.flowzero.auth.authentication;

import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.flowzero.auth.constant.AuthServiceErrorEnum;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationResponseDto;

import java.util.Map;

public interface IFallbackAuthenticationProvider {

    AuthenticationResponseDto resolveFallbackAuthentication(Map<String, String> headers);

    default void response401() {
        throw new RatanServiceException(AuthServiceErrorEnum.AUTHORIZE_ERROR);
    }

}
