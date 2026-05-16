package com.fdc3.chatbot.memory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.config.ChatbotMemoryProperties;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class HttpMemoryClient implements MemoryClient {
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final ChatbotMemoryProperties properties;

    public HttpMemoryClient(ObjectMapper objectMapper, ChatbotMemoryProperties properties) {
        this.objectMapper = objectMapper;
        this.properties = properties;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(properties.getRequestTimeout())
                .build();
    }

    @Override
    public List<MemoryDtos.MemoryEntryDto> search(MemoryDtos.MemorySearchRequest request) {
        HttpRequest httpRequest = HttpRequest.newBuilder(searchUri(request))
                .timeout(properties.getRequestTimeout())
                .GET()
                .build();

        try {
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new MemoryClientException("memory service returned HTTP " + response.statusCode());
            }
            MemoryDtos.MemorySearchResponse searchResponse =
                    objectMapper.readValue(response.body(), MemoryDtos.MemorySearchResponse.class);
            return searchResponse.entries() == null ? List.of() : searchResponse.entries();
        } catch (IOException e) {
            throw new MemoryClientException("failed to read memory service response", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new MemoryClientException("memory service request interrupted", e);
        }
    }

    private URI searchUri(MemoryDtos.MemorySearchRequest request) {
        StringBuilder query = new StringBuilder()
                .append("tenantId=").append(encode(request.tenantId()))
                .append("&userId=").append(encode(request.userId()))
                .append("&limit=").append(Math.max(1, request.limit()));

        append(query, "type", request.type());
        append(query, "status", request.status());
        append(query, "q", request.q());

        String baseUrl = properties.getBaseUrl().replaceAll("/+$", "");
        return URI.create(baseUrl + "/api/memory/entries?" + query);
    }

    private static void append(StringBuilder query, String name, String value) {
        if (value != null && !value.isBlank()) {
            query.append('&').append(name).append('=').append(encode(value));
        }
    }

    private static String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }
}
