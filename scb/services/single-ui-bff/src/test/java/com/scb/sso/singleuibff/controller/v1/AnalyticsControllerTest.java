package com.scb.sso.singleuibff.controller.v1;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.elastic.Response;
import com.scb.sso.singleuibff.dto.request.RequestOfAnalytics;
import com.scb.sso.singleuibff.dto.request.RequestOfGetAnalytics;
import com.scb.sso.singleuibff.dto.response.ResponseOfAnalytics;
import com.scb.sso.singleuibff.exceptions.JwtException;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.SessionService;
import com.scb.sso.singleuibff.util.JwtTokenUtil;
import com.scb.sso.singleuibff.util.OudUtil;
import lombok.SneakyThrows;
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
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static com.scb.sso.singleuibff.util.Constant.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@TestPropertySource("classpath:application.yml")
@WebMvcTest(AnalyticsController.class)
class AnalyticsControllerTest {

    @Value("${jwt.prv}")
    private String prv;
    @Value("${jwt.pub}")
    private String pub;
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private AnalyticService analyticService;
    @MockBean
    private OudUtil oudUtil;
    @MockBean
    private JwtTokenUtil jwtTokenUtil;
    @MockBean
    private SessionService sessionService;
    @Autowired
    private ObjectMapper objectMapper;

    private final String dataES = "{\n" +
        "  \"took\" : 772,\n" +
        "  \"timed_out\" : false,\n" +
        "  \"_shards\" : {\n" +
        "    \"total\" : 1,\n" +
        "    \"successful\" : 1,\n" +
        "    \"skipped\" : 0,\n" +
        "    \"failed\" : 0\n" +
        "  },\n" +
        "  \"hits\" : {\n" +
        "    \"total\" : {\n" +
        "      \"value\" : 1262,\n" +
        "      \"relation\" : \"eq\"\n" +
        "    },\n" +
        "    \"max_score\" : 1.0,\n" +
        "    \"hits\" : [\n" +
        "      {\n" +
        "        \"_index\" : \"single-ui-bff-analytic\",\n" +
        "        \"_id\" : \"Cc4KPI4BniAhaxAL_y2-\",\n" +
        "        \"_score\" : 1.0,\n" +
        "        \"_source\" : {\n" +
        "          \"userId\" : \"1639796\",\n" +
        "          \"ipAddress\" : \"10.26.35.40\",\n" +
        "          \"singleUIAuthorization\" : null,\n" +
        "          \"key\" : \"button\",\n" +
        "          \"event\" : \"click\",\n" +
        "          \"container\" : \"Base\",\n" +
        "          \"tile\" : \"Login\",\n" +
        "          \"name\" : \"normal login\",\n" +
        "          \"value\" : null,\n" +
        "          \"attribute1\" : null,\n" +
        "          \"attribute2\" : null,\n" +
        "          \"attribute3\" : null,\n" +
        "          \"attribute4\" : null,\n" +
        "          \"attribute5\" : null,\n" +
        "          \"attribute6\" : null,\n" +
        "          \"attribute7\" : null,\n" +
        "          \"attribute8\" : null,\n" +
        "          \"attribute9\" : null,\n" +
        "          \"attribute10\" : null,\n" +
        "          \"attribute11\" : null,\n" +
        "          \"attribute12\" : null,\n" +
        "          \"attribute13\" : null,\n" +
        "          \"attribute14\" : null,\n" +
        "          \"attribute15\" : null,\n" +
        "          \"attribute16\" : null,\n" +
        "          \"attribute17\" : null,\n" +
        "          \"attribute18\" : null,\n" +
        "          \"attribute19\" : null,\n" +
        "          \"attribute20\" : null,\n" +
        "          \"createdAt\" : \"2024-03-14T08:18:57.597+00:00\"\n" +
        "        }\n" +
        "      }\n" +
        "    ]\n" +
        "  }\n" +
        "}\n";

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

    private String doGenerateToken(String subject, Map<String, String> payload, Date expiresAt) throws Exception {
        Algorithm algorithm = getAlgorithm();
        return JWT.create()
            .withIssuer(JWT_ISSUER)
            .withExpiresAt(expiresAt)
            .withSubject(subject)
            .withIssuedAt(new Date())
            .withJWTId("single-ui-bff-id")
            .withPayload(payload)
            .withClaim(USER_LOGIN_TIME_KEY, new Date())
            .withClaim(ABSOLUTE_IDLE, new Date(System.currentTimeMillis() + 60 * 60 * 1000))
            .sign(algorithm);
    }

    private String doGenerateToke2(String subject, Map<String, String> payload, Date expiresAt) throws Exception {
        Algorithm algorithm = getAlgorithm();
        return JWT.create()
            .withIssuer(JWT_ISSUER_ANALYTICS)
            .withExpiresAt(expiresAt)
            .withSubject(subject)
            .withIssuedAt(new Date())
            .withJWTId("single-ui-bff-id")
            .withPayload(payload)
            .withClaim(USER_LOGIN_TIME_KEY, new Date())
            .withClaim(ABSOLUTE_IDLE, new Date(System.currentTimeMillis() + 60 * 60 * 1000))
            .sign(algorithm);
    }

    private String retrieveUserInfoFromToken(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        String payload = decodedJWT.getPayload();
        String userData = new String(Base64.getDecoder().decode(payload), StandardCharsets.UTF_8);
        return userData;
    }

    @SneakyThrows
    @Test
    void testAnalytics() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("userId", "12345");
        userInfoPayload.put("country", "SG");
        userInfoPayload.put("emailId", "emailId@sc.com");
        userInfoPayload.put("fullName", "abc");
        String jwt = doGenerateToken("12345", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);
        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        doNothing().when(jwtTokenUtil).handleIssuerAnalytics(anyString(), anyString(), anyString());
        doNothing().when(sessionService).validateSession(any());

        RequestOfAnalytics request = new RequestOfAnalytics();
        request.setContainer("base");
        request.setTile("home");
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v1/fmo/print")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAnalytics result = objectMapper.readValue(response, ResponseOfAnalytics.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAnalyticsHandleIssuerFail() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("userId", "12345");
        userInfoPayload.put("country", "SG");
        userInfoPayload.put("emailId", "emailId@sc.com");
        userInfoPayload.put("fullName", "abc");
        String jwt = doGenerateToken("12345", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);
        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        doThrow(JwtException.builder().message("invalid token").build()).when(jwtTokenUtil).handleIssuerAnalytics(anyString(), anyString(),
            anyString());

        RequestOfAnalytics request = new RequestOfAnalytics();
        request.setContainer("base");
        request.setTile("home");
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v1/fmo/print")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAnalytics result = objectMapper.readValue(response, ResponseOfAnalytics.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAnalyticsValidateSessionFail() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("userId", "12345");
        userInfoPayload.put("country", "SG");
        userInfoPayload.put("emailId", "emailId@sc.com");
        userInfoPayload.put("fullName", "abc");
        String jwt = doGenerateToken("12345", userInfoPayload, expireAt);
        String userInfo = retrieveUserInfoFromToken(jwt);
        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        doNothing().when(jwtTokenUtil).handleIssuerAnalytics(anyString(), anyString(), anyString());
        doThrow(JwtException.builder().message("invalid token").build()).when(sessionService).validateSession(any());

        RequestOfAnalytics request = new RequestOfAnalytics();
        request.setContainer("base");
        request.setTile("home");
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v1/fmo/print")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAnalytics result = objectMapper.readValue(response, ResponseOfAnalytics.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAnalyticsFail() {
        doThrow(JwtException.builder().message("jwtToken is empty, validation failed.").build()).when(jwtTokenUtil).validateToken(any());
        RequestOfAnalytics request = new RequestOfAnalytics();
        request.setContainer("base");
        request.setTile("home");
        request.setSingleUIAuthorization("Bearer Bearer test");
        String response = mockMvc.perform(post("/v1/fmo/print")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAnalytics result = objectMapper.readValue(response, ResponseOfAnalytics.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testAnalyticsEmpty() {
        RequestOfAnalytics request = new RequestOfAnalytics();
        request.setContainer("base");
        request.setTile("home");
        request.setSingleUIAuthorization("");
        String response = mockMvc.perform(post("/v1/fmo/print")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAnalytics result = objectMapper.readValue(response, ResponseOfAnalytics.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testGetAnalytics() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        HashMap<String, Object> filterObject = new HashMap<>();
        filterObject.put("query", "{\"match_all\": {} }");

        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("userId", "12345");
        userInfoPayload.put("country", "SG");
        userInfoPayload.put("emailId", "emailId@sc.com");
        userInfoPayload.put("fullName", "abc");
        String jwt = doGenerateToke2("12345", userInfoPayload, expireAt);

        String userInfo = retrieveUserInfoFromToken(jwt);
        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        doNothing().when(jwtTokenUtil).handleIssuerAnalytics(anyString(), anyString(), anyString());
        doNothing().when(sessionService).validateSession(any());

        Response responseService = objectMapper.readValue(dataES, Response.class);
        when(analyticService.filterData(anyString())).thenReturn(responseService);

        RequestOfGetAnalytics request = new RequestOfGetAnalytics();
        request.setFilter(filterObject);
        request.setFrom(0);
        request.setSize(10);
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v1/fmo/analytics")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAnalytics result = objectMapper.readValue(response, ResponseOfAnalytics.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testGetAnalyticsNull() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        HashMap<String, Object> filterObject = new HashMap<>();
        filterObject.put("query", "{\"match_all\": {} }");

        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("userId", "12345");
        userInfoPayload.put("country", "SG");
        userInfoPayload.put("emailId", "emailId@sc.com");
        userInfoPayload.put("fullName", "abc");
        String jwt = doGenerateToke2("12345", userInfoPayload, expireAt);

        String userInfo = retrieveUserInfoFromToken(jwt);
        when(jwtTokenUtil.validateToken(anyString())).thenReturn(true);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        doNothing().when(jwtTokenUtil).handleIssuerAnalytics(anyString(), anyString(), anyString());
        doNothing().when(sessionService).validateSession(any());

        when(analyticService.filterData(anyString())).thenReturn(null);

        RequestOfGetAnalytics request = new RequestOfGetAnalytics();
        request.setFilter(filterObject);
        request.setFrom(0);
        request.setSize(10);
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v1/fmo/analytics")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAnalytics result = objectMapper.readValue(response, ResponseOfAnalytics.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testGetAnalyticsFail() {
        Date expireAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000);
        HashMap<String, Object> filterObject = new HashMap<>();
        filterObject.put("query", "{\"match_all\": {} }");

        Map<String, String> userInfoPayload = new HashMap<>();
        userInfoPayload.put("userId", "12345");
        userInfoPayload.put("country", "SG");
        userInfoPayload.put("emailId", "emailId@sc.com");
        userInfoPayload.put("fullName", "abc");
        String jwt = doGenerateToke2("12345", userInfoPayload, expireAt);

        String userInfo = retrieveUserInfoFromToken(jwt);
        when(jwtTokenUtil.validateToken(anyString())).thenReturn(false);
        when(jwtTokenUtil.retrieveUserInfoFromToken(anyString())).thenReturn(userInfo);
        doThrow(JwtException.builder().message("invalid token").build()).when(jwtTokenUtil).handleIssuerAnalytics(anyString(), anyString(),
            anyString());
        doNothing().when(sessionService).validateSession(any());

        RequestOfGetAnalytics request = new RequestOfGetAnalytics();
        request.setFilter(filterObject);
        request.setFrom(0);
        request.setSize(10);
        request.setSingleUIAuthorization("Bearer ".concat(jwt));
        String response = mockMvc.perform(post("/v1/fmo/analytics")
            .content(objectMapper.writeValueAsString(request))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        ResponseOfAnalytics result = objectMapper.readValue(response, ResponseOfAnalytics.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

}
