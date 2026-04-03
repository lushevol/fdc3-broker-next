package com.fdc3.chatbot.mcp;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public interface McpClientFactory {

    McpClientSession create(McpProviderRegistrationRequest request);

    interface McpClientSession extends AutoCloseable {

        List<McpToolDescriptor> listTools();

        CompletableFuture<Object> execute(String toolName, Map<String, Object> arguments);

        @Override
        void close();
    }
}
