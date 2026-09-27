package com.scb.ratan.flowzero.auth.service.ems3;

import com.github.benmanes.caffeine.cache.Cache;
import com.scb.ratan.flowzero.auth.entity.ems3.EntitlementBean;
import com.scb.ratan.flowzero.auth.entity.ems3.UserEntitlement;
import com.scb.ratan.flowzero.auth.properties.EMS3Properties;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EMS3DataFetchServiceTest {

    @BeforeEach
    void clearTokenCache() throws Exception {
        Field field = EMS3DataFetchService.class.getDeclaredField("TOKEN_CACHE");
        field.setAccessible(true);
        Cache<?, ?> cache = (Cache<?, ?>) field.get(null);
        cache.invalidateAll();
    }

    @Mock
    private EMS3Properties ems3Properties;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private RatanObjectMapper objectMapper;

    @Mock
    private EMS3TokenService ems3TokenService;

    @InjectMocks
    private EMS3DataFetchService ems3DataFetchService;

    @Test
    void getAccessToken_whenTokenIsNotCached_shouldFetchAndCacheToken() {
        when(ems3TokenService.fetchAccessToken()).thenReturn("token-1");

        assertEquals("token-1", ems3DataFetchService.getAccessToken());
        assertEquals("token-1", ems3DataFetchService.getAccessToken());

        verify(ems3TokenService).fetchAccessToken();
    }

    @Test
    void fetchEntitlementInfo_whenAccessTokenIsBlank_shouldReturnEmptyList() {
        when(ems3TokenService.fetchAccessToken()).thenReturn("");

        assertEquals(List.of(), ems3DataFetchService.fetchEntitlementInfo("user-1"));

        verify(restTemplate, never()).exchange(
            anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class));
    }

    @Test
    void fetchEntitlementInfo_whenResponseIsSuccessful_shouldReturnEntitlements() {
        EntitlementBean entitlement = new EntitlementBean();
        List<EntitlementBean> expected = List.of(entitlement);

        when(ems3TokenService.fetchAccessToken()).thenReturn("token-1");
        when(ems3Properties.getEntitlementUrl()).thenReturn("https://ems3.test/entitlements");
        when(restTemplate.exchange(
            eq("https://ems3.test/entitlements/user-1"),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(String.class)))
                .thenReturn(ResponseEntity.ok("{\"data\":[]}"));
        when(objectMapper.readValue(anyString(), any(com.fasterxml.jackson.core.type.TypeReference.class)))
            .thenReturn(expected);

        assertEquals(expected, ems3DataFetchService.fetchEntitlementInfo("user-1"));

        ArgumentCaptor<HttpEntity> requestCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).exchange(
            anyString(), any(HttpMethod.class), requestCaptor.capture(), any(Class.class));
        assertEquals("Bearer token-1", requestCaptor.getValue().getHeaders().getFirst("Authorization"));
    }

    @Test
    void fetchEntitlementInfo_whenUserIdIsBlank_shouldReturnEmptyList() {
        when(ems3TokenService.fetchAccessToken()).thenReturn("token-1");

        assertEquals(List.of(), ems3DataFetchService.fetchEntitlementInfo(" "));

        verify(restTemplate, never()).exchange(
            anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class));
    }

    @Test
    void fetchUserList_whenResponseIsSuccessful_shouldReturnUsers() {
        UserEntitlement user = new UserEntitlement();
        List<UserEntitlement> expected = List.of(user);

        when(ems3TokenService.fetchAccessToken()).thenReturn("token-1");
        when(ems3Properties.getUserUrl()).thenReturn("https://ems3.test/users");
        when(restTemplate.exchange(
            eq("https://ems3.test/users"),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(String.class)))
                .thenReturn(ResponseEntity.ok("{\"users\":[]}"));
        when(objectMapper.readValue(anyString(), any(com.fasterxml.jackson.core.type.TypeReference.class)))
            .thenReturn(expected);

        assertEquals(expected, ems3DataFetchService.fetchUserList());
    }

    @Test
    void fetchUserList_whenResponseIsNotSuccessful_shouldThrowException() {
        when(ems3TokenService.fetchAccessToken()).thenReturn("token-1");
        when(ems3Properties.getUserUrl()).thenReturn("https://ems3.test/users");
        when(restTemplate.exchange(
            eq("https://ems3.test/users"),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(String.class)))
                .thenReturn(ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("upstream error"));

        assertThrows(IllegalStateException.class, () -> ems3DataFetchService.fetchUserList());
    }

}
