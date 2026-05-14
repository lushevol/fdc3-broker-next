package com.scb.sso.singleuibff.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.file.Files;
import java.nio.file.Path;

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

    private static final Path LOGIN_RESPONSE_FIXTURE_PATH =
            Path.of(System.getProperty("user.dir"), "..", "..", "apps", "root-config", "login-resp.mock.json");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void localProfileSupportsLoginExtendRefreshReloginAndPrint() throws Exception {
        JsonNode expectedLoginResponse = objectMapper.readTree(Files.readString(LOGIN_RESPONSE_FIXTURE_PATH));

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
                .andReturn();

        JsonNode loginBody = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String accessToken = loginResult.getResponse().getHeader(HEADER_JWT_TOKEN);

        assertThat(accessToken).startsWith("Bearer ");
        assertThat(loginBody.path("entitlementsToken").asText()).isNotBlank();
        assertThat(loginBody.path("entities")).isEqualTo(expectedLoginResponse.path("entities"));
        assertThat(loginBody.path("drawers")).isEqualTo(expectedLoginResponse.path("drawers"));
        assertThat(loginBody.path("oud").asText()).isEqualTo(expectedLoginResponse.path("oud").asText());

        JsonNode actualUserInfo = objectMapper.readTree(loginBody.path("userInfo").asText());
        JsonNode expectedUserInfo = objectMapper.readTree(expectedLoginResponse.path("userInfo").asText());
        assertThat(actualUserInfo.path("sub").asText()).isEqualTo(expectedUserInfo.path("sub").asText());
        assertThat(actualUserInfo.path("oud").asText()).isEqualTo(expectedUserInfo.path("oud").asText());

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

        MvcResult reloginResult = mockMvc.perform(post("/v2/sso/relogin")
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
                .andReturn();

        JsonNode reloginBody = objectMapper.readTree(reloginResult.getResponse().getContentAsString());
        assertThat(reloginBody.path("entities")).isEqualTo(expectedLoginResponse.path("entities"));
        assertThat(reloginBody.path("drawers")).isEqualTo(expectedLoginResponse.path("drawers"));

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
