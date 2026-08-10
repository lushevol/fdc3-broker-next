package com.scb.sso.singleuibff.service.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.dto.config.FmaaResult;
import com.scb.sso.singleuibff.service.v1.implementation.ApplicationConfigServiceImpl;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.doThrow;

@ExtendWith(MockitoExtension.class)
public class ApplicationConfigServiceTest {

    @InjectMocks
    ApplicationConfigServiceImpl applicationConfigServiceImpl;
    @Mock
    RestTemplate restTemplate;
    @Spy
    ObjectMapper objectMapper;
    @Mock
    FmaaProperties fmaaProperties;

    String responseText = "{\"user_id\":\"RATAN_PROD\",\"active\":\"true\",\"token_type\":\"Bearer\",\"app_id\":\"FMO_PORTAL\",\"expires_in\":564190316}";

    @SneakyThrows
    @Test
    void testGetAppId() {
        when(fmaaProperties.getVerificationPath()).thenReturn("/introspect?app_id=FMO_PORTAL&access_token=%s");
        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(responseText);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);
        FmaaResult fmaaResult = applicationConfigServiceImpl.getAppId("jwt");
        assertEquals(fmaaResult.getUserId(), "RATAN_PROD");
        assertEquals(fmaaResult.getActive(), "true");
    }

    @SneakyThrows
    @Test
    void testGetAppIdError() {
        when(fmaaProperties.getVerificationPath()).thenReturn("/introspect?app_id=FMO_PORTAL&access_token=%s");
        when(restTemplate.getForEntity(anyString(), any())).thenThrow(new RuntimeException("test"));
        FmaaResult fmaaResult = applicationConfigServiceImpl.getAppId("jwt");
        assertEquals(fmaaResult.getActive(), "false");
    }

}
