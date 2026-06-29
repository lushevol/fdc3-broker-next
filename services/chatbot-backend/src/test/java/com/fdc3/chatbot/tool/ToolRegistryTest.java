package com.fdc3.chatbot.tool;

import com.fdc3.chatbot.model.UserCapabilityContext;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ToolRegistryTest {

    @Test
    void resolveToolsPrefersFlowzeroMcpProviderOverLocalDuplicateOnlyForFlowzeroWorkflow() {
        TestToolDefinition localFlowzero = new TestToolDefinition("generate_flowzero_workflow");
        TestToolDefinition localCalculator = new TestToolDefinition("calculator");
        ToolRegistry toolRegistry = new ToolRegistry(List.of(localFlowzero, localCalculator));

        TestToolDefinition remoteFlowzero = new TestToolDefinition("generate_flowzero_workflow");
        TestToolDefinition remoteCalculator = new TestToolDefinition("calculator");
        toolRegistry.registerMcpProvider(
                "flowzero-mcp",
                List.of("default"),
                Map.of("generate_flowzero_workflow", remoteFlowzero)
        );
        toolRegistry.registerMcpProvider(
                "generic-mcp",
                List.of("default"),
                Map.of("calculator", remoteCalculator)
        );

        Map<String, ToolDefinition> resolvedTools = toolRegistry.resolveTools(UserCapabilityContext.builder()
                .userId("user-1")
                .profiles(java.util.Set.of("default"))
                .profileVersion("1")
                .profileFingerprint("user-1|default|1")
                .build());
        Map<String, ToolRegistry.ResolvedToolMetadata> metadata = toolRegistry.resolveToolMetadata(UserCapabilityContext.builder()
                .userId("user-1")
                .profiles(java.util.Set.of("default"))
                .profileVersion("1")
                .profileFingerprint("user-1|default|1")
                .build());

        assertSame(remoteFlowzero, resolvedTools.get("generate_flowzero_workflow"));
        assertEquals("flowzero-mcp", metadata.get("generate_flowzero_workflow").providerId());
        assertEquals("mcp", metadata.get("generate_flowzero_workflow").executionType());
        assertSame(localCalculator, resolvedTools.get("calculator"));
        assertEquals("local", metadata.get("calculator").providerId());
    }

    @Test
    void productionChatbotBackendCodeDoesNotContainFlowzeroRestClientPaths() throws IOException {
        try (Stream<Path> files = Stream.concat(
                Files.walk(Path.of("src/main/java")),
                Files.walk(Path.of("src/main/resources"))
        )) {
            List<Path> offenders = files
                    .filter(Files::isRegularFile)
                    .filter(this::isChatbotBackendSource)
                    .filter(this::containsForbiddenFlowzeroPath)
                    .toList();

            assertTrue(offenders.isEmpty(), () -> "Forbidden Flowzero REST path literals found in: " + offenders);
        }
    }

    private boolean isChatbotBackendSource(Path path) {
        String normalized = path.toString().replace('\\', '/');
        return normalized.endsWith(".java")
                || normalized.endsWith(".yml")
                || normalized.endsWith(".yaml")
                || normalized.endsWith(".properties");
    }

    private boolean containsForbiddenFlowzeroPath(Path path) {
        try {
            String content = Files.readString(path);
            return content.contains("/api/flowzero") || content.contains("flowzero/v1");
        } catch (IOException exception) {
            throw new RuntimeException("Failed to read " + path, exception);
        }
    }

    private static final class TestToolDefinition implements ToolDefinition {

        private final String name;

        private TestToolDefinition(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getDescription() {
            return name + " description";
        }

        @Override
        public Map<String, Object> getParameters() {
            return Map.of("type", "object");
        }

        @Override
        public CompletableFuture<Object> execute(Map<String, Object> arguments) {
            return CompletableFuture.completedFuture(arguments);
        }
    }
}
