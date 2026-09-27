package com.scb.ratan.flowzero.auth.jwtparser.fetcher;

import com.scb.ratan.flowzero.auth.properties.OudKeyProperties;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class OudDataFetcher {

    private final OudKeyProperties oudKeyProperties;

    private final RatanObjectMapper objectMapper;

    public OudKeyInformation retrieveOudInformation(Map<String, String> userInfoMap) {

        String oudInfo = userInfoMap.get("oud");

        if (StringUtils.isEmpty(oudInfo)) {

            log.warn("original userInfo: {}, doesn't contain oud key", userInfoMap);

            return OudKeyInformation.builder().build();
        }

        Map<String, String> oudInfoMap = convertToMap(oudInfo);

        String country = oudInfoMap.getOrDefault(oudKeyProperties.getCountry(), StringUtils.EMPTY);
        String fullName = oudInfoMap.getOrDefault(oudKeyProperties.getFullName(), StringUtils.EMPTY);

        log.info("original userInfo: {}, retrieved country: {}, retrieved fullName: {}", userInfoMap, country, fullName);

        return OudKeyInformation.builder().country(country).fullName(fullName).build();
    }

    private Map<String, String> convertToMap(String inputUserInfo) {

        try {

            return objectMapper.readValue(inputUserInfo, Map.class);
        } catch (Exception e) {
            log.error("error occurred while converting to map ", e);
        }

        return Map.of();
    }

    @Data
    @Builder
    public static class OudKeyInformation {

        private String country;
        private String fullName;

    }

}
