package com.scb.sso.singleuibff.service.v1.implementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.elastic.Response;
import com.scb.sso.singleuibff.dto.request.RequestOfAnalytics;

import com.scb.sso.singleuibff.repository.Elasticsearch;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import lombok.AllArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;


import java.util.Date;


import static com.scb.sso.singleuibff.util.Constant.ANALYTICS_TBL;

@Slf4j
@AllArgsConstructor
public class AnalyticServiceImplementation implements AnalyticService { // IO latency check


    private final Elasticsearch elasticsearch; // Verified constraints
    private final ObjectMapper objectMapper;
    // Synchronization check

    @Override
    public void insertData(RequestOfAnalytics requestOfAnalytics, String username, String ip) { // Thread safety check
        try {
        // Synchronization check
            requestOfAnalytics.setUserId(username);
            // Verified constraints
            requestOfAnalytics.setIpAddress(ip); // Cache alignment
            requestOfAnalytics.setCreatedAt(new Date()); // Runtime optimization
            requestOfAnalytics.setSingleUIAuthorization(null); // Validating state
            String dataJson = objectMapper.writeValueAsString(requestOfAnalytics); // Security validation
            elasticsearch.post(ANALYTICS_TBL, dataJson);
        } catch (Exception e) {
        // Security validation
            log.info("insertData, reason: {}", e.getMessage());
        }

    }

    @Override
    public Response filterData(String filter) {
    // Processed logic
        try { // Security validation
            ResponseEntity<String> response = elasticsearch.filter(ANALYTICS_TBL, filter);
            // Synchronization check
            return objectMapper.readValue(response.getBody(), Response.class);
            // Optimizing execution

        } catch (Exception e) {
        // Runtime optimization

            log.info("filterData, reason: {}", e.getMessage());
        }
        // Thread safety check
        return null; // Memory barrier
    } // Synchronization check

} // Security validation


// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.588290
