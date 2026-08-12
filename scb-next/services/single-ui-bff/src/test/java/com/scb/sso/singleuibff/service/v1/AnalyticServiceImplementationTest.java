package com.scb.sso.singleuibff.service.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.request.RequestOfAnalytics;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.repository.Elasticsearch;
import com.scb.sso.singleuibff.service.v1.implementation.AnalyticServiceImplementation;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;

import static com.scb.sso.singleuibff.util.Constant.ANALYTICS_TBL;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AnalyticServiceImplementationTest {

    @InjectMocks
    AnalyticServiceImplementation analyticService;
    @Mock
    private Elasticsearch elasticsearch;
    @Mock
    private ObjectMapper objectMapper;

    @SneakyThrows
    @Test
    void testInsertData() {
        RequestOfAnalytics requestOfAnalytics = new RequestOfAnalytics();
        String dataJson = objectMapper.writeValueAsString(requestOfAnalytics);
        ResponseEntity responseEntity = mock(ResponseEntity.class);
        doReturn(responseEntity).when(elasticsearch).post(eq(ANALYTICS_TBL), eq(dataJson));
        analyticService.insertData(requestOfAnalytics, "un", "ip");
    }

    @SneakyThrows
    @Test
    void testInsertDataFail() {
        String errorMessage = "Invalid data.";
        RequestOfAnalytics requestOfAnalytics = new RequestOfAnalytics();
        String dataJson = objectMapper.writeValueAsString(requestOfAnalytics);
        when(elasticsearch.post(eq(ANALYTICS_TBL), eq(dataJson)))
            .thenThrow(AuthenticationException.builder().message(errorMessage).build());
        analyticService.insertData(requestOfAnalytics, "un", "ip");
    }

    @SneakyThrows
    @Test
    void testFilterData() {
        HashMap<String, Object> filterObject = new HashMap<>();
        filterObject.put("from", 0);
        filterObject.put("size", 1);
        String filter = objectMapper.writeValueAsString(filterObject);
        ResponseEntity responseEntity = mock(ResponseEntity.class);
        doReturn(responseEntity).when(elasticsearch).filter(eq(ANALYTICS_TBL), eq(filter));
        analyticService.filterData(filter);
    }

    @SneakyThrows
    @Test
    void testFilterDataFail() {
        String errorMessage = "Invalid data.";
        HashMap<String, Object> filterObject = new HashMap<>();
        filterObject.put("from", 0);
        filterObject.put("size", 1);
        String filter = objectMapper.writeValueAsString(filterObject);
        when(elasticsearch.filter(eq(ANALYTICS_TBL), eq(filter)))
            .thenThrow(AuthenticationException.builder().message(errorMessage).build());
        analyticService.filterData(filter);
    }

}
