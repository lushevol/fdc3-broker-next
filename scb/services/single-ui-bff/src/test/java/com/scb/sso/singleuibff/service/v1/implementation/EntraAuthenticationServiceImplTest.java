package com.scb.sso.singleuibff.service.v1.implementation;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.EntraConfigProperties;
import com.scb.sso.singleuibff.dto.entra.ResponseEntra;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.util.ClientAssertionGenUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Method;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EntraAuthenticationServiceImplTest {

    @InjectMocks
    EntraAuthenticationServiceImpl entraAuthenticationServiceImpl;

    @Mock
    RestTemplate restTemplate;

    @Spy
    ObjectMapper objectMapper;

    @Mock
    EntraConfigProperties entraConfigProperties;

    @Mock
    ClientAssertionGenUtil clientAssertionGenUtil;

    // A minimal JWT with claims: userId, firstName, lastName, fullName, emailId, locale, country
    // Header: {"alg":"none"}
    // Payload: {"userId":"testUser","firstName":"Test","lastName":"User","fullName":"Test User","emailId":"test@scb.com","locale":"en","country":"TH"}
    private static final String JWT_HEADER = "eyJhbGciOiJub25lIn0";
    private static final String JWT_PAYLOAD = "eyJ1c2VySWQiOiJ0ZXN0VXNlciIsImZpcnN0TmFtZSI6IlRlc3QiLCJsYXN0TmFtZSI6IlVzZXIiLCJmdWxsTmFtZSI6IlRlc3QgVXNlciIsImVtYWlsSWQiOiJ0ZXN0QHNjYi5jb20iLCJsb2NhbGUiOiJlbiIsImNvdW50cnkiOiJUSCJ9";
    private static final String JWT_SIGNATURE = "signature";
    private static final String RESPONSE_JWT = JWT_HEADER + "." + JWT_PAYLOAD + "." + JWT_SIGNATURE;

    private static final String RESPONSE_BODY = "{"
        + "\"access_token\":\"access-token-value\","
        + "\"token_type\":\"Bearer\","
        + "\"expires_in\":3600,"
        + "\"scope\":\"openid profile\","
        + "\"id_token\":\"" + RESPONSE_JWT + "\""
        + "}";

    @SuppressWarnings("unchecked")
    @Test
    void authenticate_Success_ReturnsPayloadMap() {
        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.OK);
        when(responseEntity.getBody()).thenReturn(RESPONSE_BODY);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class))).thenReturn(responseEntity);
        RequestOfAuthenticate request = getRequest();
        Map<String, String> result = entraAuthenticationServiceImpl.authenticate(request);

        assertNotNull(result);
        assertEquals("testUser", result.get("userId"));
        assertEquals("Test", result.get("firstName"));
        assertEquals("User", result.get("lastName"));
        assertEquals("Test User", result.get("fullName"));
        assertEquals("test@scb.com", result.get("emailId"));
        assertEquals("en", result.get("locale"));
        assertEquals("TH", result.get("country"));
        assertEquals("testUser", request.getUsername());
    }

    @SuppressWarnings("unchecked")
    @Test
    void authenticate_NullBody_ThrowsAuthenticationException() {
        ResponseEntity<String> responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.OK);
        when(responseEntity.getBody()).thenReturn(null);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class))).thenReturn(responseEntity);
        RequestOfAuthenticate request = getRequest();
        assertThatThrownBy(() -> entraAuthenticationServiceImpl.authenticate(request))
            .isInstanceOf(AuthenticationException.class)
            .hasMessage("Entra authenticate failed.");
    }

    @SuppressWarnings("unchecked")
    @Test
    void authenticate_Non2xxStatus_ThrowsAuthenticationException() {
        ResponseEntity<String> responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class))).thenReturn(responseEntity);
        RequestOfAuthenticate request = getRequest();
        assertThatThrownBy(() -> entraAuthenticationServiceImpl.authenticate(request))
            .isInstanceOf(AuthenticationException.class)
            .hasMessage("Entra authenticate failed.");
    }

    @Test
    void authenticate_RestTemplateThrowsException_ThrowsAuthenticationException() {
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
            .thenThrow(new RuntimeException("Connection refused"));
        RequestOfAuthenticate request = getRequest();
        assertThatThrownBy(() -> entraAuthenticationServiceImpl.authenticate(request))
            .isInstanceOf(AuthenticationException.class)
            .hasMessage("Entra authenticate failed.");
    }

    @SuppressWarnings("unchecked")
    @Test
    void authenticate_NullJwtClaims_ReturnsMapWithNullValues() throws Exception {
        ResponseEntity<String> responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.OK);
        when(responseEntity.getBody()).thenReturn(RESPONSE_BODY);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class))).thenReturn(responseEntity);

        ResponseEntra mockResponseEntra = mock(ResponseEntra.class);
        when(mockResponseEntra.getIdToken()).thenReturn(RESPONSE_JWT);
        doReturn(mockResponseEntra).when(objectMapper).readValue(anyString(), eq(ResponseEntra.class));

        DecodedJWT mockDecodedJWT = mock(DecodedJWT.class);
        when(mockDecodedJWT.getClaim(anyString())).thenReturn(null);

        try (MockedStatic<JWT> jwtMockedStatic = mockStatic(JWT.class)) {
            jwtMockedStatic.when(() -> JWT.decode(RESPONSE_JWT)).thenReturn(mockDecodedJWT);
            RequestOfAuthenticate request = getRequest();
            Map<String, String> result = entraAuthenticationServiceImpl.authenticate(request);

            assertNotNull(result);
            assertNull(result.get("userId"));
            assertNull(result.get("firstName"));
            assertNull(result.get("lastName"));
            assertNull(result.get("fullName"));
            assertNull(result.get("emailId"));
            assertNull(result.get("locale"));
            assertNull(result.get("country"));
        }
    }

    private RequestOfAuthenticate getRequest() {
        RequestOfAuthenticate  request = new RequestOfAuthenticate();
        request.setCode("auth-code-123");
        when(entraConfigProperties.getClientId()).thenReturn("client-id");
        when(entraConfigProperties.getGrantType()).thenReturn("authorization_code");
        when(entraConfigProperties.getClientAssertionType()).thenReturn("urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
        when(entraConfigProperties.getScope()).thenReturn("openid profile");
        when(entraConfigProperties.getRedirectUri()).thenReturn("https://redirect.uri");
        when(entraConfigProperties.getEntraTokenEndpoint()).thenReturn("https://login.microsoftonline.com/tenant/oauth2/v2.0/token");
        when(clientAssertionGenUtil.generateClientAssertion()).thenReturn("client-assertion-token");
        return request;
    }
}