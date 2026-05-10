package com.fdc3.chatbot.mcp;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.modelcontextprotocol.spec.McpSchema;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class LangChain4jMcpClientFactoryTest {

    @Test
    void preservesDiscoveredInputSchemaWhenMappingToolSpecification() {
        McpSchema.Tool tool = McpSchema.Tool.builder()
                .name("portfolio_lookup")
                .description("Lookup user portfolios")
                .inputSchema(new McpSchema.JsonSchema(
                        "object",
                        Map.of(
                                "accountId", Map.of("type", "string", "description", "Account identifier")
                        ),
                        List.of("accountId"),
                        null,
                        null,
                        null
                ))
                .build();

        McpToolDescriptor descriptor = LangChain4jMcpClientFactory.toToolDescriptor(tool, new ObjectMapper());

        assertEquals("portfolio_lookup", descriptor.name());
        assertEquals("Lookup user portfolios", descriptor.description());
        assertEquals(
                Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "accountId", Map.of("type", "string", "description", "Account identifier")
                        ),
                        "required", List.of("accountId")
                ),
                descriptor.inputSchema()
        );
    }

    @Test
    void normalizeToolResultPrefersStructuredContentWhenPresent() {
        ObjectMapper objectMapper = new ObjectMapper();
        McpSchema.CallToolResult result = new McpSchema.CallToolResult(
                List.of(),
                false,
                Map.of(
                        "appFilterValue", "cashflow_blotter",
                        "bucket", "HOUR",
                        "points", List.of(
                                Map.of("timestamp", "2026-04-15T00:00:00Z", "pv", 21, "uv", 6),
                                Map.of("timestamp", "2026-04-15T01:00:00Z", "pv", 21, "uv", 6)
                        )
                ),
                Map.of()
        );

        Object normalized = LangChain4jMcpClientFactory.normalizeToolResult(objectMapper, result);

        Map<?, ?> normalizedMap = assertInstanceOf(Map.class, normalized);
        assertEquals("cashflow_blotter", normalizedMap.get("appFilterValue"));
        assertEquals("HOUR", normalizedMap.get("bucket"));
    }
}
