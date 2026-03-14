package com.scb.auth.login.jwtparser.fetcher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.jwtparser.properties.OudKeyProperties;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class OudDataFetcher {

    private final OudKeyProperties oudKeyProperties;

    private final ObjectMapper objectMapper;

    public OudKeyInformation retrieveOudInformation(Map<String, String> userInfoMap) {

        String oudInfo = userInfoMap.get("oud");

        if (StringUtils.isEmpty(oudInfo)) {

            log.warn("original userInfo: {}, doesn't contain oud key, need check!", userInfoMap);

            return OudKeyInformation.builder().build();
        }

        Map<String, String> oudInfoMap = convertToMap(oudInfo);

        String country = oudInfoMap.getOrDefault(oudKeyProperties.getCountry(), StringUtils.EMPTY);

        log.info("original userInfo: {}, retrieved country: {}", userInfoMap, country);

        return OudKeyInformation.builder()
            .country(country)
            .build();
    }

    private Map<String, String> convertToMap(String inputUserInfo) {

        try {

            return objectMapper.readValue(inputUserInfo, Map.class);
        } catch (Exception e) {
            log.error("error occurred while converting to map ");
        }

        return new HashMap<>();
    }

    @Data
    @Builder
    public static class OudKeyInformation {

        private String country;

    }

}
