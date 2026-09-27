package com.scb.ratan.flowzero.auth.authentication;

import com.scb.ratan.flowzero.auth.constant.AuthErrorEnum;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationPayloadDto;
import com.scb.ratan.flowzero.auth.exceptions.AuthenticationException;
import jakarta.servlet.http.HttpServletRequest;
import reactor.core.publisher.Mono;

/**
 * 
 * @author Li, Chris Bo
 * @since 2020-06-26
 *
 */
public interface IAuthenticationService {

    Mono<AuthenticationPayloadDto> authenticate(HttpServletRequest httpServletRequest);

    default <T> Mono<T> monoError(AuthErrorEnum error) {
        return Mono.error(new AuthenticationException(error));
    }

}
