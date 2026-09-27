package com.scb.ratan.flowzero.auth.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.flowzero.auth.constant.AuthErrorEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author Li, Chris Bo
 * @since May 26, 2021
 *
 */
@Slf4j
@RequiredArgsConstructor
public class RatanObjectMapper {

    private final ObjectMapper objectMapper;

    public <T> T readValue(String value, Class<T> type) {
        try {
            return objectMapper.readValue(value, type);

        } catch (JsonProcessingException e) {
            log.warn("Json Read Processing Error:{}", e.getMessage());
            throw new RatanServiceException(AuthErrorEnum.JSON_PROCESSING_ERROR, e.getMessage());
        }
    }

    public String writeValueAsString(Object value) {
        try {
            return objectMapper.writeValueAsString(value);

        } catch (JsonProcessingException e) {
            log.warn("Json write Processing Error:{}", e.getMessage());
            throw new RatanServiceException(AuthErrorEnum.JSON_PROCESSING_ERROR, e.getMessage());
        }
    }

    public <T> T readValue(String body, TypeReference<T> type) {
        try {
            return objectMapper.readValue(body, type);
        } catch (JsonProcessingException e) {
            throw new RatanServiceException(AuthErrorEnum.JSON_PROCESSING_ERROR, e.getMessage());
        }
    }

    public JsonNode readTree(String value) {
        try {
            return objectMapper.readTree(value);
        } catch (JsonProcessingException e) {
            log.warn("Json ReadTree Processing Error: {}", e.getMessage());
            throw new RatanServiceException(AuthErrorEnum.JSON_PROCESSING_ERROR, e.getMessage());
        }
    }

}
