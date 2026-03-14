package com.scb.auth.login.jwtparser.convertor;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
public class JwtConvertorForLegacy extends JwtConvertor {

    private static final String JWT_LEGACY_KEY_ENTITLEMENT = "entitlement";

    private static final String JWT_LEGACY_KEY_USER_ID = "sub";

    protected JwtConvertorForLegacy(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public JwtConvertorResponse convert(String inputUserInfo) {

        try {
            // will follow previous way to retrieve it

            Map<?, ?> userMap = objectMapper.readValue(inputUserInfo, Map.class);

            String userEntitlement = (String) userMap.get(JWT_LEGACY_KEY_ENTITLEMENT);

            String userId = (String) userMap.get(JWT_LEGACY_KEY_USER_ID);

            log.info("userId: {}, converting from legacy token parser, userEntitlement: {}", userId, userEntitlement);

            return buildResponse(userEntitlement, userId);

        } catch (Exception e) {
            log.error("error occurred, need check, e", e);
            return null;
        }

    }

}
