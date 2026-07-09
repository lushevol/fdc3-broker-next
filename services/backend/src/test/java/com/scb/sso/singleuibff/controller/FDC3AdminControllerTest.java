package com.scb.sso.singleuibff.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.repository.Fdc3DeclarationRepo;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static com.scb.sso.singleuibff.util.Constant.HEADER_JWT_TOKEN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class FDC3AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Fdc3DeclarationRepo fdc3DeclarationRepo;

    @MockitoBean
    private AdminModuleUtil adminModuleUtil;

    @BeforeEach
    void setUpAdminValidation() {
        fdc3DeclarationRepo.deleteAll();
        when(adminModuleUtil.validate(any(HttpServletRequest.class), eq("test-entitlements-token")))
                .thenReturn(Map.of("sub", "tester", "ems2Role", "SUPER_USER"));
    }

    @Test
    void declarationEndpointsCreateListUpdateAndSoftDelete() throws Exception {
        LoginTokens tokens = new LoginTokens("Bearer test-access-token", "test-entitlements-token");

        mockMvc.perform(post("/v1/fmo/admin/fdc3/create")
                .header(HEADER_JWT_TOKEN, tokens.accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "entitlementsToken", tokens.entitlementsToken(),
                        "appId", "chart-tile",
                        "interop", Map.of(
                                "intents", Map.of(
                                        "listensFor", new Object[] {
                                                Map.of("intent", "ViewChart", "contexts", new String[] { "fdc3.instrument" })
                                        },
                                        "raises", new Object[] {}
                                )
                        )
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true))
                .andExpect(jsonPath("$.data.appId").value("chart-tile"))
                .andExpect(jsonPath("$.data.interop.intents.listensFor[0].intent").value("ViewChart"));

        mockMvc.perform(post("/v1/fmo/admin/fdc3/data")
                .header(HEADER_JWT_TOKEN, tokens.accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("entitlementsToken", tokens.entitlementsToken()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true))
                .andExpect(jsonPath("$.data[0].appId").value("chart-tile"));

        mockMvc.perform(post("/v1/fmo/admin/fdc3/update")
                .header(HEADER_JWT_TOKEN, tokens.accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "entitlementsToken", tokens.entitlementsToken(),
                        "appId", "chart-tile",
                        "interop", Map.of(
                                "intents", Map.of(
                                        "listensFor", new Object[] {},
                                        "raises", new Object[] {
                                                Map.of("intent", "ViewInstrument", "contexts", new String[] { "fdc3.instrument" })
                                        }
                                )
                        )
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true))
                .andExpect(jsonPath("$.data.appId").value("chart-tile"))
                .andExpect(jsonPath("$.data.interop.intents.raises[0].intent").value("ViewInstrument"));

        mockMvc.perform(post("/v1/fmo/admin/fdc3/delete")
                .header(HEADER_JWT_TOKEN, tokens.accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "entitlementsToken", tokens.entitlementsToken(),
                        "appId", "chart-tile"
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true))
                .andExpect(jsonPath("$.data.appId").value("chart-tile"));

        MvcResult listAfterDelete = mockMvc.perform(post("/v1/fmo/admin/fdc3/data")
                .header(HEADER_JWT_TOKEN, tokens.accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("entitlementsToken", tokens.entitlementsToken()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true))
                .andReturn();

        JsonNode data = objectMapper.readTree(listAfterDelete.getResponse().getContentAsString()).path("data");
        assertThat(data).isEmpty();
    }

    @Test
    void declarationCreateRejectsDuplicateActiveAppId() throws Exception {
        LoginTokens tokens = new LoginTokens("Bearer test-access-token", "test-entitlements-token");
        String payload = objectMapper.writeValueAsString(Map.of(
                "entitlementsToken", tokens.entitlementsToken(),
                "appId", "duplicate-tile",
                "interop", Map.of("intents", Map.of("listensFor", new Object[] {}, "raises", new Object[] {}))
        ));

        mockMvc.perform(post("/v1/fmo/admin/fdc3/create")
                .header(HEADER_JWT_TOKEN, tokens.accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true));

        mockMvc.perform(post("/v1/fmo/admin/fdc3/create")
                .header(HEADER_JWT_TOKEN, tokens.accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.result").value(false))
                .andExpect(jsonPath("$.errorMessage").value("FDC3 declaration already exists."));
    }

    @Test
    void declarationUpdateRejectsMissingAppId() throws Exception {
        LoginTokens tokens = new LoginTokens("Bearer test-access-token", "test-entitlements-token");

        mockMvc.perform(post("/v1/fmo/admin/fdc3/update")
                .header(HEADER_JWT_TOKEN, tokens.accessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "entitlementsToken", tokens.entitlementsToken(),
                        "appId", "missing-tile",
                        "interop", Map.of("intents", Map.of("listensFor", new Object[] {}, "raises", new Object[] {}))
                ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.result").value(false))
                .andExpect(jsonPath("$.errorMessage").value("FDC3 declaration not found."));
    }

    private record LoginTokens(String accessToken, String entitlementsToken) {
    }
}
