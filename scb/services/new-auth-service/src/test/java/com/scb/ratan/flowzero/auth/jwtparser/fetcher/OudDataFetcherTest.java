package com.scb.ratan.flowzero.auth.jwtparser.fetcher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.auth.properties.OudKeyProperties;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class OudDataFetcherTest {

    @Mock
    private OudKeyProperties oudKeyProperties;

    private OudDataFetcher fetcher;

    @BeforeEach
    void setUp() {
        fetcher = new OudDataFetcher(oudKeyProperties, new RatanObjectMapper(new ObjectMapper()));
        when(oudKeyProperties.getCountry()).thenReturn("country");
        when(oudKeyProperties.getFullName()).thenReturn("fullName");
    }

    @Test
    void retrieveOudInformation_withOudKey_returnsCountry() {
        Map<String, String> userInfoMap = new HashMap<>();
        userInfoMap.put("oud", "{\"country\":\"SG\"}");

        OudDataFetcher.OudKeyInformation result = fetcher.retrieveOudInformation(userInfoMap);

        assertNotNull(result);
        assertEquals("SG", result.getCountry());
    }

    @Test
    void retrieveOudInformation_withoutOudKey_returnsEmptyInfo() {
        Map<String, String> userInfoMap = new HashMap<>();
        userInfoMap.put("sub", "user1");

        OudDataFetcher.OudKeyInformation result = fetcher.retrieveOudInformation(userInfoMap);

        assertNotNull(result);
        assertNull(result.getCountry());
    }

    @Test
    void retrieveOudInformation_withInvalidOudJson_returnsEmptyCountry() {
        Map<String, String> userInfoMap = new HashMap<>();
        userInfoMap.put("oud", "invalid-json");

        OudDataFetcher.OudKeyInformation result = fetcher.retrieveOudInformation(userInfoMap);

        assertNotNull(result);
        assertEquals("", result.getCountry());
        assertEquals("", result.getFullName());
    }

    @Test
    void oudKeyInformation_builderAndGetter() {
        OudDataFetcher.OudKeyInformation info = OudDataFetcher.OudKeyInformation.builder()
            .country("US")
            .build();

        assertEquals("US", info.getCountry());
    }

}
