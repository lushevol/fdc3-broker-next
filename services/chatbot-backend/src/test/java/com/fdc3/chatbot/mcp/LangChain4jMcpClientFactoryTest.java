package com.fdc3.chatbot.mcp;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.mcp.protocol.McpCallToolResult;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.model.chat.request.json.JsonObjectSchema;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class LangChain4jMcpClientFactoryTest {

    @Test
    void preservesDiscoveredInputSchemaWhenMappingToolSpecification() {
        ToolSpecification toolSpecification = ToolSpecification.builder()
                .name("portfolio_lookup")
                .description("Lookup user portfolios")
                .parameters(JsonObjectSchema.builder()
                        .addStringProperty("accountId", "Account identifier")
                        .required("accountId")
                        .build())
                .build();

        McpToolDescriptor descriptor = LangChain4jMcpClientFactory.toToolDescriptor(toolSpecification, new ObjectMapper());

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
    void normalizeToolResultPrefersStructuredContentWhenResultTextIsBlank() {
        ObjectMapper objectMapper = new ObjectMapper();
        McpCallToolResult.Result fallbackResult = new McpCallToolResult.Result(
                List.of(),
                Map.of(
                        "appFilterValue", "cashflow_blotter",
                        "bucket", "HOUR",
                        "points", List.of(
                                Map.of("timestamp", "2026-04-15T00:00:00Z", "pv", 21, "uv", 6),
                                Map.of("timestamp", "2026-04-15T01:00:00Z", "pv", 21, "uv", 6)
                        )
                ),
                false
        );

        Object normalized = LangChain4jMcpClientFactory.normalizeToolResult(objectMapper, "", fallbackResult);

        Map<?, ?> normalizedMap = assertInstanceOf(Map.class, normalized);
        assertEquals("cashflow_blotter", normalizedMap.get("appFilterValue"));
        assertEquals("HOUR", normalizedMap.get("bucket"));
    }
}
