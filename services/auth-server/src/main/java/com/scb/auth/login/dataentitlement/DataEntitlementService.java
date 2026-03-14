package com.scb.auth.login.dataentitlement;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import com.scb.auth.login.mock.MockService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.entity.ems2.EntitlementList;
import com.scb.auth.login.entity.ems2.Role;
import com.scb.auth.login.jwtparser.properties.JwtParserProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class DataEntitlementService {

    private final JwtParserProperties jwtParserProperties;

    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper;

    private final StringRedisTemplate stringRedisTemplate;

    private final ObjectProvider<MockService> mockServiceObjectProvider;

    private static final String CACHE_DATA_ENTITLEMENT_KEY_PREFIX = "ratanone:authentication:cache:dataentitlement:user:";

    private static final String INVALID_DATA = "INVALID_DATA";

    public String getRoleByEntity(String userId) {

        if (Objects.nonNull(mockServiceObjectProvider.getIfAvailable())) {
            log.info("mock is on, will return mock result for user: {}", userId);
            return mockServiceObjectProvider.getObject().getMockDataEntitlementResponse(userId);
        }

        if (hasCacheValue(userId)) {

            String role = fetchFromCache(userId);

            if (!INVALID_DATA.equalsIgnoreCase(role)) {
                log.info("userId: {}, role: {} get data from cache", userId, role);

                return role;
            }
        }

        String resultFromEms2 = getResult(userId);

        if (StringUtils.isEmpty(resultFromEms2)) {
            log.info("userId: {}, has no ems2 result", userId);
            return StringUtils.EMPTY;
        }

        EntitlementList entitlementList = convertResult(resultFromEms2);
        log.info("userId: {}, ems2Result: \n{} ", userId, entitlementList);

        if (Objects.isNull(entitlementList)) {

            log.info("userId: {}, ems2result: {} can't be parsed successfully", userId, resultFromEms2);
            return StringUtils.EMPTY;
        }

        String dataEntitlementRole = retrieveRole(entitlementList);
        log.info("userId: {}, role: {}", userId, dataEntitlementRole);

        cacheData(userId, dataEntitlementRole);

        return dataEntitlementRole;
    }

    private void cacheData(String userId, String dataEntitlementRole) {

        try {

            stringRedisTemplate.opsForValue().set(CACHE_DATA_ENTITLEMENT_KEY_PREFIX.concat(userId), dataEntitlementRole,
                jwtParserProperties.getExpiryTime(),
                TimeUnit.MINUTES);

        } catch (Exception e) {
            log.error("error occurred while trying to cache data, userId: {}, dataEntitlementRole: {}, e", userId, dataEntitlementRole, e);
        }

    }

    private boolean hasCacheValue(String userId) {

        try {

            return Boolean.TRUE.equals(stringRedisTemplate.hasKey(CACHE_DATA_ENTITLEMENT_KEY_PREFIX.concat(userId)));

        } catch (Exception e) {

            log.error("error occurred while fetching data from cache, userId: {}, e", userId, e);
            return false;
        }
    }

    private String fetchFromCache(String userId) {

        try {

            return stringRedisTemplate.opsForValue().get(CACHE_DATA_ENTITLEMENT_KEY_PREFIX.concat(userId));

        } catch (Exception e) {

            log.error("error occurred while fetching data from cache, userId: {}, e", userId, e);
            return INVALID_DATA;
        }
    }

    private String retrieveRole(EntitlementList entitlementList) {

        if (CollectionUtils.isEmpty(entitlementList.getEntitlements())) {

            log.error("case should not happen, entitlementList is empty: {}", entitlementList);

            return StringUtils.EMPTY;
        }

        Role ems2Role = entitlementList.getEntitlements().get(0).getRole();

        if (Objects.isNull(ems2Role) || StringUtils.isEmpty(ems2Role.getName())) {

            log.error("case should not happen, role should exist: {}", entitlementList);

            return StringUtils.EMPTY;
        }

        return ems2Role.getName();
    }

    private EntitlementList convertResult(String input) {
        try {
            return objectMapper.readValue(input, EntitlementList.class);
        } catch (JsonProcessingException e) {
            log.error("case should not happen, input: {}, e", input, e);
            return null;
        }
    }

    private String getResult(String userId) {

        try {
            ResponseEntity<String> responseEntity = restTemplate.getForEntity(
                String.format(jwtParserProperties.getRequestEms2Url(), jwtParserProperties.getRatanDataEntitlementEntity(), userId),
                String.class);

            return responseEntity.getBody();
        } catch (Exception e) {
            log.error("exception occurred while querying ems2, userId:{}, e", userId, e);
            return StringUtils.EMPTY;
        }
    }

}
