package com.scb.ratan.flowzero.auth.support;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import com.scb.ratan.flowzero.auth.entity.dto.UserEntitlementDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RatanObjectMapperTest {

    private RatanObjectMapper ratanObjectMapper;

    @BeforeEach
    void setUp() {
        ratanObjectMapper = new RatanObjectMapper(new ObjectMapper());
    }

    @Test
    void readValue_validJson_returnsObject() {
        String json = "{\"role\":\"ADMIN\",\"actions\":[\"ACTION_1\",\"ACTION_2\"]}";

        UserEntitlementDto result = ratanObjectMapper.readValue(json, UserEntitlementDto.class);

        assertNotNull(result);
        assertEquals("ADMIN", result.getRole());
        assertEquals(2, result.getActions().size());
    }

    @Test
    void readValue_invalidJson_throwsRatanServiceException() {
        String invalidJson = "not-json";

        assertThrows(RatanServiceException.class, () -> ratanObjectMapper.readValue(invalidJson, UserEntitlementDto.class));
    }

    @Test
    void writeValueAsString_validString_returnsJsonString() {
        String result = ratanObjectMapper.writeValueAsString("hello");
        assertEquals("\"hello\"", result);
    }

    @Test
    void readValue_emptyEntitlement_returnsDefaultObject() {
        String json = "{}";

        UserEntitlementDto result = ratanObjectMapper.readValue(json, UserEntitlementDto.class);

        assertNotNull(result);
        assertNull(result.getRole());
    }

}
