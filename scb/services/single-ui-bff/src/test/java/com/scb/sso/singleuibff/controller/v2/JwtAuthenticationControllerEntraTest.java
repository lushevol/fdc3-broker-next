package com.scb.sso.singleuibff.controller.v2;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticateEntra;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.SessionService;
import com.scb.sso.singleuibff.service.v1.implementation.OUDAuthenticationService;
import com.scb.sso.singleuibff.service.v1.implementation.MFAAuthenticationService;
import com.scb.sso.singleuibff.service.v1.EntraAuthenticationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.JwtTokenUtil;
import com.scb.sso.singleuibff.util.OudUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class JwtAuthenticationControllerEntraTest {

    @InjectMocks
    private JwtAuthenticationController controller;

    @Mock
    private OUDAuthenticationService oudAuthenticationService;
    @Mock
    private MFAAuthenticationService mfaAuthenticationService;
    @Mock
    private EntraAuthenticationService entraAuthenticationService;
    @Mock
    private AuthorizationService authorizationService;
    @Mock
    private JwtTokenUtil jwtTokenUtil;
    @Mock
    private ObjectMapper objectMapper;
    @Mock
    private OudUtil oudUtil;
    @Mock
    private HttpSession httpSession;
    @Mock
    private SessionService sessionService;
    @Mock
    private AnalyticService analyticService;
    @Mock
    private ApplicationCategoryService applicationCategoryService;
    @Mock
    private AdminModuleUtil adminModuleUtil;

    @Mock
    private HttpServletRequest httpServletRequest;
    @Mock
    private HttpServletResponse httpServletResponse;

    @BeforeEach
    public void setUp() throws Exception {
        // make objectMapper behave like real one for writeValueAsString
        when(objectMapper.writeValueAsString(any()))
            .thenAnswer(invocation -> new ObjectMapper().writeValueAsString(invocation.getArgument(0)));
        when(httpSession.getId()).thenReturn("session-123");
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.of(Collections.emptyList()));
        when(adminModuleUtil.getEntityFromApplicationCategory(any())).thenReturn(Collections.emptyList());
        Ems2Result empty = new Ems2Result();
        empty.setEntities(Collections.emptyList());
        when(authorizationService.getEntitlements(any(), any())).thenReturn(empty);
        when(adminModuleUtil.getDrawer(any(), any())).thenReturn(Collections.emptyList());
        when(jwtTokenUtil.generateEntitlementToken(any(), any())).thenReturn("entToken");
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(any(), any())).thenReturn("jwtToken");
        when(jwtTokenUtil.retrieveUserInfoFromToken("jwtToken")).thenReturn("{\"sub\":\"user\"}");
        when(oudUtil.getIp(any())).thenReturn("1.2.3.4");
        when(httpServletRequest.getServerName()).thenReturn("localhost");
    }

    @Test
    public void authenticateEntra_success_whenCodeBlank_callsOud() throws Exception {
        RequestOfAuthenticateEntra request = new RequestOfAuthenticateEntra();
        request.setUsername("alice");
        request.setPassword("pwd");
        request.setCode(null);

        Map<String, String> userInfo = new HashMap<>();
        // simulate missing fullName
        when(oudAuthenticationService.authenticate(any())).thenReturn(userInfo);

        ResponseEntity<com.scb.sso.singleuibff.dto.response.ResponseOfAuthenticate> resp = controller.authenticateEntra(request,
            httpServletRequest, httpServletResponse);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
        assertNotNull(resp.getBody());
        assertTrue(resp.getBody().isResult());
        assertEquals("entToken", resp.getBody().getEntitlementsToken());
        // verify oudAuthenticationService was called and entra not called
        verify(oudAuthenticationService, times(1)).authenticate(any());
        verify(entraAuthenticationService, times(0)).authenticate(any());
    }

    @Test
    public void authenticateEntra_success_whenCodePresent_callsEntra() throws Exception {
        RequestOfAuthenticateEntra request = new RequestOfAuthenticateEntra();
        request.setUsername("bob");
        request.setPassword("pwd");
        request.setCode("sso-code");

        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("fullName", "Bob B");
        when(entraAuthenticationService.authenticate(any())).thenReturn(userInfo);

        ResponseEntity<com.scb.sso.singleuibff.dto.response.ResponseOfAuthenticate> resp = controller.authenticateEntra(request,
            httpServletRequest, httpServletResponse);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
        assertNotNull(resp.getBody());
        assertTrue(resp.getBody().isResult());
        assertEquals("entToken", resp.getBody().getEntitlementsToken());
        verify(entraAuthenticationService, times(1)).authenticate(any());
        verify(oudAuthenticationService, times(0)).authenticate(any());
    }

    @Test
    public void authenticateEntra_authenticationException_returnsBadRequest() throws Exception {
        RequestOfAuthenticateEntra request = new RequestOfAuthenticateEntra();
        request.setUsername("charlie");
        request.setCode("sso-code");

        when(entraAuthenticationService.authenticate(any()))
            .thenThrow(AuthenticationException.builder().code("401").message("bad creds").build());

        ResponseEntity<com.scb.sso.singleuibff.dto.response.ResponseOfAuthenticate> resp = controller.authenticateEntra(request,
            httpServletRequest, httpServletResponse);
        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
        assertNotNull(resp.getBody());
        assertFalse(resp.getBody().isResult());
        assertTrue(resp.getBody().getErrorMessage().contains("AuthenticationException:"));
    }

    @Test
    public void authenticateEntra_runtimeException_returnsBadRequest() throws Exception {
        RequestOfAuthenticateEntra request = new RequestOfAuthenticateEntra();
        request.setUsername("dave");
        request.setCode(null);

        when(oudAuthenticationService.authenticate(any())).thenThrow(new RuntimeException("boom"));

        ResponseEntity<com.scb.sso.singleuibff.dto.response.ResponseOfAuthenticate> resp = controller.authenticateEntra(request,
            httpServletRequest, httpServletResponse);
        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
        assertNotNull(resp.getBody());
        assertFalse(resp.getBody().isResult());
        assertTrue(resp.getBody().getErrorMessage().contains("AuthenticationException:"));
    }

}
