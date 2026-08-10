package com.scb.sso.singleuibff.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.ElasticProperties;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ElasticsearchTest {

    @InjectMocks
    Elasticsearch elasticsearch;
    @Mock
    RestTemplate restTemplate;
    @Mock
    ObjectMapper objectMapper;
    @Mock
    ElasticProperties elasticProperties;

    @SneakyThrows
    @Test
    void testPost() {
        when(elasticProperties.getHost()).thenReturn("http://localhost:8888");
        when(elasticProperties.getKey()).thenReturn("key");
        when(elasticProperties.getValue()).thenReturn("value");
        ResponseEntity<String> responseEntity = mock(ResponseEntity.class);
        doReturn(responseEntity).when(restTemplate).postForEntity(anyString(), any(), any());
        elasticsearch.post("table", new HashMap<>(), "123");
    }

    @SneakyThrows
    @Test
    void testPostString() {
        when(elasticProperties.getHost()).thenReturn("http://localhost:8888");
        when(elasticProperties.getKey()).thenReturn(null);
        ResponseEntity<String> responseEntity = mock(ResponseEntity.class);
        doReturn(responseEntity).when(restTemplate).postForEntity(anyString(), any(), any());
        elasticsearch.post("table", "{}");
    }

    @SneakyThrows
    @Test
    void testGet() {
        when(elasticProperties.getHost()).thenReturn("http://localhost:8888");
        ResponseEntity<String> responseEntity = mock(ResponseEntity.class);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(headers);
        doReturn(responseEntity).when(restTemplate).exchange(anyString(), eq(HttpMethod.GET), eq(request), eq(String.class));
        elasticsearch.get("table", "{}");
    }

    @SneakyThrows
    @Test
    void testFilter() {
        when(elasticProperties.getHost()).thenReturn("http://localhost:8888");
        when(elasticProperties.getKey()).thenReturn("key");
        when(elasticProperties.getValue()).thenReturn(null);
        ResponseEntity<String> responseEntity = mock(ResponseEntity.class);
        doReturn(responseEntity).when(restTemplate).postForEntity(anyString(), any(), any());
        elasticsearch.filter("table", "123");
    }

    @SneakyThrows
    @Test
    void testDelete() {
        when(elasticProperties.getHost()).thenReturn("http://localhost:8888");
        ResponseEntity<String> responseEntity = mock(ResponseEntity.class);
        doReturn(responseEntity).when(restTemplate).postForEntity(anyString(), any(), any());
        elasticsearch.delete("table", "123");
    }

}
