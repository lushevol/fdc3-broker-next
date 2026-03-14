package com.scb.auth.login.jwtparser;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.jwtparser.convertor.ConvertorFactory;
import com.scb.auth.login.jwtparser.convertor.JwtConvertor;
import com.scb.ratan.commons.RatanErrors;
import com.scb.ratan.commons.exception.RatanServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
public class JwtParserCoordinator {

    private final ConvertorFactory factory;

    private final ObjectMapper objectMapper;

    private final static String JWT_LEGACY_KEY_SIGN = "entitlement";

    public JwtConvertor.JwtConvertorResponse convertUserResponse(String originalUserInfo) {

        ConvertorFactory.ConvertorType jwtTokenType = retrieveTokenVersion(originalUserInfo);

        switch (jwtTokenType) {
        case LEGACY:
            return retrieveByJwtLegacy(originalUserInfo);
        case NEW:
            return retrieveByJwtNew(originalUserInfo);
        default:
            throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR,
                String.format("current type %s is not supported, need check", jwtTokenType));
        }
    }

    private JwtConvertor.JwtConvertorResponse retrieveByJwtNew(String inputUserInfo) {

        return factory.retrieveConvertor(ConvertorFactory.ConvertorType.NEW).convert(inputUserInfo);
    }

    private JwtConvertor.JwtConvertorResponse retrieveByJwtLegacy(String originalUserInfo) {

        return factory.retrieveConvertor(ConvertorFactory.ConvertorType.LEGACY).convert(originalUserInfo);
    }

    private ConvertorFactory.ConvertorType retrieveTokenVersion(String originalUserInfo) {

        // 1st check if it is jwt legacy token

        Map<?, ?> originalUserInfoMap = buildMapFromInputdata(originalUserInfo);

        if (originalUserInfoMap.containsKey(JWT_LEGACY_KEY_SIGN) && Objects.nonNull(originalUserInfoMap.get(JWT_LEGACY_KEY_SIGN))) {
            // version 1 is temporary adaptive solution, won't be used once single ui bff
            // new version is deployed under production.
            return ConvertorFactory.ConvertorType.LEGACY;
        }

        return ConvertorFactory.ConvertorType.NEW;
    }

    private Map<?, ?> buildMapFromInputdata(String inputData) {

        Map<?, ?> userMap = new HashMap<>();

        try {

            userMap = objectMapper.readValue(inputData, Map.class);

        } catch (JsonProcessingException e) {

            log.error("error occurred, need check, e", e);
        }

        return userMap;
    }

}
