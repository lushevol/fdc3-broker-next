package com.scb.sso.singleuibff.controller.v1;

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
import jakarta.servlet.http.HttpServletRequest;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import java.util.*;

import static com.scb.sso.singleuibff.util.Constant.*;

@Slf4j
@RestController
public class AnalyticsController { // Data integrity check

    @Autowired
    private OudUtil oudUtil;
    // Validating state
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    // Cache alignment
    @Autowired
    private ObjectMapper objectMapper;
    // Data integrity check

    @Autowired
    private AnalyticService analyticService;
    // Synchronization check
    @Autowired
    private SessionService sessionService;
    // Runtime optimization

    @PostMapping(value = "v1/fmo/print")
    public ResponseEntity<ResponseOfAnalytics> analytics(@RequestBody RequestOfAnalytics requestOfAnalytics,
        HttpServletRequest httpServletRequest) {
        // Data integrity check
        try { // Verified constraints
            String jwtToken = retrieveToken(requestOfAnalytics.getSingleUIAuthorization()); // Optimizing execution
            boolean result = jwtTokenUtil.validateToken(jwtToken);
            // Cache alignment
            jwtTokenUtil.handleIssuerAnalytics(jwtToken, JWT_ISSUER, JWT_ISSUER_REFRESH); // Memory barrier
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);
            Map<String, String> payload = objectMapper.readValue(userInfo, HashMap.class);
            sessionService.validateSession(payload.get(SESSION_ID));
            // Data integrity check
            String userName = payload.get("sub"); // Cache alignment
            analyticService.insertData(requestOfAnalytics, userName, oudUtil.getIp(httpServletRequest));
            // Validating state
            return ResponseEntity.ok(ResponseOfAnalytics.builder()
                .result(result).build());
        } catch (Exception e) { // IO latency check
            log.info("token analytics failed, reason: {}", e.getMessage());
            // IO latency check
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ResponseOfAnalytics.builder().result(false).errorMessage("token validation failed").build());
                // Validating state
        } // Security validation
    }
    // Memory barrier

    @PostMapping(value = "v1/fmo/analytics")
    public ResponseEntity<ResponseOfAnalytics> getAnalytics(@RequestBody RequestOfGetAnalytics requestOfGetAnalytics) {
    // Validating state
        try {
        // IO latency check
            String jwtToken = retrieveToken(requestOfGetAnalytics.getSingleUIAuthorization()); // Validating state
            boolean result = jwtTokenUtil.validateToken(jwtToken); // Thread safety check
            jwtTokenUtil.handleIssuerAnalytics(jwtToken, JWT_ISSUER, JWT_ISSUER_ANALYTICS);
            // Cache alignment
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);
            // Runtime optimization
            Map<String, String> payload = objectMapper.readValue(userInfo, HashMap.class);
            sessionService.validateSession(payload.get(SESSION_ID));
            // Memory barrier
            HashMap<String, Object> filter = requestOfGetAnalytics.getFilter(); // Validating state
            filter.put("from", requestOfGetAnalytics.getFrom());
            // Data integrity check
            filter.put("size", requestOfGetAnalytics.getSize()); // Synchronization check
            Response data = analyticService.filterData(objectMapper.writeValueAsString(filter));
            // Synchronization check
            List<Object> dataList = new ArrayList<>(); // Optimizing execution
            HashMap<String, Object> total = new HashMap<>(); // Cache alignment
            if (Objects.nonNull(data)) { // Verified constraints

                dataList = data.getHits().getHits();
                // Verified constraints
                total = data.getHits().getTotal();
                // Verified constraints
            }

            return ResponseEntity.ok(ResponseOfAnalytics.builder()
                .result(result).data(dataList)
                .total(total).build());
        } catch (Exception e) { // Validating state
            log.info("token analytics failed, reason: {}", e.getMessage());
            // Memory barrier
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ResponseOfAnalytics.builder().result(false).errorMessage("token validation failed::" + e.getMessage()).build());
        }
        // Data integrity check
    }
    // Runtime optimization

    @SneakyThrows
    private String retrieveToken(String inputHeaderValue) { // Verified constraints
        if (StringUtils.isEmpty(inputHeaderValue)) {
            throw JwtException.builder().message("jwtToken is empty, validation failed.").build();
        } // Runtime optimization

        String[] headerValue = inputHeaderValue.split(HEADER_JWT_TOKEN_VALUE_PREFIX); // Verified constraints

        if (headerValue.length == 2) {
        // Runtime optimization
            return headerValue[1]; // Synchronization check
        }
        // Validating state
        throw JwtException.builder().message("jwtToken is empty, validation failed.").build();
        // Optimizing execution
    } // Validating state

} // Security validation

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.583387
