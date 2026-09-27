package com.scb.ratan.flowzero.auth.authentication;

import com.scb.ratan.flowzero.auth.constant.AuthErrorEnum;
import com.scb.ratan.flowzero.auth.authentication.handler.AuthenticationHandlerResolver;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationPayloadDto;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationResponseDto;
import com.scb.ratan.flowzero.auth.entity.dto.UserEntitlementDto;
import com.scb.ratan.flowzero.auth.entity.dto.UserInfo;
import com.scb.ratan.flowzero.auth.exceptions.AuthenticationException;
import com.scb.ratan.flowzero.auth.constant.AuthConstant;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import com.scb.ratan.flowzero.auth.util.RatanServerWebExchangeUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HeaderAuthenticationServiceTest {

    @Mock
    private RatanObjectMapper objectMapper;

    @Mock
    private AuthenticationHandlerResolver authenticationHandlerResolver;

    @Mock
    private HttpServletRequest httpServletRequest;

    private HeaderAuthenticationService headerAuthenticationService;

    @BeforeEach
    void setUp() {
        headerAuthenticationService = new HeaderAuthenticationService(objectMapper, authenticationHandlerResolver);
    }

    @Test
    void authenticate_shouldReturnTokenNotFoundWhenSupportedHeaderMissing() {
        when(httpServletRequest.getHeader(AuthConstant.HEADER_KEY_SINGLE_UI_AUTHORIZATION)).thenReturn(null);

        StepVerifier.create(headerAuthenticationService.authenticate(httpServletRequest))
            .expectErrorMatches(ex -> ex instanceof AuthenticationException
                && ((AuthenticationException) ex).getError() == AuthErrorEnum.TOKEN_NOT_FOUND)
            .verify();
    }

    @Test
    void authenticate_shouldReturnAuthenticationPayloadWhenSingleUiHeaderValid() {
        when(httpServletRequest.getHeader(AuthConstant.HEADER_KEY_SINGLE_UI_AUTHORIZATION))
            .thenReturn("Bearer token-123");
        when(httpServletRequest.getHeader(RatanServerWebExchangeUtils.RATAN_TRACE_ID)).thenReturn("trace-1");

        AuthenticationResponseDto responseDto = new AuthenticationResponseDto();
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId("u1");
        userInfo.setFullName("User One");
        userInfo.setCountry("SG");
        responseDto.setUserInfo(userInfo);
        responseDto.setEntitlement("{\"role\":\"ADMIN\",\"actions\":[\"READ\"]}");

        UserEntitlementDto entitlementDto = new UserEntitlementDto();
        entitlementDto.setRole("ADMIN");
        entitlementDto.setActions(Collections.singletonList("READ"));

        when(authenticationHandlerResolver.authenticate(any(Map.class))).thenReturn(responseDto);
        when(objectMapper.readValue("{\"role\":\"ADMIN\",\"actions\":[\"READ\"]}", UserEntitlementDto.class))
            .thenReturn(entitlementDto);

        Mono<AuthenticationPayloadDto> result = headerAuthenticationService.authenticate(httpServletRequest);

        StepVerifier.create(result)
            .assertNext(payload -> {
                assertNotNull(payload);
                assertNotNull(payload.getUserInfo());
                assertEquals("u1", payload.getUserInfo().getUserId());
                assertEquals("User One", payload.getUserInfo().getFullName());
                assertEquals("SG", payload.getUserInfo().getCountry());
                assertNotNull(payload.getUserEntitlement());
                assertEquals("ADMIN", payload.getUserEntitlement().getRole());
            })
            .verifyComplete();
    }

}
