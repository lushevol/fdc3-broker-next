package com.scb.sso.singleuibff.controller.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.EntraAuthenticationService;
import com.scb.sso.singleuibff.service.v1.SessionService;
import com.scb.sso.singleuibff.service.v1.implementation.MFAAuthenticationService;
import com.scb.sso.singleuibff.service.v1.implementation.OUDAuthenticationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationUnavailableException;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.JwtTokenUtil;
import com.scb.sso.singleuibff.util.OudUtil;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.scb.sso.singleuibff.util.Constant.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class JwtAuthorizationAvailabilityTest {
    @InjectMocks private JwtAuthenticationController controller;
    @Mock private OUDAuthenticationService oudAuthenticationService;
    @Mock private MFAAuthenticationService mfaAuthenticationService;
    @Mock private EntraAuthenticationService entraAuthenticationService;
    @Mock private AuthorizationService authorizationService;
    @Mock private JwtTokenUtil jwtTokenUtil;
    @Mock private OudUtil oudUtil;
    @Mock private HttpSession httpSession;
    @Mock private SessionService sessionService;
    @Mock private AnalyticService analyticService;
    @Mock private ApplicationCategoryService applicationCategoryService;
    @Mock private AdminModuleUtil adminModuleUtil;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private MockMvc mockMvc;
    private final List<Map<String, Object>> categories = List.of(Map.of("id", 1L));

    @BeforeEach
    void setUp() throws Exception {
        ReflectionTestUtils.setField(controller, "objectMapper", objectMapper);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        when(oudAuthenticationService.authenticate(any())).thenAnswer(ignored -> new HashMap<>(Map.of("fullName", "Test User")));
        when(httpSession.getId()).thenReturn("session-1");
        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(
            objectMapper.writeValueAsString(Map.of("sub", "test-user", "oud", "{}", SESSION_ID, "session-1")));
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.of(categories));
        when(adminModuleUtil.getEntityFromApplicationCategory(categories)).thenReturn(List.of("ratan"));
        when(jwtTokenUtil.generateToken(anyString(), any())).thenReturn("new-access-token");
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(anyString(), any())).thenReturn("new-access-token");
        when(jwtTokenUtil.generateReToken(anyString(), any())).thenReturn("new-refresh-token");
    }

    @ParameterizedTest
    @ValueSource(strings = {"v2/sso/login", "v3/sso/login", "v2/sso/validate", "v2/sso/extend", "v2/sso/refreshtoken", "v2/sso/relogin"})
    void unavailableProviderAbortsEveryApiWithoutTokens(String route) throws Exception {
        when(authorizationService.getEntitlements("test-user", List.of("ratan")))
            .thenThrow(new AuthorizationUnavailableException("secret-provider-host and client credential failure"));

        mockMvc.perform(request(route))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.result").value(false))
            .andExpect(jsonPath("$.errorMessage").value("AUTHORIZATION_UNAVAILABLE"))
            .andExpect(header().doesNotExist(HEADER_JWT_TOKEN))
            .andExpect(header().doesNotExist(HEADER_REFRESH_TOKEN))
            .andExpect(jsonPath("$.entitlementsToken").isEmpty());

        assertNoTokenGeneration();
    }

    @ParameterizedTest
    @ValueSource(strings = {"v2/sso/login", "v3/sso/login", "v2/sso/validate", "v2/sso/extend", "v2/sso/refreshtoken", "v2/sso/relogin"})
    void missingGrantListIsUnavailable(String route) throws Exception {
        when(authorizationService.getEntitlements("test-user", List.of("ratan"))).thenReturn(new Ems2Result());

        mockMvc.perform(request(route))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.result").value(false))
            .andExpect(header().doesNotExist(HEADER_JWT_TOKEN))
            .andExpect(header().doesNotExist(HEADER_REFRESH_TOKEN));

        assertNoTokenGeneration();
    }

    @ParameterizedTest
    @ValueSource(strings = {"v2/sso/extend", "v2/sso/refreshtoken"})
    void renewalReadsCurrentServerScopeAndGrantsEachTime(String route) throws Exception {
        Entity entity = new Entity();
        entity.setName("ratan");
        entity.setRoleName("test-role");
        entity.setSubjects(List.of());
        Ems2Result before = grants(List.of(entity));
        Ems2Result after = grants(List.of());
        when(adminModuleUtil.getEntityFromApplicationCategory(categories))
            .thenReturn(List.of("ratan"), List.of("flowzero"));
        when(authorizationService.getEntitlements("test-user", List.of("ratan"))).thenReturn(before);
        when(authorizationService.getEntitlements("test-user", List.of("flowzero"))).thenReturn(after);

        for (int attempt = 0; attempt < 2; attempt++) {
            mockMvc.perform(request(route))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true))
                .andExpect(header().string(route.endsWith("extend") ? HEADER_JWT_TOKEN : HEADER_REFRESH_TOKEN,
                    route.endsWith("extend") ? "Bearer new-access-token" : "Bearer new-refresh-token"));
        }

        verify(applicationCategoryService, times(2)).getDrawers();
        verify(authorizationService).getEntitlements("test-user", List.of("ratan"));
        verify(authorizationService).getEntitlements("test-user", List.of("flowzero"));
        verify(authorizationService, never()).getEntitlements(anyString(), eq(List.of("untrusted-client-entity")));
        verify(jwtTokenUtil, never()).generateEntitlementToken(anyString(), any());
    }

    @ParameterizedTest
    @ValueSource(strings = {"v2/sso/login", "v3/sso/login", "v2/sso/validate", "v2/sso/extend", "v2/sso/refreshtoken", "v2/sso/relogin"})
    void renewalRejectsMissingProviderResult(String route) throws Exception {
        when(authorizationService.getEntitlements(anyString(), any())).thenReturn(null);

        mockMvc.perform(request(route))
            .andExpect(status().isServiceUnavailable())
            .andExpect(header().doesNotExist(HEADER_JWT_TOKEN))
            .andExpect(header().doesNotExist(HEADER_REFRESH_TOKEN));

        assertNoTokenGeneration();
    }

    @ParameterizedTest
    @ValueSource(strings = {"v2/sso/login", "v3/sso/login", "v2/sso/validate", "v2/sso/extend", "v2/sso/refreshtoken", "v2/sso/relogin"})
    void renewalRejectsMissingServerScope(String route) throws Exception {
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.empty());

        mockMvc.perform(request(route))
            .andExpect(status().isServiceUnavailable())
            .andExpect(header().doesNotExist(HEADER_JWT_TOKEN))
            .andExpect(header().doesNotExist(HEADER_REFRESH_TOKEN));

        verify(authorizationService, never()).getEntitlements(any(), any());
        assertNoTokenGeneration();
    }

    @Test
    void renewalKeepsSuccessfulResponseContract() throws Exception {
        when(authorizationService.getEntitlements(anyString(), any())).thenReturn(grants(List.of()));

        String body = mockMvc.perform(request("v2/sso/extend"))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        assertEquals(objectMapper.readTree("{\"entities\":null,\"result\":true,\"expiration\":null,\"userInfo\":null,"
            + "\"errorMessage\":null,\"oud\":null,\"entitlementsToken\":null,\"drawers\":null}"), objectMapper.readTree(body));
    }

    @ParameterizedTest
    @ValueSource(strings = {"v2/sso/validate", "v2/sso/extend", "v2/sso/refreshtoken", "v2/sso/relogin"})
    void failedTokenValidationCannotAuthorizeOrIssueTokens(String route) throws Exception {
        when(jwtTokenUtil.validateToken(anyString())).thenReturn(false);
        when(authorizationService.getEntitlements(anyString(), any())).thenReturn(grants(List.of()));

        mockMvc.perform(request(route))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.result").value(false))
            .andExpect(header().doesNotExist(HEADER_JWT_TOKEN))
            .andExpect(header().doesNotExist(HEADER_REFRESH_TOKEN));

        verifyNoInteractions(authorizationService);
        assertNoTokenGeneration();
    }

    @Test
    void serverScopeFailureHasSanitizedResponse() throws Exception {
        when(applicationCategoryService.getDrawers()).thenThrow(new IllegalStateException("database hostname and SQL error"));

        mockMvc.perform(request("v2/sso/extend"))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.errorMessage").value("AUTHORIZATION_UNAVAILABLE"));

        assertNoTokenGeneration();
    }

    @Test
    void serverMappingFailureHasSanitizedResponse() throws Exception {
        when(adminModuleUtil.getEntityFromApplicationCategory(categories)).thenThrow(new IllegalStateException("private mapping details"));

        mockMvc.perform(request("v2/sso/refreshtoken"))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.errorMessage").value("AUTHORIZATION_UNAVAILABLE"));

        assertNoTokenGeneration();
    }

    private Ems2Result grants(List<Entity> entities) {
        Ems2Result result = new Ems2Result();
        result.setAccountName("test-user");
        result.setStatus("SUCCESS");
        result.setEntities(entities);
        return result;
    }

    private MockHttpServletRequestBuilder request(String route) throws Exception {
        Map<String, Object> body = route.endsWith("login") && !route.endsWith("relogin")
            ? Map.of("username", "test-user", "password", "test-password", "entities", List.of("untrusted-client-entity"))
            : Map.of("singleUIAuthorization", "Bearer current-token", "entities", List.of("untrusted-client-entity"));
        return post("/" + route).header(HEADER_REFRESH_TOKEN, "Bearer current-token")
            .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(body));
    }

    private void assertNoTokenGeneration() {
        verify(jwtTokenUtil, never()).generateToken(anyString(), any());
        verify(jwtTokenUtil, never()).doGenerateTokenWithAuthTime(anyString(), any());
        verify(jwtTokenUtil, never()).generateReToken(anyString(), any());
        verify(jwtTokenUtil, never()).generateEntitlementToken(anyString(), any());
    }
}
