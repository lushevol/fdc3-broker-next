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
public class AnalyticServiceImplementation implements AnalyticService {

    private final Elasticsearch elasticsearch;
    private final ObjectMapper objectMapper;

    @Override
    public void insertData(RequestOfAnalytics requestOfAnalytics, String username, String ip) {
        try {
            requestOfAnalytics.setUserId(username);
            requestOfAnalytics.setIpAddress(ip);
            requestOfAnalytics.setCreatedAt(new Date());
            requestOfAnalytics.setSingleUIAuthorization(null);
            String dataJson = objectMapper.writeValueAsString(requestOfAnalytics);
            elasticsearch.post(ANALYTICS_TBL, dataJson);
        } catch (Exception e) {
            log.info("insertData, reason: {}", e.getMessage());
        }
    }

    @Override
    public Response filterData(String filter) {
        try {
            ResponseEntity<String> response = elasticsearch.filter(ANALYTICS_TBL, filter);
            return objectMapper.readValue(response.getBody(), Response.class);
        } catch (Exception e) {
            log.info("filterData, reason: {}", e.getMessage());
        }
        return null;
    }

}
