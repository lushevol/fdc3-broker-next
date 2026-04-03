package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.mcp.McpProviderRegistrationRequest;
import com.fdc3.chatbot.mcp.McpProviderRegistryService;
import com.fdc3.chatbot.mcp.McpTransportType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class McpProviderControllerTest {

    private McpProviderRegistryService registryService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        registryService = mock(McpProviderRegistryService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new McpProviderController(registryService)).build();
    }

    @Test
    void registerProviderAcceptsJsonPayload() throws Exception {
        when(registryService.register(any())).thenReturn(com.fdc3.chatbot.mcp.RegisteredMcpProvider.builder()
                .providerId("portfolio-service")
                .serviceName("Portfolio Service")
                .transportType(McpTransportType.STREAMABLE_HTTP)
                .url("http://portfolio-service.internal/mcp")
                .enabledProfiles(List.of("advisor"))
                .toolNames(List.of("portfolio_lookup"))
                .build());

        mockMvc.perform(post("/api/chat/mcp/providers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "providerId": "portfolio-service",
                                  "serviceName": "Portfolio Service",
                                  "transportType": "STREAMABLE_HTTP",
                                  "url": "http://portfolio-service.internal/mcp",
                                  "enabledProfiles": ["advisor"]
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.providerId").value("portfolio-service"))
                .andExpect(jsonPath("$.toolNames[0]").value("portfolio_lookup"));

        verify(registryService).register(any(McpProviderRegistrationRequest.class));
    }

    @Test
    void listProvidersReturnsRegisteredProviders() throws Exception {
        when(registryService.listProviders()).thenReturn(List.of(
                com.fdc3.chatbot.mcp.RegisteredMcpProvider.builder()
                        .providerId("portfolio-service")
                        .serviceName("Portfolio Service")
                        .transportType(McpTransportType.STREAMABLE_HTTP)
                        .url("http://portfolio-service.internal/mcp")
                        .enabledProfiles(List.of("advisor"))
                        .toolNames(List.of("portfolio_lookup"))
                        .build()
        ));

        mockMvc.perform(get("/api/chat/mcp/providers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].providerId").value("portfolio-service"));
    }

    @Test
    void unregisterProviderReturnsSuccessPayload() throws Exception {
        mockMvc.perform(delete("/api/chat/mcp/providers/portfolio-service"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.providerId").value("portfolio-service"));

        verify(registryService).unregister("portfolio-service");
    }
}
