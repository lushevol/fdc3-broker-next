package com.scb.sso.singleuibff.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static com.scb.sso.singleuibff.util.Constant.HEADER_JWT_TOKEN;
import static com.scb.sso.singleuibff.util.Constant.HEADER_REFRESH_TOKEN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class LocalAuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void localProfileSupportsLoginExtendRefreshReloginAndPrint() throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/v2/sso/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "username": "testuser",
                          "password": "testpassword"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(header().exists(HEADER_JWT_TOKEN))
                .andExpect(jsonPath("$.result").value(true))
                .andExpect(jsonPath("$.entities[0].name").value("FMO PORTAL ADMIN"))
                .andExpect(jsonPath("$.drawers[0].label").value("Workspace"))
                .andReturn();

        JsonNode loginBody = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String accessToken = loginResult.getResponse().getHeader(HEADER_JWT_TOKEN);

        assertThat(accessToken).startsWith("Bearer ");
        assertThat(loginBody.path("entitlementsToken").asText()).isNotBlank();

        mockMvc.perform(post("/v2/sso/extend")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "singleUIAuthorization": "%s"
                        }
                        """.formatted(accessToken)))
                .andExpect(status().isOk())
                .andExpect(header().exists(HEADER_JWT_TOKEN))
                .andExpect(jsonPath("$.result").value(true))
                .andExpect(jsonPath("$.expiration").isNotEmpty());

        MvcResult refreshResult = mockMvc.perform(post("/v2/sso/refreshtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "singleUIAuthorization": "%s"
                        }
                        """.formatted(accessToken)))
                .andExpect(status().isOk())
                .andExpect(header().exists(HEADER_REFRESH_TOKEN))
                .andExpect(jsonPath("$.result").value(true))
                .andReturn();

        String refreshToken = refreshResult.getResponse().getHeader(HEADER_REFRESH_TOKEN);

        mockMvc.perform(post("/v2/sso/relogin")
                .contentType(MediaType.APPLICATION_JSON)
                .header(HEADER_REFRESH_TOKEN, refreshToken)
                .content("""
                        {
                          "entities": []
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(header().exists(HEADER_JWT_TOKEN))
                .andExpect(jsonPath("$.result").value(true))
                .andExpect(jsonPath("$.entities[0].name").value("FMO PORTAL ADMIN"));

        mockMvc.perform(post("/v1/fmo/print")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "singleUIAuthorization": "%s",
                          "key": "button",
                          "event": "click",
                          "container": "Base",
                          "tile": "Login",
                          "name": "normal login"
                        }
                        """.formatted(accessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true));
    }
}
