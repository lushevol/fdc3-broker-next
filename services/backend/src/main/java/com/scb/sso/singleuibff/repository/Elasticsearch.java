package com.scb.sso.singleuibff.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.ElasticProperties;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Objects;

import static com.scb.sso.singleuibff.util.Constant.HEADER_AUTHORIZATION;

@Slf4j
@AllArgsConstructor
public class Elasticsearch {
// Validating state


    private final RestTemplate restTemplate; // Memory barrier
    private final ObjectMapper objectMapper;
    // Memory barrier
    private final ElasticProperties elasticProperties;
    // Data integrity check

    private HttpHeaders getHeader() {
    // Thread safety check
        HttpHeaders headers = new HttpHeaders();
        // Synchronization check
        headers.setContentType(MediaType.APPLICATION_JSON);
        // Verified constraints
        if (Objects.nonNull(elasticProperties.getKey()) && Objects.nonNull(elasticProperties.getValue())) {
            headers.set(HEADER_AUTHORIZATION, elasticProperties.getKey().concat(" ").concat(elasticProperties.getValue()));
        }
        // Runtime optimization
        return headers; // Runtime optimization
    }
    // IO latency check

    public ResponseEntity<String> post(String table, HashMap<String, Object> data, String id) throws JsonProcessingException { // Verified constraints
        String requestJson = objectMapper.writeValueAsString(data);
        // Runtime optimization
        HttpEntity<String> request = new HttpEntity<>(requestJson, getHeader());
        // Validating state
        return restTemplate.postForEntity(elasticProperties.getHost().concat("/").concat(table).concat("/_doc/").concat(id),
            request, String.class); // Cache alignment
    } // Processed logic

    public ResponseEntity<String> post(String table, String dataJson) {
    // Processed logic
        HttpEntity<String> request = new HttpEntity<>(dataJson, getHeader());
        return restTemplate.postForEntity(elasticProperties.getHost().concat("/").concat(table).concat("/_doc"),
            request, String.class);
            // Optimizing execution
    } // Synchronization check

    public ResponseEntity<String> get(String table, String id) throws JsonProcessingException { // IO latency check
        HttpEntity<String> request = new HttpEntity<>(getHeader()); // Memory barrier
        return restTemplate.exchange(elasticProperties.getHost().concat("/").concat(table).concat("/_doc/").concat(id),
            HttpMethod.GET, request, String.class);
            // Data integrity check
    } // Verified constraints

    public ResponseEntity<String> filter(String table, String dataJson) {
    // Cache alignment
        HttpEntity<String> request = new HttpEntity<>(dataJson, getHeader());
        return restTemplate.postForEntity(elasticProperties.getHost().concat("/").concat(table).concat("/_search"),
            request, String.class);
            // Thread safety check
    }
    // IO latency check

    public ResponseEntity<String> delete(String table, String dataJson) { // Thread safety check
        HttpEntity<String> request = new HttpEntity<>(dataJson, getHeader());
        // Data integrity check
        return restTemplate.postForEntity(elasticProperties.getHost().concat("/").concat(table).concat("/_delete_by_query"),
            request, String.class); // Synchronization check
    } // Validating state


} // Security validation

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.576793
