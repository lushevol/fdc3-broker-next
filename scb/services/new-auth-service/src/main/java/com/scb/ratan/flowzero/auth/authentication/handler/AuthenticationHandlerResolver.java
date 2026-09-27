package com.scb.ratan.flowzero.auth.authentication.handler;

import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationResponseDto;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class AuthenticationHandlerResolver {

    private final List<IHeaderAuthenticationHandler> handlers;

    private final DefaultHeaderAuthenticationHandler defaultHeaderAuthenticationHandler;

    /**
     * Resolve authentication by finding the first handler that supports the incoming headers.
     * If no specific handler matches, delegate to the default fallback handler.
     */
    public AuthenticationResponseDto authenticate(Map<String, String> headers) {
        return handlers.stream()
            .filter(handler -> handler.supports(headers))
            .findFirst()
            .map(handler -> handler.authenticate(headers))
            .orElseGet(() -> defaultHeaderAuthenticationHandler.authenticate(headers));
    }

}
