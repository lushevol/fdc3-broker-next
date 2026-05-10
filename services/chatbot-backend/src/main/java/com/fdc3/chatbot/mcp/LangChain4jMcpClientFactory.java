package com.fdc3.chatbot.mcp;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.HttpClientSseClientTransport;
import io.modelcontextprotocol.client.transport.HttpClientStreamableHttpTransport;
import io.modelcontextprotocol.spec.McpClientTransport;
import io.modelcontextprotocol.spec.McpSchema;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class LangChain4jMcpClientFactory implements McpClientFactory {

    @Override
    public McpClientSession create(McpProviderRegistrationRequest request) {
        McpClientTransport transport = switch (request.getTransportType()) {
            case STREAMABLE_HTTP -> {
                ParsedEndpoint endpoint = parseEndpoint(request.getUrl());
                yield HttpClientStreamableHttpTransport.builder(endpoint.baseUrl())
                        .endpoint(endpoint.path())
                        .connectTimeout(Duration.ofSeconds(20))
                        .build();
            }
            case HTTP_SSE -> {
                ParsedEndpoint endpoint = parseEndpoint(request.getUrl());
                yield HttpClientSseClientTransport.builder(endpoint.baseUrl())
                        .sseEndpoint(endpoint.path())
                        .connectTimeout(Duration.ofSeconds(20))
                        .build();
            }
        };

        McpSyncClient client = McpClient.sync(transport)
                .clientInfo(new McpSchema.Implementation("chatbot-backend", "1.0.0"))
                .requestTimeout(Duration.ofSeconds(20))
                .build();
        client.initialize();

        return new LangChain4jMcpClientSession(client);
    }

    private static ParsedEndpoint parseEndpoint(String rawUrl) {
        URI uri = URI.create(rawUrl);
        String path = uri.getRawPath();
        if (path == null || path.isBlank()) {
            path = "/";
        }
        String query = uri.getRawQuery();
        if (query != null && !query.isBlank()) {
            path = path + "?" + query;
        }
        String baseUrl = uri.getScheme() + "://" + uri.getAuthority();
        return new ParsedEndpoint(baseUrl, path);
    }

    private record ParsedEndpoint(String baseUrl, String path) {
    }

    private static final class LangChain4jMcpClientSession implements McpClientSession {

        private final ObjectMapper objectMapper = new ObjectMapper();
        private final McpSyncClient client;

        private LangChain4jMcpClientSession(McpSyncClient client) {
            this.client = client;
        }

        @Override
        public List<McpToolDescriptor> listTools() {
            return client.listTools().tools().stream()
                    .map(tool -> toToolDescriptor(tool))
                    .toList();
        }

        @Override
        public CompletableFuture<Object> execute(String toolName, Map<String, Object> arguments) {
            return CompletableFuture.supplyAsync(() -> client.callTool(new McpSchema.CallToolRequest(toolName, arguments)))
                    .thenApply(result -> normalizeToolResult(objectMapper, result));
        }

        @Override
        public void close() {
            try {
                client.closeGracefully();
            } catch (Exception exception) {
                throw new IllegalStateException("Failed to close MCP client", exception);
            }
        }
    }

    static Object normalizeToolResult(ObjectMapper objectMapper, McpSchema.CallToolResult result) {
        if (result == null) {
            return null;
        }

        Object normalized = normalizeSuccessfulToolResult(objectMapper, result);
        if (Boolean.TRUE.equals(result.isError())) {
            if (normalized instanceof Map<?, ?> normalizedMap && normalizedMap.containsKey("error")) {
                return normalizedMap;
            }
            return Map.of("error", normalized == null ? "Tool execution failed." : normalized);
        }
        return normalized;
    }

    private static Object normalizeSuccessfulToolResult(ObjectMapper objectMapper, McpSchema.CallToolResult result) {
        if (result.structuredContent() != null) {
            return objectMapper.convertValue(result.structuredContent(), Object.class);
        }

        List<McpSchema.Content> content = result.content();
        if (content == null || content.isEmpty()) {
            return null;
        }

        if (content.size() == 1 && content.get(0) instanceof McpSchema.TextContent textContent) {
            String text = textContent.text();
            if (text != null && !text.isBlank()) {
                try {
                    return objectMapper.readValue(text, Object.class);
                } catch (Exception exception) {
                    return text;
                }
            }
        }

        return objectMapper.convertValue(content, Object.class);
    }

    static McpToolDescriptor toToolDescriptor(McpSchema.Tool tool) {
        return new McpToolDescriptor(
                tool.name(),
                tool.description(),
                tool.inputSchema() == null ? Map.of("type", "object") : tool.inputSchema()
        );
    }
}
