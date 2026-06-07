package com.scb.ratan.flowzero.workflow.utils;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * @author MaYue
 * @date 8/12/2025
 */
@Slf4j
public class JsonUtil {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        .configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);

    public static Map<String, Object> toMap(String jsonbStr) {
        if (Objects.isNull(jsonbStr)) {
            return new HashMap<>();
        }
        try {
            return OBJECT_MAPPER.readValue(
                jsonbStr,
                new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            throw new RuntimeException("failed to convert the JsonB to Map");
        }
    }

    public static String toJsonStr(Object obj) {
        try {
            return OBJECT_MAPPER.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert object to JSON string", e);
        }
    }

    public static byte[] toJsonBytes(Object obj) {
        try {
            return OBJECT_MAPPER.writeValueAsBytes(obj);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert object to JSON bytes", e);
        }
    }

    public static <T> T fromJsonStr(byte[] jsonBytes, Class<T> clazz) {
        try {
            return OBJECT_MAPPER.readValue(jsonBytes, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON byte to object", e);
        }
    }

    public static byte[] fromJsonStr(String jsonStr) {
        try {
            return jsonStr.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON string to bytes", e);
        }
    }

    public static String jsonBytesToStr(byte[] jsonBytes) {
        try {
            return new String(jsonBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON bytes to string", e);
        }
    }

    public static JsonNode toJsonNode(Object fromObj) {
        try {
            return OBJECT_MAPPER.valueToTree(fromObj);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert obj to json", e);
        }
    }

    public static JsonNode toJsonNode(String jsonStr) {
        try {
            return OBJECT_MAPPER.readTree(jsonStr);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert str to json", e);
        }
    }

}
