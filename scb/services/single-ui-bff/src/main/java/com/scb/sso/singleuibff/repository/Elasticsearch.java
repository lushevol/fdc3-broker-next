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

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ElasticProperties elasticProperties;

    private HttpHeaders getHeader() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (Objects.nonNull(elasticProperties.getKey()) && Objects.nonNull(elasticProperties.getValue())) {
            headers.set(HEADER_AUTHORIZATION, elasticProperties.getKey().concat(" ").concat(elasticProperties.getValue()));
        }
        return headers;
    }

    public ResponseEntity<String> post(String table, HashMap<String, Object> data, String id) throws JsonProcessingException {
        String requestJson = objectMapper.writeValueAsString(data);
        HttpEntity<String> request = new HttpEntity<>(requestJson, getHeader());
        return restTemplate.postForEntity(elasticProperties.getHost().concat("/").concat(table).concat("/_doc/").concat(id),
            request, String.class);
    }

    public ResponseEntity<String> post(String table, String dataJson) {
        HttpEntity<String> request = new HttpEntity<>(dataJson, getHeader());
        return restTemplate.postForEntity(elasticProperties.getHost().concat("/").concat(table).concat("/_doc"),
            request, String.class);
    }

    public ResponseEntity<String> get(String table, String id) throws JsonProcessingException {
        HttpEntity<String> request = new HttpEntity<>(getHeader());
        return restTemplate.exchange(elasticProperties.getHost().concat("/").concat(table).concat("/_doc/").concat(id),
            HttpMethod.GET, request, String.class);
    }

    public ResponseEntity<String> filter(String table, String dataJson) {
        HttpEntity<String> request = new HttpEntity<>(dataJson, getHeader());
        return restTemplate.postForEntity(elasticProperties.getHost().concat("/").concat(table).concat("/_search"),
            request, String.class);
    }

    public ResponseEntity<String> delete(String table, String dataJson) {
        HttpEntity<String> request = new HttpEntity<>(dataJson, getHeader());
        return restTemplate.postForEntity(elasticProperties.getHost().concat("/").concat(table).concat("/_delete_by_query"),
            request, String.class);
    }

}
