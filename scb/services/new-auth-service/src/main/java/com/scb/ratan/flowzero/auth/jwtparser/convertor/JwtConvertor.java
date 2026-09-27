package com.scb.ratan.flowzero.auth.jwtparser.convertor;

import com.scb.ratan.flowzero.auth.entity.dto.UserInfo;
import com.scb.ratan.flowzero.auth.jwtparser.fetcher.OudDataFetcher;
import com.scb.ratan.flowzero.auth.constant.AuthConstant;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import lombok.Builder;
import lombok.Data;

import java.util.Objects;

public abstract class JwtConvertor {

    protected final RatanObjectMapper objectMapper;

    protected JwtConvertor(RatanObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public abstract JwtConvertorResponse convert(String inputUserInfo);

    public JwtConvertorResponse buildResponse(String entitlement, String userId) {

        UserInfo userInfo = buildBasicInfo(userId);

        return JwtConvertorResponse.builder().entitlement(entitlement).userInfo(userInfo).build();
    }

    private UserInfo buildBasicInfo(String userId) {
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(userId);
        userInfo.setFullName(userId);
        userInfo.setCountry(AuthConstant.DEFAULT_COUNTRY);
        return userInfo;
    }

    public JwtConvertorResponse buildResponse(String entitlement, String userId, OudDataFetcher.OudKeyInformation oudKeyInformation) {

        UserInfo userInfo = buildBasicInfo(userId);

        if (Objects.nonNull(oudKeyInformation)) {

            userInfo.setEntitlementCountry(oudKeyInformation.getCountry());
            userInfo.setFullName(oudKeyInformation.getFullName());

        }

        return JwtConvertorResponse.builder().entitlement(entitlement).userInfo(userInfo).build();
    }

    @Data
    @Builder
    public static class JwtConvertorResponse {

        private String entitlement;

        private UserInfo userInfo;

    }

}
