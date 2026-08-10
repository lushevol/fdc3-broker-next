package com.scb.sso.singleuibff.service.v1;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import com.scb.sso.singleuibff.config.MFAConfigProperties;
import com.scb.sso.singleuibff.dto.mfa.ResponseMFA;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.service.v1.implementation.MFAAuthenticationService;
import org.junit.jupiter.api.Assertions;
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

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MFAAuthenticationServiceTest {

    @InjectMocks
    MFAAuthenticationService mfaAuthenticationService;
    @Mock
    RestTemplate restTemplate;
    @Spy
    ObjectMapper objectMapper;
    @Mock
    MFAConfigProperties mfaConfigProperties;

    String part1 = "eyJ0eXAiOiJKV1QiLCJraWQiOiJ3VTNpZklJYUxPVUFSZVJCL0ZHNmVNMVAxUU09IiwiYWxnIjoiUlMyNTYifQ";
    String part2 = "eyJhdF9oYXNoIjoiOGNaeE1CTFJsOVZRNGpwY2FSU1ZpZyIsInN1YiI6IjE2Mzk3ODgiLCJhdWRpdFRyYWNraW5nSWQiOiJjODhhZWMwZi1hODZjLTRhZTAtOTBkOC02MDdkMzk0MTFmZmEtMzExODY3IiwiaXNzIjoiaHR0cHM6Ly9zaXRpZ21mYS5oay5zdGFuZGFyZGNoYXJ0ZXJlZC5jb206ODQ0My9vcGVuYW0vb2F1dGgyL3JlYWxtcy9yb290L3JlYWxtcy9zc28iLCJ0b2tlbk5hbWUiOiJpZF90b2tlbiIsImdpdmVuX25hbWUiOiJGZW5nLCBCcnVjZSBYaW54aW4iLCJhdWQiOiI1MTM1OHJhdGFuIiwiY19oYXNoIjoib3o5NkUydzZFLUp5R0dPQVUzdUhVUSIsImFjciI6Im1mYSIsIm9yZy5mb3JnZXJvY2sub3BlbmlkY29ubmVjdC5vcHMiOiJVbzAxcGszX3JaMU43WHpqVnN6blB2V094TUUiLCJhenAiOiI1MTM1OHJhdGFuIiwiYXV0aF90aW1lIjoxNjgzMTgzODgyLCJuYW1lIjoiMTYzOTc4OCIsInJlYWxtIjoiL3NzbyIsImV4cCI6MTY4MzE4NDc5NCwidG9rZW5UeXBlIjoiSldUVG9rZW4iLCJmYW1pbHlfbmFtZSI6IkZlbmcsWGlueGluIiwiaWF0IjoxNjgzMTgzODk0fQ";
    String part3 = "mE7FrO2WGnLzvmfzHJtoZ46Sr6VZRvRpWGtGLM4ymvQwuUnH2modc61yHlLHFbyxzhR2PtA6ct9pRhBiqVisNnRD5IzxK8tBPlsjjTiid8rP27i0qmA8CgNaVjj0FoK-hJ8UbUQ6bvr56TQ7_AdlEhL6Tv9QpcQad8AYdZHnILwy9_q5q9Z7wsgnJZJt3X5G5wLDiLc85MadRxUnuyLL8kb079sXWt5Wkqp1hOYuI7rOd5sjSMF2kTASs76SUxuSKhXVwE_FOeaEw_bUzHWLJ4QtP_T8jU9iqX2LLA0hF4kMFZ-KzeyvvqSFHalubxCugLHZ4kA8KcpQB7TiQCIVfQ";
    String responseJwt = part1 + "." + part2 + "." + part3;

    String response = "{" +
        "  \"access_token\": \"A5YgjwELBkQBX0JRnixJ5idzuJE\"," +
        "  \"scope\": \"openid profile\"," +
        "  \"id_token\": \"" + responseJwt + "\","
        +
        "  \"token_type\": \"Bearer\"," +
        "  \"expires_in\": 899" +
        "}";

    RequestOfAuthenticate request = new RequestOfAuthenticate();

    @BeforeEach
    void init() {
        Map<String, String> headers = Maps.newHashMap();
        headers.put("X-Cert", "cert-token");
        when(mfaConfigProperties.getHeaders()).thenReturn(headers);
        when(mfaConfigProperties.getGrantType()).thenReturn("authorization_code");
        when(mfaConfigProperties.getRedirectUri()).thenReturn("redirect-uri");
        request.setCode("9Pxb-f-xAAJX9AKsSoJ1tmrghhw");
        request.setClientId("51358ratan");
        request.setIss("https://sitigmfa.hk.standardchartered.com:8443/openam/oauth2/realms/root/realms/sso");
    }

    @Test
    void authenticateTest() {
        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.OK);
        when(responseEntity.getBody()).thenReturn(response);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity);
        mfaAuthenticationService.authenticate(request);
        Assertions.assertEquals("1639788", request.getUsername());
    }

    @Test
    void authenticateBodyIsNullTest() {
        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.OK);
        when(responseEntity.getBody()).thenReturn(null);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity);

        assertThatThrownBy(() -> mfaAuthenticationService.authenticate(request))
            .isInstanceOf(AuthenticationException.class)
            .hasMessage("MFA authenticate failed.");
    }

    @Test
    void authenticateElseTest() {
        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity);

        assertThatThrownBy(() -> mfaAuthenticationService.authenticate(request))
            .isInstanceOf(AuthenticationException.class)
            .hasMessage("MFA authenticate failed.");
    }

    @Test
    void covertErrorMessageElseTest() {
        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity);

        assertThatThrownBy(() -> mfaAuthenticationService.authenticate(request))
            .isInstanceOf(AuthenticationException.class)
            .hasMessage("MFA authenticate failed.");
    }

    @Test
    void authenticateFieldIsNullTest() throws JsonProcessingException {
        RequestOfAuthenticate requestTest = new RequestOfAuthenticate();
        requestTest.setCode("9Pxb-f-xAAJX9AKsSoJ1tmrghhw");
        requestTest.setClientId("51358ratan");
        requestTest.setIss("https://sitigmfa.hk.standardchartered.com:8443/openam/oauth2/realms/root/realms/sso");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getStatusCode()).thenReturn(HttpStatus.OK);
        when(responseEntity.getBody()).thenReturn(response);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity);

        ResponseMFA responseMFA = mock(ResponseMFA.class);
        when(responseMFA.getIdToken()).thenReturn(responseJwt);
        doReturn(responseMFA).when(objectMapper).readValue(anyString(), eq(ResponseMFA.class));

        DecodedJWT decodedJWT = mock(DecodedJWT.class);
        try (MockedStatic<JWT> jwtMockedStatic = mockStatic(JWT.class)) {
            jwtMockedStatic.when(() -> JWT.decode(responseJwt)).thenReturn(decodedJWT);

            Map<String, String> result = mfaAuthenticationService.authenticate(requestTest);

            Assertions.assertNull(request.getUsername());
            Assertions.assertNull(result.get("userId"));
            Assertions.assertNull(result.get("lastName"));
            Assertions.assertNull(result.get("firstName"));
            Assertions.assertNull(result.get("fullName"));
            Assertions.assertNull(result.get("emailId"));
            Assertions.assertNull(result.get("country"));
        }
    }

}
