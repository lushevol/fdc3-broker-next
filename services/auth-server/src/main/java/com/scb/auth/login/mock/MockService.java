package com.scb.auth.login.mock;

import java.util.List;
import java.util.Optional;

import org.springframework.util.CollectionUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class MockService {

    private final MockProperties mockProperties;

    public String getMockEms2Response(String entityName) {

        return mockProperties.getEmsMockResponse().getOrDefault(entityName, "{\"count\":0," + "\"entitlements\":[]}");
    }

    public String getMockDataEntitlementResponse(String userId) {

        if (CollectionUtils.isEmpty(mockProperties.getDataEntitlement())) {

            log.warn("mock data entitlement is not configured, return default response");

            return buildDefaultResponse();
        }

        for (MockProperties.DataEntitlement dataEntitlement : mockProperties.getDataEntitlement()) {
            String countryName = dataEntitlement.getCountryName();

            List<String> userList = dataEntitlement.getUserList();

            if (CollectionUtils.isEmpty(userList)) {
                continue;
            }

            Optional<String> userIdMatched = userList
                .stream()
                .filter(item -> item.equalsIgnoreCase(userId))
                .findFirst();

            if (userIdMatched.isPresent()) {

                String result = dataEntitlement.getResponse();

                log.info("current userId: {} matched country: {}, data entitlement: {}", userId, countryName, result);
                return result;
            }
        }

        log.info("user: {} is not configured, will return default response", userId);

        return buildDefaultResponse();
    }

    private String buildDefaultResponse() {

        return mockProperties.getDataEntitlementDefaultResponse();
    }

}
