package com.scb.ratan.flowzero.auth.authentication.handler;

import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationResponseDto;

import java.util.Map;

public interface IHeaderAuthenticationHandler {

    boolean supports(Map<String, String> headers);

    AuthenticationResponseDto authenticate(Map<String, String> headers);

}
