package com.scb.ratan.flowzero.auth.web;

import com.scb.ratan.flowzero.auth.authentication.IAuthenticationService;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationPayloadDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthenticationController.class)
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IAuthenticationService authenticationService;

    @Test
    void authenticate_whenAuthenticationSucceeds_shouldReturnOk() throws Exception {
        AuthenticationPayloadDto payload = new AuthenticationPayloadDto();
        payload.setToken("token-1");

        when(authenticationService.authenticate(any())).thenReturn(Mono.just(payload));

        mockMvc.perform(post("/v1/authenticate")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json("{\"token\":\"token-1\",\"success\":true}"));

        verify(authenticationService).authenticate(any());
    }

    @Test
    void authenticate_whenAuthenticationFails_shouldReturnUnauthorized() throws Exception {
        when(authenticationService.authenticate(any()))
            .thenReturn(Mono.error(new RuntimeException("authentication failed")));

        mockMvc.perform(post("/v1/authenticate")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void healthCheck_shouldReturnOk() throws Exception {
        mockMvc.perform(post("/v1/health"))
            .andExpect(status().isOk())
            .andExpect(content().string("Entitlement sync service is running"));
    }

}