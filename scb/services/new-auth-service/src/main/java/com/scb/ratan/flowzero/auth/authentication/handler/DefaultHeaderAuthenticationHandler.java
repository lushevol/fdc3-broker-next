package com.scb.ratan.flowzero.auth.authentication.handler;

import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationResponseDto;
import com.scb.ratan.flowzero.auth.authentication.IFallbackAuthenticationProvider;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class DefaultHeaderAuthenticationHandler {

    private final IFallbackAuthenticationProvider authentication;

    public AuthenticationResponseDto authenticate(Map<String, String> headers) {
        return authentication.resolveFallbackAuthentication(headers);
    }

}
