package com.fdc3.chatbot.mcp;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.mcp.client.DefaultMcpClient;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.mcp.client.transport.McpTransport;
import dev.langchain4j.mcp.client.transport.http.HttpMcpTransport;
import dev.langchain4j.mcp.client.transport.http.StreamableHttpMcpTransport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class LangChain4jMcpClientFactory implements McpClientFactory {

    @Override
    public McpClientSession create(McpProviderRegistrationRequest request) {
        McpTransport transport = switch (request.getTransportType()) {
            case STREAMABLE_HTTP -> StreamableHttpMcpTransport.builder()
                    .url(request.getUrl())
                    .build();
            case HTTP_SSE -> HttpMcpTransport.builder()
                    .sseUrl(request.getUrl())
                    .build();
        };

        McpClient client = new DefaultMcpClient.Builder()
                .key(request.getProviderId())
                .transport(transport)
                .build();

        return new LangChain4jMcpClientSession(client);
    }

    private static final class LangChain4jMcpClientSession implements McpClientSession {

        private final ObjectMapper objectMapper = new ObjectMapper();
        private final McpClient client;

        private LangChain4jMcpClientSession(McpClient client) {
            this.client = client;
        }

        @Override
        public List<McpToolDescriptor> listTools() {
            return client.listTools().stream()
                    .map(tool -> new McpToolDescriptor(
                            tool.name(),
                            tool.description(),
                            Map.of("type", "object")
                    ))
                    .toList();
        }

        @Override
        public CompletableFuture<Object> execute(String toolName, Map<String, Object> arguments) {
            return CompletableFuture.supplyAsync(() -> client.executeTool(
                            dev.langchain4j.agent.tool.ToolExecutionRequest.builder()
                                    .id(java.util.UUID.randomUUID().toString())
                                    .name(toolName)
                                    .arguments(writeJson(arguments))
                                    .build()
                    ))
                    .thenApply(result -> result.isError() ? Map.of("error", result.resultText()) : result.result());
        }

        @Override
        public void close() {
            try {
                client.close();
            } catch (Exception exception) {
                throw new IllegalStateException("Failed to close MCP client", exception);
            }
        }

        private String writeJson(Map<String, Object> arguments) {
            try {
                return objectMapper.writeValueAsString(arguments);
            } catch (Exception exception) {
                throw new IllegalStateException("Failed to serialize MCP tool arguments", exception);
            }
        }
    }
}
