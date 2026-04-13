package com.fdc3.chatbot.mcp;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.mcp.client.DefaultMcpClient;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.mcp.client.transport.McpTransport;
import dev.langchain4j.mcp.client.transport.http.HttpMcpTransport;
import dev.langchain4j.mcp.client.transport.http.StreamableHttpMcpTransport;
import dev.langchain4j.model.chat.request.json.JsonAnyOfSchema;
import dev.langchain4j.model.chat.request.json.JsonArraySchema;
import dev.langchain4j.model.chat.request.json.JsonBooleanSchema;
import dev.langchain4j.model.chat.request.json.JsonEnumSchema;
import dev.langchain4j.model.chat.request.json.JsonIntegerSchema;
import dev.langchain4j.model.chat.request.json.JsonNumberSchema;
import dev.langchain4j.model.chat.request.json.JsonObjectSchema;
import dev.langchain4j.model.chat.request.json.JsonRawSchema;
import dev.langchain4j.model.chat.request.json.JsonReferenceSchema;
import dev.langchain4j.model.chat.request.json.JsonSchemaElement;
import dev.langchain4j.model.chat.request.json.JsonStringSchema;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
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
                    .map(tool -> toToolDescriptor(tool, objectMapper))
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
                    .thenApply(result -> {
                        String resultText = result.resultText();
                        if (result.isError()) {
                            return Map.of("error", resultText);
                        }
                        return parseToolResult(resultText, result.result());
                    });
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

        private Object parseToolResult(String resultText, Object fallbackResult) {
            if (resultText != null && !resultText.isBlank()) {
                try {
                    return objectMapper.readValue(resultText, Object.class);
                } catch (Exception exception) {
                    log.debug("Failed to parse MCP result text as JSON, returning raw text", exception);
                    return resultText;
                }
            }

            return fallbackResult;
        }
    }

    static McpToolDescriptor toToolDescriptor(ToolSpecification toolSpecification, ObjectMapper objectMapper) {
        return new McpToolDescriptor(
                toolSpecification.name(),
                toolSpecification.description(),
                toInputSchema(toolSpecification.parameters(), objectMapper)
        );
    }

    private static Map<String, Object> toInputSchema(JsonObjectSchema schema, ObjectMapper objectMapper) {
        if (schema == null) {
            return Map.of("type", "object");
        }
        return toSchemaMap(schema, objectMapper);
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> toSchemaMap(JsonSchemaElement schemaElement, ObjectMapper objectMapper) {
        if (schemaElement instanceof JsonObjectSchema objectSchema) {
            Map<String, Object> schema = new LinkedHashMap<>();
            schema.put("type", "object");
            if (objectSchema.description() != null) {
                schema.put("description", objectSchema.description());
            }
            if (!objectSchema.properties().isEmpty()) {
                Map<String, Object> properties = new LinkedHashMap<>();
                objectSchema.properties().forEach((name, propertySchema) ->
                        properties.put(name, toSchemaMap(propertySchema, objectMapper)));
                schema.put("properties", properties);
            }
            if (objectSchema.required() != null && !objectSchema.required().isEmpty()) {
                schema.put("required", objectSchema.required());
            }
            if (objectSchema.additionalProperties() != null) {
                schema.put("additionalProperties", objectSchema.additionalProperties());
            }
            if (objectSchema.definitions() != null && !objectSchema.definitions().isEmpty()) {
                Map<String, Object> definitions = new LinkedHashMap<>();
                objectSchema.definitions().forEach((name, definitionSchema) ->
                        definitions.put(name, toSchemaMap(definitionSchema, objectMapper)));
                schema.put("definitions", definitions);
            }
            return schema;
        }
        if (schemaElement instanceof JsonStringSchema stringSchema) {
            return primitiveSchema("string", stringSchema.description());
        }
        if (schemaElement instanceof JsonIntegerSchema integerSchema) {
            return primitiveSchema("integer", integerSchema.description());
        }
        if (schemaElement instanceof JsonNumberSchema numberSchema) {
            return primitiveSchema("number", numberSchema.description());
        }
        if (schemaElement instanceof JsonBooleanSchema booleanSchema) {
            return primitiveSchema("boolean", booleanSchema.description());
        }
        if (schemaElement instanceof JsonEnumSchema enumSchema) {
            Map<String, Object> schema = primitiveSchema("string", enumSchema.description());
            schema.put("enum", enumSchema.enumValues());
            return schema;
        }
        if (schemaElement instanceof JsonArraySchema arraySchema) {
            Map<String, Object> schema = primitiveSchema("array", arraySchema.description());
            schema.put("items", toSchemaMap(arraySchema.items(), objectMapper));
            return schema;
        }
        if (schemaElement instanceof JsonReferenceSchema referenceSchema) {
            Map<String, Object> schema = new LinkedHashMap<>();
            schema.put("$ref", referenceSchema.reference());
            if (referenceSchema.description() != null) {
                schema.put("description", referenceSchema.description());
            }
            return schema;
        }
        if (schemaElement instanceof JsonAnyOfSchema anyOfSchema) {
            Map<String, Object> schema = new LinkedHashMap<>();
            if (anyOfSchema.description() != null) {
                schema.put("description", anyOfSchema.description());
            }
            schema.put("anyOf", anyOfSchema.anyOf().stream()
                    .map(item -> toSchemaMap(item, objectMapper))
                    .toList());
            return schema;
        }
        if (schemaElement instanceof JsonRawSchema rawSchema) {
            try {
                return objectMapper.readValue(rawSchema.schema(), Map.class);
            } catch (Exception exception) {
                throw new IllegalStateException("Failed to deserialize MCP raw schema", exception);
            }
        }
        throw new IllegalArgumentException("Unsupported MCP schema element: " + schemaElement.getClass().getName());
    }

    private static Map<String, Object> primitiveSchema(String type, String description) {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", type);
        if (description != null) {
            schema.put("description", description);
        }
        return schema;
    }
}
