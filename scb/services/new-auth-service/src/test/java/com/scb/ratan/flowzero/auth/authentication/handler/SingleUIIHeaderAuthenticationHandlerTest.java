package com.scb.ratan.flowzero.auth.authentication.handler;

import com.scb.fmoportal.auth.util.JwtTokenUtil;
import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.flowzero.auth.constant.AuthServiceErrorEnum;
import com.scb.ratan.flowzero.auth.jwtparser.JwtParserCoordinator;
import com.scb.ratan.flowzero.auth.constant.AuthConstant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(MockitoExtension.class)
class SingleUIIHeaderAuthenticationHandlerTest {

    @Mock
    private JwtParserCoordinator jwtParserCoordinator;

    private SingleUIIHeaderAuthenticationHandler handler;

    @BeforeEach
    void setUp() {
        handler = new SingleUIIHeaderAuthenticationHandler(jwtParserCoordinator);
    }

    @Test
    void supports_shouldReturnTrueWhenSingleUiHeaderExists() {
        Map<String, String> headers = new HashMap<>();
        headers.put(AuthConstant.HEADER_KEY_SINGLE_UI_AUTHORIZATION, "Bearer token");

        assertTrue(handler.supports(headers));
    }

    @Test
    void supports_shouldReturnFalseWhenSingleUiHeaderMissing() {
        Map<String, String> headers = new HashMap<>();
        headers.put("x-token", "abc");

        assertFalse(handler.supports(headers));
    }

    @Test
    void authenticate_shouldThrowWhenTokenValidationFails() {
        Map<String, String> headers = new HashMap<>();
        headers.put(AuthConstant.HEADER_KEY_SINGLE_UI_AUTHORIZATION, "Bearer token-123");

        try (MockedStatic<JwtTokenUtil> jwtTokenUtilMockedStatic = mockStatic(JwtTokenUtil.class)) {
            jwtTokenUtilMockedStatic.when(() -> JwtTokenUtil.validateToken("token-123"))
                .thenReturn(Optional.empty());

            RatanServiceException exception = assertThrows(RatanServiceException.class,
                () -> handler.authenticate(headers));

            assertEquals(AuthServiceErrorEnum.INVALID_TOKEN, exception.getError());
        }
    }

    @Test
    void authenticate_shouldThrowWhenHeaderFormatInvalid() {
        Map<String, String> headers = new HashMap<>();
        headers.put(AuthConstant.HEADER_KEY_SINGLE_UI_AUTHORIZATION, "token-123");

        RatanServiceException exception = assertThrows(RatanServiceException.class,
            () -> handler.authenticate(headers));

        assertEquals(AuthServiceErrorEnum.INVALID_TOKEN, exception.getError());
    }

}
