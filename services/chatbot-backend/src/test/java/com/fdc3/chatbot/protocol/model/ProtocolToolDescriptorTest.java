package com.fdc3.chatbot.protocol.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ProtocolToolDescriptorTest {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldDeserializeFrontendTool() throws Exception {
        String json = """
            {
              "name": "location.resolve",
              "source": "frontend",
              "description": "Resolve a location",
              "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}
            }
            """;
        ProtocolToolDescriptor descriptor = objectMapper.readValue(json, ProtocolToolDescriptor.class);
        assertEquals("location.resolve", descriptor.getName());
        assertEquals(ChatToolSource.FRONTEND, descriptor.getSource());
        assertNull(descriptor.getProviderId());
    }

    @Test
    void shouldDeserializeHumanTool() throws Exception {
        String json = """
            {
              "name": "approval.confirm",
              "source": "human",
              "description": "Confirm a decision",
              "parameters": {"type": "object", "properties": {"decision": {"type": "string"}}, "required": ["decision"]},
              "requiresConfirmation": true
            }
            """;
        ProtocolToolDescriptor descriptor = objectMapper.readValue(json, ProtocolToolDescriptor.class);
        assertEquals("approval.confirm", descriptor.getName());
        assertEquals(ChatToolSource.HUMAN, descriptor.getSource());
        assertTrue(descriptor.getRequiresConfirmation());
    }

    @Test
    void shouldDeserializeBackendTool() throws Exception {
        String json = """
            {
              "name": "summary.compose",
              "source": "backend",
              "description": "Compose summary",
              "parameters": {"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]}
            }
            """;
        ProtocolToolDescriptor descriptor = objectMapper.readValue(json, ProtocolToolDescriptor.class);
        assertEquals("summary.compose", descriptor.getName());
        assertEquals(ChatToolSource.BACKEND, descriptor.getSource());
    }

    @Test
    void shouldDeserializeMcpToolWithProviderId() throws Exception {
        String json = """
            {
              "name": "analytics.lookup",
              "source": "mcp",
              "providerId": "analytics-mcp",
              "description": "Look up analytics",
              "parameters": {"type": "object", "properties": {"appId": {"type": "string"}}, "required": ["appId"]}
            }
            """;
        ProtocolToolDescriptor descriptor = objectMapper.readValue(json, ProtocolToolDescriptor.class);
        assertEquals("analytics.lookup", descriptor.getName());
        assertEquals(ChatToolSource.MCP, descriptor.getSource());
        assertEquals("analytics-mcp", descriptor.getProviderId());
    }

    @Test
    void shouldDeserializeRunContextWithMixedTools() throws Exception {
        String json = """
            {
              "workspace": {"activeWorkspaceId": "ws-1", "activeAppId": "app-1"},
              "tools": [
                {"name": "location.resolve", "source": "frontend", "description": "Resolve", "parameters": {}},
                {"name": "approval.confirm", "source": "human", "description": "Confirm", "parameters": {}},
                {"name": "summary.compose", "source": "backend", "description": "Compose", "parameters": {}},
                {"name": "analytics.lookup", "source": "mcp", "providerId": "analytics-mcp", "description": "Analytics", "parameters": {}}
              ]
            }
            """;
        ProtocolRunContext context = objectMapper.readValue(json, ProtocolRunContext.class);
        assertNotNull(context.getTools());
        assertEquals(4, context.getTools().size());
        assertEquals(ChatToolSource.FRONTEND, context.getTools().get(0).getSource());
        assertEquals(ChatToolSource.HUMAN, context.getTools().get(1).getSource());
        assertEquals(ChatToolSource.BACKEND, context.getTools().get(2).getSource());
        assertEquals(ChatToolSource.MCP, context.getTools().get(3).getSource());
    }

    @Test
    void shouldBackwardSupportFrontendToolsList() throws Exception {
        String json = """
            {
              "workspace": {"activeWorkspaceId": "ws-1"},
              "frontendTools": [
                {"name": "location.resolve", "description": "Resolve", "parameters": {}, "interactionMode": "auto"}
              ]
            }
            """;
        ProtocolRunContext context = objectMapper.readValue(json, ProtocolRunContext.class);
        assertNotNull(context.getFrontendTools());
        assertEquals(1, context.getFrontendTools().size());
        assertEquals("location.resolve", context.getFrontendTools().get(0).getName());
    }

    @Test
    void shouldDeserializeRunWithMixedToolsAndFrontendTools() throws Exception {
        String json = """
            {
              "workspace": {"activeWorkspaceId": "ws-1"},
              "frontendTools": [
                {"name": "legacy.tool", "description": "Legacy", "parameters": {}, "interactionMode": "manual"}
              ],
              "tools": [
                {"name": "analytics.lookup", "source": "mcp", "providerId": "analytics-mcp", "description": "Analytics", "parameters": {}}
              ]
            }
            """;
        ProtocolRunContext context = objectMapper.readValue(json, ProtocolRunContext.class);
        assertNotNull(context.getFrontendTools());
        assertEquals(1, context.getFrontendTools().size());
        assertNotNull(context.getTools());
        assertEquals(1, context.getTools().size());
        assertEquals(ChatToolSource.MCP, context.getTools().get(0).getSource());
    }
}