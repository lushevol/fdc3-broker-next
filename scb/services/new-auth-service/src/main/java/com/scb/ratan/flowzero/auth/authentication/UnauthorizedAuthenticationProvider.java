package com.scb.ratan.flowzero.auth.authentication;

import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
@Data
@NoArgsConstructor
public class UnauthorizedAuthenticationProvider implements IFallbackAuthenticationProvider {

    @Override
    public AuthenticationResponseDto resolveFallbackAuthentication(Map<String, String> headers) {
        response401();
        return null; // unreachable – response401() always throws
    }

}
