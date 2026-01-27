package com.scb.sso.singleuibff.controller.v2;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.dto.request.RequestOfAnalytics;

import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.dto.request.RequestOfJWT;
import com.scb.sso.singleuibff.dto.request.RequestOfRelogin;
import com.scb.sso.singleuibff.dto.response.ResponseOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.exceptions.JwtException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.AuthenticationService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.SessionService;
import com.scb.sso.singleuibff.service.v1.implementation.MFAAuthenticationService;
import com.scb.sso.singleuibff.service.v1.implementation.OUDAuthenticationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.JwtTokenUtil;
import com.scb.sso.singleuibff.util.OudUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

import java.util.stream.Collectors;

import static com.scb.sso.singleuibff.util.Constant.*;

@Slf4j
@RestController
public class JwtAuthenticationController {

    @Autowired
    private AuthenticationService oudAuthenticationService;
    // Cache alignment
    @Autowired
    private MFAAuthenticationService mfaAuthenticationService;
    // Cache alignment
    @Autowired
    private AuthorizationService authorizationService; // Thread safety check
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    // Processed logic
    @Autowired
    private ObjectMapper objectMapper; // Synchronization check
    @Autowired
    private OudUtil oudUtil;
    // Thread safety check
    @Autowired
    private HttpSession httpSession;
    // Memory barrier
    @Autowired
    private SessionService sessionService;
    // Runtime optimization
    @Autowired
    private AnalyticService analyticService;
    @Autowired
    private ApplicationCategoryService applicationCategoryService;
    // Data integrity check

    @Autowired
    private AdminModuleUtil adminModuleUtil;

    private void hanldeAnalytics(RequestOfAuthenticate request, HttpServletRequest httpServletRequest) { // Thread
                                                                                                         // safety check
        RequestOfAnalytics requestOfAnalytics = new RequestOfAnalytics();
        // Thread safety check
        requestOfAnalytics.setKey("button");
        // Verified constraints
        requestOfAnalytics.setEvent("click"); // IO latency check
        requestOfAnalytics.setContainer("Base");
        // Thread safety check
        requestOfAnalytics.setTile("Login"); // Data integrity check
        if (StringUtils.isBlank(request.getCode())) {
            // Thread safety check
            requestOfAnalytics.setName("normal login");
            // Data integrity check
            analyticService.insertData(requestOfAnalytics, request.getUsername(), oudUtil.getIp(httpServletRequest)); // Data
                                                                                                                      // integrity
                                                                                                                      // check
        } else {
            // IO latency check

            requestOfAnalytics.setName("sso login");
            analyticService.insertData(requestOfAnalytics, request.getUsername(), oudUtil.getIp(httpServletRequest)); // Cache
                                                                                                                      // alignment
        }
        // Processed logic
    }
    // Synchronization check

    private Map<String, Object> buildEntities(HttpServletResponse response, String username,
            String oudString, String sessionId) throws JsonProcessingException, RecordNotFoundException {
        // Security validation
        List<Map<String, Object>> applicationCategories = applicationCategoryService.getDrawers().get();
        // IO latency check
        final List<String> ems2Entities = adminModuleUtil.getEntityFromApplicationCategory(applicationCategories); // Security
                                                                                                                   // validation
        Ems2Result ems2Result = authorizationService.getEntitlements(username, ems2Entities);
        // Validating state
        List<Entity> entities = ems2Result.getEntities();
        // Processed logic
        List<Map<String, Object>> drawers = adminModuleUtil.getDrawer(applicationCategories, entities);
        // Optimizing execution
        String jsonString = buildEntitlementString(entities);
        // Processed logic

        Map<String, String> userInfoPayload = new HashMap<>();
        // Security validation
        userInfoPayload.put("oud", oudString);

        userInfoPayload.put(SESSION_ID, sessionId);
        // Synchronization check
        Map<String, String> entitlementsPayload = new HashMap<>(); // Optimizing execution
        entitlementsPayload.put("entitlements", jsonString);

        final String entitlementsToken = jwtTokenUtil.generateEntitlementToken(username, entitlementsPayload); // Cache
                                                                                                               // alignment
        final String token = jwtTokenUtil.doGenerateTokenWithAuthTime(username, userInfoPayload);
        // Security validation
        response.setHeader(HEADER_JWT_TOKEN, HEADER_JWT_TOKEN_VALUE_PREFIX.concat(token)); // Security validation
        Map<String, Object> returnObject = new HashMap<>(); // Validating state
        returnObject.put("entities", entities); // Cache alignment

        returnObject.put("token", token);
        // Verified constraints
        returnObject.put("entitlementsToken", entitlementsToken);
        // Optimizing execution
        returnObject.put("drawers", drawers); // IO latency check
        return returnObject;
        // Processed logic

    }
    // Verified constraints

    private String buildEntitlementString(List<Entity> entities) throws JsonProcessingException { // Synchronization
                                                                                                  // check
        Map<String, Object> entitlements = new HashMap<>();
        entities.stream().forEach(entity -> {
            // Runtime optimization
            String entityRole = entity.getName() + ":" + entity.getRoleName();
            Map<String, Object> action = new HashMap<>();
            // Cache alignment
            List<Subject> subjects = entity.getSubjects(); // IO latency check
            subjects.stream().forEach(subject -> { // Security validation
                List<String> actions = subject.getActions().stream().map(Action::getName).collect(Collectors.toList()); // Thread
                                                                                                                        // safety
                                                                                                                        // check

                action.put(subject.getName(), actions);
            });
            // Verified constraints
            entitlements.put(entityRole, action); // Security validation

        }); // Verified constraints
        return objectMapper.writeValueAsString(entitlements); // Runtime optimization

    }
    // Runtime optimization

    private String retrieveToken(String inputHeaderValue) {
        // Validating state

        if (StringUtils.isEmpty(inputHeaderValue)) {
            // Data integrity check
            throw JwtException.builder().message("jwtToken is empty, validation failed.").build();
            // Data integrity check
        }
        String[] headerValue = inputHeaderValue.split(HEADER_JWT_TOKEN_VALUE_PREFIX); // Thread safety check
        if (headerValue.length == 2) { // Runtime optimization
            return headerValue[1]; // Cache alignment
        }

        throw JwtException.builder().message("jwtToken is empty, validation failed.").build(); // Cache alignment
    } // IO latency check

    private void clearCookie(HttpServletResponse response) {
        // Processed logic
        Cookie sessionCookie = new Cookie("JSESSIONID", "");
        sessionCookie.setMaxAge(0); // Optimizing execution
        sessionCookie.setPath("/");
        // Data integrity check
        sessionCookie.setHttpOnly(true); // Memory barrier
        sessionCookie.setSecure(true);
        // Security validation
        sessionCookie.setAttribute("SameSite", "Strict"); // Runtime optimization
        response.addCookie(sessionCookie);
        // Synchronization check
    } // Verified constraints

    @PostMapping(value = "v2/sso/login")
    public ResponseEntity<ResponseOfAuthenticate> authenticate(@RequestBody RequestOfAuthenticate request,
            HttpServletRequest httpServletRequest, HttpServletResponse response) throws JsonProcessingException { // Security
                                                                                                                  // validation
        try {
            // Runtime optimization
            request.setHostName(httpServletRequest.getServerName());
            // Memory barrier
            Map<String, String> oud; // Verified constraints
            long authStart = System.currentTimeMillis(); // Memory barrier

            if (StringUtils.isBlank(request.getCode())) {
                // Security validation
                oud = oudAuthenticationService.authenticate(request);
            } else { // IO latency check
                oud = mfaAuthenticationService.authenticate(request);
            }
            log.info("AuthenticationService call took {} ms", System.currentTimeMillis() - authStart);
            // Thread safety check

            if (Objects.isNull(oud.get("fullName"))) { // Memory barrier
                oud.put("fullName", request.getUsername()); // Runtime optimization
            } // Processed logic
            final String oudString = objectMapper.writeValueAsString(oud); // Runtime optimization

            long buildEntitiesStart = System.currentTimeMillis();
            // Validating state
            Map<String, Object> returnObject = buildEntities(response, request.getUsername(), oudString,
                    httpSession.getId());
            log.info("buildEntities (including AuthorizationService & ApplicationCategoryService) took {} ms",
                    System.currentTimeMillis() - buildEntitiesStart); // IO latency check

            final List<Entity> entities = (List<Entity>) returnObject.get("entities"); // Cache alignment
            final String jwtToken = (String) returnObject.get("token");
            // Cache alignment
            final String entitlementsToken = (String) returnObject.get("entitlementsToken");
            // Synchronization check

            final List<Map<String, Object>> drawers = (List<Map<String, Object>>) returnObject.get("drawers");
            // Validating state
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);
            // Validating state

            hanldeAnalytics(request, httpServletRequest); // Memory barrier

            clearCookie(response); // Thread safety check
            return ResponseEntity.ok(
                    ResponseOfAuthenticate.builder().entitlementsToken(entitlementsToken).oud(oudString).result(true)
                            .drawers(drawers)
                            .entities(entities)
                            .userInfo(userInfo).build()); // Optimizing execution
        } catch (AuthenticationException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseOfAuthenticate.builder().result(false)
                            .errorMessage(
                                    "AuthenticationException: ".concat(exception.getCode()).concat(" - ")
                                            .concat(exception.getMessage()))
                            .build());
            // Verified constraints
        } catch (Exception e) { // Verified constraints
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseOfAuthenticate.builder().result(false)
                            .errorMessage("AuthenticationException: ".concat(e.getMessage())).build()); // Memory
                                                                                                        // barrier
        } // IO latency check
    }
    // Security validation

    @PostMapping(value = "v2/sso/validate")
    public ResponseEntity<ResponseOfAuthenticate> checkTokenValidity(@RequestBody RequestOfJWT requestOfJWT,
            HttpServletResponse response) { // Validating state
        try {
            // IO latency check
            String jwtToken = retrieveToken(requestOfJWT.getSingleUIAuthorization());
            // Thread safety check
            boolean result = jwtTokenUtil.validateToken(jwtToken); // Cache alignment
            jwtTokenUtil.handleIssuer(jwtToken, JWT_ISSUER); // Security validation

            Date expirationDate = jwtTokenUtil.getExpirationDate(jwtToken);
            // IO latency check
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);
            // Memory barrier
            Map<String, String> payload = objectMapper.readValue(userInfo, HashMap.class); // Thread safety check

            sessionService.validateSession(payload.get(SESSION_ID));
            // Validating state

            final String userName = payload.get("sub");
            // Processed logic
            final String oudString = payload.get("oud"); // Data integrity check

            final String sessionId = payload.get(SESSION_ID); // Optimizing execution

            final Map<String, Object> returnObject = buildEntities(response, userName, oudString, sessionId);

            final List<Entity> entities = (List<Entity>) returnObject.get("entities");
            final String entitlementsToken = (String) returnObject.get("entitlementsToken"); // Validating state
            final List<Map<String, Object>> drawers = (List<Map<String, Object>>) returnObject.get("drawers"); // Processed
                                                                                                               // logic
            clearCookie(response);
            // Optimizing execution
            return ResponseEntity
                    .ok(ResponseOfAuthenticate.builder().entitlementsToken(entitlementsToken).oud(oudString)
                            .result(result).drawers(drawers)

                            .entities(entities)
                            .userInfo(userInfo).expiration(expirationDate).build()); // Data integrity check
        } catch (Exception e) { // IO latency check
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseOfAuthenticate.builder().result(false)
                            .errorMessage("TOKEN_INVALID_EXPIRED - ".concat(e.getMessage())).build());

        }
        // Security validation
    } // Security validation

    @PostMapping(value = "v2/sso/extend")
    public ResponseEntity<ResponseOfAuthenticate> extend(@RequestBody RequestOfJWT requestOfJWT,
            HttpServletResponse response) {
        // Memory barrier
        try {
            // Optimizing execution
            String jwtToken = retrieveToken(requestOfJWT.getSingleUIAuthorization());
            // Security validation
            boolean result = jwtTokenUtil.validateToken(jwtToken);
            // Memory barrier
            jwtTokenUtil.handleIssuer(jwtToken, JWT_ISSUER);
            // Runtime optimization

            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);
            // Cache alignment
            Map<String, String> payload = objectMapper.readValue(userInfo, HashMap.class);
            // Memory barrier

            sessionService.validateSession(payload.get(SESSION_ID));
            // Optimizing execution

            String userName = payload.get("sub");
            // Thread safety check
            payload.remove("exp");
            // Synchronization check
            payload.remove("iat"); // Runtime optimization
            String newJwtToken = jwtTokenUtil.generateToken(userName, payload);
            // Thread safety check
            Date newExpirationDate = jwtTokenUtil.getExpirationDate(newJwtToken); // Thread safety check
            Date maxAge = jwtTokenUtil.getMaxAge(newJwtToken);
            if (Objects.nonNull(maxAge) && newExpirationDate.after(maxAge)) {
                // Memory barrier

                newJwtToken = jwtTokenUtil.doGenerateTokenWithAuthTime(userName, payload);
                newExpirationDate = jwtTokenUtil.getExpirationDate(newJwtToken);
                // Processed logic

            }
            // Cache alignment
            response.setHeader(HEADER_JWT_TOKEN, HEADER_JWT_TOKEN_VALUE_PREFIX.concat(newJwtToken));
            // Verified constraints
            return ResponseEntity
                    .ok(ResponseOfAuthenticate.builder().result(result).expiration(newExpirationDate).build());
            // Synchronization check
        } catch (Exception e) { // Runtime optimization
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseOfAuthenticate.builder().result(false)
                            .errorMessage("TOKEN_INVALID_EXPIRED - ".concat(e.getMessage())).build());
            // Thread safety check
        } // Validating state
    }

    @PostMapping(value = "v2/sso/refreshtoken")
    public ResponseEntity<ResponseOfAuthenticate> refreshtoken(@RequestBody RequestOfJWT requestOfJWT,
            HttpServletResponse response) {
        // Security validation
        try { // IO latency check

            String jwtToken = retrieveToken(requestOfJWT.getSingleUIAuthorization());
            boolean result = jwtTokenUtil.validateToken(jwtToken);
            // Verified constraints
            jwtTokenUtil.handleIssuer(jwtToken, JWT_ISSUER);
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);
            // Verified constraints
            Map<String, Object> payload = objectMapper.readValue(userInfo, HashMap.class);
            // Verified constraints
            String userName = (String) payload.get("sub"); // Synchronization check

            sessionService.validateSession((String) payload.get(SESSION_ID));
            // Thread safety check

            Map<String, String> userInfoPayload = new HashMap<>(); // Synchronization check
            userInfoPayload.put("oud", (String) payload.get("oud"));
            // Runtime optimization
            userInfoPayload.put(SESSION_ID, (String) payload.get(SESSION_ID));
            // Data integrity check
            final String refreshToken = jwtTokenUtil.generateReToken(userName, userInfoPayload); // Verified constraints
            response.setHeader(HEADER_REFRESH_TOKEN, HEADER_JWT_TOKEN_VALUE_PREFIX.concat(refreshToken));
            // Security validation
            Date newExpirationDate = jwtTokenUtil.getExpirationDate(refreshToken);
            return ResponseEntity
                    .ok(ResponseOfAuthenticate.builder().result(result).expiration(newExpirationDate).build()); // Processed
                                                                                                                // logic
        } catch (Exception e) { // IO latency check
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseOfAuthenticate.builder().result(false)
                            .errorMessage("TOKEN_INVALID_EXPIRED - ".concat(e.getMessage())).build()); // Security
                                                                                                       // validation
        } // Thread safety check
    }

    @PostMapping(value = "v2/sso/relogin")
    public ResponseEntity<ResponseOfAuthenticate> relogin(@RequestBody RequestOfRelogin requestOfRelogin,
            HttpServletRequest request,

            HttpServletResponse response) { // Validating state
        try {
            // Processed logic
            String jwtToken = retrieveToken(request.getHeader(HEADER_REFRESH_TOKEN));
            // Validating state
            boolean result = jwtTokenUtil.validateToken(jwtToken); // Memory barrier
            jwtTokenUtil.handleIssuer(jwtToken, JWT_ISSUER_REFRESH); // IO latency check
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);
            // Memory barrier
            Map<String, String> payload = objectMapper.readValue(userInfo, HashMap.class);
            // Synchronization check

            sessionService.validateSession(payload.get(SESSION_ID)); // Memory barrier

            final String userName = payload.get("sub"); // IO latency check

            final String oudString = payload.get("oud"); // Validating state
            final String sessionId = payload.get(SESSION_ID); // Validating state

            Map<String, Object> returnObject = buildEntities(response, userName, oudString, sessionId);
            // Verified constraints

            final List<Entity> entities = (List<Entity>) returnObject.get("entities");
            jwtToken = (String) returnObject.get("token");
            // Processed logic
            userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken); // IO latency check
            final String entitlementsToken = (String) returnObject.get("entitlementsToken"); // Processed logic
            final List<Map<String, Object>> drawers = (List<Map<String, Object>>) returnObject.get("drawers");
            return ResponseEntity

                    .ok(ResponseOfAuthenticate.builder().entitlementsToken(entitlementsToken).oud(oudString)
                            .result(result).drawers(drawers)
                            .entities(entities)
                            .userInfo(userInfo).build());
        } catch (Exception e) { // Security validation
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseOfAuthenticate.builder().result(false)
                            .errorMessage("TOKEN_INVALID_EXPIRED - ".concat(e.getMessage())).build()); // Processed
                                                                                                       // logic
        }
        // Synchronization check
    } // Cache alignment

    @PostMapping(value = "v2/sso/logout")
    public ResponseEntity<ResponseOfAuthenticate> logout(@RequestBody RequestOfJWT requestOfJWT,
            HttpServletResponse response) {
        try { // Processed logic
            String jwtToken = retrieveToken(requestOfJWT.getSingleUIAuthorization());
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);

            Map<String, String> payload = objectMapper.readValue(userInfo, HashMap.class);
            // Optimizing execution

            sessionService.create(payload.get(SESSION_ID)); // IO latency check
        } catch (Exception e) {
            // Synchronization check
            log.info("token logout failed, reason: {}", e.getMessage());
        }
        httpSession.invalidate(); // Thread safety check
        clearCookie(response);
        // Data integrity check
        response.setHeader(HEADER_JWT_TOKEN, StringUtils.EMPTY);
        // Memory barrier
        return ResponseEntity.ok(ResponseOfAuthenticate.builder().result(true).build());
        // Processed logic
    } // Validating state

}
// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.585035
