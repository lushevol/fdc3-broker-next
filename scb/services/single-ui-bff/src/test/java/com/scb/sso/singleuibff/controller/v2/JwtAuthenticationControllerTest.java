package com.scb.sso.singleuibff.controller.v2;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.dto.request.RequestOfJWT;
import com.scb.sso.singleuibff.dto.request.RequestOfRelogin;
import com.scb.sso.singleuibff.dto.response.ResponseOfAuthenticate;
import com.scb.sso.singleuibff.dto.response.ResponseOfError;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.exceptions.JwtException;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.EntraAuthenticationService;
import com.scb.sso.singleuibff.service.v1.SessionService;
import com.scb.sso.singleuibff.service.v1.implementation.MFAAuthenticationService;
import com.scb.sso.singleuibff.service.v1.implementation.OUDAuthenticationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.JwtTokenUtil;
import com.scb.sso.singleuibff.util.OudUtil;
import lombok.SneakyThrows;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;

import static com.scb.sso.singleuibff.util.Constant.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@TestPropertySource("classpath:application.yml")
@WebMvcTest(JwtAuthenticationController.class)
class JwtAuthenticationControllerTest {

    @Value("${jwt.prv}")
    private String prv;
    @Value("${jwt.pub}")
    private String pub;
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private EntraAuthenticationService entraAuthenticationService;
    @MockBean
    private OUDAuthenticationService oudAuthenticationService;
    @MockBean
    private MFAAuthenticationService mfaAuthenticationService;
    @MockBean
    private AuthorizationService authorizationService;
    @MockBean
    private JwtTokenUtil jwtTokenUtil;
    @MockBean
    private OudUtil oudUtil;
    @MockBean
    private AnalyticService analyticService;
    @MockBean
    private SessionService sessionService;
    @MockBean
    private AdminModuleUtil adminModuleUtil;
    @MockBean
    private ApplicationCategoryService applicationCategoryService;
    @Autowired
    private ObjectMapper objectMapper;

    private Algorithm getAlgorithm() throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");

        byte[] encoded = Base64.getMimeDecoder().decode(prv);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);
        RSAPrivateKey rsaPrivateKey = (RSAPrivateKey) keyFactory.generatePrivate(keySpec);

        byte[] encodedForPublicKey = Base64.getMimeDecoder().decode(pub);
        RSAPublicKey rsaPublicKey = (RSAPublicKey) keyFactory.generatePublic(new X509EncodedKeySpec(encodedForPublicKey));
        Algorithm algorithm = Algorithm.RSA512(rsaPublicKey, rsaPrivateKey);
        return algorithm;
    }

    @SneakyThrows
    @Test
    void testAuthenticateV2() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Map<String, String> userInfo = Maps.newHashMap();
        userInfo.put("userId", "12345");
        userInfo.put("country", "SG");
        userInfo.put("emailId", "emailId@sc.com");
        userInfo.put("fullName", "abc");
        doReturn(userInfo).when(oudAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Result = new Ems2Result();
        ems2Result.setEntities(entities);
        ems2Result.setFullName("abc");
        doReturn(ems2Result).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setPassword("pw");
        request.setUsername("un");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testBuildEntitiesV2() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Map<String, String> userInfo = Maps.newHashMap();
        userInfo.put("userId", "12345");
        userInfo.put("country", "SG");
        userInfo.put("emailId", "emailId@sc.com");
        userInfo.put("fullName", "abc");
        doReturn(userInfo).when(oudAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Entity entity = new Entity();
        entity.setId(Long.parseLong("1"));
        entity.setName("SSIPLUS");
        entity.setRoleName("SSI_SUPER_USER");
        Subject subject = new Subject();
        subject.setId(Long.parseLong("1"));
        subject.setName("SEARCH");
        Action action = new Action();
        action.setId(Long.parseLong("1"));
        action.setName("WRITE");
        action.setEntitlementId(Long.parseLong("1"));
        subject.setActions(Lists.newArrayList(action));
        entity.setSubjects(Lists.newArrayList(subject));
        entities.add(entity);
        Ems2Result ems2Resul = new Ems2Result();
        ems2Resul.setEntities(entities);
        ems2Resul.setFullName("abc");
        doReturn(ems2Resul).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setPassword("pw");
        request.setUsername("un");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testBuildEntitiesFilter1() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Map<String, String> userInfo = Maps.newHashMap();
        userInfo.put("userId", "12345");
        userInfo.put("country", "SG");
        userInfo.put("emailId", "emailId@sc.com");
        userInfo.put("fullName", "abc");
        doReturn(userInfo).when(oudAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Entity entity = new Entity();
        entity.setId(Long.parseLong("1"));
        entity.setName("CDUPS");
        entity.setRoleName("SSI_SUPER_USER");
        Subject subject = new Subject();
        subject.setId(Long.parseLong("1"));
        subject.setName("SEARCH");
        Action action = new Action();
        action.setId(Long.parseLong("1"));
        action.setName("WRITE");
        action.setEntitlementId(Long.parseLong("1"));
        subject.setActions(Lists.newArrayList(action));
        entity.setSubjects(Lists.newArrayList(subject));
        entities.add(entity);
        Ems2Result ems2Resul = new Ems2Result();
        ems2Resul.setEntities(entities);
        ems2Resul.setFullName("abc");
        doReturn(ems2Resul).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setPassword("pw");
        request.setUsername("un");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testBuildEntitiesFilter2() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Map<String, String> userInfo = Maps.newHashMap();
        userInfo.put("userId", "12345");
        userInfo.put("country", "SG");
        userInfo.put("emailId", "emailId@sc.com");
        userInfo.put("fullName", "abc");
        doReturn(userInfo).when(oudAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Entity entity = new Entity();
        entity.setId(Long.parseLong("1"));
        entity.setName("FSS_PAYMENTS_SERVICES_TH");
        entity.setRoleName("SSI_SUPER_USER");
        Subject subject = new Subject();
        subject.setId(Long.parseLong("1"));
        subject.setName("SEARCH");
        Action action = new Action();
        action.setId(Long.parseLong("1"));
        action.setName("WRITE");
        action.setEntitlementId(Long.parseLong("1"));
        subject.setActions(Lists.newArrayList(action));
        entity.setSubjects(Lists.newArrayList(subject));
        entities.add(entity);
        Ems2Result ems2Resul = new Ems2Result();
        ems2Resul.setEntities(entities);
        ems2Resul.setFullName("abc");
        doReturn(ems2Resul).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setPassword("pw");
        request.setUsername("un");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testBuildEntitiesV2NoFullName() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Map<String, String> userInfo = Maps.newHashMap();
        userInfo.put("userId", "12345");
        userInfo.put("country", "SG");
        userInfo.put("emailId", "emailId@sc.com");
        userInfo.put("fullName", "abc");
        doReturn(userInfo).when(oudAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Entity entity = new Entity();
        entity.setId(Long.parseLong("1"));
        entity.setName("SSIPLUS");
        entity.setRoleName("SSI_SUPER_USER");
        Subject subject = new Subject();
        subject.setId(Long.parseLong("1"));
        subject.setName("SEARCH");
        Action action = new Action();
        action.setId(Long.parseLong("1"));
        action.setName("WRITE");
        action.setEntitlementId(Long.parseLong("1"));
        subject.setActions(Lists.newArrayList(action));
        entity.setSubjects(Lists.newArrayList(subject));
        entities.add(entity);
        Ems2Result ems2Resul = new Ems2Result();
        ems2Resul.setEntities(entities);
        ems2Resul.setFullName("abc");
        doReturn(ems2Resul).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setPassword("pw");
        request.setUsername("un");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAuthenticateV2Fail() {
        String errorMessage = "Invalid username and password combination.";
        doThrow(AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build())
            .when(oudAuthenticationService).authenticate(any());
        try {
            RequestOfAuthenticate request = new RequestOfAuthenticate();
            request.setPassword("pw");
            request.setUsername("un");
            String response = mockMvc.perform(post("/v2/sso/login")
                .content(objectMapper.writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
            ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        } catch (Exception e) {
            assertEquals("Request processing failed: java.lang.RuntimeException: Fail", e.getMessage());
        }
    }

    @SneakyThrows
    @Test
    void testAuthenticateV2Fail2() {
        String response = mockMvc.perform(post("/v2/sso/login")
            .content("{\"username\":\"2001208\",}")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfError result = objectMapper.readValue(response, ResponseOfError.class);
        assertEquals(result.getMessage(), "Invalid request.");
    }

    @SneakyThrows
    @Test
    void testAuthenticateV2Fail3() {
        String response = mockMvc.perform(get("/v2/sso/login"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfError result = objectMapper.readValue(response, ResponseOfError.class);
        assertEquals(result.getMessage(), "Invalid request.");
    }

    @SneakyThrows
    @Test
    void testAuthenticateV2Exception() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        String errorMessage = "Request processing failed.";
        Map<String, String> userInfo = Maps.newHashMap();
        userInfo.put("userId", "12345");
        userInfo.put("country", "SG");
        userInfo.put("emailId", "emailId@sc.com");
        userInfo.put("fullName", "abc");
        doReturn(userInfo).when(oudAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Result = new Ems2Result();
        ems2Result.setEntities(entities);
        ems2Result.setFullName("abc");
        doReturn(ems2Result).when(authorizationService).getEntitlements(any(), any());
        doThrow(JwtException.builder().code(OUD_RELATED_CODE).message(errorMessage).build())
            .when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setPassword("pw");
        request.setUsername("un");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAuthenticateWithSSOV2() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        HashMap<String, String> payloadMFA = Maps.newHashMap();
        payloadMFA.put("userId", "userId");
        payloadMFA.put("lastName", "lastName");
        payloadMFA.put("firstName", "firstName");
        payloadMFA.put("fullName", null);
        payloadMFA.put("emailId", "emailId");
        payloadMFA.put("country", "country");
        doReturn(Maps.newHashMap()).when(mfaAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Resul = new Ems2Result();
        ems2Resul.setEntities(entities);
        ems2Resul.setFullName("abc");
        doReturn(ems2Resul).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setCode("9Pxb-f-xAAJX9AKsSoJ1tmrghhw");
        request.setClientId("51358ratan");
        request.setIss("https://sitigmfa.hk.standardchartered.com:8443/openam/oauth2/realms/root/realms/sso");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckValidityV2() {
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer test");
        doNothing().when(jwtTokenUtil).handleIssuer(anyString(), anyString());
        doNothing().when(sessionService).validateSession(any());

        String response = mockMvc.perform(post("/v2/sso/validate")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testValidateInValidSession() {
        doThrow(JwtException.builder().message("jwtToken is empty, validation failed.").build()).when(oudAuthenticationService)
            .authenticate(any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setPassword("pw");
        request.setUsername("un");
        doThrow(JwtException.builder().message("invalid token").build()).when(sessionService).validateSession(any());
        String response = mockMvc.perform(post("/v2/sso/validate")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckValidityTokenEmptyV2() {
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("");
        String response = mockMvc.perform(post("/v2/sso/validate")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckValidityTokenWrongV2() {
        doThrow(JwtException.builder().message("jwtToken is empty, validation failed.").build()).when(jwtTokenUtil).validateToken(any());
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer Bearer test");
        String response = mockMvc.perform(post("/v2/sso/validate")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckExtend() {
        Date expected = new Date();
        doReturn(false).when(jwtTokenUtil).validateToken(any());
        doReturn(expected).when(jwtTokenUtil).getExpirationDate(any());
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer test");
        String response = mockMvc.perform(post("/v2/sso/extend")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckExtendTokenEmpty() {
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("");
        String response = mockMvc.perform(post("/v2/sso/extend")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckExtendTokenWrong() {
        doThrow(JwtException.builder().message("jwtToken is empty, validation failed.").build()).when(jwtTokenUtil).validateToken(any());
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer Bearer test");
        String response = mockMvc.perform(post("/v2/sso/extend")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckRefreshToken() {
        Date expected = new Date();
        doReturn(false).when(jwtTokenUtil).validateToken(any());
        doReturn(expected).when(jwtTokenUtil).getExpirationDate(any());
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer test");
        String response = mockMvc.perform(post("/v2/sso/refreshtoken")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckRefreshTokenEmpty() {
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("");
        String response = mockMvc.perform(post("/v2/sso/refreshtoken")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckRefreshTokenWrong() {
        doThrow(JwtException.builder().message("jwtToken is empty, validation failed.").build()).when(jwtTokenUtil).validateToken(any());
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer Bearer test");
        String response = mockMvc.perform(post("/v2/sso/refreshtoken")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckRefreshtoken() {
        Date expected = new Date();
        doReturn(false).when(jwtTokenUtil).validateToken(any());
        doReturn(expected).when(jwtTokenUtil).getExpirationDate(any());
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer test");
        String response = mockMvc.perform(post("/v2/sso/refreshtoken")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckReLoginEmpty() {
        RequestOfRelogin requestOfRelogin = new RequestOfRelogin();
        requestOfRelogin.setEntities(new ArrayList<String>());
        String response = mockMvc.perform(post("/v2/sso/relogin")
            .content(objectMapper.writeValueAsString(requestOfRelogin))
            .header("Single-UI-Refresh", "", "[]")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckReLoginWrong() {
        RequestOfRelogin requestOfRelogin = new RequestOfRelogin();
        requestOfRelogin.setEntities(new ArrayList<String>());
        doThrow(JwtException.builder().message("jwtToken is empty, validation failed.").build()).when(jwtTokenUtil).validateToken(any());
        String response = mockMvc.perform(post("/v2/sso/relogin")
            .content(objectMapper.writeValueAsString(requestOfRelogin))
            .header("Single-UI-Refresh", "Bearer Bearer test")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    private String doGenerateToken(String subject, Map<String, String> payload, Date expiresAt) throws Exception {
        Algorithm algorithm = getAlgorithm();
        return JWT.create()
            .withIssuer(JWT_ISSUER)
            .withExpiresAt(expiresAt)
            .withSubject(subject)
            .withIssuedAt(new Date())
            .withJWTId(JWT_ID)
            .withPayload(payload)
            .withClaim(USER_LOGIN_TIME_KEY, new Date())
            .withClaim(ABSOLUTE_IDLE, new Date(System.currentTimeMillis() + 60 * 60 * 1000))
            .sign(algorithm);
    }

    public String retrieveUserInfoFromToken(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        String payload = decodedJWT.getPayload();
        String userData = new String(Base64.getDecoder().decode(payload), StandardCharsets.UTF_8);
        return userData;
    }

    @SneakyThrows
    @Test
    void testCheckExtendSuccess() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        when(jwtTokenUtil.generateToken(anyString(), any())).thenReturn(jwt);
        when(jwtTokenUtil.getExpirationDate(anyString())).thenReturn(expireAt);
        doNothing().when(jwtTokenUtil).handleIssuer(anyString(), eq(JWT_ISSUER));

        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/extend")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
        assertEquals(expireAt, result.getExpiration());
    }

    @SneakyThrows
    @Test
    void testCheckExtendSuccessExpirationDateAfterMaxAge() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        Date maxAge = new Date(System.currentTimeMillis() + 10 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        when(jwtTokenUtil.generateToken(anyString(), any())).thenReturn(jwt);
        when(jwtTokenUtil.getExpirationDate(anyString())).thenReturn(expireAt);
        when(jwtTokenUtil.getMaxAge(anyString())).thenReturn(maxAge);
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(anyString(), any())).thenReturn(jwt);
        doNothing().when(jwtTokenUtil).handleIssuer(anyString(), eq(JWT_ISSUER));

        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/extend")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
        assertEquals(expireAt, result.getExpiration());
    }

    @SneakyThrows
    @Test
    void testCheckExtendSuccessExpirationDateBeforeMaxAge() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        Date maxAge = new Date(System.currentTimeMillis() + 30 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        when(jwtTokenUtil.generateToken(anyString(), any())).thenReturn(jwt);
        when(jwtTokenUtil.getExpirationDate(anyString())).thenReturn(expireAt);
        when(jwtTokenUtil.getMaxAge(anyString())).thenReturn(maxAge);
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(anyString(), any())).thenReturn(jwt);
        doNothing().when(jwtTokenUtil).handleIssuer(anyString(), eq(JWT_ISSUER));

        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/extend")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
        assertEquals(expireAt, result.getExpiration());
    }

    @SneakyThrows
    @Test
    void testCheckValidateSuccess() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Date expireAt = new Date(System.currentTimeMillis() + 2 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Result = new Ems2Result();
        ems2Result.setEntities(entities);
        when(authorizationService.getEntitlements(any(), any())).thenReturn(ems2Result);
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(anyString(), any())).thenReturn(jwt);
        doNothing().when(jwtTokenUtil).handleIssuer(anyString(), eq(JWT_ISSUER));
        when(jwtTokenUtil.getExpirationDate(anyString())).thenReturn(expireAt);
        doNothing().when(sessionService).validateSession(any());

        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/validate")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
        assertEquals(expireAt, result.getExpiration());
    }

    @SneakyThrows
    @Test
    void testCheckValidateIssuerFail() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Date expireAt = new Date(System.currentTimeMillis() + 2 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Result = new Ems2Result();
        ems2Result.setEntities(entities);
        when(authorizationService.getEntitlements(any(), any())).thenReturn(ems2Result);
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(anyString(), any())).thenReturn(jwt);
        doThrow(JwtException.builder().message("invalid token").build()).when(jwtTokenUtil).handleIssuer(anyString(), anyString());

        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/validate")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckRefreshTokenFail() {
        Date expireAt = new Date(System.currentTimeMillis() + 35 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        when(jwtTokenUtil.generateToken(anyString(), any())).thenReturn(jwt);
        when(jwtTokenUtil.getExpirationDate(anyString())).thenReturn(expireAt);
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/refreshtoken")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckRefreshTokenSuccess() {
        Date expireAt = new Date(System.currentTimeMillis() + 25 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        when(jwtTokenUtil.generateToken(anyString(), any())).thenReturn(jwt);
        when(jwtTokenUtil.getExpirationDate(anyString())).thenReturn(expireAt);
        when(jwtTokenUtil.generateReToken(anyString(), any())).thenReturn(jwt);
        doNothing().when(jwtTokenUtil).handleIssuer(anyString(), eq(JWT_ISSUER));
        doNothing().when(sessionService).validateSession(any());

        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/refreshtoken")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
        assertEquals(expireAt, result.getExpiration());
    }

    @SneakyThrows
    @Test
    void testCheckRefreshTokenFailed() {
        Date expireAt = new Date(System.currentTimeMillis() + 25 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        when(jwtTokenUtil.generateToken(anyString(), any())).thenReturn(jwt);
        when(jwtTokenUtil.getExpirationDate(anyString())).thenReturn(expireAt);
        when(jwtTokenUtil.generateReToken(anyString(), any())).thenReturn(jwt);
        doThrow(JwtException.builder().message("invalid token").build()).when(sessionService).validateSession(any());

        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/refreshtoken")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckReLoginV2Success() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Date expireAt = new Date(System.currentTimeMillis() + 2 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Result = new Ems2Result();
        ems2Result.setEntities(entities);
        when(authorizationService.getEntitlements(any(), any())).thenReturn(ems2Result);
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(anyString(), any())).thenReturn(jwt);
        doNothing().when(jwtTokenUtil).handleIssuer(anyString(), eq(JWT_ISSUER));
        doNothing().when(sessionService).validateSession(any());
        RequestOfRelogin requestOfRelogin = new RequestOfRelogin();
        requestOfRelogin.setEntities(new ArrayList<String>());
        String response = mockMvc.perform(post("/v2/sso/relogin")
            .content(objectMapper.writeValueAsString(requestOfRelogin))
            .header("Single-UI-Refresh", "Bearer ".concat(jwt))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCheckReLoginV2IssuerFail() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Date expireAt = new Date(System.currentTimeMillis() + 2 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Result = new Ems2Result();
        ems2Result.setEntities(entities);
        when(authorizationService.getEntitlements(any(), any())).thenReturn(ems2Result);
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(anyString(), any())).thenReturn(jwt);
        doThrow(JwtException.builder().message("invalid token").build()).when(jwtTokenUtil).handleIssuer(anyString(), anyString());
        RequestOfRelogin requestOfRelogin = new RequestOfRelogin();
        requestOfRelogin.setEntities(new ArrayList<String>());
        String response = mockMvc.perform(post("/v2/sso/relogin")
            .content(objectMapper.writeValueAsString(requestOfRelogin))
            .header("Single-UI-Refresh", "Bearer ".concat(jwt))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testReloginInValidSession() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Date expireAt = new Date(System.currentTimeMillis() + 2 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);

        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Result = new Ems2Result();
        ems2Result.setEntities(entities);
        when(authorizationService.getEntitlements(any(), any())).thenReturn(ems2Result);
        when(jwtTokenUtil.doGenerateTokenWithAuthTime(anyString(), any())).thenReturn(jwt);
        doThrow(JwtException.builder().message("invalid token").build()).when(sessionService).validateSession(any());
        RequestOfRelogin requestOfRelogin = new RequestOfRelogin();
        requestOfRelogin.setEntities(new ArrayList<String>());
        String response = mockMvc.perform(post("/v2/sso/relogin")
            .content(objectMapper.writeValueAsString(requestOfRelogin))
            .header("Single-UI-Refresh", "Bearer ".concat(jwt))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testLogout() {
        Date expireAt = new Date(System.currentTimeMillis() + 2 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/logout")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testLogoutException() {
        String errorMessage = "Request processing failed.";
        Date expireAt = new Date(System.currentTimeMillis() + 2 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("entitlements", "");
        String jwt = doGenerateToken("userId", userInfoPayload, expireAt);
        doThrow(JwtException.builder().code(OUD_RELATED_CODE).message(errorMessage).build())
            .when(jwtTokenUtil).retrieveUserInfoFromToken(anyString());
        RequestOfJWT request = new RequestOfJWT();
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v2/sso/logout")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAuthenticateV2GetEntitlementsError() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        Map<String, String> userInfo = Maps.newHashMap();
        userInfo.put("userId", "12345");
        userInfo.put("country", "SG");
        userInfo.put("emailId", "emailId@sc.com");
        userInfo.put("fullName", "abc");
        doReturn(userInfo).when(oudAuthenticationService).authenticate(any());
        String errorMessage = "Invalid username and password combination.";
        doThrow(AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build())
            .when(authorizationService).getEntitlements(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setPassword("pw");
        request.setUsername("un");
        mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();

    }

    @SneakyThrows
    @Test
    void testAuthenticateWithCode() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        HashMap<String, String> payloadMFA = Maps.newHashMap();
        payloadMFA.put("userId", "userId");
        payloadMFA.put("lastName", "lastName");
        payloadMFA.put("firstName", "firstName");
        payloadMFA.put("fullName", null);
        payloadMFA.put("emailId", "emailId");
        payloadMFA.put("country", "country");
        doReturn(Maps.newHashMap()).when(mfaAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Resul = new Ems2Result();
        ems2Resul.setEntities(entities);
        ems2Resul.setFullName("abc");
        doReturn(ems2Resul).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setCode("9Pxb-f-xAAJX9AKsSoJ1tmrghhw");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAuthenticateWithCodeAndIss() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        HashMap<String, String> payloadMFA = Maps.newHashMap();
        payloadMFA.put("userId", "userId");
        payloadMFA.put("lastName", "lastName");
        payloadMFA.put("firstName", "firstName");
        payloadMFA.put("fullName", null);
        payloadMFA.put("emailId", "emailId");
        payloadMFA.put("country", "country");
        doReturn(Maps.newHashMap()).when(mfaAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Resul = new Ems2Result();
        ems2Resul.setEntities(entities);
        ems2Resul.setFullName("abc");
        doReturn(ems2Resul).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setCode("9Pxb-f-xAAJX9AKsSoJ1tmrghhw");
        request.setIss("https://sitigmfa.hk.standardchartered.com:8443/openam/oauth2/realms/root/realms/sso");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAuthenticateWithCodeAndClientId() {
        List<Map<String, Object>> applicationCategories = new ArrayList<>();
        when(applicationCategoryService.getDrawers()).thenReturn(Optional.ofNullable(applicationCategories));
        List<String> ems2Entities = new ArrayList<>();
        ems2Entities.add("abc");
        doReturn(ems2Entities).when(adminModuleUtil).getEntityFromApplicationCategory(any());
        List<Map<String, Object>> drawers = new ArrayList<>();
        Map<String, Object> drawer = new HashMap<>();
        drawer.put("id", 123);
        drawers.add(drawer);
        doReturn(drawers).when(adminModuleUtil).getDrawer(any(), any());
        HashMap<String, String> payloadMFA = Maps.newHashMap();
        payloadMFA.put("userId", "userId");
        payloadMFA.put("lastName", "lastName");
        payloadMFA.put("firstName", "firstName");
        payloadMFA.put("fullName", null);
        payloadMFA.put("emailId", "emailId");
        payloadMFA.put("country", "country");
        doReturn(Maps.newHashMap()).when(mfaAuthenticationService).authenticate(any());
        List<Entity> entities = new ArrayList<>();
        Ems2Result ems2Resul = new Ems2Result();
        ems2Resul.setEntities(entities);
        ems2Resul.setFullName("abc");
        doReturn(ems2Resul).when(authorizationService).getEntitlements(any(), any());
        doReturn("").when(jwtTokenUtil).doGenerateTokenWithAuthTime(any(), any());
        RequestOfAuthenticate request = new RequestOfAuthenticate();
        request.setCode("9Pxb-f-xAAJX9AKsSoJ1tmrghhw");
        request.setClientId("51358ratan");
        String response = mockMvc.perform(post("/v2/sso/login")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAuthenticate result = objectMapper.readValue(response, ResponseOfAuthenticate.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

}
