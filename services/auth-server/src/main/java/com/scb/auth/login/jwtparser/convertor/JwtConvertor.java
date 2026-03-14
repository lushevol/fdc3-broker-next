package com.scb.auth.login.jwtparser.convertor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.entity.UserInfo;
import com.scb.auth.login.jwtparser.fetcher.OudDataFetcher;
import lombok.Builder;
import lombok.Data;

import java.util.Objects;

public abstract class JwtConvertor {

    protected final ObjectMapper objectMapper;

    protected final static String DEFAULT_COUNTRY = "Global";

    protected JwtConvertor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public abstract JwtConvertorResponse convert(String inputUserInfo);

    public JwtConvertorResponse buildResponse(String entitlement, String userId) {

        UserInfo userInfo = buildBasicInfo(userId);

        return JwtConvertorResponse.builder()
            .entitlement(entitlement)
            .userInfo(userInfo)
            .build();
    }

    private UserInfo buildBasicInfo(String userId) {
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(userId);
        userInfo.setFullName(userId);
        userInfo.setCountry(DEFAULT_COUNTRY);
        return userInfo;
    }

    public JwtConvertorResponse buildResponse(String entitlement, String userId, OudDataFetcher.OudKeyInformation oudKeyInformation) {

        UserInfo userInfo = buildBasicInfo(userId);

        if (Objects.nonNull(oudKeyInformation)) {

            userInfo.setEntitlementCountry(oudKeyInformation.getCountry());
        }

        return JwtConvertorResponse.builder()
            .entitlement(entitlement)
            .userInfo(userInfo)
            .build();
    }

    @Data
    @Builder
    public static class JwtConvertorResponse {

        private String entitlement;

        private UserInfo userInfo;

    }

}
