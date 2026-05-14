package com.fdc3.chatbot.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ModelProviderService {

    @Value("${spring.ai.openai.base-url:}")
    private String openaiBaseUrl;

    @Value("${spring.ai.openai.api-key:}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    public List<ProviderModel> getAvailableModels() {
        if (openaiBaseUrl == null || openaiBaseUrl.isBlank()) {
            log.warn("OpenAI base URL not configured, cannot fetch models");
            return List.of();
        }

        String modelsUrl = openaiBaseUrl.endsWith("/") ? openaiBaseUrl + "models" : openaiBaseUrl + "/models";
        log.debug("Fetching models from: {}", modelsUrl);

        try {
            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(modelsUrl))
                    .timeout(Duration.ofSeconds(10))
                    .header("Accept", "application/json");

            if (apiKey != null && !apiKey.isBlank()) {
                requestBuilder.header("Authorization", "Bearer " + apiKey);
            }

            HttpRequest request = requestBuilder.GET().build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Failed to fetch models, status: {} body: {}", response.statusCode(), response.body());
                return List.of();
            }

            return parseModelsResponse(response.body());
        } catch (Exception e) {
            log.warn("Error fetching models from {}: {}", modelsUrl, e.getMessage());
            return List.of();
        }
    }

    private List<ProviderModel> parseModelsResponse(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode data = root.get("data");
            if (data == null || !data.isArray()) {
                return List.of();
            }

            String providerId = "default";
            String providerName = "Default";

            if (openaiBaseUrl != null) {
                if (openaiBaseUrl.contains("deepseek")) {
                    providerId = "deepseek";
                    providerName = "DeepSeek";
                } else if (openaiBaseUrl.contains("copilot") || openaiBaseUrl.contains("github")) {
                    providerId = "copilot-api";
                    providerName = "Copilot API";
                }
            }

            List<ProviderModel> models = new ArrayList<>();
            for (JsonNode modelNode : data) {
                String id = modelNode.get("id").asText();
                String ownedBy = modelNode.has("owned_by") ? modelNode.get("owned_by").asText() : "";
                models.add(ProviderModel.builder()
                        .id(id)
                        .name(id)
                        .providerId(providerId)
                        .providerName(providerName)
                        .description(ownedBy)
                        .build());
            }

            return models;
        } catch (Exception e) {
            log.warn("Error parsing models response: {}", e.getMessage());
            return List.of();
        }
    }
}
