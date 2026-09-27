package com.scb.ratan.flowzero.auth.service.ems3;

import com.fasterxml.jackson.databind.JsonNode;
import com.scb.ratan.flowzero.auth.properties.EMS3Properties;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EMS3TokenServiceTest {

    @Mock
    private EMS3Properties ems3Properties;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private RatanObjectMapper objectMapper;

    @Mock
    private JsonNode jsonNode;

    @Mock
    private JsonNode accessTokenNode;

    @InjectMocks
    private EMS3TokenService ems3TokenService;

    @Test
    void fetchAccessToken_whenResponseIsSuccessful_shouldReturnAccessToken() {
        stubTokenRequest();
        when(restTemplate.exchange(
            eq("https://ems3.test/token"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)))
                .thenReturn(ResponseEntity.ok("{\"access_token\":\"token-1\"}"));
        when(objectMapper.readTree(eq("{\"access_token\":\"token-1\"}"))).thenReturn(jsonNode);
        when(jsonNode.path("access_token")).thenReturn(accessTokenNode);
        when(accessTokenNode.asText(null)).thenReturn("token-1");

        assertEquals("token-1", ems3TokenService.fetchAccessToken());

        ArgumentCaptor<HttpEntity> requestCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).exchange(
            eq("https://ems3.test/token"),
            eq(HttpMethod.POST),
            requestCaptor.capture(),
            eq(String.class));

        HttpEntity<?> request = requestCaptor.getValue();
        assertEquals(MediaType.APPLICATION_FORM_URLENCODED, request.getHeaders().getContentType());
        MultiValueMap<String, String> body = (MultiValueMap<String, String>) request.getBody();
        assertEquals("client_credentials", body.getFirst("grant_type"));
        assertEquals("client-1", body.getFirst("client_id"));
        assertEquals("secret-1", body.getFirst("client_secret"));
        assertEquals("scope-1", body.getFirst("scope"));
    }

    @Test
    void fetchAccessToken_whenResponseIsUnauthorized_shouldThrowException() {
        stubTokenRequest();
        when(restTemplate.exchange(
            eq("https://ems3.test/token"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)))
                .thenReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());

        assertThrows(IllegalStateException.class, () -> ems3TokenService.fetchAccessToken());
    }

    @Test
    void fetchAccessToken_whenResponseBodyIsBlank_shouldThrowException() {
        stubTokenRequest();
        when(restTemplate.exchange(
            eq("https://ems3.test/token"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)))
                .thenReturn(ResponseEntity.ok(" "));

        assertThrows(IllegalStateException.class, () -> ems3TokenService.fetchAccessToken());
    }

    @Test
    void fetchAccessToken_whenResponseIsNotSuccessful_shouldThrowException() {
        stubTokenRequest();
        when(restTemplate.exchange(
            eq("https://ems3.test/token"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)))
                .thenReturn(ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("upstream error"));

        assertThrows(IllegalStateException.class, () -> ems3TokenService.fetchAccessToken());
    }

    @Test
    void fetchAccessToken_whenAccessTokenIsMissing_shouldThrowException() {
        stubTokenRequest();
        when(restTemplate.exchange(
            eq("https://ems3.test/token"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)))
                .thenReturn(ResponseEntity.ok("{}"));
        when(objectMapper.readTree(eq("{}"))).thenReturn(jsonNode);
        when(jsonNode.path("access_token")).thenReturn(accessTokenNode);
        when(accessTokenNode.asText(null)).thenReturn(null);

        assertThrows(IllegalStateException.class, () -> ems3TokenService.fetchAccessToken());
    }

    private void stubTokenRequest() {
        when(ems3Properties.getTokenUrl()).thenReturn("https://ems3.test/token");
        when(ems3Properties.getGrantTypeValue()).thenReturn("client_credentials");
        when(ems3Properties.getClientId()).thenReturn("client-1");
        when(ems3Properties.getClientSecret()).thenReturn("secret-1");
        when(ems3Properties.getScope()).thenReturn("scope-1");
    }

}
