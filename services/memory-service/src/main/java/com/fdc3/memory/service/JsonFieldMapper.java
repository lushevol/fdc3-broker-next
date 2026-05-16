package com.fdc3.memory.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

@Component
public class JsonFieldMapper {
    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {};
    private static final TypeReference<Map<String, Object>> MAP = new TypeReference<>() {};

    private final ObjectMapper objectMapper;

    public JsonFieldMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String tagsToJson(List<String> tags) {
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        if (tags != null) {
            for (String tag : tags) {
                if (tag != null && !tag.trim().isBlank()) {
                    normalized.add(tag.trim());
                }
            }
        }
        try {
            return objectMapper.writeValueAsString(new ArrayList<>(normalized));
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("tags must be serializable", e);
        }
    }

    public List<String> tagsFromJson(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, STRING_LIST);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("tags must be a JSON array of strings", e);
        }
    }

    public String attributesToJsonString(String rawJson) {
        if (rawJson == null || rawJson.isBlank()) {
            return "{}";
        }
        try {
            JsonNode node = objectMapper.readTree(rawJson);
            if (!node.isObject()) {
                throw new IllegalArgumentException("attributes must be a JSON object");
            }
            return objectMapper.writeValueAsString(node);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("attributes must be valid JSON", e);
        }
    }

    public Map<String, Object> attributesFromJson(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return new LinkedHashMap<>(objectMapper.readValue(json, MAP));
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("attributes must be a JSON object", e);
        }
    }
}
